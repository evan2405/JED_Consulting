import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import EnquiryForm from "../../../components/EnquiryForm";
import { getCourses } from "../../../Sainity/queries";
import { getSettings } from "../../../Sainity/queries";
import { pageMetadata } from "../../../lib/metadata";
export const metadata = {
  ...pageMetadata(
    "Start your enquiry",
    "Ask J.ed about courses, counselling, placement and financial assistance.",
    "/enquire",
  ),
  robots: { index: false, follow: true },
};
export default async function Enquire({ searchParams }) {
  const [initial, settings, { courses }] = await Promise.all([
    searchParams,
    getSettings(),
    getCourses(),
  ]);
  return (
    <>
      <Navbar />
      <main id="main-content">
        <section className="page-hero">
          <div className="container">
            <p className="eyebrow">A CONVERSATION IS A GOOD START</p>
            <h1>Let’s find your next step.</h1>
            <p>
              Tell us a little about yourself and what you need. We’ll use these
              details to follow up on your enquiry.
            </p>
          </div>
        </section>
        <section className="section container content-grid">
          <EnquiryForm
            courses={courses.map(({ _id, title }) => ({ _id, title }))}
            initial={initial}
          />
          <aside className="form-side">
            <h2>Guidance starts here.</h2>
            <p>
              Choose academic, career or financial counselling. Your selection
              helps us connect you to the right support.
            </p>
            <p>Prefer to speak directly?</p>
            <a
              href={settings.whatsapp || "/contact"}
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat with J.Ed on WhatsApp ↗
            </a>
            <p style={{ marginTop: 25 }}>{settings.location}</p>
            <p>
              Course details and eligibility are confirmed individually.
              Placement and financing outcomes depend on employers and the
              relevant institutions.
            </p>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}
