"use client";
import { track } from "../lib/analytics";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Search,
  BookOpen,
  TrendingUp,
  Globe2,
  ChevronDown,
  X,
} from "lucide-react";

export default function CourseList({ courses, initialExpanded = false }) {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(initialExpanded);
  const categories = [
    "All",
    ...new Set(courses.map((c) => c.category || "Professional")),
  ];
  const filtered = courses.filter(
    (c) =>
      (category === "All" || (c.category || "Professional") === category) &&
      `${c.title} ${c.description || ""}`
        .toLowerCase()
        .includes(search.trim().toLowerCase()),
  );
  const visible =
    expanded || search.trim() || category !== "All"
      ? filtered
      : filtered.slice(0, 6);
  return (
    <>
      <div className="course-toolbar">
        <div className="pills" role="group" aria-label="Filter courses">
          {categories.map((x) => (
            <button
              key={x}
              aria-pressed={category === x}
              onClick={() => {
                setCategory(x);
                setExpanded(false);
              }}
            >
              {x === "All" ? "All programmes" : x}
            </button>
          ))}
        </div>
        <label className="search">
          <Search size={18} />
          <span className="sr-only">Search courses</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Find your course"
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearch("")}
            >
              <X size={16} />
            </button>
          )}
        </label>
      </div>
      <p className="sr-only" aria-live="polite">
        {filtered.length} courses found. Showing {visible.length}.
      </p>
      <div className="course-grid" id="programme-results">
        {visible.map((c, i) => {
          const language = /language|german|nursing|english/i.test(c.title);
          const Icon = language ? Globe2 : i % 2 ? TrendingUp : BookOpen;
          return (
            <Link
              key={c._id}
              prefetch={false}
              onClick={() =>
                track("course_selected", { course: c.slug.current })
              }
              href={"/courses/" + c.slug.current}
              className={`course-card ${i % 3 === 1 ? "course-maroon" : "course-navy"}`}
            >
              <div className="course-card-top">
                <span className="course-icon">
                  <Icon size={25} strokeWidth={1.5} />
                </span>
                <span className="course-category">
                  {c.category || "Professional"}
                </span>
                <ArrowUpRight className="course-arrow" size={21} />
              </div>
              <h3>{c.title}</h3>
              <p>{c.description}</p>
              <div className="course-card-bottom">
                <span>{c.duration || "Programme guidance"}</span>
                <span>
                  Explore course <ArrowUpRight size={16} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
      {!filtered.length && (
        <div role="status" className="empty">
          <Search size={25} />
          <h3>No courses found</h3>
          <p>Try another keyword or explore all programmes.</p>
          <button
            className="button secondary"
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
          >
            Reset filters
          </button>
        </div>
      )}
      {category === "All" && !search.trim() && filtered.length > 6 && (
        <div className="course-more">
          <button
            className="button secondary"
            aria-expanded={expanded}
            aria-controls="programme-results"
            onClick={() => {
              setExpanded(!expanded);
              if (expanded)
                document
                  .getElementById("courses")
                  ?.scrollIntoView({ behavior: "instant" });
            }}
          >
            {expanded
              ? "Show fewer programmes"
              : `View all ${filtered.length} programmes`}
            <ChevronDown size={17} className={expanded ? "rotated" : ""} />
          </button>
        </div>
      )}
    </>
  );
}
