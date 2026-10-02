import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCourse, getCourses } from "../Sainity/queries";
import { enquiryHref } from "../lib/catalog";
import { safeUrl } from "../lib/validation";
import PublicPage from "./PublicPage";
import Curriculum from "./Curriculum";
export default async function CoursePage({ slug }) {
  const c = await getCourse(slug);
  if (!c) notFound();
  const href = enquiryHref("academic", c._id);
  const related = (await getCourses()).courses
    .filter((x) => x._id !== c._id && x.category === c.category)
    .slice(0, 3);
  return (
    <PublicPage>
      <section className="page-hero">
        <div className="container">
          <p className="breadcrumbs">
            <Link href="/">Home</Link> / <Link href="/courses">Courses</Link> /{" "}
            {c.title}
          </p>
          <p className="eyebrow">{c.category || "Professional programme"}</p>
          <h1>{c.title}</h1>
          <p>{c.shortDescription || c.description}</p>
          {c.isDemo && <p className="notice">Development sample programme</p>}
          <div className="actions">
            <Link href={href} className="button">
              Enquire about this course ↗
            </Link>
            <Link
              href={"/courses/" + slug + "/demo"}
              prefetch={false}
              className="button secondary"
              data-event="demo_opened"
            >
              View programme introduction ↗
            </Link>
          </div>
        </div>
      </section>
      <section className="section container content-grid">
        <div className="prose">
          {c.image?.startsWith("https://cdn.sanity.io/") && (
            <Image
              src={c.image}
              loading="lazy"
              alt={c.imageAlt || c.title + " programme"}
              width={780}
              height={440}
              sizes="(max-width:800px) 90vw,60vw"
              className="content-image"
            />
          )}
          <h2>Find the right fit for your goals.</h2>
          <p>{c.description}</p>
          <Curriculum
            modules={c.curriculum}
            status={c.curriculumStatus || "awaiting-material"}
          />
          <h2>Eligibility & programme details</h2>
          <p>
            {c.eligibility ||
              "Confirmed for your chosen programme and institution before enrolment."}
          </p>
          {c.accreditation && (
            <p>Accreditation information: {c.accreditation}</p>
          )}
          {c.examDates && <p>Exam schedule: {c.examDates}</p>}
          {safeUrl(c.syllabusUrl) && (
            <a
              href={safeUrl(c.syllabusUrl)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download syllabus ↗
            </a>
          )}
          {c.counsellingAvailable !== false && (
            <p>
              <Link
                href={
                  "/enquire?service=academic&course=" +
                  encodeURIComponent(c._id) +
                  "&counselling=academic"
                }
                data-event="counselling_interest"
              >
                Book academic counselling ↗
              </Link>
            </p>
          )}
          <div className="notice">
            An enquiry does not reserve a place or process a payment.
            Availability and programme details are confirmed individually.
          </div>
        </div>
        <aside className="info-card">
          <h2>At a glance</h2>
          <dl>
            <div>
              <dt>Course fee</dt>
              <dd>
                {c.price != null
                  ? "₹" + Number(c.price).toLocaleString("en-IN")
                  : "Confirm with our team"}
              </dd>
            </div>
            <div>
              <dt>Duration</dt>
              <dd>{c.duration || "Varies by programme / institution"}</dd>
            </div>
            <div>
              <dt>Eligibility</dt>
              <dd>{c.eligibility || "Confirmed for your chosen programme"}</dd>
            </div>
          </dl>
          <Link href={href} className="button full" style={{ marginTop: 25 }}>
            Apply now — send an enquiry ↗
          </Link>
        </aside>
      </section>
      {related.length > 0 && (
        <section className="section container">
          <h2>Related programmes</h2>
          <div className="course-grid">
            {related.map((r) => (
              <Link
                className="course-card"
                prefetch={false}
                key={r._id}
                href={"/courses/" + r.slug.current}
              >
                <h3>{r.title}</h3>
                <p>{r.description}</p>
                <span className="text-link">View course ↗</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </PublicPage>
  );
}
