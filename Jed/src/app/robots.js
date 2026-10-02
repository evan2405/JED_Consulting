export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  return {
    rules: {
      userAgent: "*",
      allow: base ? "/" : undefined,
      disallow: base
        ? ["/api/", "/staff", "/admin", "/enquire", "/thank-you"]
        : ["/"],
    },
    ...(base ? { sitemap: base + "/sitemap.xml" } : {}),
  };
}
