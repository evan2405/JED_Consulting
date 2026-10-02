import { createClient } from "@sanity/client";
const required = [
  "NEXT_PUBLIC_SITE_URL",
  "SANITY_PROJECT_ID",
  "SANITY_DATASET",
  "SANITY_ENQUIRY_DATASET",
  "SANITY_ENQUIRY_READ_TOKEN",
  "SANITY_ENQUIRY_WRITE_TOKEN",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "RATE_LIMIT_SALT",
  "OIDC_ISSUER",
  "OIDC_CLIENT_ID",
  "OIDC_CLIENT_SECRET",
  "STAFF_SESSION_SECRET",
  "STAFF_SUBJECT_ROLES",
  "LEAD_NOTIFICATION_WEBHOOK",
  "LEAD_NOTIFICATION_SECRET",
  "CRON_SECRET",
  "MONITOR_SECRET",
];
let failed = false;
for (const name of [
  "NEXT_PUBLIC_SITE_URL",
  "OIDC_ISSUER",
  "LEAD_NOTIFICATION_WEBHOOK",
]) {
  try {
    if (new URL(process.env[name]).protocol !== "https:") throw new Error();
  } catch {
    console.error("Configure a valid HTTPS URL: " + name);
    failed = true;
  }
}
if (!process.env.VERCEL && !process.env.TRUSTED_IP_HEADER) {
  console.error("Configure and verify a trusted proxy IP header.");
  failed = true;
}
if ((process.env.STAFF_SESSION_SECRET || "").length < 32) {
  console.error("Staff session secret must contain at least 32 characters.");
  failed = true;
}
try {
  const roles = Object.values(
    JSON.parse(process.env.STAFF_SUBJECT_ROLES || "{}"),
  );
  if (
    !roles.some((role) => ["admin", "exporter"].includes(role)) ||
    !roles.some((role) => ["admin", "manager"].includes(role))
  )
    throw new Error();
} catch {
  console.error(
    "Assign staff subjects with lead-management and export permissions.",
  );
  failed = true;
}
for (const key of required)
  if (!process.env[key]) {
    console.error("Missing configuration: " + key);
    failed = true;
  }
if (process.env.SANITY_DATASET === process.env.SANITY_ENQUIRY_DATASET) {
  console.error("Content and enquiries must use separate datasets.");
  failed = true;
}
if (process.env.SANITY_PROJECT_ID && process.env.SANITY_ENQUIRY_DATASET) {
  const anonymous = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_ENQUIRY_DATASET,
    apiVersion: "2026-01-01",
    useCdn: false,
  });
  try {
    await anonymous.fetch('count(*[_type=="submission"])');
    console.error("FAIL: enquiry dataset accepts anonymous reads.");
    failed = true;
  } catch (e) {
    if (![401, 403].includes(e.statusCode)) {
      console.error("Unable to verify private dataset.");
      failed = true;
    } else console.log("Private dataset rejects anonymous reads.");
  }
  if (process.env.SANITY_DATASET) {
    try {
      const count = await anonymous
        .withConfig({ dataset: process.env.SANITY_DATASET })
        .fetch('count(*[_type=="submission"])');
      if (count) {
        console.error(
          "FAIL: legacy submissions remain anonymously readable (" +
            count +
            ").",
        );
        failed = true;
      }
    } catch (e) {
      if (![401, 403].includes(e.statusCode)) {
        console.error("Unable to check legacy dataset.");
        failed = true;
      }
    }
  }
}
console.log(
  failed
    ? "Launch configuration is incomplete."
    : "Configuration checks passed. Complete the manual production acceptance checklist.",
);
process.exitCode = failed ? 1 : 0;
