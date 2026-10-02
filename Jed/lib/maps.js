export function googleMapsEmbedUrl(value) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    if (
      url.origin !== "https://www.google.com" ||
      url.pathname !== "/maps/embed" ||
      !url.searchParams.get("pb") ||
      url.username ||
      url.password
    )
      return null;
    return url.href;
  } catch {
    return null;
  }
}
