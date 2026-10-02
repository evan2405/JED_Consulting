import { test, mock, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { HttpError } from "../lib/http.js";
let actor, record, changes, deleted, auditFails, calls;
const db = {
  getDocument: async () => record,
  fetch: async (query, params) => {
    calls.push({ query, params });
    return [];
  },
  delete: async (id) => {
    deleted.push(id);
  },
  patch: () => ({
    set: (value) => ({
      commit: async () => {
        changes.push(value);
      },
    }),
  }),
};
mock.module("../Sainity/client.js", {
  namedExports: { privateClient: () => db },
});
mock.module("../lib/auth.js", {
  namedExports: {
    requireStaff: async (roles) => {
      if (!actor) throw new HttpError(401, "Sign in");
      if (roles && !roles.includes(actor.role))
        throw new HttpError(403, "Forbidden");
      return actor;
    },
  },
});
mock.module("../lib/rate-limit.js", {
  namedExports: { rateLimit: async () => {} },
});
mock.module("../lib/audit.js", {
  namedExports: {
    audit: async () => {
      if (auditFails) throw new Error("Audit failed");
    },
  },
});
const { GET, PATCH, DELETE } =
  await import("../src/app/api/staff/leads/route.js");
const { GET: exportCSV } =
  await import("../src/app/api/export-enquiries/route.js");
beforeEach(() => {
  actor = { sub: "staff", role: "admin" };
  record = { _type: "submission" };
  changes = [];
  deleted = [];
  calls = [];
  auditFails = false;
  delete process.env.NEXT_PUBLIC_SITE_URL;
});
function request(method, body, origin = "http://localhost") {
  return new Request("http://localhost/api/staff/leads", {
    method,
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}
test("staff listing and CSV export apply identical filters", async () => {
  const filters =
    "?q=Visitor&status=converted&service=career&from=2026-10-01&to=2026-10-02";
  assert.equal(
    (await GET(new Request("http://localhost/api/staff/leads" + filters)))
      .status,
    200,
  );
  const exported = await exportCSV(
    new Request("http://localhost/api/enquiries/export" + filters),
  );
  assert.equal(exported.status, 200);
  const { after, ...listing } = calls[0].params;
  assert.equal(after, "");
  assert.deepEqual(listing, calls[1].params);
  assert.match(
    exported.headers.get("content-disposition"),
    /2026-10-01-to-2026-10-02/,
  );
});
test("only managers/admins may update a submission; writable fields are allowlisted", async () => {
  const body = {
    id: "lead-1",
    status: "converted",
    owner: " Staff ",
    email: "replacement@example.com",
  };
  actor.role = "viewer";
  assert.equal((await PATCH(request("PATCH", body))).status, 403);
  actor.role = "manager";
  assert.equal((await PATCH(request("PATCH", body))).status, 200);
  assert.equal(changes[0].status, "converted");
  assert.equal(changes[0].owner, "Staff");
  assert.equal(changes[0].email, undefined);
  record = { _type: "course" };
  assert.equal((await PATCH(request("PATCH", body))).status, 404);
});
test("delete requires admin, same origin, explicit confirmation, submission type and successful audit", async () => {
  const body = { id: "lead-1", confirm: true };
  actor = null;
  assert.equal((await DELETE(request("DELETE", body))).status, 401);
  actor = { sub: "staff", role: "manager" };
  assert.equal((await DELETE(request("DELETE", body))).status, 403);
  actor.role = "admin";
  assert.equal(
    (await DELETE(request("DELETE", body, "https://evil.example"))).status,
    403,
  );
  assert.equal((await DELETE(request("DELETE", { id: "lead-1" }))).status, 400);
  record = { _type: "course" };
  assert.equal((await DELETE(request("DELETE", body))).status, 404);
  record = { _type: "submission" };
  auditFails = true;
  assert.equal((await DELETE(request("DELETE", body))).status, 503);
  assert.deepEqual(deleted, []);
  auditFails = false;
  assert.equal((await DELETE(request("DELETE", body))).status, 200);
  assert.deepEqual(deleted, ["lead-1"]);
});
