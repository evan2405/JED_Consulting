import { NextResponse } from "next/server";
import { client } from "../../../../Sainity/client.js";

/**
 * GET /api/health
 * Returns current system health status.
 * Use this URL with UptimeRobot, BetterStack, or any uptime monitor.
 *
 * Response: 200 OK (healthy) | 503 Service Unavailable (degraded)
 */
export async function GET() {
  const start = Date.now();
  const checks = {};
  let allHealthy = true;

  // ── Check 1: Sanity connectivity ───────────────────────────────────────────
  try {
    // Lightweight ping — just fetch one document's _id
    await client.fetch(`*[_type == "course"][0]._id`);
    checks.sanity = { status: "ok" };
  } catch (err) {
    checks.sanity = { status: "error", message: err.message };
    allHealthy = false;
  }

  // ── Check 2: Environment variables present ─────────────────────────────────
  const requiredEnvVars = ["SANITY_PROJECT_ID", "SANITY_DATASET", "SANITY_API_TOKEN", "ADMIN_EXPORT_KEY"];
  const missingVars = requiredEnvVars.filter((v) => !process.env[v]);
  if (missingVars.length > 0) {
    checks.env = { status: "error", missing: missingVars };
    allHealthy = false;
  } else {
    checks.env = { status: "ok" };
  }

  const responseTimeMs = Date.now() - start;
  const statusCode = allHealthy ? 200 : 503;

  return NextResponse.json(
    {
      status: allHealthy ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      responseTimeMs,
      checks,
    },
    {
      status: statusCode,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
