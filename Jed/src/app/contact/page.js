import PublicPage from "../../../components/PublicPage";
import Link from "next/link";
import { getSettings } from "../../../Sainity/queries";
import { pageMetadata } from "../../../lib/metadata";
import { googleMapsEmbedUrl } from "../../../lib/maps";
import LocationMap from "../../../components/LocationMap";
export const metadata = pageMetadata(
  "Contact J.ed",
  "Talk with J.ed Placement Consultancy in Shillong about courses, careers and financial guidance.",
  "/contact",
);
export default async function Contact() {
  const s = await getSettings();
  const embedUrl = googleMapsEmbedUrl(s.mapEmbedUrl);
  return (
    <PublicPage>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">LET’S TALK</p>
          <h1>{s.contactTitle}</h1>
          <p>{s.contactDescription}</p>
          <Link href="/enquire" className="button">
            Send enquiry ↗
          </Link>
        </div>
      </section>
      <section className="section container content-grid">
        <div>
          <h2>{s.organization}</h2>
          <p>{s.location}</p>
          {s.address && <p>{s.address}</p>}
          {s.hours && <p>Office hours: {s.hours}</p>}
          {s.phone && (
            <p>
              <a className="text-link" href={"tel:" + s.phone}>
                Call {s.phone}
              </a>
            </p>
          )}
          {s.email && (
            <p>
              <a className="text-link" href={"mailto:" + s.email}>
                {s.email}
              </a>
            </p>
          )}
          {s.mapUrl && (
            <p>
              <a
                href={s.mapUrl}
                className="text-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                View location on Google Maps ↗
              </a>
            </p>
          )}
        </div>
        <aside className="info-card">
          <h2>Start a conversation.</h2>
          <p>
            Ask about a programme, discuss your career goals or understand what
            support is available.
          </p>
          {s.whatsapp && (
            <a
              href={s.whatsapp}
              className="button"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat on WhatsApp ↗
            </a>
          )}
          {s.instagram && (
            <p style={{ marginTop: 20 }}>
              <a
                href={s.instagram}
                className="text-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Find us on Instagram ↗
              </a>
            </p>
          )}
        </aside>
      </section>
      {embedUrl && (
        <LocationMap
          embedUrl={embedUrl}
          mapUrl={s.mapUrl}
          organization={s.organization}
          location={s.location}
        />
      )}
    </PublicPage>
  );
}
