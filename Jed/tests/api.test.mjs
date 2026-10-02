import { test, mock, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { HttpError } from "../lib/http.js";
const records = new Map();
let notifications = 0;
let actor = { sub: "staff-1", role: "admin" };
let rows = [];
let audits = [];
const db = {
  createIfNotExists: async (doc) => {
    if (!records.has(doc._id)) records.set(doc._id, doc);
    return records.get(doc._id);
  },
  fetch: async () => rows,
};
mock.module("../Sainity/client.js", {
  namedExports: { privateClient: () => db },
});
mock.module("../Sainity/queries.js", {
  namedExports: {
    getService: async (slug) => ({ service: slug }),
    getCourses: async () => ({
      courses: [{ _id: "course-1", title: "Example" }],
    }),
  },
});
mock.module("../lib/rate-limit.js", {
  namedExports: { rateLimit: async () => {} },
});
mock.module("../lib/storage-privacy.js", {
  namedExports: { assertPrivateStorage: async () => {} },
});
mock.module("../lib/notifications.js", {
  namedExports: {
    notifyLead: async () => {
      notifications++;
    },
  },
});
mock.module("../lib/auth.js", {
  namedExports: {
    requireStaff: async (roles) => {
      if (!actor) throw new HttpError(401, "Staff sign-in required.");
      if (roles && !roles.includes(actor.role))
        throw new HttpError(403, "Forbidden");
      return actor;
    },
  },
});
mock.module("../lib/audit.js", {
  namedExports: { audit: async (...args) => audits.push(args) },
});
const { POST } = await import("../src/app/api/contact/route.js");
const { GET: exportCSV } =
  await import("../src/app/api/export-enquiries/route.js");
const body = {
  name: "Visitor Example",
  email: "person@example.com",
  phone: "+919876543210",
  serviceInterested: "academic",
  selectedCourse: "course-1",
  termsAccepted: true,
};
function request(
  data = body,
  key = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
  headers = {},
) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: {
      origin: "http://localhost",
      "content-type": "application/json",
      "idempotency-key": key,
      ...headers,
    },
    body: typeof data === "string" ? data : JSON.stringify(data),
  });
}
beforeEach(() => {
  records.clear();
  notifications = 0;
  actor = { sub: "staff-1", role: "admin" };
  rows = [];
  audits = [];
  delete process.env.NEXT_PUBLIC_SITE_URL;
});
test("contact saves all conditional services and captures explicit consent", async () => {
  const variants = [
    body,
    { ...body, serviceInterested: "career", careerGoal: "Recruitment" },
    { ...body, serviceInterested: "financial", loanType: "Business" },
  ];
  for (let i = 0; i < variants.length; i++) {
    const res = await POST(
      request(variants[i], "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeee" + i),
    );
    assert.equal(res.status, 200);
  }
  assert.equal(records.size, 3);
  assert.equal(notifications, 3);
  const academic = [...records.values()][0];
  assert.equal(academic.courseTitle, "Example");
  assert.equal(academic.termsAccepted, true);
  assert.equal(academic.status, "new");
});
test("duplicate and uncertain network retries keep one saved record", async () => {
  const first = await POST(request());
  const second = await POST(request());
  assert.equal(first.status, 200);
  assert.equal(second.status, 200);
  assert.equal(records.size, 1);
  const changed = await POST(request({ ...body, name: "Different Person" }));
  assert.equal(changed.status, 409);
  assert.equal(records.size, 1);
});
test("contact refuses malicious input before writing", async () => {
  assert.equal(
    (await POST(request({ ...body, selectedCourse: "invented" }))).status,
    400,
  );
  assert.equal(
    (await POST(request({ ...body, termsAccepted: false }))).status,
    400,
  );
  assert.equal((await POST(request("broken JSON"))).status, 400);
  assert.equal(
    (await POST(request(body, undefined, { "content-type": "text/plain" })))
      .status,
    415,
  );
  assert.equal(
    (await POST(request(body, undefined, { origin: "https://evil.example" })))
      .status,
    403,
  );
  assert.equal(
    (await POST(request({ ...body, message: "x".repeat(13000) }))).status,
    413,
  );
  assert.equal(records.size, 0);
});
test("export enforces role, date boundaries and formula-safe output with audit", async () => {
  const url =
    "http://localhost/api/export-enquiries?from=2026-09-01&to=2026-09-26";
  actor = null;
  assert.equal((await exportCSV(new Request(url))).status, 401);
  actor = { sub: "viewer", role: "viewer" };
  assert.equal((await exportCSV(new Request(url))).status, 403);
  actor = { sub: "exporter", role: "exporter" };
  rows = [
    {
      name: ' \t=HYPERLINK("bad")',
      service: "legacy",
      interestedCourse: "Older course",
    },
  ];
  const res = await exportCSV(new Request(url));
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("cache-control"), "private, no-store");
  const text = await res.text();
  assert.ok(text.includes('"\' \t=HYPERLINK(""bad"")"'));
  assert.ok(text.includes("Older course"));
  assert.equal(audits.length, 1);
  assert.equal((await exportCSV(new Request(url + "&key=old"))).status, 400);
  assert.equal(
    (
      await exportCSV(
        new Request(
          "http://localhost/api/export-enquiries?from=2020-01-01&to=2026-01-01",
        ),
      )
    ).status,
    400,
  );
});
