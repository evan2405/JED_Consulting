/**
 * lib/logger.js
 * Lightweight structured logger for Next.js API routes.
 * Outputs JSON in production (for log aggregators like Vercel, BetterStack, Datadog).
 * Outputs readable formatted text in development.
 */

const isDev = process.env.NODE_ENV !== "production";

function timestamp() {
  return new Date().toISOString();
}

function formatDev(level, route, message, meta) {
  const prefix = {
    info:  "ℹ️  INFO ",
    warn:  "⚠️  WARN ",
    error: "🔴 ERROR",
  }[level] || level.toUpperCase();

  const metaStr = meta && Object.keys(meta).length
    ? "\n    " + JSON.stringify(meta, null, 2).replace(/\n/g, "\n    ")
    : "";

  return `[${timestamp()}] ${prefix} [${route}] ${message}${metaStr}`;
}

function formatProd(level, route, message, meta) {
  return JSON.stringify({
    ts: timestamp(),
    level,
    route,
    message,
    ...meta,
  });
}

function log(level, route, message, meta = {}) {
  // Scrub any accidental secrets from meta before logging
  const safeMeta = { ...meta };
  for (const key of Object.keys(safeMeta)) {
    if (/token|key|secret|password|auth/i.test(key)) {
      safeMeta[key] = "[REDACTED]";
    }
  }

  const output = isDev
    ? formatDev(level, route, message, safeMeta)
    : formatProd(level, route, message, safeMeta);

  if (level === "error") {
    console.error(output);
  } else if (level === "warn") {
    console.warn(output);
  } else {
    console.log(output);
  }
}

const logger = {
  /**
   * Log an informational message.
   * @param {string} route  - e.g. "POST /api/contact"
   * @param {string} message
   * @param {object} [meta] - Extra structured data (will be scrubbed of secrets)
   */
  info(route, message, meta = {}) {
    log("info", route, message, meta);
  },

  /**
   * Log a warning.
   */
  warn(route, message, meta = {}) {
    log("warn", route, message, meta);
  },

  /**
   * Log an error. Pass the Error object as `meta.error` for stack traces in dev.
   */
  error(route, message, meta = {}) {
    // In dev, extract the stack; in prod, just include message
    if (meta.error instanceof Error) {
      const err = meta.error;
      meta = {
        ...meta,
        errorMessage: err.message,
        stack: isDev ? err.stack : undefined,
      };
      delete meta.error;
    }
    log("error", route, message, meta);
  },
};

export default logger;
