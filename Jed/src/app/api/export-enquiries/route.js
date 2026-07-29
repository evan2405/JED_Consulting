import { createClient } from "@sanity/client";
import { NextResponse } from "next/server";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Escape a CSV cell value
function csvCell(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  // Wrap in quotes and escape any existing quotes
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// CORS — allow Sanity Studio (port 3333) to call this route
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "http://localhost:3333",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Handle CORS preflight
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request) {
  // ── Admin key guard ──────────────────────────────────────────────────────────
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  const adminKey = process.env.ADMIN_EXPORT_KEY;

  if (!adminKey || key !== adminKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // ── Fetch all submissions from Sanity ────────────────────────────────────
    const submissions = await client.fetch(
      `*[_type == "submission"] | order(submittedAt desc) {
        name,
        email,
        phone,
        service,
        country,
        preferredDestination,
        interestedCourse,
        message,
        submittedAt
      }`
    );

    // ── Build CSV ────────────────────────────────────────────────────────────
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Interested Service",
      "Country",
      "Preferred Destination",
      "Interested Course",
      "Message",
      "Submitted At",
    ];

    const rows = submissions.map((s) => [
      csvCell(s.name),
      csvCell(s.email),
      csvCell(s.phone),
      csvCell(s.service),
      csvCell(s.country),
      csvCell(s.preferredDestination),
      csvCell(s.interestedCourse),
      csvCell(s.message),
      csvCell(s.submittedAt ? new Date(s.submittedAt).toLocaleString("en-IN") : ""),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\r\n");

    // Add BOM for Excel UTF-8 compatibility
    const bom = "\uFEFF";
    const csvWithBom = bom + csvContent;

    const fileName = `jed-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;

    return new Response(csvWithBom, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[Export Enquiries Error]", err);
    return NextResponse.json(
      { error: "Failed to export enquiries" },
      { status: 500 }
    );
  }
}

// Reject non-GET
export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
