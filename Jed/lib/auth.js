import "server-only";
import { cookies } from "next/headers.js";
import { EncryptJWT, jwtDecrypt, createRemoteJWKSet, jwtVerify } from "jose";
import { createHash, randomBytes } from "node:crypto";
import { HttpError } from "./http.js";
export const sessionCookie = "jed_staff_session";
export const flowCookie = "jed_oidc_flow";
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};
function secret() {
  if (
    !process.env.STAFF_SESSION_SECRET ||
    process.env.STAFF_SESSION_SECRET.length < 32
  )
    throw new Error("Staff session secret missing");
  return createHash("sha256").update(process.env.STAFF_SESSION_SECRET).digest();
}
export async function seal(payload, seconds) {
  return new EncryptJWT(payload)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setIssuer("jed-staff")
    .setAudience("jed-staff")
    .setExpirationTime(Math.floor(Date.now() / 1000) + seconds)
    .encrypt(secret());
}
export async function unseal(value) {
  return (
    await jwtDecrypt(value, secret(), {
      issuer: "jed-staff",
      audience: "jed-staff",
      keyManagementAlgorithms: ["dir"],
      contentEncryptionAlgorithms: ["A256GCM"],
    })
  ).payload;
}
export function roleFor(sub) {
  let staff = {};
  try {
    staff = JSON.parse(process.env.STAFF_SUBJECT_ROLES || "{}");
  } catch {}
  return ["viewer", "manager", "exporter", "admin"].includes(staff[sub])
    ? staff[sub]
    : null;
}
export async function getStaff() {
  try {
    const value = (await cookies()).get(sessionCookie)?.value;
    if (!value) return null;
    const data = await unseal(value);
    const role = roleFor(data.sub);
    return role ? { sub: data.sub, role } : null;
  } catch {
    return null;
  }
}
export async function requireStaff(
  roles = ["viewer", "manager", "exporter", "admin"],
) {
  const user = await getStaff();
  if (!user) throw new HttpError(401, "Staff sign-in required.");
  if (!roles.includes(user.role))
    throw new HttpError(403, "You do not have permission for this action.");
  return user;
}
export function random() {
  return randomBytes(32).toString("base64url");
}
export async function provider() {
  const issuer = process.env.OIDC_ISSUER;
  if (!issuer || !process.env.OIDC_CLIENT_ID || !process.env.OIDC_CLIENT_SECRET)
    throw new Error("Staff sign-in is not configured");
  if (new URL(issuer).protocol !== "https:")
    throw new Error("OIDC requires HTTPS");
  const res = await fetch(
    issuer.replace(/\/$/, "") + "/.well-known/openid-configuration",
    { next: { revalidate: 3600 }, signal: AbortSignal.timeout(7000) },
  );
  if (!res.ok) throw new Error("Identity provider unavailable");
  const config = await res.json();
  if (config.issuer !== issuer) throw new Error("Identity issuer mismatch");
  for (const key of ["authorization_endpoint", "token_endpoint", "jwks_uri"])
    if (new URL(config[key]).protocol !== "https:")
      throw new Error("Unsafe identity endpoint");
  return config;
}
export async function verifyIdToken(token, config, nonce) {
  const { payload } = await jwtVerify(
    token,
    createRemoteJWKSet(new URL(config.jwks_uri)),
    {
      issuer: config.issuer,
      audience: process.env.OIDC_CLIENT_ID,
      algorithms: ["RS256", "ES256"],
      maxTokenAge: "10m",
    },
  );
  if (
    payload.nonce !== nonce ||
    !payload.sub ||
    (payload.azp && payload.azp !== process.env.OIDC_CLIENT_ID)
  )
    throw new Error("Identity verification failed");
  return payload;
}
