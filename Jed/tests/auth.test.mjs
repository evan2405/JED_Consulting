import { test, mock } from "node:test";
import assert from "node:assert/strict";
mock.module("next/headers.js", {
  namedExports: { cookies: async () => ({ get: () => null }) },
});
const { seal, unseal, roleFor, getStaff } = await import("../lib/auth.js");
test("staff sessions are authenticated, encrypted, expiring and tamper resistant", async () => {
  process.env.STAFF_SESSION_SECRET =
    "test-only-session-secret-at-least-thirty-two-characters";
  const token = await seal({ sub: "approved-staff" }, 60);
  assert.equal((await unseal(token)).sub, "approved-staff");
  assert.ok(!token.includes("approved-staff"));
  const parts = token.split(".");
  parts[3] = (parts[3][0] === "A" ? "B" : "A") + parts[3].slice(1);
  await assert.rejects(unseal(parts.join(".")));
  const expired = await seal({ sub: "approved-staff" }, -60);
  await assert.rejects(unseal(expired));
});
test("individual allowlist supports immediate revocation and rejects unexpected roles", async () => {
  process.env.STAFF_SUBJECT_ROLES = JSON.stringify({
    "staff-1": "exporter",
    "staff-2": "owner",
  });
  assert.equal(roleFor("staff-1"), "exporter");
  assert.equal(roleFor("staff-2"), null);
  assert.equal(roleFor("unknown"), null);
  process.env.STAFF_SUBJECT_ROLES = "{}";
  assert.equal(roleFor("staff-1"), null);
  assert.equal(await getStaff(), null);
});
