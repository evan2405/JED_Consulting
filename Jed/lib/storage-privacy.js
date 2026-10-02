import "server-only";
import { HttpError } from "./http.js";
let verifiedUntil = 0;
export async function assertPrivateStorage() {
  if (Date.now() < verifiedUntil) return;
  const project = process.env.SANITY_PROJECT_ID,
    dataset = process.env.SANITY_ENQUIRY_DATASET;
  if (!project || !dataset || dataset === process.env.SANITY_DATASET)
    throw new HttpError(
      503,
      "Private enquiry storage is not ready. Please contact us on WhatsApp.",
    );
  const url =
    "https://" +
    project +
    ".api.sanity.io/v2026-01-01/data/query/" +
    encodeURIComponent(dataset) +
    "?query=" +
    encodeURIComponent('count(*[_type == "submission"])');
  const response = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
  if (![401, 403].includes(response.status))
    throw new HttpError(
      503,
      "Private enquiry storage is not ready. Please contact us on WhatsApp.",
    );
  verifiedUntil = Date.now() + 60000;
}
