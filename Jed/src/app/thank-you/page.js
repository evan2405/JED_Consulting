import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { getSettings } from "../../../Sainity/queries";
export const metadata = {
  title: "Thank you",
  robots: { index: false, follow: false },
};
export default async function ThankYou() {
  const { whatsapp } = await getSettings();
  return (
    <>
      <Navbar />
      <main id="main-content" className="section container">
        <div className="success-card">
          <div className="success-icon" aria-hidden="true">
            ✓
          </div>
          <p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
          <h1>Thank you for reaching out.</h1>
          <p>
            After a successful submission, your enquiry is saved for our team to
            review. We’ll follow up using the contact details you provided.
          </p>
          {process.env.CONTACT_RESPONSE_TIME && (
            <p>Expected response: {process.env.CONTACT_RESPONSE_TIME}</p>
          )}
          <p>
            If you need to contact us in the meantime, you can reach us on
            WhatsApp.
          </p>
          <div className="actions">
            <Link href="/#services" className="button">
              Back to services
            </Link>
            {whatsapp && (
              <a href={whatsapp} className="button secondary">
                WhatsApp ↗
              </a>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
