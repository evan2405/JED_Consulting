import "server-only";
import { cache } from "react";
import { client } from "./client.js";
import {
  defaultCourses,
  defaultServices,
  defaultSettings,
  defaultHomepage,
  defaultFaqs,
} from "../lib/content-defaults.js";
import { safeUrl } from "../lib/validation.js";
import { createPublicContentReader } from "../lib/public-content-reader.js";
export const publicGate =
  'approved == true && !(_id in path("drafts.**")) && !(_id in path("versions.**")) && ($allowDemo || isDemo != true)';
const media = '"image":image.asset->url,imageAlt';
const seo = 'seo{title,description,"image":image.asset->url}';
export const coursesQuery = `*[_type == "course" && ${publicGate} && category != "visa"] | order(title asc) {_id,title,slug,description,shortDescription,"category":coalesce(*[_type=="courseCategory" && _id==^.categoryReference._ref && ${publicGate}][0].title,category),level,duration,price,eligibility,${media},syllabusUrl,accreditation,examDates,curriculum[]{title,topics},curriculumStatus,demoUrl,demoText,counsellingAvailable,isDemo,${seo}}`;
export const servicesQuery = `*[_type=="counsellingService" && ${publicGate}] | order(order asc) {_id,title,"id":service,service,"slug":coalesce(slug,{"current":service}),short,description,items,process,curriculum[]{title,topics},offerings[]{title,items,eligibility,loanType},counsellorName,counsellorBio,demoUrl,demoText,${media},"relatedCourses":*[_type=="course" && _id in ^.relatedCourses[]._ref && ${publicGate}]{_id,title,slug,approved},isDemo,${seo}}`;
export const activeBannersQuery = `*[_type=="banner" && ${publicGate} && isActive==true && (!defined(publishAt) || publishAt<=now()) && (!defined(expiresAt) || expiresAt>now())] | order(order asc) {_id,title,subtitle,ctaText,ctaLink,placement,${media}}`;
export const contentQueries = {
  banners: activeBannersQuery,
  updates: `*[_type=="update" && ${publicGate} && (!defined(publishAt) || publishAt<=now())] | order(publishAt desc,_createdAt desc) {_id,title,slug,description,category,link,publishAt,${media},${seo}}`,
  testimonials: `*[_type=="testimonial" && ${publicGate}] | order(order asc) {_id,author,quote,"course":*[_type=="course" && _id==^.course._ref && ${publicGate}][0].title,${media},isDemo}`,
  reviews: `*[_type=="counsellingReview" && ${publicGate}] | order(order asc) {_id,author,quote,"serviceSlug":*[_type=="counsellingService" && _id==^.service._ref && ${publicGate}][0]{"value":coalesce(slug.current,service)}.value,${media},isDemo}`,
  placements: `*[_type=="placement" && ${publicGate}] | order(year desc,order asc) {_id,title,studentName,course,company,position,package,year,testimonial,${media}}`,
  faqs: `*[_type=="faq" && ${publicGate}] | order(order asc) {_id,question,answer}`,
  categories: `*[_type=="courseCategory" && ${publicGate}] | order(order asc) {_id,title,slug,description}`,
  settings: `*[_type=="siteSettings" && ${publicGate}] | order(_updatedAt desc)[0]{organization,location,address,phone,email,hours,mapUrl,mapEmbedUrl,whatsapp,instagram,membershipFee,membershipBenefits,partners,footerDescription,contactTitle,contactDescription,placementTitle,placementDescription}`,
  homepage: `*[_type=="homepage" && ${publicGate}] | order(_updatedAt desc)[0]{heroEyebrow,heroTitle,heroSubtitle,heroAccent,heroDescription,${media},photoCaption,benefits[]{title,text},courseTitle,courseDescription,whyTitle,whyDescription,steps[]{title,text},membershipTitle,membershipDescription,statistics[]{title,value,source}}`,
};
export const fallbackEnabled = () =>
  !client || process.env.SANITY_USE_CATALOG_FALLBACK === "true";
const rows = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);
const modules = (value) =>
  rows(value).map((module) => ({ ...module, topics: rows(module.topics) }));
const hasRoute = (record) =>
  record &&
  typeof record.title === "string" &&
  /^[a-z0-9-]{1,100}$/.test(record.slug?.current || "");
