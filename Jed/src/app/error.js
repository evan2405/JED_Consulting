"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RefreshCcw } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log to the structured logger if available, else console
    console.error("[App Error Boundary]", error);
  }, [error]);

  return (
    <div className="min-h-screen hero-gradient flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse-glow pointer-events-none" style={{ animationDelay: "1.5s" }} />

      <div className="relative text-center max-w-lg">
        {/* Error Icon */}
        <div className="w-20 h-20 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-8">
          <span className="text-4xl" role="img" aria-label="error">⚠️</span>
        </div>

        <h1
          className="text-2xl sm:text-3xl font-extrabold text-white mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Something went wrong
        </h1>
        <p className="text-slate-400 leading-relaxed mb-10">
          An unexpected error occurred. This has been logged and our team will look into it.
          You can try refreshing the page or go back home.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={reset} className="btn-primary btn-shimmer">
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>
          <Link href="/" className="btn-secondary">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
