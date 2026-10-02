import PublicPage from "../../../components/PublicPage";
import ContentFeed from "../../../components/ContentFeed";
import { getCollection } from "../../../Sainity/queries";
import { pageMetadata } from "../../../lib/metadata";
export const metadata = pageMetadata(
  "Latest updates",
  "Admissions, courses, exam notices and events from J.ed.",
  "/updates",
);
export default async function Updates() {
  const { items, unavailable } = await getCollection("updates");
  return (
    <PublicPage>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">LATEST FROM J.ED</p>
          <h1>Stay in the know.</h1>
          <p>Course news, admissions, events and notices.</p>
        </div>
      </section>
      <ContentFeed title="Latest updates" items={items} kind="updates" />
      {!items.length && (
        <section className="section container">
          <p>
            {unavailable
              ? "Updates are temporarily unavailable. Please try again shortly."
              : "No new updates just yet. Check back for the latest from J.ed."}
          </p>
        </section>
      )}
    </PublicPage>
  );
}
