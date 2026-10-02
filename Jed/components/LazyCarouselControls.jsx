"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

function Placeholder() {
  return (
    <>
      <button aria-label="Previous services" disabled>
        <span aria-hidden="true">←</span>
      </button>
      <button aria-label="Next services" disabled>
        <span aria-hidden="true">→</span>
      </button>
    </>
  );
}

const CarouselControls = dynamic(() => import("./CarouselControls"), {
  ssr: false,
  loading: Placeholder,
});

export default function LazyCarouselControls() {
  const container = useRef(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      const timer = setTimeout(() => setNearViewport(true), 0);
      return () => clearTimeout(timer);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="carousel-controls" ref={container}>
      {nearViewport ? <CarouselControls /> : <Placeholder />}
    </div>
  );
}
