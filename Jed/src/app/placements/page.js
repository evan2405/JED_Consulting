import PublicPage from "../../../components/PublicPage";
import ContentFeed from "../../../components/ContentFeed";
import Link from "next/link";
import { getCollection, getSettings } from "../../../Sainity/queries";
import { pageMetadata } from "../../../lib/metadata";
export const metadata = pageMetadata(
  "Placements",
  "Explore placement support and approved student career stories from J.ed.",
  "/placements",
);
export default async function Placements() {
  const [{ items, unavailable }, settings] = await Promise.all([
    getCollection("placements"),
    getSettings(),
  ]);
  return (
    <PublicPage>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">CAREERS WITH DIRECTION</p>
          <h1>
            {items.length
              ? "New chapters. Real journeys."
              : settings.placementTitle}
          </h1>
          <p>
            {items.length
              ? "Approved student placements and career stories."
              : settings.placementDescription}
          </p>
          <Link className="button" href="/career">
            Explore career support ?
          </Link>
        </div>
      </section>
      {unavailable && (
        <p className="notice container">
          Placement updates are temporarily unavailable.
        </p>
      )}
      <ContentFeed title="Placement stories" items={items} kind="placements" />
      {!items.length && (
        <section className="section container">
          <h2>Stories coming soon.</h2>
          <p>
            We publish placement details only after they have been supplied and
            approved.
          </p>
          <Link
            href="/enquire?service=career&careerGoal=Placement"
            className="text-link"
          >
            Talk about your career ?
          </Link>
        </section>
      )}
    </PublicPage>
  );
}
