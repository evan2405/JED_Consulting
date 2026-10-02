"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function toTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

export default function PageScroll() {
  const pathname = usePathname();
  const search = useSearchParams().toString();

  useLayoutEffect(() => {
    // Section links retain their anchor destination; full pages start at the top.
    if (!window.location.hash) toTop();
  }, [pathname, search]);

  useEffect(() => {
    let observer;
    // Wait until the router has committed the URL; streamed sections may arrive later.
    const frame = requestAnimationFrame(() => {
      if (!window.location.hash) {
        toTop();
        return;
      }
      let id;
      try {
        id = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        return;
      }
      function scrollToSection() {
        const section = document.getElementById(id);
        if (!section) return false;
        section.scrollIntoView({ block: "start", behavior: "instant" });
        return true;
      }
      if (!scrollToSection()) {
        observer = new MutationObserver(() => {
          if (scrollToSection()) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
    });
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [pathname, search]);

  useEffect(() => {
    function onClick(event) {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = event.target.closest?.("a[href]");
      if (
        !link ||
        link.hasAttribute("download") ||
        (link.target && link.target !== "_self")
      )
        return;
      const destination = new URL(link.href, window.location.href);
      if (
        destination.origin === window.location.origin &&
        destination.pathname === window.location.pathname &&
        destination.search === window.location.search &&
        !destination.hash
      )
        toTop();
    }
    // A link to the current page does not change usePathname.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
