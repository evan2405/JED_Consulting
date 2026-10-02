import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  MapPin,
  GraduationCap,
  MessagesSquare,
  Compass,
  BookOpen,
  BriefcaseBusiness,
} from "lucide-react";
import ServicesCarousel from "./ServicesCarousel";
import CourseList from "./CourseList";
import { courseCards } from "../lib/course-cards";
import ContentFeed from "./ContentFeed";
import BannerSections from "./BannerSections";
export default function Home({
  courses,
  unavailable,
  services,
  settings,
  home,
  faqs,
  banners,
  updates,
  testimonials,
  placements,
}) {
  const icons = [BookOpen, Compass, BriefcaseBusiness];
  const heroImage =
    home.image?.startsWith("/images/") ||
    home.image?.startsWith("https://cdn.sanity.io/")
      ? home.image
      : "/images/students-learning.jpg";
  return (
    <main id="main-content">
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" />
              {home.heroEyebrow}
            </p>
            <h1>
              {home.heroTitle}
              <br />
              {home.heroSubtitle}
              <br />
              <em>{home.heroAccent}</em>
            </h1>
            <p className="hero-description">{home.heroDescription}</p>
            <div className="actions">
              <Link href="/courses" className="button">
                Explore courses <ArrowUpRight size={18} />
              </Link>
              <Link href="/counselling" className="button secondary">
                Book counselling <ArrowRight size={18} />
              </Link>
            </div>
            <p className="location">
              <MapPin size={15} />
              {settings.location}
            </p>
          </div>
          <div className="hero-visual">
            <div className="photo-label">
              <span /> A LITTLE GUIDANCE. A BIG NEXT STEP.
            </div>
            <div className="hero-photo">
              <Image
                src={heroImage}
                alt={home.imageAlt || ""}
                fill
                sizes="(max-width:700px) 90vw,45vw"
                preload
              />
              <div className="photo-caption">
                <span>{home.photoCaption}</span>
                <ArrowUpRight size={38} strokeWidth={1.3} />
              </div>
            </div>
            <div className="guidance-tag">
              <span className="icon-tile">
                <GraduationCap size={24} />
              </span>
              <div>
                <strong>Your goals. Your path.</strong>
                <span>Personal guidance at every step</span>
              </div>
            </div>
            <span className="visual-spark" aria-hidden="true">
              ✳
            </span>
          </div>
        </div>
      </section>
      <div className="path-strip">
        <div className="container">
          {home.benefits.map((b, i) => {
            const Icon = icons[i % 3];
            return (
              <div key={b.title}>
                <Icon size={22} />
                <span>
                  <strong>{b.title}</strong>
                  {b.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <BannerSections banners={banners} position="homepage" />
      <section id="courses" className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">LEARNING THAT TAKES YOU FURTHER</p>
            <h2>{home.courseTitle}</h2>
          </div>
          <p>{home.courseDescription}</p>
        </div>
        <CourseList courses={courseCards(courses)} />
        {unavailable && (
          <p className="notice">
            Live course updates are unavailable. Please contact us to confirm
            programme details.
          </p>
        )}
        <p className="catalog-note">
          Availability, institution, fees and eligibility are confirmed
          individually before enrolment.
        </p>
        <div className="counselling-banner">
          <span className="icon-tile">
            <MessagesSquare size={25} />
          </span>
          <div>
            <h3>A little unsure? Let’s figure it out together.</h3>
            <p>
              Tell us what interests you. We’ll help you explore your options.
            </p>
          </div>
          <Link href="/counselling/academic" className="text-link">
            Get course guidance <ArrowUpRight size={19} />
          </Link>
        </div>
      </section>
      <section id="services" className="services-section">
        <div className="section container">
          <ServicesCarousel services={services} />
        </div>
      </section>
      <section id="about" className="section container journey-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE J.ED APPROACH</p>
            <h2>{home.whyTitle}</h2>
          </div>
          <p>{home.whyDescription}</p>
        </div>
        <div className="journey-grid">
          {home.steps.map((s, i) => (
            <article key={s.title}>
              <span className="step-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
        <div className="local-note">
          <MapPin size={18} />
          <p>
            Based in <strong>{settings.location}.</strong>
          </p>
          <Link href="/contact" className="text-link">
            Meet your next step <ArrowRight size={17} />
          </Link>
        </div>
        {home.statistics?.length > 0 && (
          <div className="journey-grid">
            {home.statistics.map((s) => (
              <article key={s.title}>
                <h3>{s.value}</h3>
                <p>{s.title}</p>
                <small>{s.source}</small>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="membership-section">
        <div className="container membership-grid">
          <div>
            <p className="eyebrow">BEYOND THE CLASSROOM</p>
            <h2>{home.membershipTitle}</h2>
            <p>{home.membershipDescription}</p>
            <Link className="text-link" href="/career">
              Explore placement support <ArrowUpRight size={18} />
            </Link>
            <div className="membership-footnote">
              <BriefcaseBusiness size={20} />
              <span>For students, freshers & job seekers</span>
            </div>
          </div>
          <div className="membership-card">
            <span className="eyebrow">PLACEMENT MEMBERSHIP</span>
            <p className="price">
              ₹{Number(settings.membershipFee).toLocaleString("en-IN")}{" "}
              <span>/ year</span>
            </p>
            <ul>
              {settings.membershipBenefits.map((t) => (
                <li key={t}>
                  <Check size={17} />
                  {t}
                </li>
              ))}
            </ul>
            <Link
              href="/enquire?service=career&careerGoal=Placement"
              className="button full"
            >
              Enquire about membership <ArrowUpRight size={18} />
            </Link>
            <small>
              Enquiry only. Membership does not guarantee employment.
            </small>
          </div>
        </div>
      </section>
      <ContentFeed
        title="From the J.ed community"
        items={testimonials.slice(0, 3)}
        kind="testimonials"
      />
      <ContentFeed
        title="Latest from J.ed"
        items={updates.slice(0, 3)}
        kind="updates"
      />
      {placements.length ? (
        <ContentFeed
          title="A new chapter, in practice"
          items={placements.slice(0, 3)}
          kind="placements"
        />
      ) : (
        <section className="section container">
          <p className="eyebrow">PLACEMENTS</p>
          <h2>{settings.placementTitle}</h2>
          <p>{settings.placementDescription}</p>
          <Link className="text-link" href="/placements">
            Explore placement support ↗
          </Link>
        </section>
      )}
      <BannerSections banners={banners} position="promotional" />
      {faqs.length > 0 && (
        <section className="section container faq-section">
          <div>
            <p className="eyebrow">GOOD QUESTIONS. CLEAR ANSWERS.</p>
            <h2>
              A little more <span className="serif-accent">clarity.</span>
            </h2>
            <Link href="/enquire" className="text-link">
              Ask us a question <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="faq">
            {faqs.map((f) => (
              <details key={f._id}>
                <summary>
                  {f.question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}
      <section id="contact" className="contact-section">
        <div className="container contact-grid">
          <div>
            <p className="eyebrow">YOUR FUTURE STARTS WITH A CONVERSATION</p>
            <h2>{settings.contactTitle}</h2>
            <p>{settings.contactDescription}</p>
          </div>
          <div className="actions">
            <Link href="/enquire" className="button">
              Send enquiry <ArrowUpRight size={18} />
            </Link>
            {settings.whatsapp && (
              <a
                href={settings.whatsapp}
                className="text-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat on WhatsApp <ArrowUpRight size={18} />
              </a>
            )}
          </div>
        </div>
        <div className="container contact-details">
          <span>{settings.location}</span>
          <Link href="/contact">Contact details ↗</Link>
          {settings.phone && (
            <a href={"tel:" + settings.phone}>{settings.phone}</a>
          )}
          {settings.email && (
            <a href={"mailto:" + settings.email}>{settings.email}</a>
          )}
        </div>
      </section>
      <BannerSections banners={banners} position="homepage_bottom" />
    </main>
  );
}
