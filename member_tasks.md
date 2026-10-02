# J.ED Consultancy - Developer Tasks Breakdown

This checklist contains only the actionable tasks that need to be completed by each member.

---
## Member 1: Frontend - UI & Core Design

### Theme & Styling

- [ ] Update theme color tokens in [`globals.css`](file:///d:/Jed/Jed/src/app/globals.css): change bright red (`#dc2626`) references and variables to Maroon (`#800000` / `#7f1d1d`). Ensure background remains Navy Blue and body text is White.

### Navigation & Navbar
- [ ] Remove the "Visa" nav link from [`Navbar.jsx`](file:///d:/Jed/Jed/components/Navbar.jsx).
- [ ] Convert the "Services" nav link in [`Navbar.jsx`](file:///d:/Jed/Jed/components/Navbar.jsx) to an interactive dropdown containing:
  1. Academic Counselling
  2. Career Counselling
  3. Financial Counselling
- [ ] Implement smooth scrolling/routing from the dropdown options to the respective item inside the homepage Services Carousel.

### Home Page Components
- [ ] Refactor the Services section in [`Home.jsx`](file:///d:/Jed/Jed/components/Home.jsx) from a static grid to a touch-enabled horizontal carousel/slider.
- [ ] Map the services inside the carousel to show:
  * **Academic Counselling**: Courses list overview and course links.
  * **Career Counselling**: Info about placement and recruitment.
  * **Financial Counselling**: Info about loans (personal, mortgage, business, startup, others).
- [ ] Remove the entire "Visa Process" section from [`Home.jsx`](file:///d:/Jed/Jed/components/Home.jsx).
- [ ] Add a dismissible top updates banner / ticker strip to display the latest updates above the main navigation header on the homepage.

### New Routes & Pages
- [ ] Design and create a beautiful custom 404 page at `src/app/not-found.js`.
- [ ] Create a static `/thank-you` page route for successful contact form redirection.
- [ ] Implement a sticky mobile CTA floating button at the bottom of the viewport on mobile devices.
- [ ] Build a Cookie Consent Banner component at the bottom of the page.

---

## Member 2: Backend (Sanity CMS) & Data Layer

### CMS Schema Changes
- [ ] Remove or deregister the `VisaServices` schema from [`index.js`](file:///d:/Jed/JedStudio/schemaTypes/index.js) and delete [`VisaServices.js`](file:///d:/Jed/JedStudio/schemaTypes/VisaServices.js).
- [ ] Update [`Submissions.js`](file:///d:/Jed/JedStudio/schemaTypes/Submissions.js) schema fields to align with the new form inputs:
  * Add `serviceInterested` (string)
  * Add `selectedCourse` (string, optional)
  * Add `loanType` (string, optional)
  * Add `careerGoal` (string, optional)
  * Remove `country` and `preferredDestination` fields.
- [ ] Add dynamic fields to the `Banner` schema if necessary to support the "Latest Updates" text banner content.

### GROQ Queries
- [ ] Refactor [`queries.js`](file:///d:/Jed/Jed/Sainity/queries.js):
  * Delete `visaServicesQuery` and `getVisaServices`.
  * Ensure banners fetch includes placements for updates ticker.

### SEO & Media Accessibility
- [ ] Define dynamic meta title and descriptions per page inside [`layout.js`](file:///d:/Jed/Jed/src/app/layout.js), [`page.js`](file:///d:/Jed/Jed/src/app/page.js), and policy pages.
- [ ] Configure Open Graph metadata (`openGraph` sharing images) for all pages.
- [ ] Add unique descriptive `alt` tags to all image tags across the frontend application.
- [ ] Setup standard favicon asset packages and ensure configurations in `app/layout.js` match.

### Deployment & Configs
- [ ] Confirm [`robots.js`](file:///d:/Jed/Jed/src/app/robots.js) and [`sitemap.js`](file:///d:/Jed/Jed/src/app/sitemap.js) reflect production URL values.
- [ ] Integrate script trackers for Analytics (Google Analytics or Vercel Analytics).

---

## Member 3: Frontend - Interactive Features & Forms

### Contact Form Redo
- [ ] Rebuild the `EnquiryForm` component inside [`Home.jsx`](file:///d:/Jed/Jed/components/Home.jsx):
  * Remove the country of residence select dropdown and study destination select dropdown.
  * Add a required "Selected Service" select dropdown (Academic, Career, Financial).
  * Build dynamic, conditional sub-dropdowns that appear based on the selected service:
    * **Academic**: Select course (populated dynamically from courses query).
    * **Career**: Select option ("Placement" or "Recruitment").
    * **Financial**: Select loan type ("Personal", "Mortgage", "Business", "Startup", "Others").
- [ ] Implement client-side validation logic and clear visual error messages for missing or invalid inputs.
- [ ] Add submit loading states (spinners and disabled attributes) on buttons during submissions.
- [ ] Redirect users to `/thank-you` upon successful form submission.

### API Routes
- [ ] Update contact API route [`route.js`](file:///d:/Jed/Jed/src/app/api/contact/route.js):
  * Refactor body parameters mapping to match the new form fields.
  * Sanitize and save data to the updated `submission` model in Sanity.
- [ ] Update export API route [`route.js`](file:///d:/Jed/Jed/src/app/api/export-enquiries/route.js):
  * Adjust CSV headers and rows mapping to reflect the updated fields (`serviceInterested`, `selectedCourse`, `loanType`, `careerGoal`).

### Real Contact & Details
- [ ] Update the office address block with the real Shillong, Meghalaya contact address.
- [ ] Replace phone and email placeholders with actual client helpline numbers and emails.
