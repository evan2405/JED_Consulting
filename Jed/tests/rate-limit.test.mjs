import { test, mock } from "node:test";
import assert from "node:assert/strict";
let identifiers = [],
  allowed = true;
class FakeLimiter {
  constructor(options) {
    assert.equal(options.timeout, 0);
  }
  static slidingWindow() {
    return {};
  }
  async limit(identifier) {
    identifiers.push(identifier);
    return { success: allowed };
  }
}
mock.module("@upstash/redis", {
  namedExports: { Redis: { fromEnv: () => ({}) } },
});
mock.module("@upstash/ratelimit", { namedExports: { Ratelimit: FakeLimiter } });
const { rateLimit } = await import("../lib/rate-limit.js");
test("production throttling fails closed, trusts only configured proxy headers and hashes identities", async () => {
  process.env.NODE_ENV = "production";
  delete process.env.UPSTASH_REDIS_REST_URL;
  const request = new Request("https://example.com", {
    headers: { "x-forwarded-for": "spoofed", "x-trusted-client": "192.0.2.1" },
  });
  await assert.rejects(rateLimit(request), { status: 503 });
  process.env.UPSTASH_REDIS_REST_URL = "https://example.invalid";
  process.env.UPSTASH_REDIS_REST_TOKEN = "test-only";
  process.env.RATE_LIMIT_SALT = "test-only-salt";
  delete process.env.VERCEL;
  delete process.env.TRUSTED_IP_HEADER;
  await assert.rejects(rateLimit(request), { status: 503 });
  process.env.TRUSTED_IP_HEADER = "x-trusted-client";
  await rateLimit(request);
  assert.match(identifiers[0], /^[a-f0-9]{64}$/);
  assert.ok(!identifiers[0].includes("192.0.2.1"));
  allowed = false;
  await assert.rejects(rateLimit(request), { status: 429 });
  assert.equal(identifiers[0], identifiers[1]);
});
