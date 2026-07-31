import { client } from "../../../../Sainity/client.js";
import { courseBySlugQuery, coursesQuery } from "../../../../Sainity/queries.js";
import { notFound } from "next/navigation";
import Link from "next/link";
import Footer from "../../../../components/Footer.jsx";
import Navbar from "../../../../components/Navbar.jsx";
import { Star, CheckCircle2 } from "lucide-react";
import CourseHero from "../../../../components/CourseHero.jsx";
import AccreditationBadge from "../../../../components/AccreditationBadge.jsx";
import DownloadButton from "../../../../components/DownloadButton.jsx";

// ── ISR: rebuild page at most every 60 seconds ────────────────────────────────
export const revalidate = 60;

// ── Pre-render all course slugs at build time ─────────────────────────────────
export async function generateStaticParams() {
  const courses = await client.fetch(coursesQuery);
  return (courses || [])
    .filter((c) => c?.slug?.current)
    .map((c) => ({ slug: c.slug.current }));
}

// ── Dynamic SEO metadata per course ──────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = await client.fetch(courseBySlugQuery, { slug });

  if (!course) {
    return { title: "Course Not Found | Jed Consultancy" };
  }

  return {
    title: `${course.title} | Jed Consultancy`,
    description:
      course.description
        ? course.description.slice(0, 155) + "…"
        : `Learn ${course.title} with Jed Consultancy — expert-led, industry-recognised certification courses in Shillong.`,
    openGraph: {
      title: `${course.title} | Jed Consultancy`,
      description: course.description?.slice(0, 155) ?? `Enroll in ${course.title} at Jed Consultancy.`,
      images: course.image ? [{ url: course.image }] : [],
      type: "article",
    },
  };
}

export default async function CourseDetailPage({ params }) {
  const { slug } = await params;
  const course = await client.fetch(courseBySlugQuery, { slug });


  if (!course) {
    notFound();
  }

  const reviews = course.reviews ?? [];
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
      : 0;

  return (
    <>
      <Navbar />

      {/* ---------- Hero ---------- */}
      <CourseHero course={course} avgRating={avgRating} reviews={reviews} />

      {/* ---------- Body: description + sticky enroll card ---------- */}
      <section className="bg-[#0d1b3e] border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-12 lg:gap-16">
            {/* Main column — appears BELOW sidebar on mobile, LEFT on desktop */}
            <div className="min-w-0 order-2 lg:order-1">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6">
                About this course
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed whitespace-pre-line">
                {course.description ||
                  "Full course details are being finalized — check back soon, or reach out and our team will walk you through everything."}
              </p>

              {/* Accreditation badge */}
              <AccreditationBadge accreditation={course.accreditation} />

              {/* Download syllabus */}
              <DownloadButton url={course.syllabusUrl} label="Download Syllabus" />

              {/* What you'll walk away with — gives structure beyond a wall of text */}
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Step-by-step guidance from enrollment to completion",
                  "Direct access to instructors for questions",
                  "Practical material you can use immediately",
                  "Certificate recognized by our partner network",
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-slate-300">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sticky enroll sidebar — appears FIRST on mobile, RIGHT on desktop */}
            <aside className="lg:sticky lg:top-24 self-start w-full order-1 lg:order-2">
              <div className="rounded-2xl border border-white/10 shadow-xl overflow-hidden glass-card">
                <div className="bg-[#060f2b] p-6 border-b border-white/10">
                  <p className="text-slate-400 text-sm mb-1">Course fee</p>
                  <p className="text-3xl font-extrabold text-white">
                    {course.price ? `₹${course.price.toLocaleString("en-IN")}` : "Contact us"}
                  </p>
                </div>
                <div className="p-6 space-y-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Duration</span>
                    <span className="font-semibold text-white">
                      {course.duration || "Self-paced"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Level</span>
                    <span className="font-semibold text-white">
                      {course.level || "All levels"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Category</span>
                    <span className="font-semibold text-white">
                      {course.category || "General"}
                    </span>
                  </div>

                  <Link href="/#contact" className="block w-full">
                    <button className="w-full btn-primary btn-shimmer justify-center py-3">
                      Enroll Now
                    </button>
                  </Link>
                  <Link
                    href="/#contact"
                    className="block text-center text-sm text-slate-400 hover:text-red-400 transition"
                  >
                    Have questions? Talk to us
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ---------- Reviews ---------- */}
      <section className="py-16 md:py-20 bg-[#060f2b] border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-400 mb-3">
                STUDENT REVIEWS
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                What students say
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl font-extrabold text-white">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-slate-400">
                / 5 average from {reviews.length} review
                {reviews.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="rounded-xl p-8 border border-white/10 hover:border-red-500/50 hover:shadow-xl transition duration-300 glass-card"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating || 0)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 text-lg italic leading-relaxed">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-[#060f2b] rounded-full flex items-center justify-center text-white font-bold shrink-0">
                    {review.author?.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <p className="font-bold text-white">{review.author}</p>
                    <p className="text-sm text-slate-400">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}