"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

export default function CarouselControls() {
  function move(event, direction) {
    const rail = event.currentTarget
      .closest("[data-service-carousel]")
      ?.querySelector(".service-rail");
    rail?.scrollBy({
      left: direction * rail.clientWidth,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  return (
    <>
      <button
        aria-label="Previous services"
        data-carousel-ready
        onClick={(event) => move(event, -1)}
      >
        <ArrowLeft size={20} />
      </button>
      <button aria-label="Next services" onClick={(event) => move(event, 1)}>
        <ArrowRight size={20} />
      </button>
    </>
  );
}
