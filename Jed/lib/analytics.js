export function track(name, properties = {}) {
  if (typeof window !== "undefined" && window.gtag) {
    try {
      if (localStorage.getItem("jed-analytics") === "accepted")
        window.gtag("event", name, {
          ...properties,
          page_location: location.origin + location.pathname,
        });
    } catch {}
  }
}
