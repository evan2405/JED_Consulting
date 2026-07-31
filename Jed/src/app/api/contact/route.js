import { writeClient } from "../../../../Sainity/client.js";
import { NextResponse } from "next/server";
import logger from "../../../../lib/logger.js";

const client = writeClient;

// Simple HTML-strip sanitizer
function sanitize(str) {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").trim().slice(0, 2000);
}

// Email regex
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const body = await request.json();

    // ── Honeypot check ─────────────────────────────────────────────────────────
    if (body.website) {
      // Silently reject bots — return 200 so bots think it worked
      return NextResponse.json({ success: true });
    }

    // ── Validation ─────────────────────────────────────────────────────────────
    const name    = sanitize(body.name);
    const email   = sanitize(body.email);
    const phone   = sanitize(body.phone);
    const service = sanitize(body.service);
    const country             = sanitize(body.country);
    const preferredDestination = sanitize(body.preferredDestination);
    const interestedCourse    = sanitize(body.interestedCourse);
    const rawMessage          = sanitize(body.message);

    const message = rawMessage || `Course Enquiry for: ${interestedCourse || "General Course Enquiry"}`;

    const errors = [];
    if (!name || name.length < 2) errors.push("Name is required (min 2 chars)");
    if (!email || !EMAIL_RE.test(email)) errors.push("A valid email is required");
    if (!phone || phone.length < 6) errors.push("A valid phone number is required");

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // ── Write to Sanity ────────────────────────────────────────────────────────
    await client.create({
      _type: "submission",
      name,
      email,
      phone,
      service,
      message,
      country,
      preferredDestination,
      interestedCourse,
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, message: "Enquiry submitted successfully!" },
      { status: 200 }
    );
  } catch (err) {
    logger.error("POST /api/contact", "Failed to save enquiry", { error: err });
    return NextResponse.json(
      { success: false, error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}

// Reject non-POST
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
