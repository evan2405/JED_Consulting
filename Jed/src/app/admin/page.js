import PublicPage from "../../../components/PublicPage";
import Link from "next/link";
import { safeUrl } from "../../../lib/validation";
export const metadata = {
  title: "Admin workspace",
  robots: { index: false, follow: false },
};
export default function Admin() {
  const studio = safeUrl(process.env.SANITY_STUDIO_URL);
  return (
    <PublicPage>
      <section className="section container">
        <p className="eyebrow">ADMINISTRATION</p>
        <h1>J.ed workspace</h1>
        <div className="course-grid">
          <article className="info-card">
            <h2>Website content</h2>
            <p>
              Manage courses, counselling, curriculum, reviews, banners,
              updates, placements, FAQs and site settings in Sanity Studio. Sign
              in with an authorised Sanity account.
            </p>
            {studio ? (
              <a className="button" href={studio}>
                Open Sanity Studio ?
              </a>
            ) : (
              <p>
                Studio is not linked yet. For local development, run JedStudio
                and open its localhost address.
              </p>
            )}
          </article>
          <article className="info-card">
            <h2>Enquiries & exports</h2>
            <p>
              Use your approved staff account to manage enquiries and export
              filtered CSV files.
            </p>
            <Link href="/staff" className="button">
              Open staff workspace ?
            </Link>
          </article>
        </div>
      </section>
    </PublicPage>
  );
}
