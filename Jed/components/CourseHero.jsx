import React from "react";
import Link from "next/link";
import { ChevronRight, Clock, BarChart, Star } from "lucide-react";

export default function CourseHero({ course, avgRating = 0, reviews = [] }) {
  return (
    <section className="relative hero-gradient pt-28 pb-16 md:pt-32 md:pb-20">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(220,38,38,0.35),transparent_55%)]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/#courses" className="hover:text-white transition">Courses</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white/80 truncate max-w-[180px]">{course.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10 items-start">
          {/* Left: title + meta */}
          <div>
            <p className="text-red-400 font-bold text-sm uppercase tracking-[0.2em] mb-4">
              {course.category?.toUpperCase() || "COURSE"}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] text-white mb-6">
              {course.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-slate-300 text-sm md:text-base">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-500" />
                {course.duration || "Self-paced"}
              </span>
              <span className="flex items-center gap-2">
                <BarChart className="w-4 h-4 text-red-500" />
                {course.level || "All levels"}
              </span>
              {reviews.length > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-white font-semibold">{avgRating.toFixed(1)}</span>
                  <span className="text-slate-400">
                    ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* Right: course image */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            {course.image ? (
              <img src={course.image} alt={course.title} className="w-full h-56 lg:h-64 object-cover" />
            ) : (
              <div className="w-full h-56 lg:h-64 bg-gradient-to-br from-red-800 to-[#060f2b]" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
