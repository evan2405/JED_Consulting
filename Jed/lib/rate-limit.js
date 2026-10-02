import "server-only";
import { createHmac } from "node:crypto";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { HttpError } from "./http.js";
const limiters = new Map();
export async function rateLimit(request, kind = "contact", identity) {
  if (
    process.env.NODE_ENV !== "production" &&
    !process.env.UPSTASH_REDIS_REST_URL
  )
    return;
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN ||
    !process.env.RATE_LIMIT_SALT
  )
    throw new HttpError(
      503,
      "Enquiries are temporarily unavailable. Please contact us on WhatsApp.",
    );
  // Only trust a header that the deployment proxy overwrites. Never accept the client's first XFF value.
  let ip = identity;
  if (!ip) {
    const header = process.env.VERCEL
      ? "x-vercel-forwarded-for"
      : process.env.TRUSTED_IP_HEADER;
    if (!header)
      throw new HttpError(
        503,
        "Enquiries are temporarily unavailable. Please contact us on WhatsApp.",
      );
    ip = request.headers.get(header)?.split(",")[0]?.trim();
    if (!ip)
      throw new HttpError(
        503,
        "Unable to verify this connection. Please try again.",
      );
  }
  if (!limiters.has(kind))
    limiters.set(
      kind,
      new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(kind === "contact" ? 5 : 30, "10 m"),
        prefix: "jed:" + kind,
        analytics: false,
        timeout: 0,
      }),
    );
  const identifier = createHmac("sha256", process.env.RATE_LIMIT_SALT)
    .update(ip)
    .digest("hex");
  const result = await limiters.get(kind).limit(identifier);
  if (!result.success)
    throw new HttpError(
      429,
      "Too many requests. Please wait 10 minutes before trying again.",
    );
}
