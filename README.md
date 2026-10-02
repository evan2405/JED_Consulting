# J.Ed Placement Consultancy

Next.js website and Sanity Studio for academic, career and financial counselling in Shillong. Content is based on the supplied placement consultancy requirements PDF. The whole website uses navy blue (#10264D), white (#FFFFFF) and maroon (#800020), with subtle navy tints for secondary surfaces.

See [the 1 October UI redesign log](docs/UI_REDESIGN_LOG.md) for the Zell reference analysis, completed frontend changes, cleanup, verification and upcoming CMS handoff.

See the [CMS implementation log](docs/CMS_IMPLEMENTATION_LOG.md) for the completed work, all 30 plan chunks, verification and remaining production dependencies. The [resume bookmark](docs/WORK_BOOKMARK.md) records where to continue. Sanity manages website content; staff enquiries use a separate private dataset.

See [private enquiry setup](docs/PRIVATE_ENQUIRY_SETUP.md) for the remaining Sanity account configuration and the new storage verification commands.

## Run locally

See [hosting, admin and map setup](docs/HOSTING_ADMIN_AND_MAPS.md) for the hosting recommendation, Google Maps integration, `/admin`, Sanity Studio and protected CSV enquiry downloads. Staff sign-in/private enquiry infrastructure still needs configuration.

The [performance optimization log](docs/PERFORMANCE_OPTIMIZATION.md) records the latest loading fixes and measurements. For realistic speed checks, run `npm run build` then `npm run start -- --port 3101` inside `Jed`; `npm run perf` measures that production preview. Development mode also includes on-demand compilation.

**Content is now loaded in Sanity.** See [the CMS content guide](docs/CMS_CONTENT_GUIDE.md) to add, edit, unpublish or delete records without code changes. Keep catalogue fallback disabled so removed content stays removed. The PDF-only import and live content lifecycle have been verified against the current backend.

Use Node 24.14+ (Node 24).

```powershell
cd Jed
npm ci
npm run dev
```

In another terminal:

```powershell
cd JedStudio
npm ci
npm run dev
```

Copy each project's .env.example to a local environment file. The site can render the PDF programme catalogue without credentials; private enquiry saves require configured private storage and abuse protection.

When connected to Sanity, published managed records are the default. For an initial PDF catalogue preview, set `SANITY_USE_CATALOG_FALLBACK=true`; disable it for CMS publication checks and production. `npm run seed` in `Jed` performs a dry run. See the implementation log for the guarded non-production apply workflow. `/admin` links to your configured Studio; `/staff` requires an approved staff account.

## Validation

Website: npm run lint, npm test, npm run build, npm run test:e2e, npm audit.
Studio: npm run lint, npm run build, npm audit.
Install browser binaries with npx playwright install chromium before browser tests.

- [Implementation and remaining launch blockers](docs/LAUNCH_STATUS.md)
- [Deployment, privacy migration and operations](docs/DEPLOYMENT.md)
- [Validation results](docs/TEST_RESULTS.md)

**Existing data needs attention:** an anonymous count query found three enquiry documents in the current content dataset. New code uses a separate private dataset, but the existing enquiry records must also be protected during cutover. The authorized PDF import changed public website content only; enquiry records and production deployment configuration remain untouched.

```
Jed
├─ docs
│  ├─ CMS_CONTENT_GUIDE.md
│  ├─ CMS_IMPLEMENTATION_LOG.md
│  ├─ DEPLOYMENT.md
│  ├─ DEVELOPMENT_CHECKLIST.md
│  ├─ HOSTING_ADMIN_AND_MAPS.md
│  ├─ LAUNCH_STATUS.md
│  ├─ PERFORMANCE_OPTIMIZATION.md
│  ├─ PRIVATE_ENQUIRY_SETUP.md
│  ├─ REQUIREMENTS_SOURCE.txt
│  ├─ TEST_RESULTS.md
│  ├─ UI_REDESIGN_LOG.md
│  └─ WORK_BOOKMARK.md
├─ Jed
│  ├─ .env.example
│  ├─ AGENTS.md
│  ├─ CHANGELOG.md
│  ├─ CLAUDE.md
│  ├─ components
│  │  ├─ BannerSections.jsx
│  │  ├─ CarouselControls.jsx
│  │  ├─ Consent.jsx
│  │  ├─ ContentFeed.jsx
│  │  ├─ CourseList.jsx
│  │  ├─ CoursePage.jsx
│  │  ├─ Curriculum.jsx
│  │  ├─ DemoPage.jsx
│  │  ├─ EnquiryForm.jsx
│  │  ├─ Footer.jsx
│  │  ├─ Home.jsx
│  │  ├─ InteractionAnalytics.jsx
│  │  ├─ LazyCarouselControls.jsx
│  │  ├─ LocationMap.jsx
│  │  ├─ MobileActions.jsx
│  │  ├─ Navbar.jsx
│  │  ├─ NavbarClient.jsx
│  │  ├─ PageScroll.jsx
│  │  ├─ PublicPage.jsx
│  │  ├─ ServicePage.jsx
│  │  ├─ ServicesCarousel.jsx
│  │  ├─ StaffDashboard.jsx
│  │  ├─ Updates.jsx
│  │  └─ WebVitals.jsx
│  ├─ eslint.config.mjs
│  ├─ hooks
│  ├─ instrumentation.js
│  ├─ jed
│  ├─ jsconfig.json
│  ├─ lib
│  │  ├─ analytics.js
│  │  ├─ audit.js
│  │  ├─ auth.js
│  │  ├─ catalog.js
│  │  ├─ content-defaults.js
│  │  ├─ course-cards.js
│  │  ├─ enquiry-filters.js
│  │  ├─ http.js
│  │  ├─ job-auth.js
│  │  ├─ logger.js
│  │  ├─ maps.js
│  │  ├─ metadata.js
│  │  ├─ notifications.js
│  │  ├─ public-content-reader.js
│  │  ├─ rate-limit.js
│  │  ├─ storage-privacy.js
│  │  └─ validation.js
│  ├─ next.config.mjs
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ playwright.config.js
│  ├─ postcss.config.mjs
│  ├─ public
│  │  ├─ apple-icon.png
│  │  ├─ icon.png
│  │  ├─ images
│  │  │  └─ students-learning.jpg
│  │  └─ logo.png
│  ├─ README.md
│  ├─ Sainity
│  │  ├─ client.js
│  │  └─ queries.js
│  ├─ scripts
│  │  ├─ check-enquiry-storage.mjs
│  │  ├─ check-launch.mjs
│  │  ├─ import-pdf-content.mjs
│  │  ├─ measure-performance.mjs
│  │  ├─ migrate-enquiries.mjs
│  │  ├─ pdf-service-content.mjs
│  │  └─ seed-content.mjs
│  ├─ src
│  │  ├─ app
│  │  │  ├─ admin
│  │  │  │  └─ page.js
│  │  │  ├─ api
│  │  │  │  ├─ auth
│  │  │  │  │  ├─ callback
│  │  │  │  │  │  └─ route.js
│  │  │  │  │  ├─ login
│  │  │  │  │  │  └─ route.js
│  │  │  │  │  └─ logout
│  │  │  │  │     └─ route.js
│  │  │  │  ├─ contact
│  │  │  │  │  └─ route.js
│  │  │  │  ├─ cron
│  │  │  │  │  └─ maintenance
│  │  │  │  │     └─ route.js
│  │  │  │  ├─ enquiries
│  │  │  │  │  ├─ export
│  │  │  │  │  │  └─ route.js
│  │  │  │  │  └─ route.js
│  │  │  │  ├─ export-enquiries
│  │  │  │  │  └─ route.js
│  │  │  │  ├─ health
│  │  │  │  │  ├─ ready
│  │  │  │  │  │  └─ route.js
│  │  │  │  │  └─ route.js
│  │  │  │  ├─ staff
│  │  │  │  │  └─ leads
│  │  │  │  │     └─ route.js
│  │  │  │  └─ [resource]
│  │  │  │     └─ [[...slug]]
│  │  │  │        └─ route.js
│  │  │  ├─ career
│  │  │  │  └─ page.js
│  │  │  ├─ contact
│  │  │  │  └─ page.js
│  │  │  ├─ counselling
│  │  │  │  ├─ page.js
│  │  │  │  └─ [slug]
│  │  │  │     ├─ demo
│  │  │  │     │  └─ page.js
│  │  │  │     └─ page.js
│  │  │  ├─ courses
│  │  │  │  ├─ page.js
│  │  │  │  └─ [slug]
│  │  │  │     ├─ demo
│  │  │  │     │  └─ page.js
│  │  │  │     └─ page.js
│  │  │  ├─ enquire
│  │  │  │  └─ page.js
│  │  │  ├─ error.js
│  │  │  ├─ financial
│  │  │  │  └─ page.js
│  │  │  ├─ globals.css
│  │  │  ├─ layout.js
│  │  │  ├─ loading.js
│  │  │  ├─ not-found.js
│  │  │  ├─ page.js
│  │  │  ├─ placements
│  │  │  │  └─ page.js
│  │  │  ├─ privacy-policy
│  │  │  │  └─ page.js
│  │  │  ├─ robots.js
│  │  │  ├─ sitemap.js
│  │  │  ├─ staff
│  │  │  │  └─ page.js
│  │  │  ├─ terms
│  │  │  │  └─ page.js
│  │  │  ├─ terms-and-conditions
│  │  │  │  └─ page.js
│  │  │  ├─ thank-you
│  │  │  │  └─ page.js
│  │  │  └─ updates
│  │  │     ├─ page.js
│  │  │     └─ [slug]
│  │  │        └─ page.js
│  │  └─ proxy.js
│  ├─ tests
│  │  ├─ api.test.mjs
│  │  ├─ auth.test.mjs
│  │  ├─ browser
│  │  │  ├─ accessibility.spec.js
│  │  │  ├─ content.spec.js
│  │  │  ├─ journey.spec.js
│  │  │  ├─ lazy-loading.spec.js
│  │  │  ├─ map.spec.js
│  │  │  └─ navigation.spec.js
│  │  ├─ content.test.mjs
│  │  ├─ enquiry-setup.test.mjs
│  │  ├─ maps.test.mjs
│  │  ├─ operations.test.mjs
│  │  ├─ pdf-import.test.mjs
│  │  ├─ public-content-reader.test.mjs
│  │  ├─ rate-limit.test.mjs
│  │  ├─ seed.test.mjs
│  │  ├─ staff-management.test.mjs
│  │  ├─ storage-privacy.test.mjs
│  │  └─ validation.test.mjs
│  └─ vercel.json
├─ JedStudio
│  ├─ .env.example
│  ├─ .sanity
│  │  └─ runtime
│  │     ├─ app.js
│  │     └─ index.html
│  ├─ eslint.config.mjs
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ plugins
│  │  ├─ ContentDashboard.jsx
│  │  ├─ exportEnquiriesPlugin.js
│  │  └─ ExportEnquiriesTool.jsx
│  ├─ README.md
│  ├─ sanity.cli.js
│  ├─ sanity.config.js
│  ├─ schemaTypes
│  │  ├─ AuditEvent.js
│  │  ├─ Banner.js
│  │  ├─ Content.js
│  │  ├─ Courses.js
│  │  ├─ FAQ.js
│  │  ├─ index.js
│  │  ├─ Services.js
│  │  ├─ shared.js
│  │  └─ Submissions.js
│  ├─ static
│  └─ structure.js
├─ member_tasks.md
└─ README.md

```