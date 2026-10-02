import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  provider,
  unseal,
  seal,
  verifyIdToken,
  roleFor,
  flowCookie,
  sessionCookie,
  cookieOptions,
} from "../../../../../lib/auth.js";
export async function GET(request) {
  try {
    const jar = await cookies();
    const value = jar.get(flowCookie)?.value;
    jar.delete(flowCookie);
    if (!value) throw new Error("Expired flow");
    const flow = await unseal(value);
    const params = new URL(request.url).searchParams;
    if (!params.get("code") || params.get("state") !== flow.state)
      throw new Error("Invalid state");
    const config = await provider();
    const response = await fetch(config.token_endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            encodeURIComponent(process.env.OIDC_CLIENT_ID) +
              ":" +
              encodeURIComponent(process.env.OIDC_CLIENT_SECRET),
          ).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: params.get("code"),
        redirect_uri: process.env.NEXT_PUBLIC_SITE_URL + "/api/auth/callback",
        code_verifier: flow.verifier,
      }),
      signal: AbortSignal.timeout(7000),
    });
    if (!response.ok) throw new Error("Token exchange failed");
    const tokens = await response.json();
    const identity = await verifyIdToken(tokens.id_token, config, flow.nonce);
    if (!roleFor(identity.sub)) throw new Error("Access denied");
    const res = NextResponse.redirect(
      new URL("/staff", process.env.NEXT_PUBLIC_SITE_URL),
    );
    res.cookies.set(sessionCookie, await seal({ sub: identity.sub }, 3600), {
      ...cookieOptions,
      maxAge: 3600,
    });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch {
    return Response.json(
      {
        error:
          "Sign-in failed or your account has not been granted staff access.",
      },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }
}