const getPublicReader = cache(() =>
  createPublicContentReader(
    { courses: coursesQuery, services: servicesQuery, ...contentQueries },
    async (query) => {
      if (!client) throw new Error("Content not configured");
      return client.fetch(
        query,
        {
          allowDemo:
            process.env.NODE_ENV !== "production" &&
            process.env.SANITY_SHOW_DEMO === "true",
        },
        { cache: "no-store", signal: AbortSignal.timeout(8000) },
      );
    },
  ),
);
const fetchPublic = (kind) => getPublicReader()(kind);
export const getCourses = cache(async () => {
  let published = [],
    unavailable = false;
  try {
    published = rows(await fetchPublic("courses"))
      .filter(hasRoute)
      .map((course) => ({ ...course, curriculum: modules(course.curriculum) }));
  } catch {
    unavailable = true;
  }
  const slugs = new Set(published.map((c) => c.slug?.current));
  return {
    courses: [
      ...published,
      ...(fallbackEnabled()
        ? defaultCourses.filter((c) => !slugs.has(c.slug.current))
        : []),
    ],
    unavailable,
  };
});
export async function getCourse(slug) {
  const { courses, unavailable } = await getCourses();
  const course = courses.find((c) => c.slug?.current === slug);
  if (!course && unavailable)
    throw new Error(
      "Course information is temporarily unavailable. Please retry.",
    );
  return course;
}
const getServiceCollection = cache(async () => {
  try {
    const services = rows(await fetchPublic("services"))
      .filter(hasRoute)
      .map((row) => ({
        ...Object.fromEntries(
          Object.entries(row).filter(([, value]) => value != null),
        ),
        items: rows(row.items),
        process: rows(row.process),
        curriculum: modules(row.curriculum),
        offerings: rows(row.offerings).map((offer) => ({
          ...offer,
          items: rows(offer.items),
        })),
      }));
    if (!fallbackEnabled()) return { services, unavailable: false };
    return {
      unavailable: false,
      services: [
        ...defaultServices.map((s) => ({
          ...s,
          ...services.find((r) => r.slug?.current === s.slug.current),
        })),
        ...services.filter(
          (r) =>
            !defaultServices.some((s) => s.slug.current === r.slug?.current),
        ),
      ],
    };
  } catch {
    return {
      services: fallbackEnabled() ? defaultServices : [],
      unavailable: true,
    };
  }
});
export const getServices = cache(
  async () => (await getServiceCollection()).services,
);
export async function getService(slug) {
  // A network failure must show the retry boundary, not a misleading 404.
  const { services, unavailable } = await getServiceCollection();
  const service = services.find((s) => s.slug?.current === slug);
  if (!service && unavailable)
    throw new Error(
      "Service information is temporarily unavailable. Please retry.",
    );
  return service;
}
export const getCollection = cache(async (kind) => {
  if (!contentQueries[kind]) throw new Error("Unknown public collection");
  try {
    return {
      items: await fetchPublic(kind),
      unavailable: false,
    };
  } catch {
    return {
      items: kind === "settings" || kind === "homepage" ? null : [],
      unavailable: true,
    };
  }
});
export const getActiveBanners = cache(
  async () => (await getCollection("banners")).items,
);
export const getSettings = cache(async () => {
  const { items } = await getCollection("settings");
  const data = {
    ...defaultSettings,
    address: process.env.CONTACT_ADDRESS || "",
    phone: process.env.CONTACT_PHONE || "",
    email: process.env.CONTACT_EMAIL || "",
    ...Object.fromEntries(
      Object.entries(items || {}).filter(([, v]) => v != null),
    ),
  };
  if (items) {
    data.membershipBenefits = rows(items.membershipBenefits);
    data.partners = rows(items.partners);
  }
  for (const key of ["whatsapp", "instagram", "mapUrl"])
    data[key] = safeUrl(data[key]) || "";
  if (!/^\+?[\d ()-]{7,30}$/.test(data.phone)) data.phone = "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) data.email = "";
  return data;
});
export const getHomepage = cache(async () => {
  const { items } = await getCollection("homepage");
  return {
    ...defaultHomepage,
    ...Object.fromEntries(
      Object.entries(items || {}).filter(([, value]) => value != null),
    ),
    ...(items
      ? {
          benefits: rows(items.benefits),
          steps: rows(items.steps),
          statistics: rows(items.statistics),
        }
      : {}),
  };
});
export const getFaqs = cache(async () => {
  const { items } = await getCollection("faqs");
  return items.length || !fallbackEnabled() ? items : defaultFaqs;
});
