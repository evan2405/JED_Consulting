// Dry-run by default. Never deletes source records. Do not commit exported personal data.
import { createClient } from "@sanity/client";
const apply = process.argv.includes("--apply");
const {
  SANITY_PROJECT_ID,
  SANITY_DATASET,
  SANITY_ENQUIRY_DATASET,
  SANITY_MIGRATION_TOKEN,
} = process.env;
if (
  !SANITY_MIGRATION_TOKEN ||
  !SANITY_PROJECT_ID ||
  !SANITY_ENQUIRY_DATASET ||
  SANITY_DATASET === SANITY_ENQUIRY_DATASET
)
  throw new Error(
    "Set project, distinct source/destination datasets and a temporary migration token.",
  );
const source = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_MIGRATION_TOKEN,
  apiVersion: "2026-01-01",
  useCdn: false,
});
const target = source.withConfig({ dataset: SANITY_ENQUIRY_DATASET });
let anonymousDenied = false;
try {
  await target.withConfig({ token: undefined }).fetch("count(*)");
} catch (e) {
  if ([401, 403].includes(e.statusCode)) anonymousDenied = true;
  else throw new Error("Cannot verify destination privacy.");
}
if (!anonymousDenied)
  throw new Error("Destination must reject anonymous reads before migration.");
let after = "",
  count = 0;
while (true) {
  const records = await source.fetch(
    '*[_type=="submission" && _id>$after] | order(_id asc)[0...100]',
    { after },
  );
  if (!records.length) break;
  if (apply) {
    let tx = target.transaction();
    for (const record of records) {
      const { _rev, _createdAt, _updatedAt, ...doc } = record;
      tx = tx.createIfNotExists({
        ...doc,
        submittedAt: doc.submittedAt || _createdAt,
        status: doc.status || "new",
      });
    }
    await tx.commit();
    const ids = records.map((r) => r._id);
    const found = await target.fetch("count(*[_id in $ids])", { ids });
    if (found !== ids.length)
      throw new Error("Destination verification failed; source is unchanged.");
  }
  count += records.length;
  after = records.at(-1)._id;
}
console.log(
  (apply ? "Copied and verified " : "Would copy ") +
    count +
    " records. Source records are unchanged.",
);
console.log(
  "Protect the old dataset from anonymous access as part of the coordinated cutover; copying alone does not remove existing exposure. Revoke the temporary migration token after verification.",
);
