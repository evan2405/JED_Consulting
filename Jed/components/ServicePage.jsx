import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getService,
  getSettings,
  getCollection,
  getCourses,
} from "../Sainity/queries";
import PublicPage from "./PublicPage";
import Curriculum from "./Curriculum";
import CourseList from "./CourseList";
import ContentFeed from "./ContentFeed";
import { courseCards } from "../lib/course-cards";
export default async function ServicePage({ slug }) {
  const [s, settings, catalogue, reviewCollection] = await Promise.all([
    getService(slug),
    getSettings(),
    getCourses(),
    getCollection("reviews"),
  ]);
  if (!s) notFound();
  const href =
    "/enquire?service=" +
    s.service +
    "&counselling=" +
    encodeURIComponent(slug);
  const relatedIds = new Set(
    (s.relatedCourses || []).filter((c) => c?.approved).map((c) => c._id),
  );
  const courses = catalogue.courses
    .filter((c) => relatedIds.has(c._id) || s.service === "academic")
    .slice(0, s.service === "academic" ? undefined : 3);
  const reviews = reviewCollection.items.filter((r) => r.serviceSlug === slug);
  return (
    <PublicPage>
      <section className="page-hero">
        <div className="container">
          <p className="breadcrumbs">
            <Link href="/">Home</Link> /{" "}
            <Link href="/counselling">Counselling</Link> / {s.title}
          </p>
          <p className="eyebrow">PERSONAL GUIDANCE</p>
          <h1>{s.title}</h1>
          <p>{s.description}</p>
          <div className="actions">
            <Link
              href={href}
              className="button"
              data-event="counselling_interest"
            >
              Book counselling ↗
            </Link>
            <Link
              href={"/counselling/" + slug + "/demo"}
              prefetch={false}
              className="button secondary"
              data-event="demo_opened"
            >
              See how it works ↗
            </Link>
          </div>
        </div>
      </section>
      <section className="section container content-grid">
        <div className="prose">
          {s.image?.startsWith("https://cdn.sanity.io/") && (
            <Image
              src={s.image}
              loading="lazy"
              alt={s.imageAlt || s.title}
              width={780}
              height={440}
              sizes="(max-width:800px) 90vw,60vw"
              className="content-image"
            />
          )}
          <h2>{s.short || "Guidance built around your goals."}</h2>
          <ul>
            {(s.items || []).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <h2>Your next steps</h2>
          <ol className="steps">
            {(s.process || []).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ol>
          <Curriculum
            modules={
              s.curriculum?.length
                ? s.curriculum
                : [
                    {
                      title: "Your guidance journey",
                      topics: s.process || s.items || [],
                    },
                  ]
            }
            service
          />
          {s.counsellorName && (
            <>
              <h2>Your counsellor</h2>
              <h3>{s.counsellorName}</h3>
              <p>{s.counsellorBio}</p>
            </>
          )}
        </div>
        <aside className="membership-card">
          {s.service === "career" ? (
            <>
              <p className="eyebrow">PLACEMENT MEMBERSHIP</p>
              <p className="price">
                ₹{Number(settings.membershipFee).toLocaleString("en-IN")}{" "}
                <span>/ year</span>
              </p>
              <ul>
                {settings.membershipBenefits.map((t) => (
                  <li key={t}>✓ {t}</li>
                ))}
              </ul>
              <Link
                className="button full"
                href={href + "&careerGoal=Placement"}
              >
                Enquire about membership ↗
              </Link>
              <small>
                Membership and referrals do not guarantee employment.
              </small>
              <p style={{ marginTop: 24 }}>
                <Link
                  className="text-link"
                  href={href + "&careerGoal=Recruitment"}
                >
                  Recruitment support for employers ↗
                </Link>
              </p>
            </>
          ) : (
            <>
              <h2>Let’s understand your goals.</h2>
              <p>
                Tell us what you need and we’ll help you explore the next step.
              </p>
              <Link href={href} className="button full">
                Send an enquiry ↗
              </Link>
            </>
          )}
        </aside>
      </section>
      {s.offerings?.length > 0 && (
        <section className="section container">
          <h2>Explore your options</h2>
          <div className="loan-grid">
            {s.offerings.map((o) => (
              <article className="info-card" key={o.title}>
                <h2>{o.title}</h2>
                <ul>
                  {(o.items || []).map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                {o.eligibility && (
                  <p>
                    <strong>Eligibility considerations:</strong> {o.eligibility}
                  </p>
                )}
                <Link
                  className="text-link"
                  href={
                    href +
                    (o.loanType
                      ? "&loanType=" + encodeURIComponent(o.loanType)
                      : "")
                  }
                >
                  Enquire about this support ↗
                </Link>
              </article>
            ))}
          </div>
          {s.service === "financial" && (
            <div className="notice">
              Final loan approval, interest rates, amount, tenure and
              eligibility are determined by the bank, NBFC, lending institution
              or funding agency.
            </div>
          )}
        </section>
      )}
      {s.service === "career" && (
        <section className="section container">
          <h2>Connections to opportunity.</h2>
          <div className="partner-list">
            {settings.partners.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <p className="catalog-note">
            Organisations listed in our service information. Current vacancies
            and recruitment opportunities vary; a listing does not guarantee a
            referral.
          </p>
        </section>
      )}
      {courses.length > 0 && (
        <section className="section container">
          <h2>
            {s.service === "academic"
              ? "Explore our programmes"
              : "Related courses"}
          </h2>
          {s.service === "academic" ? (
            <CourseList courses={courseCards(courses)} initialExpanded />
          ) : (
            <div className="course-grid">
              {courses.map((c) => (
                <Link
                  className="course-card"
                  prefetch={false}
                  href={"/courses/" + c.slug.current}
                  key={c._id}
                >
                  <h3>{c.title}</h3>
                  <p>{c.description}</p>
                  <span className="text-link">View course ↗</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}
      <ContentFeed
        title="Counselling experiences"
        items={reviews}
        kind="reviews"
      />
    </PublicPage>
  );
}
