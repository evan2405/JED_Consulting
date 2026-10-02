import { test } from "node:test";
import assert from "node:assert/strict";
import { parse, evaluate } from "groq-js";
import { createPublicContentReader } from "../lib/public-content-reader.js";

const queries = {
  courses: '*[_type == "course"]{title}',
  settings: '*[_type == "settings"][0]{title}',
};

test("concurrent content requests batch, deduplicate and fetch only requested projections", async () => {
  let calls = 0;
  let query;
  const read = createPublicContentReader(queries, async (input) => {
    calls++;
    query = input;
    return (
      await evaluate(parse(input), {
        dataset: [
          { _type: "course", title: "Course", privateNotes: "secret" },
          { _type: "settings", title: "Contact" },
        ],
      })
    ).get();
  });
  const courses = read("courses");
  assert.equal(read("courses"), courses);
  const [list, settings] = await Promise.all([courses, read("settings")]);
  assert.equal(calls, 1);
  assert.deepEqual(list, [{ title: "Course" }]);
  assert.deepEqual(settings, { title: "Contact" });
  await read("courses");
  assert.equal(calls, 1);
  assert.throws(() => read("submissions"), /Unknown public/);
  assert.throws(() => read("toString"), /Unknown public/);
  assert.ok(!query.includes("privateNotes"));
});

test("each new render sees edits/deletions; settled results never leak across requests", async () => {
  let dataset = [{ _type: "course", title: "Before" }];
  const fetchBatch = async (input) =>
    (await evaluate(parse(input), { dataset })).get();
  const first = createPublicContentReader(queries, fetchBatch);
  assert.deepEqual(await first("courses"), [{ title: "Before" }]);
  dataset = [{ _type: "course", title: "After" }];
  assert.deepEqual(
    await createPublicContentReader(queries, fetchBatch)("courses"),
    [{ title: "After" }],
  );
  dataset = [];
  assert.deepEqual(
    await createPublicContentReader(queries, fetchBatch)("courses"),
    [],
  );
});

test("batch failures and incomplete responses reject instead of hanging or inventing content", async () => {
  const read = createPublicContentReader(queries, async () => {
    throw new Error("Offline");
  });
  const results = await Promise.allSettled([read("courses"), read("settings")]);
  assert.ok(results.every((result) => result.status === "rejected"));
  const incomplete = createPublicContentReader(queries, async () => ({
    settings: null,
  }));
  const [courses, settings] = await Promise.allSettled([
    incomplete("courses"),
    incomplete("settings"),
  ]);
  assert.equal(courses.status, "rejected");
  assert.equal(settings.value, null);
});
