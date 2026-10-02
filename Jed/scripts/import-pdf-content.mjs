// Explicit, reviewed PDF-content import. The general demo seeder remains non-production only.
import { createClient } from "@sanity/client";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { seedDocuments } from "./seed-content.mjs";

const allowedTypes = [
  "course",
  "counsellingService",
  "courseCategory",
  "faq",
  "siteSettings",
  "homepage",
];
export function planPdfImport(existing) {
  const documents = seedDocuments({ pdfOnly: true });
  const idMap = new Map();
  for (const doc of documents) {
    const matches = existing.filter(
      (row) =>
        row._type === doc._type &&
        (row._id === doc._id ||
          (doc._type === "counsellingService" && row.service === doc.service) ||
          (doc._type === "course" && row.slug?.current === doc.slug.current) ||
          ["siteSettings", "homepage"].includes(doc._type)),
    );
    if (matches.length > 1)
      throw new Error("Resolve duplicate content before importing.");
    idMap.set(doc._id, matches[0]?._id || doc._id);
  }
  const rewrite = (value) => {
    if (Array.isArray(value)) return value.map(rewrite);
    if (value && typeof value === "object")
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [
          key,
          key === "_ref" ? idMap.get(item) || item : rewrite(item),
        ]),
      );
    return value;
  };
  const mutations = [];
  const changes = [];
  for (const raw of documents) {
    const doc = { ...rewrite(raw), _id: idMap.get(raw._id) };
    const previous = existing.find((row) => row._id === doc._id);
    if (!previous) {
      mutations.push({ createIfNotExists: doc });
      changes.push({ id: doc._id, type: doc._type, action: "create" });
      continue;
    }
    if (previous._type !== doc._type)
      throw new Error("Document ID type collision.");
    const { _id, _type, ...fields } = doc;
    // Only the existing service explicitly titled "test" is treated as a disposable placeholder.
    const placeholder =
      _type === "counsellingService" &&
      /^test$/i.test(previous.title?.trim() || "");
    const missing = Object.fromEntries(
      Object.entries(fields).filter(([key]) => previous[key] === undefined),
    );
    if (!placeholder && !Object.keys(missing).length) continue;
    if (!previous._rev)
      throw new Error("A revision is required before updating content.");
    mutations.push({
      patch: {
        id: _id,
        ifRevisionID: previous._rev,
        ...(placeholder ? { set: fields } : { setIfMissing: missing }),
      },
    });
    changes.push({
      id: _id,
      type: _type,
      action: placeholder ? "replace-test-service" : "fill-missing-fields",
    });
  }
  return { mutations, changes, documentIds: [...idMap.values()] };
}

async function main() {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;
  const token =
    process.env.SANITY_CONTENT_WRITE_TOKEN ||
    process.env.SANITY_SEED_WRITE_TOKEN ||
    process.env.SANITY_API_TOKEN;
  const target = process.argv
    .find((arg) => arg.startsWith("--target="))
    ?.slice(9);
  if (!projectId || !dataset || !token || target !== `${projectId}/${dataset}`)
    throw new Error(
      "Supply a configured content token and an exact --target=project/dataset.",
    );
  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2026-01-01",
    useCdn: false,
    perspective: "raw",
  });
  const existing = await client.fetch(
    '*[_type in $types && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]',
    { types: allowedTypes },
  );
  const plan = planPdfImport(existing);
  console.log(
    JSON.stringify({
      target,
      documents: plan.documentIds.length,
      changes: plan.changes,
    }),
  );
  if (!plan.mutations.length) {
    console.log("Content already present; no changes needed.");
    return;
  }
  await client.mutate(plan.mutations, { dryRun: true });
  if (!process.argv.includes("--apply")) {
    console.log("Server dry run passed. No content written.");
    return;
  }
  const directory = new URL("../../artifacts/", import.meta.url);
  await mkdir(directory, { recursive: true });
  const changed = new Set(plan.changes.map((change) => change.id));
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backup = new URL(`sanity-pdf-import-${stamp}.json`, directory);
  await writeFile(
    backup,
    JSON.stringify(
      {
        target,
        before: existing.filter((doc) => changed.has(doc._id)),
        changes: plan.changes,
      },
      null,
      2,
    ),
    { flag: "wx" },
  );
  await client.mutate(plan.mutations, { visibility: "sync" });
  const count = await client.fetch("count(*[_id in $ids])", {
    ids: plan.documentIds,
  });
  if (count !== plan.documentIds.length)
    throw new Error("Content count verification failed.");
  console.log(
    JSON.stringify({ verifiedDocuments: count, backup: fileURLToPath(backup) }),
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    console.error(
      JSON.stringify({
        failed: true,
        status: error.statusCode || null,
        reason: error.statusCode
          ? "Sanity rejected the content import; inspect access and document conflicts."
          : error.message,
      }),
    );
    process.exitCode = 1;
  });
}
