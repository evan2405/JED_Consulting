"use client";
import { useReportWebVitals } from "next/web-vitals";
import { track } from "../lib/analytics";
export default function WebVitals() {
  useReportWebVitals((metric) => {
    if (["LCP", "INP", "CLS"].includes(metric.name))
      track("web_vital", {
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
      });
  });
  return null;
}
