import Link from "next/link";
import { ArrowUpRight, Home, Search } from "lucide-react";

export const metadata = {
  title: "Page Not Found | Jed Consultancy",
  description: "The page you are looking for doesn't exist or has been moved.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen hero-gradient flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse-glow pointer-events-none" style={{ animationDelay: "1.5s" }} />

      <div className="relative text-center max-w-lg">
        {/* 404 Number */}
        <p
          className="text-[9rem] sm:text-[12rem] font-extrabold leading-none select-none"
          style={{
            fontFamily: "var(--font-heading)",
            background: "linear-gradient(135deg, rgba(220,38,38,0.5) 0%, rgba(220,38,38,0.1) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </p>

        {/* Message */}
        <h1
          className="text-2xl sm:text-3xl font-extrabold text-white mb-4 -mt-6"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Page Not Found
        </h1>
        <p className="text-slate-400 leading-relaxed mb-10">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="btn-primary btn-shimmer">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link href="/#courses" className="btn-secondary">
            <Search className="w-4 h-4" />
            Browse Courses
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
