import { notFound } from "next/navigation";
import Link from "next/link";
import PublicPage from "../../../../components/PublicPage";
import { getCollection } from "../../../../Sainity/queries";
import { safeUrl } from "../../../../lib/validation";
import { pageMetadata } from "../../../../lib/metadata";
async function getUpdate(slug) {
  return (await getCollection("updates")).items.find(
    (x) => x.slug?.current === slug,
  );
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const u = await getUpdate(slug);
  return pageMetadata(
    u?.title || "Update not found",
    u?.description?.slice(0, 155),
    "/updates/" + slug,
    u?.seo,
  );
}
export default async function Update({ params }) {
  const u = await getUpdate((await params).slug);
  if (!u) notFound();
  return (
    <PublicPage>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">{u.category}</p>
          <h1>{u.title}</h1>
        </div>
      </section>
      <section className="section container prose">
        <p className="preserve-lines">{u.description}</p>
        {safeUrl(u.link) && (
          <p>
            <a className="button" href={safeUrl(u.link)}>
              Learn more ?
            </a>
          </p>
        )}
        <Link href="/updates">All updates</Link>
      </section>
    </PublicPage>
  );
}
