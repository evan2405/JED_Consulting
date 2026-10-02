import { test } from "node:test";
import assert from "node:assert/strict";
import { checkStorage } from "../scripts/check-enquiry-storage.mjs";

const env = { SANITY_PROJECT_ID: "example", SANITY_DATASET: "production",
  SANITY_ENQUIRY_DATASET: "enquiries", SANITY_ENQUIRY_READ_TOKEN: "read-test",
  SANITY_ENQUIRY_WRITE_TOKEN: "write-test" };
function fixture({ status = 401, failWrite = false, failDelete = false } = {}) {
  const records = new Map();
  let writes = 0, deletes = 0;
  const client = {
    async fetch(query, params) {
      if (query.includes("[0]")) return records.get(params.id);
      return params ? Number(records.has(params.id)) : records.size;
    },
    async createIfNotExists(doc) {
      writes++;
      if (!records.has(doc._id)) records.set(doc._id, doc);
      if (failWrite) throw new Error("Ambiguous write timeout");
      return records.get(doc._id);
    },
    async delete(id) { deletes++; if (failDelete) throw new Error("Denied"); records.delete(id); },
  };
  return { records, get writes() { return writes; }, get deletes() { return deletes; }, options: {
    writeTest: true, clientFactory: () => client,
    fetcher: async (_url, options) => {
      assert.equal(options.headers, undefined);
      assert.equal(options.cache, "no-store");
      return new Response(null, { status });
    },
  } };
}
test("setup rejects missing credentials and public/content/comments storage before writing", async () => {
  for (const config of [{}, { ...env, SANITY_ENQUIRY_DATASET: "production" },
    { ...env, SANITY_ENQUIRY_DATASET: "production-comments" }]) {
    const f = fixture();
    assert.ok((await checkStorage(config, f.options)).some((c) => c.ok === false));
    assert.equal(f.writes, 0);
  }
  for (const status of [200, 404, 500]) {
    const f = fixture({ status });
    assert.ok((await checkStorage(env, f.options)).some((c) => c.ok === false));
    assert.equal(f.writes, 0);
  }
});
test("read-only setup check never mutates data", async () => {
  const f = fixture();
  const checks = await checkStorage(env, { ...f.options, writeTest: false });
  assert.equal(f.writes, 0);
  assert.equal(f.deletes, 0);
  assert.ok(checks.some((c) => c.ok === null));
});
test("private probe verifies duplicate protection and cleans up only its synthetic record", async () => {
  const f = fixture();
  f.records.set("existing", { _id: "existing" });
  const checks = await checkStorage(env, f.options);
  assert.ok(checks.every((c) => c.ok));
  assert.equal(f.writes, 2);
  assert.equal(f.deletes, 1);
  assert.deepEqual([...f.records.keys()], ["existing"]);
});
test("ambiguous writes are cleaned up and cleanup failures block verification", async () => {
  for (const failDelete of [false, true]) {
    const f = fixture({ failWrite: true, failDelete });
    const checks = await checkStorage(env, f.options);
    assert.ok(checks.some((c) => c.ok === false));
    assert.equal(f.deletes, 1);
    assert.equal(f.records.size, failDelete ? 1 : 0);
    assert.equal(checks.at(-1).ok, !failDelete);
  }
});
