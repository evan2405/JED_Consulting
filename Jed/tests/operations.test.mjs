import { test, mock, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { authorizedJob } from "../lib/job-auth.js";

let deleted = [],
  notified = [],
  queries = [],
  failNotification = false;
const db = {
  fetch: async (query, params) => {
    queries.push({ query, params });
    if (query.includes("notificationStatus")) return [{ _id: "pending-1" }];
    if (query.includes("$cutoff")) return [{ _id: "expired-1" }];
    return 2;
  },
  transaction: () => ({
    delete: (id) => deleted.push(id),
    commit: async () => {},
  }),
};
mock.module("../Sainity/client.js", {
  namedExports: { privateClient: () => db },
});
mock.module("../lib/notifications.js", {
  namedExports: {
    notifyLead: async (id) => {
      if (failNotification) throw new Error("Simulated delivery failure");
      notified.push(id);
      return true;
    },
  },
});
mock.module("../lib/storage-privacy.js", {
  namedExports: { assertPrivateStorage: async () => {} },
});
mock.module("@upstash/redis", {
  namedExports: { Redis: { fromEnv: () => ({ ping: async () => "PONG" }) } },
});
const { GET: maintenance } =
  await import("../src/app/api/cron/maintenance/route.js");
const { GET: readiness } = await import("../src/app/api/health/ready/route.js");
const request = (token) =>
  new Request("https://example.com/api/cron/maintenance", {
    headers: token ? { authorization: "Bearer " + token } : {},
  });
beforeEach(() => {
  deleted = [];
  notified = [];
  queries = [];
  failNotification = false;
  process.env.CRON_SECRET = "test-job-secret";
  process.env.RETENTION_ENABLED = "false";
  process.env.RETENTION_DAYS = "730";
  process.env.MONITOR_SECRET = "test-monitor-secret";
});
test("machine endpoints require exact bearer credentials, including malformed Unicode", async () => {
  assert.equal(authorizedJob(request(), "test"), false);
  assert.equal(authorizedJob(request("test"), "test"), true);
  assert.equal(authorizedJob(request("tést"), "test"), false);
  assert.equal(
    authorizedJob(
      new Request("https://example.com", {
        headers: { authorization: "test" },
      }),
      "test",
    ),
    false,
  );
  assert.equal((await maintenance(request("incorrect"))).status, 401);
  assert.equal((await readiness(request())).status, 401);
  assert.equal(queries.length, 0);
});
test("retention is disabled by default while notification retry still runs", async () => {
  const res = await maintenance(request("test-job-secret"));
  assert.deepEqual(await res.json(), { notified: 1, deleted: 0 });
  assert.deepEqual(deleted, []);
  assert.deepEqual(notified, ["pending-1"]);
});
test("approved retention deletes a bounded batch with a real cutoff", async () => {
  process.env.RETENTION_ENABLED = "true";
  const res = await maintenance(request("test-job-secret"));
  assert.deepEqual(await res.json(), { notified: 1, deleted: 1 });
  assert.deepEqual(deleted, ["expired-1"]);
  const expiry = queries.find((q) => q.params?.cutoff);
  assert.ok(expiry.query.includes("[0...100]"));
  assert.ok(Date.parse(expiry.params.cutoff) < Date.now() - 729 * 86400000);
});
test("invalid retention fails visibly and delivery failures remain pending", async () => {
  process.env.RETENTION_ENABLED = "true";
  process.env.RETENTION_DAYS = "invalid";
  assert.equal((await maintenance(request("test-job-secret"))).status, 503);
  assert.deepEqual(deleted, []);
  process.env.RETENTION_ENABLED = "false";
  failNotification = true;
  assert.deepEqual(
    await (await maintenance(request("test-job-secret"))).json(),
    { notified: 0, deleted: 0 },
  );
});
test("protected readiness reports a generic failure without configuration details", async () => {
  delete process.env.OIDC_ISSUER;
  const response = await readiness(request("test-monitor-secret"));
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { status: "degraded" });
});
