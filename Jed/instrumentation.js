export async function onRequestError(error, request, context) {
  // Never log request headers, query strings, bodies or exception messages.
  console.error(
    JSON.stringify({
      event: "server_request_error",
      digest: error.digest || "unknown",
      route: context.routePath,
      method: request.method,
      time: new Date().toISOString(),
    }),
  );
}
