import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | Jed Consultancy",
  description:
    "Read the terms and conditions governing the use of Jed Consultancy's website and services.",
};

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2
      className="text-xl sm:text-2xl font-bold text-white mb-4"
      style={{ fontFamily: "var(--font-heading)" }}
    >
      {title}
    </h2>
    <div className="text-slate-300 leading-relaxed space-y-3">{children}</div>
  </div>
);

export default function TermsAndConditions() {
  const lastUpdated = "31 July 2026";

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative hero-gradient pt-28 pb-12">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(220,38,38,0.25),transparent_55%)]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white/80">Terms &amp; Conditions</span>
          </nav>
          <div className="section-tag">LEGAL</div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-2 mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Terms &amp; Conditions
          </h1>
          <p className="text-slate-400">
            Last updated: <span className="text-white font-medium">{lastUpdated}</span>
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="bg-[#0d1b3e] border-t border-white/5 py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="glass-card p-8 sm:p-12">

            <p className="text-slate-400 leading-relaxed mb-10">
              Please read these Terms and Conditions carefully before using the Jed Consultancy
              website or engaging our services. By accessing this website, you agree to be
              bound by these terms.
            </p>

            <Section title="1. Services">
              <p>
                Jed Consultancy provides visa consultancy, professional course guidance, and
                career counselling services. We act as advisors — final visa and admission
                decisions rest entirely with the relevant government authorities and
                educational institutions.
              </p>
            </Section>

            <Section title="2. No Guarantee of Outcome">
              <p>
                While we maintain a high success rate, Jed Consultancy does{" "}
                <strong className="text-white">not</strong> guarantee visa approval or
                admission to any institution. Outcomes depend on individual circumstances
                and decisions made by third-party authorities.
              </p>
            </Section>

            <Section title="3. Accuracy of Information">
              <p>
                You agree to provide accurate, complete, and up-to-date information when
                submitting enquiries or engaging our services. Providing false or misleading
                information may result in termination of services without a refund.
              </p>
            </Section>

            <Section title="4. Fees & Refunds">
              <p>
                Consultancy fees are agreed upon before services commence and are clearly
                communicated in writing. Refund eligibility depends on the stage of service
                delivery and is detailed in your individual service agreement.
              </p>
            </Section>

            <Section title="5. Intellectual Property">
              <p>
                All content on this website — including text, design, logos, and images —
                is the property of Jed Consultancy and may not be reproduced without written
                permission.
              </p>
            </Section>

            <Section title="6. Limitation of Liability">
              <p>
                Jed Consultancy is not liable for any indirect, incidental, or consequential
                damages arising from the use of our website or services, including but not
                limited to visa refusal or delays caused by third-party authorities.
              </p>
            </Section>

            <Section title="7. Third-Party Links">
              <p>
                Our website may contain links to third-party websites. We are not responsible
                for the content or privacy practices of those sites.
              </p>
            </Section>

            <Section title="8. Governing Law">
              <p>
                These terms are governed by the laws of India. Any disputes shall be subject
                to the exclusive jurisdiction of the courts in Shillong, Meghalaya.
              </p>
            </Section>

            <Section title="9. Changes to These Terms">
              <p>
                We reserve the right to update these Terms and Conditions at any time.
                Continued use of our website after changes constitutes acceptance of the
                revised terms.
              </p>
            </Section>

            <Section title="10. Contact">
              <p>
                Questions about these terms? Contact us at{" "}
                <a href="mailto:info@jedcms.com" className="text-red-400 hover:underline">
                  info@jedcms.com
                </a>.
              </p>
            </Section>

          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="btn-secondary">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
