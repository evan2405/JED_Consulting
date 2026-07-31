import { client } from "../../Sainity/client";
import { coursesQuery } from "../../Sainity/queries";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jedconsultancy.com";

export default async function sitemap() {
  // Static routes
  const staticRoutes = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic course routes from Sanity
  let courseRoutes = [];
  try {
    const courses = await client.fetch(coursesQuery);
    courseRoutes = (courses || [])
      .filter((c) => c?.slug?.current)
      .map((c) => ({
        url: `${BASE_URL}/courses/${c.slug.current}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      }));
  } catch {
    // If Sanity is unavailable during build, skip dynamic routes
  }

  return [...staticRoutes, ...courseRoutes];
}
