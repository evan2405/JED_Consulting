"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track } from "../lib/analytics";
export default function InteractionAnalytics() {
  const path = usePathname(),
    last = useRef(null);
  useEffect(() => {
    if (last.current !== path) {
      if (/^\/courses\/[^/]+$/.test(path))
        track("course_viewed", { course: path.split("/")[2] });
      if (/^\/counselling\/[^/]+$/.test(path))
        track("counselling_viewed", { service: path.split("/")[2] });
      last.current = path;
    }
  }, [path]);
  useEffect(() => {
    function click(e) {
      const link = e.target.closest?.("a");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      if (href.startsWith("tel:")) track("phone_clicked");
      else if (link.dataset.event === "demo_opened") track("demo_opened");
      else if (link.dataset.event === "counselling_interest")
        track("counselling_interest");
      else if (link.classList.contains("button"))
        track("cta_clicked", {
          destination: href.startsWith("/") ? href.split("?")[0] : "external",
        });
    }
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);
  return null;
}
