import Link from "next/link";
import { getSettings } from "../Sainity/queries";
export default async function Footer() {
  const settings = await getSettings();
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="footer-brand">
            J.ed<span className="accent">✳</span>
          </Link>
          <p>{settings.footerDescription}</p>
          <p>{settings.location}</p>
          {settings.address && <p>{settings.address}</p>}
          {settings.hours && <p>{settings.hours}</p>}
        </div>
        <div>
          <h3>Your next step</h3>
          <Link href="/courses">Courses</Link>
          <Link href="/counselling">Counselling services</Link>
          <Link href="/career">Career & placement support</Link>
          <Link href="/placements">Placement stories</Link>
          <Link href="/updates">Latest updates</Link>
          <Link href="/contact">Contact us</Link>
        </div>
        <div>
          <h3>Stay connected</h3>
          {settings.whatsapp && (
            <a
              href={settings.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp ↗
            </a>
          )}
          {settings.instagram && (
            <a
              href={settings.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram ↗
            </a>
          )}
          {settings.phone && (
            <a href={"tel:" + settings.phone}> {settings.phone}</a>
          )}
          {settings.email && (
            <a href={"mailto:" + settings.email}>{settings.email}</a>
          )}
          <Link href="/privacy-policy">Privacy policy</Link>
          <Link href="/terms">Terms & conditions</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {settings.organization}
        </span>
        <span>Developed & Maintained by J.ed Web Admin</span>
        <span>Guidance for what comes next.</span>
      </div>
    </footer>
  );
}
