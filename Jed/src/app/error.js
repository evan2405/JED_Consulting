"use client";
import { useEffect } from "react";
import Link from "next/link";
export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error(
      JSON.stringify({
        event: "client_render_error",
        digest: error.digest || "unknown",
      }),
    );
  }, [error]);
  return (
    <main id="main-content" className="section container">
      <div className="success-card">
        <p className="eyebrow">LET’S TRY THAT AGAIN</p>
        <h1>Something went wrong.</h1>
        <p>
          Please try again or return to the homepage. If the problem continues,
          contact us through our official WhatsApp link.
        </p>
        <div className="actions">
          <button className="button" onClick={reset}>
            Try again
          </button>
          <Link href="/" className="button secondary">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
