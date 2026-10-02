import { randomUUID } from "node:crypto";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import nextEnv from "@next/env";
import { createClient } from "@sanity/client";
import { Redis } from "@upstash/redis";

// Never log SDK errors: they can include authorization headers or document data.
export async function checkStorage(env, {
  writeTest = false,
  clientFactory = createClient,
  fetcher = fetch,
} = {}) {
  const checks = [];
  const result = (check, ok, detail) => checks.push({ check, ok, detail });
  const required = ["SANITY_PROJECT_ID", "SANITY_DATASET", "SANITY_ENQUIRY_DATASET",
    "SANITY_ENQUIRY_READ_TOKEN", "SANITY_ENQUIRY_WRITE_TOKEN"];
  const missing = required.filter((key) => !env[key]?.trim());
  if (missing.length) {
    result("storage configuration", false, "Missing: " + missing.join(", "));
    return checks;
  }
  const projectId = env.SANITY_PROJECT_ID;
  const dataset = env.SANITY_ENQUIRY_DATASET;
  if (!/^[a-z0-9]+$/.test(projectId) || !/^[a-z0-9][a-z0-9_-]{0,63}$/.test(dataset) ||
      dataset === env.SANITY_DATASET || dataset.endsWith("-comments")) {
    result("storage configuration", false, "Use a valid, separate enquiry dataset; content and comments datasets are forbidden.");
    return checks;
  }
  try {
    const query = encodeURIComponent('count(*[_type == "submission"])');
    const response = await fetcher(`https://${projectId}.api.sanity.io/v2026-01-01/data/query/${dataset}?query=${query}`, {
      cache: "no-store", redirect: "error", signal: AbortSignal.timeout(5000),
    });
    if (![401, 403].includes(response.status)) throw new Error("Not private");
    result("anonymous access denied", true, "Anonymous query rejected.");
  } catch {
    result("anonymous access denied", false, "Privacy not verified. Check dataset existence, private visibility and connectivity. No write attempted.");
    return checks;
  }
  const config = { projectId, dataset, apiVersion: "2026-01-01", useCdn: false,
    perspective: "raw", timeout: 5000, maxRetries: 0 };
  let reader, writer;
  try {
    reader = clientFactory({ ...config, token: env.SANITY_ENQUIRY_READ_TOKEN });
    writer = clientFactory({ ...config, token: env.SANITY_ENQUIRY_WRITE_TOKEN });
    for (const client of [reader, writer]) {
      const count = await client.fetch('count(*[_type == "submission"])');
      if (!Number.isInteger(count) || count < 0) throw new Error("Invalid query response");
    }
    result("authenticated access", true, "Both server tokens can query the private dataset. No personal fields retrieved.");
  } catch {
    result("authenticated access", false, "Check token validity and private-dataset read permissions. No write attempted.");
    return checks;
  }
  if (!writeTest) {
    result("write verification", null, "Not run. Use npm run enquiries:verify to create, read and delete one synthetic probe.");
    return checks;
  }
  const id = "enquiry." + randomUUID();
  const document = { _id: id, _type: "submission", setupProbe: true,
    status: "closed", notificationStatus: "disabled", source: "/setup",
    submittedAt: new Date().toISOString(), payloadDigest: randomUUID() };
  try {
    const saved = await writer.createIfNotExists(document);
    const retried = await writer.createIfNotExists({ ...document, payloadDigest: "must-not-overwrite" });
    const read = await reader.fetch('*[_id == $id][0]{_id, payloadDigest}', { id });
    if (![saved, retried, read].every((record) => record?._id === id && record.payloadDigest === document.payloadDigest))
      throw new Error("Round trip failed");
    result("private write/read/idempotency", true, "Synthetic submission persisted and duplicate retry preserved the original. No notification sent.");
  } catch {
    result("private write/read/idempotency", false, "Probe failed. Check enquiry create/read permissions and connectivity.");
  } finally {
    // Also clean up after ambiguous write timeouts. Never delete any other ID.
    try {
      await writer.delete(id);
      const remaining = await reader.fetch('count(*[_id == $id])', { id });
      if (remaining !== 0) throw new Error("Probe remains");
      result("probe cleanup", true, "Synthetic record removed.");
    } catch {
      result("probe cleanup", false, "Check delete permission/connectivity and remove only synthetic probe " + id);
    }
  }
  return checks;
}

export async function checkDelivery(env, { writeTest = false, redisFactory = (config) => new Redis(config) } = {}) {
  const checks = [];
  const missing = ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN", "RATE_LIMIT_SALT"]
    .filter((key) => !env[key]?.trim());
  if (!env.VERCEL && !env.TRUSTED_IP_HEADER) missing.push("TRUSTED_IP_HEADER (or Vercel deployment)");
  if (!env.NEXT_PUBLIC_SITE_URL) missing.push("NEXT_PUBLIC_SITE_URL");
  checks.push({ check: "production configuration", ok: !missing.length,
    detail: missing.length ? "Missing: " + missing.join(", ") : "Required variables present; verify proxy overwrites its trusted header on the deployed host." });
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    let redis;
    const key = "jed:setup:" + randomUUID();
    try {
      const url = new URL(env.UPSTASH_REDIS_REST_URL);
      if (url.protocol !== "https:" || url.username || url.password) throw new Error("Invalid Redis URL");
      redis = redisFactory({ url: url.href, token: env.UPSTASH_REDIS_REST_TOKEN,
        retry: false, signal: () => AbortSignal.timeout(5000) });
      if (await redis.ping() !== "PONG") throw new Error("Ping failed");
      if (writeTest) {
        await redis.set(key, "probe", { ex: 60, nx: true });
        if (await redis.get(key) !== "probe") throw new Error("Write failed");
      }
      checks.push({ check: "Redis connection", ok: true, detail: writeTest ? "Connection and temporary-key write/read verified." : "Connection verified; write permissions untested." });
    } catch {
      checks.push({ check: "Redis connection", ok: false, detail: "Check Redis REST URL, token, permissions and connectivity." });
    } finally {
      if (redis && writeTest) {
        try { await redis.del(key); }
        catch { checks.push({ check: "Redis cleanup", ok: false, detail: "Temporary probe expires within 60 seconds; verify Redis access." }); }
      }
    }
  }
  return checks;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.some((arg) => !["--write-test", "--production"].includes(arg))) {
    console.error("Usage: npm run enquiries:check -- [--write-test] [--production]");
    process.exitCode = 1;
    return;
  }
  const production = args.includes("--production");
  nextEnv.loadEnvConfig(process.cwd(), !production, { info() {}, error() {} });
  const options = { writeTest: args.includes("--write-test") };
  const storage = await checkStorage(process.env, options);
  const delivery = await checkDelivery(process.env, options);
  console.log(JSON.stringify({ mode: production ? "production" : "local", writeTest: options.writeTest,
    storage, delivery, note: "These checks do not certify staff login, token role isolation, legacy-data migration, notifications or the deployed form journey." }, null, 2));
  if ([...storage, ...(production ? delivery : [])].some((check) => check.ok === false)) process.exitCode = 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(() => { console.error("Enquiry setup check failed. Check local configuration; no secret values were logged."); process.exitCode = 1; });
}
