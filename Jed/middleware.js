import { NextResponse } from "next/server";

// ─── In-memory rate limit store ───────────────────────────────────────────────
// Map: IP → { count, resetAt }
// NOTE: This is per-process. For multi-instance deployments, use Redis (Upstash).
const ipStore = new Map();

const RATE_LIMIT = 60;       // max requests
const WINDOW_MS  = 60_000;   // per 60 seconds

function getRateLimitResult(ip) {
  const now = Date.now();
  const entry = ipStore.get(ip);

  if (!entry || now > entry.resetAt) {
    ipStore.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  entry.count += 1;

  if (entry.count > RATE_LIMIT) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { allowed: true, remaining: RATE_LIMIT - entry.count };
}

// Periodically flush expired IPs to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of ipStore.entries()) {
      if (now > entry.resetAt) ipStore.delete(ip);
    }
  }, WINDOW_MS * 2);
}

// ─── Static asset patterns to skip ────────────────────────────────────────────
const SKIP_PATTERNS = [
  /^\/_next\//,
  /^\/favicon\.ico$/,
  /^\/fonts\//,
  /^\/images\//,
  /^\/icons\//,
  /\.(svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf|css|js\.map)$/,
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip static assets
  if (SKIP_PATTERNS.some((p) => p.test(pathname))) {
    return NextResponse.next();
  }

  // Determine real IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // Rate limiting
  const { allowed, remaining, resetAt } = getRateLimitResult(ip);

  if (!allowed) {
    return new NextResponse(
      JSON.stringify({
        error: "Too many requests",
        message: "You have exceeded the rate limit. Please try again shortly.",
        retryAfter: Math.ceil((resetAt - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)),
          "X-RateLimit-Limit": String(RATE_LIMIT),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // Pass through with rate limit headers
  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", String(RATE_LIMIT));
  response.headers.set("X-RateLimit-Remaining", String(remaining));

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static  (static files)
     * - _next/image   (image optimization)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
