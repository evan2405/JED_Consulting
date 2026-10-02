import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { getSettings } from "../../../Sainity/queries";
import { pageMetadata } from "../../../lib/metadata";
export const metadata = pageMetadata(
  "Terms & conditions",
  "Terms for J.ed courses, placement membership, counselling and enquiry services.",
  "/terms",
);
export default async function Page() {
  const settings = await getSettings();
  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className="section container prose"
        style={{ maxWidth: 850 }}
      >
        <p className="eyebrow">WORKING WITH J.ED</p>
        <h1 style={{ fontSize: "3rem" }}>Terms & conditions</h1>
        <p>Updated 26 September 2026</p>
        <h2>Our services</h2>
        <p>
          J.Ed Placement Consultancy provides academic, career and financial
          counselling, placement and recruitment support, professional course
          guidance, and business application assistance. Information on this
          website helps you make an enquiry; it is not a confirmed admission,
          employment offer or credit approval.
        </p>
        <h2>Placement membership</h2>
        <p>
          Placement membership is listed at ₹500 per year and includes CV
          revamp, job application support, interview referrals, interview
          scheduling and continued placement assistance. Confirm registration,
          service scope, payment and cancellation or refund terms with our team
          before paying. No payment is collected on this website.
        </p>
        <h2>Courses and employment</h2>
        <p>
          Course fees, availability, duration and eligibility depend on the
          programme and institution and are confirmed before enrolment.
          Recruitment opportunities vary. Employers determine interviews,
          selection and employment conditions. Membership, referrals and
          placement assistance do not guarantee a job.
        </p>
        <h2>Financial assistance</h2>
        <p>
          Final loan approval, interest rate, amount, tenure and eligibility are
          determined by the bank, NBFC, lending institution or funding agency.
          J.Ed assists with guidance, documentation and applications. Funding,
          grants and loans are not guaranteed.
        </p>
        <h2>Your enquiry</h2>
        <p>
          Provide accurate contact information and only information needed for
          the enquiry. Do not submit identity documents or bank details through
          the public form. By submitting, you agree that J.Ed may contact you
          about your request as described in the privacy policy.
        </p>
        <h2>Questions and service terms</h2>
        <p>
          Individual service arrangements are confirmed directly with you before
          you proceed. For clarification, contact{" "}
          <a href={settings.whatsapp || "/contact"}>J.Ed on WhatsApp</a>. J.Ed
          Placement Consultancy is located in Shillong, Meghalaya, India.
        </p>
      </main>
      <Footer />
    </>
  );
}
