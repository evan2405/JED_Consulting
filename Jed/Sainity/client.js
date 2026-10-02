import "server-only";
import { createClient } from "@sanity/client";
const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
export const client =
  projectId && dataset
    ? createClient({
        projectId,
        dataset,
        apiVersion: "2026-01-01",
        perspective: "published",
        useCdn: false,
        timeout: 8000,
        maxRetries: 1,
        token: process.env.SANITY_CONTENT_READ_TOKEN,
      })
    : null;
export function privateClient(mode = "read") {
  const privateDataset = process.env.SANITY_ENQUIRY_DATASET;
  const token =
    mode === "write"
      ? process.env.SANITY_ENQUIRY_WRITE_TOKEN
      : process.env.SANITY_ENQUIRY_READ_TOKEN;
  if (!projectId || !privateDataset || !token || privateDataset === dataset)
    throw new Error("Private enquiry storage is not configured");
  return createClient({
    projectId,
    dataset: privateDataset,
    token,
    apiVersion: "2026-01-01",
    useCdn: false,
    timeout: 5000,
  });
}
