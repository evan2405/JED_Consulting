import { createClient } from "next-sanity";

const projectId  = process.env.SANITY_PROJECT_ID;
const dataset    = process.env.SANITY_DATASET;
const apiVersion = "2024-01-01";
const token      = process.env.SANITY_API_TOKEN;

/**
 * client — CDN-enabled read client with token.
 * Use for all public-facing data fetches (homepage, courses, testimonials, etc.).
 * - useCdn: true  → responses served from Sanity's global edge CDN (fast)
 * - token included → works on both public AND private datasets
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: true,
});

/**
 * writeClient — CDN disabled, same token.
 * Use ONLY in API routes that WRITE to Sanity or need the absolute freshest data.
 * - useCdn: false → bypasses CDN, always hits the live API
 * - Required for: /api/contact (create submission), /api/export-enquiries (fetch live data)
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});
