import {
  getCourses,
  getServices,
  getCollection,
  getSettings,
  getHomepage,
  getFaqs,
} from "../../../../../Sainity/queries";
import { HttpError, apiError } from "../../../../../lib/http";
export async function GET(request, { params }) {
  try {
    const { resource, slug = [] } = await params;
    if (slug.length > 1 || slug.some((s) => !/^[a-z0-9-]{1,100}$/.test(s)))
      throw new HttpError(404, "Content not found.");
    const p = new URL(request.url).searchParams;
    const page = Number(p.get("page") || 1),
      limit = Number(p.get("limit") || 20),
      q = (p.get("q") || "").trim(),
      category = p.get("category") || "";
    if (
      !Number.isInteger(page) ||
      page < 1 ||
      page > 10000 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100 ||
      q.length > 100 ||
      category.length > 100
    )
      throw new HttpError(400, "Invalid content filters.");
    let items,
      unavailable = false;
    if (resource === "courses") {
      const result = await getCourses();
      items = result.courses;
      unavailable = result.unavailable;
    } else if (resource === "counselling") items = await getServices();
    else if (resource === "settings" || resource === "homepage") {
      if (slug.length) throw new HttpError(404, "Content not found.");
      return Response.json(
        {
          item: await (resource === "settings" ? getSettings() : getHomepage()),
        },
        { headers: { "Cache-Control": "no-store" } },
      );
    } else if (resource === "faqs") items = await getFaqs();
    else if (
      [
        "banners",
        "updates",
        "testimonials",
        "reviews",
        "placements",
        "categories",
      ].includes(resource)
    ) {
      const result = await getCollection(resource);
      items = result.items;
      unavailable = result.unavailable;
    } else throw new HttpError(404, "Content not found.");
    if (slug.length) {
      const item = items.find((i) => i.slug?.current === slug[0]);
      if (!item)
        throw new HttpError(
          unavailable ? 503 : 404,
          unavailable
            ? "Content temporarily unavailable."
            : "Content not found.",
        );
      return Response.json(
        { item },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
    items = items.filter(
      (i) =>
        (!category || i.category === category) &&
        (!q ||
          (i.title + " " + (i.description || ""))
            .toLowerCase()
            .includes(q.toLowerCase())),
    );
    return Response.json(
      {
        items: items.slice((page - 1) * limit, page * limit),
        total: items.length,
        page,
        limit,
        unavailable,
      },
      {
        status: unavailable && !items.length ? 503 : 200,
        headers: {
          "Cache-Control": unavailable
            ? "no-store"
            : "no-store",
        },
      },
    );
  } catch (e) {
    return apiError(e);
  }
}
