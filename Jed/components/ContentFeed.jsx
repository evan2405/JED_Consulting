import Link from "next/link";
import Image from "next/image";
import { safeUrl } from "../lib/validation";
export default function ContentFeed({ title, items, kind }) {
  if (!items?.length) return null;
  return (
    <section className="section container">
      <div className="section-heading">
        <h2>{title}</h2>
        {kind === "updates" && (
          <Link className="text-link" href="/updates">
            All updates ↗
          </Link>
        )}
        {kind === "placements" && (
          <Link className="text-link" href="/placements">
            All placements ↗
          </Link>
        )}
      </div>
      <div className="course-grid">
        {items.map((item) => (
          <article className="info-card" key={item._id}>
            {item.image?.startsWith("https://cdn.sanity.io/") && (
              <Image
                src={item.image}
                loading="lazy"
                alt={
                  item.imageAlt ||
                  item.title ||
                  item.author ||
                  item.studentName ||
                  ""
                }
                width={600}
                height={400}
                sizes="(max-width:600px) 90vw, 30vw"
                className="content-image"
              />
            )}
            {item.isDemo && <p className="eyebrow">Development sample</p>}
            {item.quote ? (
              <>
                <blockquote>
                  <p>“{item.quote}”</p>
                </blockquote>
                <h3>{item.author}</h3>
                <p>{item.course}</p>
              </>
            ) : (
              <>
                <p className="eyebrow">{item.category || item.company}</p>
                <h3>{item.title || item.studentName}</h3>
                <p>{item.description || item.position}</p>
                {item.package && <p>{item.package}</p>}
                {item.year && <p>{item.year}</p>}
                {item.testimonial && <p>{item.testimonial}</p>}
              </>
            )}
            {kind === "updates" && item.slug?.current ? (
              <Link
                className="text-link"
                href={"/updates/" + item.slug.current}
              >
                Read update ↗
              </Link>
            ) : (
              safeUrl(item.link) && (
                <a className="text-link" href={safeUrl(item.link)}>
                  Learn more ↗
                </a>
              )
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
