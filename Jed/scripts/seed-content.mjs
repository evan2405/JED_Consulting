import { createClient } from "@sanity/client";
import {
  defaultCourses,
  defaultServices,
  defaultSettings,
  defaultHomepage,
  defaultFaqs,
} from "../lib/content-defaults.js";
import { pdfServiceContent } from "./pdf-service-content.mjs";
export function seedDocuments({ pdfOnly = false } = {}) {
  const key = (values) =>
    values.map((v, i) =>
      typeof v === "object" ? { _key: "item-" + i, ...v } : v,
    );
  const courses = defaultCourses.map((c, i) => ({
    _id: c._id,
    _type: "course",
    title: c.title,
    slug: { _type: "slug", current: c.slug.current },
    description: c.description,
    shortDescription: c.description,
    category: c.category,
    categoryReference: {
      _type: "reference",
      _weak: true,
      _ref: c.category === "Career & language" ? "category-1" : "category-0",
    },
    approved: true,
    isDemo: false,
    curriculumStatus: "overview",
    curriculum: [
      {
        _key: "orientation",
        title: "Programme orientation — official curriculum pending",
        topics: [
          c.description,
          "Confirm the institution, eligibility, duration, fees and official teaching modules with J.ed.",
        ],
      },
    ],
    demoText: c.demoText,
    counsellingAvailable: true,
    order: i,
  }));
  const services = defaultServices
    .map((s) => ({ ...s, ...pdfServiceContent[s.service] }))
    .map((s, i) => ({
      _id: s._id,
      _type: "counsellingService",
      title: s.title,
      slug: { _type: "slug", current: s.slug.current },
      service: s.service,
      short: s.short,
      description: s.description,
      items: s.items,
      process: s.process,
      curriculum: key(s.curriculum),
      offerings: key(
        s.offerings.map((o) => ({
          title: o.title,
          items: o.items,
          eligibility: o.eligibility,
          loanType: o.loanType,
        })),
      ),
      demoText: s.demoText,
      relatedCourses: (s.relatedCourseIds || []).map((id, index) => ({
        _key: "course-" + index,
        _type: "reference",
        _weak: true,
        _ref: id,
      })),
      seo: { title: s.title, description: s.description.slice(0, 155) },
      approved: true,
      order: i,
    }));
  const home = { ...defaultHomepage };
  delete home.image;
  const documents = [
    ...courses,
    ...services,
    ...defaultFaqs.map((f) => ({ ...f, _type: "faq", approved: true })),
    {
      _id: "site-settings",
      _type: "siteSettings",
      ...defaultSettings,
      approved: true,
    },
    {
      _id: "homepage",
      _type: "homepage",
      ...home,
      benefits: key(home.benefits),
      steps: key(home.steps),
      approved: true,
    },
    ...["Accounting & finance", "Career & language"].map((title, i) => ({
      _id: "category-" + i,
      _type: "courseCategory",
      title,
      slug: { current: i ? "career-language" : "accounting-finance" },
      approved: true,
      order: i,
    })),
    {
      _id: "drafts.demo-update",
      _type: "update",
      title: "Development example: programme enquiry",
      slug: { current: "demo-programme-enquiry" },
      description:
        "Sample update for Studio training. Replace with an approved notice before publication.",
      category: "courses",
      approved: false,
      isDemo: true,
    },
    {
      _id: "drafts.demo-banner",
      _type: "banner",
      title: "Development example banner",
      subtitle: "A sample announcement for editors.",
      placement: "homepage",
      ctaText: "Explore courses",
      ctaLink: "/courses",
      isActive: false,
      approved: false,
      isDemo: true,
    },
    {
      _id: "drafts.demo-review",
      _type: "counsellingReview",
      title: "Development sample review",
      author: "Sample reviewer — fictional",
      quote:
        "Example text for editor training. This is not a real customer review.",
      approved: false,
      isDemo: true,
    },
    {
      _id: "drafts.demo-testimonial",
      _type: "testimonial",
      title: "Development sample testimonial",
      author: "Sample learner — fictional",
      quote:
        "Example text only. Replace with an approved statement from a real learner.",
      approved: false,
      isDemo: true,
    },
  ];
  return pdfOnly ? documents.filter((doc) => !doc.isDemo) : documents;
}
async function main() {
  const docs = seedDocuments({ pdfOnly: process.argv.includes("--pdf-only") });
  if (!process.argv.includes("--apply")) {
    console.log(
      `Dry run: ${docs.length} deterministic documents. No data written. Use --apply with an explicitly permitted non-production dataset.`,
    );
    return;
  }
  const dataset = process.env.SANITY_SEED_DATASET;
  if (
    process.env.NODE_ENV === "production" ||
    process.env.ALLOW_SANITY_SEED !== "true" ||
    !/^(development|test|staging)([-_][a-z0-9_-]+)?$/.test(dataset || "")
  )
    throw new Error(
      "Seeding is restricted to explicitly allowed development/test/staging datasets.",
    );
  if (!process.env.SANITY_PROJECT_ID || !process.env.SANITY_SEED_WRITE_TOKEN)
    throw new Error("Set the seed project and scoped write token.");
  const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset,
    token: process.env.SANITY_SEED_WRITE_TOKEN,
    apiVersion: "2026-01-01",
    useCdn: false,
  });
  const tx = client.transaction();
  for (const doc of docs) tx.createIfNotExists(doc);
  await tx.commit();
  console.log(
    `Seeded ${docs.length} document IDs; existing content was not overwritten.`,
  );
}
if (process.argv[1]?.endsWith("seed-content.mjs"))
  main().catch(() => {
    console.error(
      "Seed refused or failed. Check the non-production dataset, explicit opt-in and scoped credentials.",
    );
    process.exitCode = 1;
  });
