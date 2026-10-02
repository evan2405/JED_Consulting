import { getCourses, getServices, getCollection } from "../../Sainity/queries";
export const revalidate = 60;
export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  if (!base) return [];
  const [{ courses }, services, updates] = await Promise.all([
    getCourses(),
    getServices(),
    getCollection("updates"),
  ]);
  const paths = [
    "",
    "/courses",
    "/counselling",
    "/career",
    "/financial",
    "/placements",
    "/updates",
    "/contact",
    "/privacy-policy",
    "/terms",
  ];
  return [
    ...paths.map((path) => ({
      url: base + path,
      changeFrequency: "monthly",
      priority: path ? 0.7 : 1,
    })),
    ...courses
      .filter((c) => c.slug?.current)
      .map((c) => ({
        url: base + "/courses/" + c.slug.current,
        changeFrequency: "weekly",
        priority: 0.8,
      })),
    ...services
      .filter((s) => s.slug?.current)
      .map((s) => ({
        url: base + "/counselling/" + s.slug.current,
        changeFrequency: "monthly",
        priority: 0.8,
      })),
    ...updates.items
      .filter((u) => u.slug?.current)
      .map((u) => ({
        url: base + "/updates/" + u.slug.current,
        changeFrequency: "weekly",
        priority: 0.6,
      })),
  ];
}
