"use client";
import { useState, useSyncExternalStore } from "react";
import Script from "next/script";
import Link from "next/link";
const analyticsId = process.env.NEXT_PUBLIC_GA_ID;
function subscribe(callback) {
  function sync() {
    if (window.gtag && snapshot() !== "accepted") {
      window["ga-disable-" + analyticsId] = true;
      window.gtag("consent", "update", { analytics_storage: "denied" });
    }
    callback();
  }
  window.addEventListener("storage", sync);
  window.addEventListener("jed-consent", callback);
  return () => {
    window.removeEventListener("storage", sync);
    window.removeEventListener("jed-consent", callback);
  };
}
function snapshot() {
  try {
    const value = localStorage.getItem("jed-analytics");
    return ["accepted", "declined"].includes(value) ? value : null;
  } catch {
    return null;
  }
}
export default function Consent({ nonce }) {
  const choice = useSyncExternalStore(subscribe, snapshot, () => undefined);
  const [editing, setEditing] = useState(false),
    [temporary, setTemporary] = useState(null);
  const selected = temporary || choice,
    open = editing || selected === null;
  function choose(value) {
    try {
      localStorage.setItem("jed-analytics", value);
      window.dispatchEvent(new Event("jed-consent"));
      setTemporary(null);
    } catch {
      setTemporary(value);
    }
    window["ga-disable-" + analyticsId] = value !== "accepted";
    setEditing(false);
    if (value === "declined") {
      if (window.gtag)
        window.gtag("consent", "update", { analytics_storage: "denied" });
      document.cookie.split(";").forEach((c) => {
        const name = c.split("=")[0].trim();
        if (name.startsWith("_ga")) {
          const host = location.hostname.split(".");
          for (let i = 0; i < host.length - 1; i++)
            document.cookie =
              name + "=; Max-Age=0; path=/; domain=." + host.slice(i).join(".");
          document.cookie = name + "=; Max-Age=0; path=/";
        }
      });
    } else if (window.gtag)
      window.gtag("consent", "update", { analytics_storage: "granted" });
  }
  if (!analyticsId) return null;
  return (
    <>
      {selected === "accepted" && (
        <>
          <Script
            nonce={nonce}
            src={"https://www.googletagmanager.com/gtag/js?id=" + analyticsId}
            strategy="afterInteractive"
          />
          <Script
            nonce={nonce}
            id="analytics-init"
            strategy="afterInteractive"
          >{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});gtag('config',${JSON.stringify(analyticsId)},{send_page_view:false,page_location:location.origin+location.pathname,page_referrer:document.referrer?new URL(document.referrer).origin:''});gtag('event','page_view',{page_location:location.origin+location.pathname,page_title:document.title});`}</Script>
        </>
      )}
      {open ? (
        <section className="cookie-banner" aria-label="Analytics preferences">
          <strong>Your privacy, your choice.</strong>
          <p>
            Optional analytics help us understand which services visitors use.
            We only load analytics if you accept. Your enquiry details are never
            included in analytics.
          </p>
          <div className="actions">
            <button className="button" onClick={() => choose("accepted")}>
              Accept analytics
            </button>
            <button
              className="button secondary"
              onClick={() => choose("declined")}
            >
              Reject analytics
            </button>
            <Link href="/privacy-policy">Privacy policy</Link>
          </div>
        </section>
      ) : (
        <button className="privacy-toggle" onClick={() => setEditing(true)}>
          Cookie preferences
        </button>
      )}
    </>
  );
}
