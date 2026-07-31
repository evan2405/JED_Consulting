import { writeClient } from "../../../../Sainity/client.js";
import { NextResponse } from "next/server";
import logger from "../../../../lib/logger.js";

const client = writeClient;

// Escape a CSV cell value
function csvCell(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// ── CORS ──────────────────────────────────────────────────────────────────────
// Allow Sanity Studio from localhost (dev) and production origin (if set)
const STUDIO_ORIGIN =
  process.env.NEXT_PUBLIC_STUDIO_ORIGIN || "http://localhost:3333";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": STUDIO_ORIGIN,
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle CORS preflight
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

// ── Auth helper ───────────────────────────────────────────────────────────────
// Accepts key via:
//   1. Authorization: Bearer <key>  (preferred — not visible in server logs)
//   2. ?key=<key>                   (legacy — still supported)
function extractKey(request) {
  const authHeader = request.headers.get("authorization") || "";
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }
  const { searchParams } = new URL(request.url);
  return searchParams.get("key");
}

export async function GET(request) {
  const key      = extractKey(request);
  const adminKey = process.env.ADMIN_EXPORT_KEY;

  if (!adminKey || key !== adminKey) {
    logger.warn("GET /api/export-enquiries", "Unauthorized export attempt", {
      ip: request.headers.get("x-forwarded-for") || "unknown",
    });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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

    logger.info("GET /api/export-enquiries", "Export successful", {
      count: submissions.length,
    });

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

    // UTF-8 BOM for Excel compatibility
    const csvWithBom = "\uFEFF" + csvContent;
    const fileName   = `jed-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;

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
    logger.error("GET /api/export-enquiries", "Export failed", { error: err });
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
