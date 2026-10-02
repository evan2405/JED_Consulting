const blocked =
  /name|email|phone|message|body|token|key|secret|password|auth|cookie|address|stack/i;
function redact(value) {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === "object") {
    if (value instanceof Error) return { type: value.name };
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [
        k,
        blocked.test(k) ? "[REDACTED]" : redact(v),
      ]),
    );
  }
  return value;
}
function log(level, route, event, meta = {}) {
  console[level](
    JSON.stringify({
      time: new Date().toISOString(),
      route,
      event,
      ...redact(meta),
    }),
  );
}
const logger = {
  info: (...args) => log("info", ...args),
  warn: (...args) => log("warn", ...args),
  error: (...args) => log("error", ...args),
};

export default logger;
