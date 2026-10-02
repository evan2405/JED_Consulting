import PublicPage from "./PublicPage";
import Link from "next/link";
import { safeUrl } from "../lib/validation";
export default function DemoPage({ record, kind }) {
  const href =
    kind === "courses"
      ? "/enquire?service=academic&course=" + encodeURIComponent(record._id)
      : "/enquire?service=" +
        record.service +
        "&counselling=" +
        encodeURIComponent(record.slug.current);
  return (
    <PublicPage>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">PROGRAMME / SERVICE INTRODUCTION</p>
          <h1>{record.title}</h1>
          <p>Explore what to discuss before taking your next step.</p>
        </div>
      </section>
      <section className="section container prose" style={{ maxWidth: 850 }}>
        <h2>Your introduction</h2>
        <p>
          {record.demoText ||
            "An official demonstration has not yet been supplied. Ask the team for a current programme or service introduction."}
        </p>
        {safeUrl(record.demoUrl) && (
          <p>
            <a
              className="button"
              href={safeUrl(record.demoUrl)}
              target="_blank"
              rel="noopener noreferrer"
              data-event="demo_opened"
            >
              Open the supplied demo ↗
            </a>
          </p>
        )}
        <div className="actions">
          <Link href={href} className="button">
            Discuss this with J.ed ↗
          </Link>
          <Link
            className="button secondary"
            href={"/" + kind + "/" + record.slug.current}
            prefetch={false}
          >
            Back to details
          </Link>
        </div>
      </section>
    </PublicPage>
  );
}
