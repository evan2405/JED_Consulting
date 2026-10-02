import { Redis } from "@upstash/redis";
import { authorizedJob } from "../../../../../lib/job-auth.js";
import { assertPrivateStorage } from "../../../../../lib/storage-privacy.js";
import { privateClient } from "../../../../../Sainity/client.js";

export async function GET(request) {
  const headers = { "Cache-Control": "no-store" };
  if (!authorizedJob(request, process.env.MONITOR_SECRET))
    return Response.json({ error: "Unauthorized" }, { status: 401, headers });
  try {
    const required = [
      "NEXT_PUBLIC_SITE_URL",
      "SANITY_ENQUIRY_WRITE_TOKEN",
      "RATE_LIMIT_SALT",
      "OIDC_ISSUER",
      "OIDC_CLIENT_ID",
      "OIDC_CLIENT_SECRET",
      "STAFF_SESSION_SECRET",
      "STAFF_SUBJECT_ROLES",
      "LEAD_NOTIFICATION_WEBHOOK",
      "LEAD_NOTIFICATION_SECRET",
      "UPSTASH_REDIS_REST_URL",
      "UPSTASH_REDIS_REST_TOKEN",
    ];
    if (required.some((name) => !process.env[name]))
      throw new Error("Configuration incomplete");
    if (!process.env.VERCEL && !process.env.TRUSTED_IP_HEADER)
      throw new Error("Proxy incomplete");
    await assertPrivateStorage();
    await Promise.all([
      privateClient().fetch('count(*[_type == "submission"])'),
      Redis.fromEnv().ping(),
    ]);
    return Response.json({ status: "ready" }, { headers });
  } catch {
    console.error(JSON.stringify({ event: "readiness_failed" }));
    return Response.json({ status: "degraded" }, { status: 503, headers });
  }
}
