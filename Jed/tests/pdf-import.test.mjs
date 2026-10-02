import { test } from "node:test";
import assert from "node:assert/strict";
import { planPdfImport } from "../scripts/import-pdf-content.mjs";
test("PDF import preserves real content, replaces only the test service and guards revisions", () => {
  const existing = [
    {
      _id: "existing-career",
      _type: "counsellingService",
      _rev: "revision-1",
      title: "test",
      service: "career",
    },
    {
      _id: "real-academic",
      _type: "counsellingService",
      _rev: "revision-2",
      title: "Owner title",
      service: "academic",
      description: "Owner copy",
    },
    {
      _id: "owner-course",
      _type: "course",
      _rev: "revision-3",
      title: "Owner ACCA",
      slug: { current: "acca" },
    },
  ];
  const plan = planPdfImport(existing);
  const career = plan.mutations.find(
    (m) => m.patch?.id === "existing-career",
  ).patch;
  assert.equal(career.ifRevisionID, "revision-1");
  assert.equal(career.set.title, "Career counselling");
  const academic = plan.mutations.find(
    (m) => m.patch?.id === "real-academic",
  ).patch;
  assert.equal(academic.set, undefined);
  assert.equal(academic.setIfMissing.title, undefined);
  assert.equal(academic.setIfMissing.description, undefined);
  assert.ok(
    academic.setIfMissing.relatedCourses.some(
      (ref) => ref._ref === "owner-course",
    ),
  );
  assert.equal(
    plan.mutations.some((m) => m.delete),
    false,
  );
});
test("PDF import refuses duplicates and produces no writes for fully populated records", () => {
  assert.throws(
    () =>
      planPdfImport([
        { _id: "a", _type: "counsellingService", service: "career" },
        { _id: "b", _type: "counsellingService", service: "career" },
      ]),
    /duplicate/,
  );
  const initial = planPdfImport([]);
  const records = initial.mutations.map((m) => ({
    ...m.createIfNotExists,
    _rev: "stored-revision",
  }));
  assert.deepEqual(planPdfImport(records).mutations, []);
});
