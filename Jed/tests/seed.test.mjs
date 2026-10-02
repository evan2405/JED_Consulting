import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { seedDocuments } from "../scripts/seed-content.mjs";
test("seed IDs are repeatable, complete and sample testimonials cannot be published accidentally", () => {
  const docs = seedDocuments();
  assert.deepEqual(docs, seedDocuments());
  assert.equal(new Set(docs.map((d) => d._id)).size, docs.length);
  assert.equal(docs.filter((d) => d._type === "course").length, 15);
  assert.equal(docs.filter((d) => d._type === "counsellingService").length, 3);
  for (const doc of docs.filter((d) =>
    ["testimonial", "counsellingReview"].includes(d._type),
  )) {
    assert.equal(doc.approved, false);
    assert.equal(doc.isDemo, true);
    assert.match(doc._id, /^drafts\./);
  }
});
test("PDF-only seed covers all services and programmes without fabricated social proof", () => {
  const docs = seedDocuments({ pdfOnly: true });
  assert.equal(docs.length, 27);
  assert.equal(
    docs.some((doc) =>
      ["submission", "testimonial", "counsellingReview", "placement"].includes(
        doc._type,
      ),
    ),
    false,
  );
  const ids = new Set(docs.map((doc) => doc._id));
  const services = docs.filter((doc) => doc._type === "counsellingService");
  assert.deepEqual(
    services.map((s) => s.service),
    ["academic", "career", "financial"],
  );
  for (const service of services) {
    assert.ok(service.curriculum.length >= 3);
    assert.ok(service.demoText.length > 200);
    for (const ref of service.relatedCourses) assert.ok(ids.has(ref._ref));
  }
  assert.equal(services.find((s) => s.service === "career").process.length, 10);
  assert.equal(
    services.find((s) => s.service === "financial").offerings.length,
    5,
  );
  assert.equal(docs.find((d) => d._type === "siteSettings").membershipFee, 500);
  assert.equal(
    docs
      .filter((d) => d._type === "course")
      .every((c) => c.curriculumStatus === "overview"),
    true,
  );
});
test("seed defaults to dry run and refuses production even with opt-in", () => {
  const options = {
    encoding: "utf8",
    env: {
      ...process.env,
      NODE_ENV: "production",
      ALLOW_SANITY_SEED: "true",
      SANITY_SEED_DATASET: "production",
    },
  };
  const dry = spawnSync(
    process.execPath,
    ["scripts/seed-content.mjs"],
    options,
  );
  assert.equal(dry.status, 0);
  assert.match(dry.stdout, /No data written/);
  const apply = spawnSync(
    process.execPath,
    ["scripts/seed-content.mjs", "--apply"],
    options,
  );
  assert.equal(apply.status, 1);
  assert.match(apply.stderr, /Seed refused/);
});
