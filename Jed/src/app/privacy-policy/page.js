import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Jed Consultancy",
  description:
    "Read Jed Consultancy's privacy policy to understand how we collect, use, and protect your personal information.",
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

export default function PrivacyPolicy() {
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
            <span className="text-white/80">Privacy Policy</span>
          </nav>
          <div className="section-tag">LEGAL</div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-2 mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Privacy Policy
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
              Jed Consultancy (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your personal
              information. This policy explains what data we collect, how we use it, and
              your rights regarding it.
            </p>

            <Section title="1. Information We Collect">
              <p>We collect information you provide directly when you:</p>
              <ul className="list-disc list-inside space-y-2 mt-2 text-slate-400">
                <li>Submit an enquiry through our contact form (name, email, phone, course interest)</li>
                <li>Contact us via email or phone</li>
              </ul>
              <p className="mt-3">
                We do <strong className="text-white">not</strong> collect payment details. We do not use
                analytics trackers, cookies, or third-party advertising on this website.
              </p>
            </Section>

            <Section title="2. How We Use Your Information">
              <p>We use your information solely to:</p>
              <ul className="list-disc list-inside space-y-2 mt-2 text-slate-400">
                <li>Respond to your enquiries and provide consultancy services</li>
                <li>Send updates about courses or visa services you expressed interest in</li>
                <li>Improve the quality of our services</li>
              </ul>
            </Section>

            <Section title="3. Data Storage & Security">
              <p>
                Enquiry data is stored securely in Sanity.io, a cloud-based content platform
                with industry-standard security practices. We implement appropriate technical
                and organisational measures to protect your data against unauthorised access.
              </p>
            </Section>

            <Section title="4. Data Sharing">
              <p>
                We do <strong className="text-white">not</strong> sell, rent, or share your personal
                information with third parties for marketing purposes. We may share data only
                where required by law or to fulfil your specific service request.
              </p>
            </Section>

            <Section title="5. Data Retention">
              <p>
                We retain your enquiry data for up to <strong className="text-white">24 months</strong> from
                the date of submission, after which it is securely deleted unless you are an
                active client.
              </p>
            </Section>

            <Section title="6. Your Rights">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 mt-2 text-slate-400">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, contact us at{" "}
                <a href="mailto:info@jedcms.com" className="text-red-400 hover:underline">
                  info@jedcms.com
                </a>.
              </p>
            </Section>

            <Section title="7. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted
                on this page with an updated &quot;Last updated&quot; date.
              </p>
            </Section>

            <Section title="8. Contact">
              <p>
                For privacy-related questions, contact us at{" "}
                <a href="mailto:info@jedcms.com" className="text-red-400 hover:underline">
                  info@jedcms.com
                </a>{" "}
                or visit us at Shillong, Meghalaya, India.
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
