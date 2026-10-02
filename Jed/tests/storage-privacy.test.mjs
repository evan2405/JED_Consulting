import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { assertPrivateStorage } from "../lib/storage-privacy.js";

test("enquiry storage refuses public, missing and unreachable datasets; accepts private denial", async () => {
  process.env.SANITY_PROJECT_ID = "example";
  process.env.SANITY_DATASET = "production";
  process.env.SANITY_ENQUIRY_DATASET = "production";
  await assert.rejects(assertPrivateStorage(), { status: 503 });
  process.env.SANITY_ENQUIRY_DATASET = "enquiries";
  let status = 200,
    calls = 0,
    now = Date.now();
  mock.method(Date, "now", () => now);
  mock.method(globalThis, "fetch", async (_url, options) => {
    calls++;
    assert.equal(options.cache, "no-store");
    assert.equal(options.headers, undefined); // The privacy probe must be anonymous.
    return new Response(null, { status });
  });
  for (status of [200, 404, 500])
    await assert.rejects(assertPrivateStorage(), { status: 503 });
  status = 401;
  await assertPrivateStorage();
  const verifiedCalls = calls;
  await assertPrivateStorage();
  assert.equal(calls, verifiedCalls);
  now += 61000;
  status = 200;
  await assert.rejects(assertPrivateStorage(), { status: 503 });
  mock.restoreAll();
});
