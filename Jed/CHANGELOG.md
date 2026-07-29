# Jed Consultancy - Redesign & System Improvements Log

This file contains a detailed record of all changes, refactors, and enhancements implemented in the Jed Consultancy codebase.

---

## 1. Database & Sanity CMS

### Studio Configuration
* **Project ID Migration:** Swapped project IDs in the files below to point to the new project `62ycsw57`:
  * [sanity.config.js](file:///e:/Jed/JedStudio/sanity.config.js)
  * [sanity.cli.js](file:///e:/Jed/JedStudio/sanity.cli.js)
  * [.env.local](file:///e:/Jed/Jed/.env.local) (`SANITY_PROJECT_ID=62ycsw57`)

### Schema Updates
* **Fixed Studio Crash:** In [Submissions.js](file:///e:/Jed/JedStudio/schemaTypes/Submissions.js#L38), removed the unsupported `'read'` directive from `__experimental_actions` which was preventing the studio layout from loading.
* **Expanded Lead Capture Fields:** Added the following fields to the Customer Submissions schema in [Submissions.js](file:///e:/Jed/JedStudio/schemaTypes/Submissions.js):
  * **Country of Residence** (`country`)
  * **Preferred Study Destination** (`preferredDestination`) (dropdown configuration matching USA, UK, Canada, Australia, Germany, or Other)
  * **Interested Course** (`interestedCourse`)
  * **Submitted At** (`submittedAt`)

---

## 2. Infrastructure, Security & Rate Limiting

### Network Middleware
* **Rate Limiting Middleware ([middleware.js](file:///e:/Jed/Jed/middleware.js)):**
  * Added custom sliding window rate limiter (max **60 requests per minute** per IP).
  * Serves a JSON `429 Too Many Requests` error with remaining seconds wait-time if triggered.
  * Extends headers on success with remaining limit data (`X-RateLimit-Limit`, `X-RateLimit-Remaining`).
* **HTTP Security Headers:**
  * Added headers on all responses in [middleware.js](file:///e:/Jed/Jed/middleware.js):
    * `X-Frame-Options: DENY` (prevents Clickjacking)
    * `X-Content-Type-Options: nosniff` (prevents MIME sniffing)
    * `Referrer-Policy: strict-origin-when-cross-origin`
    * `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Build Optimization
* **Server Configurations ([next.config.mjs](file:///e:/Jed/Jed/next.config.mjs)):**
  * Enabled Gzip compilation compression (`compress: true`).
  * Removed Server Info signature header (`poweredByHeader: false`).
  * Added Strict Transport Security (HSTS) headers: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.

---

## 3. Form Processing & Lead Export API

### Form Submissions API
* **Enquiry POST route ([route.js](file:///e:/Jed/Jed/src/app/api/contact/route.js)):**
  * Processes form responses securely.
  * **Bot Prevention:** Checks a hidden Honeypot field (`website`). Instantly discards submissions if populated.
  * **Input Sanitization:** Strips HTML tag characters from all string inputs before saving to prevent injection.
  * **Sanity API Client:** Authenticates using your write token (`SANITY_API_TOKEN`) in `.env.local` to save leads.

### Admin Export API
* **CSV Download route ([route.js](file:///e:/Jed/Jed/src/app/api/export-enquiries/route.js)):**
  * Secure route: `/api/export-enquiries?key=<SECRET_KEY>` matching your `ADMIN_EXPORT_KEY` in `.env.local`.
  * Fetches all submissions from Sanity.
  * Compiles data into a cleanly structured `.csv` format.
  * Adds a UTF-8 BOM indicator so the file displays correctly when opened directly in Microsoft Excel or Google Sheets.

---

## 4. Visual red & blue Redesign (Yocket Inspired)

### Fonts & Theme Tokens
* **Typography:** Converted layouts to premium Google Fonts: `Plus Jakarta Sans` for headers and `Inter` for body text in [layout.js](file:///e:/Jed/Jed/src/app/layout.js).
* **Color Variables:** Updated [globals.css](file:///e:/Jed/Jed/src/app/globals.css) with color tokens for a premium Dark Navy (`#060f2b` / `#0d1b3e`) background with Crimson Red (`#dc2626`) details and custom glassmorphism utilities (`.glass-card`).

### Core Page Redesigns
* **Global Navigation ([Navbar.jsx](file:///e:/Jed/Jed/components/Navbar.jsx)):**
  * Created a glass background with a blur filter.
  * Nav bar shifts to a solid background and triggers a border bottom line upon scroll.
  * Added a red underline animation that animates from center on hover.
  * Added a persistent "Enquire Now" CTA pill button.
* **Landing Page ([Home.jsx](file:///e:/Jed/Jed/components/Home.jsx)):**
  * **Hero:** Added gradient overlays with glowing color blobs and smooth floating card animations.
  * **Stats Ribbon:** Created a key section displaying partner stats using an IntersectionObserver to animate numbers.
  * **Services & Steps:** Redesigned services using custom red-tinted glassmorphism grids.
  * **Testimonials:** Setup snapping carousels for horizontal review card navigation.
  * **Enquiry Form:** Placed form inputs on a layout grid and set a floating "Enquire Now" action button (FAB) at the bottom-right.
* **Course Detail Page ([page.js](file:///e:/Jed/Jed/src/app/courses/%5Bslug%5D/page.js)):**
  * Darkened backgrounds, borders, sidecards, and reviews to match the home page design theme.
* **Footer ([Footer.jsx](file:///e:/Jed/Jed/components/Footer.jsx)):**
  * Built a dark footer containing a CTA conversion row, inline SVG social links, and custom hover states.

---

## 5. Dynamic Content & Sanity Studio Seeding
* **Integrated Dynamic GROQ Queries ([queries.js](file:///e:/Jed/Jed/Sainity/queries.js)):**
  * Created queries to fetch `testimonial`, `service` (Visa Services), `faq`, and `banner` schemas from Sanity.
* **Connected Homepage Prop Pipeline ([page.js](file:///e:/Jed/Jed/src/app/page.js) & [Home.jsx](file:///e:/Jed/Jed/components/Home.jsx)):**
  * Modified the main page to fetch all schema datasets in parallel.
  * Homepage now loops over Sanity-driven Services, FAQs, Banners, and Testimonial reviews.
  * Preserved local fallback values to guarantee the layout remains unbroken if the CMS dataset is empty.
* **Database Seeding Completed:**
  * Created and successfully executed a data seeding script ([seed.js](file:///e:/Jed/Jed/seed.js)) using your write token.
  * Seeded 3 Testimonials, 4 Visa Services, 2 FAQs, and 3 Courses directly to project `62ycsw57`.

---

## 6. Export Enquiries — Sanity Studio Tool

### Custom Studio Plugin
* **Created Export Enquiries Plugin ([exportEnquiriesPlugin.js](file:///e:/Jed/JedStudio/plugins/exportEnquiriesPlugin.js)):**
  * Registers a custom tool in the Sanity Studio sidebar using `definePlugin` (Sanity v5).
  * Adds a new **📥 Export Enquiries** tab accessible directly from the Studio dashboard.
* **Created Export Enquiries UI ([ExportEnquiriesTool.jsx](file:///e:/Jed/JedStudio/plugins/ExportEnquiriesTool.jsx)):**
  * Clean React component — admin enters the `ADMIN_EXPORT_KEY` in a password field (never stored).
  * Fetches from the existing `/api/export-enquiries` Next.js route and triggers a browser file download.
  * Shows loading, success, and error states with clear feedback messages.
  * Auto-detects `localhost` vs production to point to the correct API base URL.
* **Updated ([sanity.config.js](file:///e:/Jed/JedStudio/sanity.config.js)):**
  * Registered `exportEnquiriesPlugin()` alongside `structureTool()` and `visionTool()`.

---

## 7. Course Detail Page — UI Enhancements

### New Components
* **[CourseHero.jsx](file:///e:/Jed/Jed/components/CourseHero.jsx):** Reusable hero section with breadcrumb, course title, category tag, duration/level metadata, and course image.
* **[AccreditationBadge.jsx](file:///e:/Jed/Jed/components/AccreditationBadge.jsx):** Inline badge for course accreditation (hidden when field is empty).
* **[DownloadButton.jsx](file:///e:/Jed/Jed/components/DownloadButton.jsx):** Button that opens a syllabus PDF URL in a new tab (hidden when no URL is set).

### Data Layer
* **Extended `courseBySlugQuery` ([queries.js](file:///e:/Jed/Jed/Sainity/queries.js)):**
  * Added `syllabusUrl`, `accreditation`, and `examDates` fields to the course detail GROQ query.

---

## 8. Enquiry Form — Minimalist Redesign

### UI & Fields Alignment
* **Updated ([Home.jsx](file:///e:/Jed/Jed/components/Home.jsx)):**
  * Redesigned the enquiry form to match the exact visual layout from the reference image:
    1. **Your Name** (text input)
    2. **Your Email** (email input)
    3. **Phone Number** (phone input with 🇮🇳 country flag badge)
    4. **Select Course** (dropdown automatically populated with all courses from Sanity Studio)
    5. **Terms & Privacy Checkbox** ("I accept the terms and conditions & privacy policy.")
    6. **Enquire Now** (purple pill CTA button)
* **API Validation Update ([route.js](file:///e:/Jed/Jed/src/app/api/contact/route.js)):**
  * Made the `message` field optional and auto-generated based on the selected course so submissions save cleanly to Sanity.



