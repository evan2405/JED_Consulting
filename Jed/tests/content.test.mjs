import { test, mock, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { parse, evaluate } from "groq-js";
import { enquiryFilters, leadFilter } from "../lib/enquiry-filters.js";
let dataset = [];
let offline = false;
mock.module("../Sainity/client.js", {
  namedExports: {
    client: {
      fetch: async (query, params) => {
        if (offline) throw new Error("Offline");
        return (await evaluate(parse(query), { dataset, params })).get();
      },
    },
  },
});
const content = await import("../Sainity/queries.js");
beforeEach(() => {
  process.env.NODE_ENV = "production";
  process.env.SANITY_SHOW_DEMO = "true";
  process.env.SANITY_USE_CATALOG_FALLBACK = "false";
  offline = false;
  dataset = [];
});
const course = {
  _id: "course-1",
  _type: "course",
  approved: true,
  title: "Approved course",
  slug: { current: "approved-course" },
  internalNotes: "PRIVATE",
};
test("published content excludes drafts, releases, samples and unapproved records; edits propagate", async () => {
  dataset = [
    course,
    { ...course, _id: "drafts.course-1" },
    { ...course, _id: "versions.release.course-1" },
    { ...course, _id: "unapproved", approved: false },
    { ...course, _id: "sample", isDemo: true },
  ];
  let result = await content.getCourses();
  assert.deepEqual(
    result.courses.map((c) => c._id),
    ["course-1"],
  );
  assert.equal(result.courses[0].internalNotes, undefined);
  dataset[0] = {
    ...course,
    title: "Updated title",
    curriculum: [
      { title: "Module", topics: ["Topic"], privateNotes: "PRIVATE" },
    ],
  };
  result = await content.getCourses();
  assert.equal(result.courses[0].title, "Updated title");
  assert.deepEqual(result.courses[0].curriculum, [
    { title: "Module", topics: ["Topic"] },
  ]);
  dataset[0].approved = false;
  assert.equal((await content.getCourses()).courses.length, 0);
});
test("banners respect activity and schedules independently of updates", async () => {
  const banner = {
    _id: "current",
    _type: "banner",
    approved: true,
    isActive: true,
    title: "Current",
    placement: "homepage",
  };
  dataset = [
    banner,
    { ...banner, _id: "inactive", isActive: false },
    { ...banner, _id: "expired", expiresAt: "2000-01-01T00:00:00Z" },
    { ...banner, _id: "future", publishAt: "2999-01-01T00:00:00Z" },
    { _id: "news", _type: "update", approved: true, title: "News" },
  ];
  assert.deepEqual(
    (await content.getActiveBanners()).map((b) => b._id),
    ["current"],
  );
  assert.deepEqual(
    (await content.getCollection("updates")).items.map((b) => b._id),
    ["news"],
  );
});
test("content outages do not resurrect deleted catalogue entries in production", async () => {
  offline = true;
  await assert.rejects(
    () => content.getCourse("approved-course"),
    /temporarily unavailable/,
  );
  await assert.rejects(
    () => content.getService("career"),
    /temporarily unavailable/,
  );
  assert.deepEqual(await content.getCourses(), {
    courses: [],
    unavailable: true,
  });
  assert.deepEqual(await content.getServices(), []);
  assert.deepEqual(await content.getCollection("updates"), {
    items: [],
    unavailable: true,
  });
});
test("partially filled service records render safe collection values", async () => {
  dataset = [
    {
      _id: "service",
      _type: "counsellingService",
      approved: true,
      title: "Advice",
      service: "career",
      items: null,
      process: null,
    },
  ];
  const [service] = await content.getServices();
  assert.deepEqual(service.items, []);
  assert.deepEqual(service.curriculum, []);
  assert.equal(service.slug.current, "career");
});
test("related-course projections exclude unpublished references", async () => {
  dataset = [
    { ...course, categoryReference: { _ref: "category" } },
    { ...course, _id: "hidden", approved: false },
    {
      _id: "service",
      _type: "counsellingService",
      approved: true,
      service: "academic",
      title: "Academic counselling",
      relatedCourses: [{ _ref: "course-1" }, { _ref: "hidden" }],
    },
    {
      _id: "category",
      _type: "courseCategory",
      approved: true,
      title: "Managed category",
    },
    {
      _id: "review",
      _type: "counsellingReview",
      approved: true,
      service: { _ref: "service" },
    },
    {
      _id: "testimonial",
      _type: "testimonial",
      approved: true,
      course: { _ref: "hidden" },
    },
  ];
  const [service] = await content.getServices();
  assert.deepEqual(
    service.relatedCourses.map((c) => c._id),
    ["course-1"],
  );
  assert.equal(
    (await content.getCourses()).courses[0].category,
    "Managed category",
  );
  assert.equal(
    (await content.getCollection("reviews")).items[0].serviceSlug,
    "academic",
  );
  assert.equal(
    (await content.getCollection("testimonials")).items[0].course,
    null,
  );
});
test("CMS additions, clearing optional fields and deleting linked content need no code changes", async () => {
  dataset = [
    course,
    {
      _id: "new-service",
      _type: "counsellingService",
      title: "New guidance",
      service: "academic",
      slug: { current: "new-guidance" },
      approved: true,
      curriculum: [null, { title: "Support", topics: null }],
      offerings: [null, { title: "Advice", items: null }],
      relatedCourses: [{ _ref: course._id }],
    },
  ];
  assert.equal(
    (await content.getService("new-guidance")).relatedCourses.length,
    1,
  );
  assert.deepEqual((await content.getService("new-guidance")).curriculum, [
    { title: "Support", topics: [] },
  ]);
  dataset = dataset.filter((doc) => doc._id !== course._id);
  assert.equal(await content.getCourse("approved-course"), undefined);
  assert.deepEqual(
    (await content.getService("new-guidance")).relatedCourses,
    [],
  );
  dataset = [];
  assert.deepEqual(await content.getServices(), []);
  assert.deepEqual((await content.getCourses()).courses, []);
  dataset = [
    {
      _id: "homepage",
      _type: "homepage",
      approved: true,
      benefits: null,
      steps: null,
      statistics: null,
    },
    {
      _id: "settings",
      _type: "siteSettings",
      approved: true,
      partners: null,
      membershipBenefits: null,
    },
  ];
  assert.deepEqual((await content.getHomepage()).steps, []);
  assert.deepEqual((await content.getSettings()).partners, []);
});
test("enquiry filters execute exact searches, status/service and inclusive dates", async () => {
  const row = {
    _id: "match",
    name: "Test Visitor",
    email: "PERSON@example.com",
    phone: "+919876543210",
    serviceInterested: "career",
    status: "interested",
    submittedAt: "2026-10-02T23:59:59.999Z",
  };
  const leads = [
    row,
    { ...row, _id: "wrong-status", status: "closed" },
    { ...row, _id: "tomorrow", submittedAt: "2026-10-03T00:00:00Z" },
    { ...row, _id: "wrong-service", serviceInterested: "financial" },
  ];
  for (const q of ["VISITOR", "person@example.com", "+919876543210"]) {
    const params = enquiryFilters(
      new URLSearchParams({
        q,
        status: "interested",
        service: "career",
        from: "2026-10-02",
        to: "2026-10-02",
      }),
      { requireDates: true },
    );
    const result = await (
      await evaluate(parse(`*[${leadFilter}]{_id}`), { dataset: leads, params })
    ).get();
    assert.deepEqual(result, [{ _id: "match" }]);
  }
  for (const value of [
    "from=2026-02-30",
    "status=invalid",
    "from=2026-10-03&to=2026-10-02",
    "q=" + encodeURIComponent("x".repeat(101)),
  ])
    assert.throws(() => enquiryFilters(new URLSearchParams(value)));
  assert.throws(() =>
    enquiryFilters(new URLSearchParams(), { requireDates: true }),
  );
});
