import {
  ArrowUpRight,
  GraduationCap,
  BriefcaseBusiness,
  Landmark,
} from "lucide-react";
import Link from "next/link";
import { enquiryHref } from "../lib/catalog";
import LazyCarouselControls from "./LazyCarouselControls";
const icons = [GraduationCap, BriefcaseBusiness, Landmark];
export default function ServicesCarousel({ services }) {
  if (!services.length)
    return (
      <p className="notice">
        Service details will appear here when available.{" "}
        <Link href="/contact">Contact J.ed for guidance.</Link>
      </p>
    );
  return (
    <div data-service-carousel>
      <div className="section-heading">
        <div>
          <p className="eyebrow">ONE PLACE. THREE PATHWAYS.</p>
          <h2>What’s your next move?</h2>
        </div>
        <LazyCarouselControls />
      </div>
      <div
        className="service-rail"
        aria-label="Counselling services"
        tabIndex={0}
      >
        {services.map((s, i) => {
          const Icon = icons[i % icons.length];
          return (
            <article className="service-card" key={s._id} id={s.slug.current}>
              <div className="card-top">
                <Icon size={30} />
                <span>0{i + 1}</span>
              </div>
              <p className="eyebrow">{s.title}</p>
              <h3>{s.short}</h3>
              <p>{s.description}</p>
              <ul>
                {s.items.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <Link
                className="text-link"
                prefetch={false}
                href={
                  enquiryHref(s.service || s.id) +
                  "&counselling=" +
                  encodeURIComponent(s.slug.current)
                }
              >
                Enquire about{" "}
                {s.id === "academic"
                  ? "courses"
                  : s.id === "career"
                    ? "your career"
                    : "finance"}{" "}
                <ArrowUpRight size={18} />
              </Link>
              <Link
                className="sub-link"
                prefetch={false}
                href={"/counselling/" + s.slug.current}
              >
                Explore this service →
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
