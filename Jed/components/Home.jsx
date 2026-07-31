"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Star,
  Plane,
  BookOpen,
  Target,
  FileCheck,
  ArrowUpRight,
  CheckCircle2,
  X,
  Send,
  Globe,
  Users,
  Award,
  Sparkles,
  Clock,
  ChevronDown,
  ChevronUp,
  Database,
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────────
   CMS VISUAL GUIDE OVERLAY COMPONENT
───────────────────────────────────────────────────────────────── */
function CmsIndicator({ active, schema, fields }) {
  if (!active) return null;
  return (
    <div className="absolute top-2 left-2 z-30 bg-blue-600/90 text-white text-[10px] font-mono font-bold
                    px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-lg border border-blue-400/30
                    pointer-events-none select-none animate-scale-in">
      <Database className="w-3 h-3 text-blue-200" />
      <span>{schema} ({fields})</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SCROLL REVEAL HOOK
───────────────────────────────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    const elements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

/* ─────────────────────────────────────────────────────────────────
   ENQUIRY FORM (shared between inline and modal)
───────────────────────────────────────────────────────────────── */
const COUNTRY_CODES = [
  { code: "+91", flag: "🇮🇳", label: "India (+91)" },
  { code: "+1", flag: "🇺🇸", label: "USA (+1)" },
  { code: "+44", flag: "🇬🇧", label: "UK (+44)" },
  { code: "+61", flag: "🇦🇺", label: "Australia (+61)" },
  { code: "+1", flag: "🇨🇦", label: "Canada (+1)" },
  { code: "+971", flag: "🇦🇪", label: "UAE (+971)" },
  { code: "+65", flag: "🇸🇬", label: "Singapore (+65)" },
  { code: "+49", flag: "🇩🇪", label: "Germany (+49)" },
  { code: "+977", flag: "🇳🇵", label: "Nepal (+977)" },
  { code: "+880", flag: "🇧🇩", label: "Bangladesh (+880)" },
  { code: "+92", flag: "🇵🇰", label: "Pakistan (+92)" },
  { code: "+94", flag: "🇱🇰", label: "Sri Lanka (+94)" },
  { code: "+234", flag: "🇳🇬", label: "Nigeria (+234)" },
  { code: "+233", flag: "🇬🇭", label: "Ghana (+233)" },
  { code: "+254", flag: "🇰🇪", label: "Kenya (+254)" },
  { code: "+27", flag: "🇿🇦", label: "South Africa (+27)" },
];

function EnquiryForm({ courses = [], onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    interestedCourse: "",
    termsAccepted: true,
    website: "", // honeypot
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const courseOptions =
    Array.isArray(courses) && courses.length > 0
      ? courses.map((c) => (typeof c === "string" ? c : c.title)).filter(Boolean)
      : [
          "ACCA Qualification",
          "CMA (USA)",
          "US CPA",
          "US CMA",
          "CFA Program",
          "Diploma in IFRS",
        ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.termsAccepted) {
      setError("Please accept the terms and conditions & privacy policy.");
      return;
    }
    setError("");
    setLoading(true);

    const fullPhone = `${form.countryCode} ${form.phone}`.trim();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: fullPhone,
          interestedCourse: form.interestedCourse,
          message: `Enquiry for course: ${form.interestedCourse || "General Course Enquiry"}`,
          website: form.website,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.errors?.join(", ") || data.error || "Something went wrong.");
      } else {
        setSuccess(true);
        onSuccess?.();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center animate-scale-in">
          <CheckCircle2 className="w-6 h-6 text-green-400" />
        </div>
        <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
          Enquiry Sent!
        </h3>
        <p className="text-slate-300 text-xs max-w-xs">
          Thank you! Our team will reach out to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Honeypot — hidden from real users */}
      <input type="text" name="website" value={form.website} onChange={handleChange}
             style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

      {/* Your Name */}
      <div>
        <input
          className="w-full bg-white text-slate-900 placeholder-slate-400 rounded-md px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500 transition-all shadow-sm"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      {/* Your Email */}
      <div>
        <input
          className="w-full bg-white text-slate-900 placeholder-slate-400 rounded-lg px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500 transition-all shadow-sm"
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      {/* Phone Number with Country Code Dropdown */}
      <div className="flex items-center gap-1.5 bg-white rounded-lg px-1.5 py-1 focus-within:ring-2 focus-within:ring-red-500 shadow-sm">
        <div className="relative flex items-center shrink-0 border-r border-slate-200 pr-1">
          <select
            name="countryCode"
            value={form.countryCode}
            onChange={handleChange}
            className="bg-transparent text-slate-800 text-xs font-semibold py-1.5 pl-1.5 pr-5 appearance-none cursor-pointer focus:outline-none"
          >
            {COUNTRY_CODES.map((c, i) => (
              <option key={i} value={c.code} className="text-slate-900 font-medium">
                {c.flag} {c.code} ({c.label.split(" ")[0]})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
        </div>
        <input
          className="w-full bg-transparent text-slate-900 placeholder-slate-400 px-2 py-1.5 text-xs font-medium focus:outline-none"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
        />
      </div>

      {/* Select Course Dropdown */}
      <div>
        <div className="relative">
          <select
            className="w-full bg-white text-slate-900 rounded-lg px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500 transition-all shadow-sm appearance-none cursor-pointer"
            name="interestedCourse"
            value={form.interestedCourse}
            onChange={handleChange}
            required
          >
            <option value="" disabled className="text-slate-400">
              Select Course
            </option>
            {courseOptions.map((courseTitle, idx) => (
              <option key={idx} value={courseTitle} className="text-slate-900 font-medium">
                {courseTitle}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Terms and conditions */}
      <label className="flex items-center gap-2 text-[11px] text-slate-200 cursor-pointer select-none mt-0.5">
        <input
          type="checkbox"
          name="termsAccepted"
          checked={form.termsAccepted}
          onChange={handleChange}
          className="w-3.5 h-3.5 rounded border-white/20 text-red-600 focus:ring-red-500 accent-red-600 cursor-pointer"
        />
        <span>I accept the terms and conditions & privacy policy.</span>
      </label>

      {error && (
        <p className="text-red-400 text-[11px] bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="w-auto self-start bg-[#701a75] hover:bg-[#86198f] text-white font-bold rounded-full px-6 py-2.5 text-xs transition-all shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
      >
        {loading ? "Submitting…" : "Enquire Now"}
      </button>
    </form>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FLOATING ACTION BUTTON + MODAL
───────────────────────────────────────────────────────────────── */
function FloatingEnquire({ courses = [] }) {
  const [show, setShow]           = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <button onClick={() => setModalOpen(true)}
              className={`fab-enquire ${show ? "" : "hidden-fab"}`}
              aria-label="Open enquiry form">
        <Sparkles className="w-4 h-4" />
        Enquire Now
      </button>

      {modalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal-content p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                  Quick Enquiry
                </h2>
                <p className="text-sm text-slate-400 mt-0.5">We'll get back to you within 24h</p>
              </div>
              <button onClick={() => setModalOpen(false)}
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <EnquiryForm courses={courses} onSuccess={() => setTimeout(() => setModalOpen(false), 3000)} />
          </div>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   COUNT-UP HOOK
───────────────────────────────────────────────────────────────── */
function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

/* ─────────────────────────────────────────────────────────────────
   STATS RIBBON — with IntersectionObserver trigger
───────────────────────────────────────────────────────────────── */
function StatsRibbon() {
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const c1 = useCountUp(500, 1800, started);
  const c2 = useCountUp(95,  1600, started);
  const c3 = useCountUp(25,  1400, started);
  const c4 = useCountUp(10000, 2000, started);

  const stats = [
    { value: c1,    suffix: "+",  label: "Partner Universities" },
    { value: c2,    suffix: "%",  label: "Visa Success Rate" },
    { value: c3,    suffix: "+",  label: "Years Experience" },
    { value: c4,    suffix: "+",  label: "Success Stories" },
  ];

  return (
    <div ref={ref}
         className="bg-[#0a1628] border-y border-white/5 py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 text-center">
          {stats.map((s, i) => (
            <div key={i}
                 className="lg:border-r border-white/10 last:border-0 px-6 py-2">
              <p className="text-3xl md:text-4xl font-extrabold text-red-500"
                 style={{ fontFamily: "var(--font-heading)" }}>
                {s.value.toLocaleString()}{s.suffix}
              </p>
              <p className="text-sm text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN HOME COMPONENT
───────────────────────────────────────────────────────────────── */
const Home = ({
  courses = [],
  testimonials = [],
  visaServices = [],
  faqs = [],
  banners = [],
}) => {
  useScrollReveal();

  const [activeFilter,    setActiveFilter]    = useState("all");
  const [filteredCourses, setFilteredCourses] = useState(
    Array.isArray(courses) ? courses : []
  );
  const [cmsGuideActive,  setCmsGuideActive]  = useState(false);

  useEffect(() => {
    if (!Array.isArray(courses)) return;
    setFilteredCourses(
      activeFilter === "all"
        ? courses
        : courses.filter((c) => c.category === activeFilter)
    );
  }, [activeFilter, courses]);

  // Fallback services if none in Sanity
  const displayServices =
    visaServices && visaServices.length > 0
      ? visaServices
      : [
          {
            title: "Visa Consultation",
            description: "Expert guidance for student and work visas to top destinations worldwide.",
            iconName: "plane",
            color: "from-red-600 to-red-900",
          },
          {
            title: "Professional Courses",
            description: "Industry-recognized certification programs designed for career advancement.",
            iconName: "book",
            color: "from-blue-600 to-blue-900",
          },
          {
            title: "Career Counseling",
            description: "Personalized guidance to achieve your professional goals and aspirations.",
            iconName: "target",
            color: "from-purple-600 to-purple-900",
          },
          {
            title: "Application Support",
            description: "Complete assistance with applications to universities and job placements.",
            iconName: "file",
            color: "from-teal-600 to-teal-900",
          },
        ];

  const visaSteps = [
    { step: "01", title: "Initial Consultation", description: "Discuss your goals and explore the best pathways for your profile." },
    { step: "02", title: "Document Preparation", description: "We help you compile and verify every required document." },
    { step: "03", title: "Application Filing",   description: "We submit your applications to institutions with precision." },
    { step: "04", title: "Visa Approval",        description: "Receive your visa and start planning your global journey." },
  ];

  // Fallback testimonials if none in Sanity
  const displayTestimonials =
    testimonials && testimonials.length > 0
      ? testimonials
      : [
          { quote: "The guidance I received was invaluable. Now I'm studying at my dream university!", name: "Sarah Khan",   role: "Student, UK",     rating: 5 },
          { quote: "Professional courses helped me transition to tech. Best investment ever!",          name: "Rahul Sharma", role: "Software Engineer", rating: 5 },
          { quote: "Exceptional service and support throughout my entire visa journey.",                name: "Aisha Patel",  role: "Student, Canada",   rating: 5 },
          { quote: "My application was accepted in record time. Truly professional team!",              name: "James Lyngdoh", role: "Student, Australia", rating: 5 },
        ];

  const whyUs = [
    { icon: Award,  label: "Certified Consultants" },
    { icon: Globe,  label: "50+ Partner Countries" },
    { icon: Users,  label: "Dedicated Support Team" },
    { icon: Clock,  label: "Fast Turnaround" },
  ];

  // Render icons dynamically
  const renderServiceIcon = (service) => {
    if (service.icon) {
      return <img src={service.icon} alt="" className="w-7 h-7 object-contain brightness-0 invert" />;
    }
    const name = (service.iconName || "").toLowerCase();
    if (name.includes("plane")) return <Plane className="w-7 h-7 text-white" />;
    if (name.includes("book"))  return <BookOpen className="w-7 h-7 text-white" />;
    if (name.includes("target")) return <Target className="w-7 h-7 text-white" />;
    return <FileCheck className="w-7 h-7 text-white" />;
  };

  const getServiceColor = (index) => {
    const colors = [
      "from-red-600 to-red-900",
      "from-blue-600 to-blue-900",
      "from-purple-600 to-purple-900",
      "from-teal-600 to-teal-900",
    ];
    return colors[index % colors.length];
  };

  // Find home top active banner
  const topBanner = banners?.find((b) => b.placement === "homepage_top");

  // Helper to split hero title words for color accenting
  const renderHeroTitle = () => {
    if (topBanner && topBanner.title) {
      const words = topBanner.title.split(" ");
      if (words.length > 1) {
        const lastWord = words.pop();
        return (
          <>
            {words.join(" ")}{" "}
            <span className="gradient-text-red">{lastWord}</span>
          </>
        );
      }
      return topBanner.title;
    }
    return (
      <>
        Your Gateway to <span className="gradient-text-red">Global</span> Success
      </>
    );
  };

  return (
    <>
      {/* ── Floating CMS Visual Guide Toggle ── */}
      <div className="fixed top-20 right-6 z-40 hidden md:block">
        <button
          onClick={() => setCmsGuideActive(!cmsGuideActive)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold tracking-tight shadow-xl border transition-all ${
            cmsGuideActive
              ? "bg-blue-600 text-white border-blue-400"
              : "bg-navy-800 text-slate-400 border-white/15 hover:text-white"
          }`}
        >
          <Database className={`w-3.5 h-3.5 ${cmsGuideActive ? "animate-bounce" : ""}`} />
          {cmsGuideActive ? "CMS Guide: ON" : "CMS Guide"}
        </button>
      </div>

      {/* ══════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════ */}
      <section id="hero" className={`relative min-h-screen hero-gradient pt-[68px] overflow-hidden transition-all duration-300 ${
        cmsGuideActive ? "border-2 border-dashed border-blue-500/60 shadow-[0_0_30px_rgba(59,130,246,0.25)]" : ""
      }`}>
        <CmsIndicator active={cmsGuideActive} schema="banner" fields="title, subtitle, ctaText, ctaLink, image (placement: 'homepage_top')" />

        {/* Animated glow blobs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-red-600/10 rounded-full
                        blur-3xl animate-pulse-glow pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-blue-600/10 rounded-full
                        blur-3xl animate-pulse-glow pointer-events-none"
             style={{ animationDelay: "1.5s" }} />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
             style={{
               backgroundImage:
                 "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
               backgroundSize: "60px 60px",
             }} />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left */}
            <div className="animate-slide-in-left">
              <div className="section-tag mb-6">
                <span>Your Trusted Education Partner</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05]
                             text-white mb-6 tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}>
                {renderHeroTitle()}
              </h1>

              <p className="text-lg text-slate-400 leading-relaxed max-w-lg mb-10">
                {topBanner?.subtitle || `Expert visa consultancy and world-class professional courses to
                accelerate your career. We transform ambitions into achievements
                across borders.`}
              </p>

              <div className="flex flex-wrap gap-4">
                <a href={topBanner?.ctaLink || "#courses"} className="btn-primary btn-shimmer">
                  {topBanner?.ctaText || "Explore Courses"}
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a href="#contact" className="btn-secondary">
                  Visa Services
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 mt-10">
                {whyUs.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i}
                         className="flex items-center gap-2 text-xs text-slate-400
                                    bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                      <Icon className="w-3.5 h-3.5 text-red-400" />
                      {item.label}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right — Banner Image or Stat Card */}
            <div className="animate-slide-in-right flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-full">
                {topBanner?.image ? (
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    <img src={topBanner.image} alt={topBanner.title} className="w-full h-80 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060f2b] via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="relative max-w-sm mx-auto">
                    {/* Glowing border */}
                    <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-br
                                    from-red-500/50 via-transparent to-blue-500/30 blur-sm" />
                    <div className="relative glass-card p-8 animate-float"
                         style={{ animationDuration: "5s" }}>
                      {/* Icon */}
                      <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center
                                      justify-center mb-6">
                        <Globe className="w-7 h-7 text-red-400" />
                      </div>

                      <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                        Trusted Globally
                      </p>
                      <p className="text-4xl font-extrabold text-white mb-1"
                         style={{ fontFamily: "var(--font-heading)" }}>
                        10,000+
                      </p>
                      <p className="text-slate-400 text-sm mb-6">Success stories and counting</p>

                      <div className="divider mb-6" />

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-2xl font-bold text-red-400">95%</p>
                          <p className="text-xs text-slate-500 mt-0.5">Visa Success</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-400">500+</p>
                          <p className="text-xs text-slate-500 mt-0.5">Universities</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-white">25+</p>
                          <p className="text-xs text-slate-500 mt-0.5">Yrs Experience</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-white">50+</p>
                          <p className="text-xs text-slate-500 mt-0.5">Countries</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          STATS RIBBON
      ══════════════════════════════════════════════════ */}
      <StatsRibbon />

      {/* ══════════════════════════════════════════════════
          SERVICES SECTION
      ══════════════════════════════════════════════════ */}
      <section id="services" className={`relative py-24 bg-[#060f2b] transition-all duration-300 ${
        cmsGuideActive ? "border-2 border-dashed border-blue-500/60 shadow-[0_0_30px_rgba(59,130,246,0.25)]" : ""
      }`}>
        <CmsIndicator active={cmsGuideActive} schema="service" fields="title, description, icon, order" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <div className="section-tag justify-center">OUR SERVICES</div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4"
                style={{ fontFamily: "var(--font-heading)" }}>
              Everything You Need
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Comprehensive solutions tailored to help you succeed globally
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayServices.map((service, index) => {
              return (
                <div
                  key={service._id || index}
                  className="glass-card p-8 group cursor-pointer reveal"
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color || getServiceColor(index)}
                                   flex items-center justify-center mb-6
                                   group-hover:scale-110 transition-transform duration-300`}>
                    {renderServiceIcon(service)}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3"
                      style={{ fontFamily: "var(--font-heading)" }}>
                    {service.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-5">
                    {service.description}
                  </p>
                  <div className="flex items-center text-red-400 text-sm font-semibold
                                  group-hover:gap-2 transition-all duration-200">
                    Learn more <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          VISA PROCESS SECTION
      ══════════════════════════════════════════════════ */}
      <section id="visa" className="py-24 section-gradient-alt">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <div className="section-tag justify-center">HOW IT WORKS</div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4"
                style={{ fontFamily: "var(--font-heading)" }}>
              Your Journey to Success
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Four simple steps to transform your international education dream into reality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visaSteps.map((item, index) => (
              <div key={index}
                   className="relative glass-card p-8 group reveal"
                   style={{ transitionDelay: `${index * 0.12}s` }}>
                {/* Step number */}
                <div className="text-5xl font-extrabold text-red-500/30 mb-4
                                group-hover:text-red-500/60 transition-colors duration-300"
                     style={{ fontFamily: "var(--font-heading)" }}>
                  {item.step}
                </div>

                <h4 className="text-lg font-bold text-white mb-3"
                    style={{ fontFamily: "var(--font-heading)" }}>
                  {item.title}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.description}
                </p>

                {/* Connector arrow (desktop only) */}
                {index < visaSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-3 w-6 z-10">
                    <ChevronRight className="w-6 h-6 text-red-500/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          COURSES SECTION
      ══════════════════════════════════════════════════ */}
      <section id="courses" className={`relative py-24 bg-[#060f2b] transition-all duration-300 ${
        cmsGuideActive ? "border-2 border-dashed border-blue-500/60 shadow-[0_0_30px_rgba(59,130,246,0.25)]" : ""
      }`}>
        <CmsIndicator active={cmsGuideActive} schema="course" fields="title, slug, description, category, level, duration, price, image" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12 reveal">
            <div className="section-tag justify-center">EXPLORE COURSES</div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4"
                style={{ fontFamily: "var(--font-heading)" }}>
              Learn &amp; Grow
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Industry-recognized programs to accelerate your career globally.
            </p>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {["all", "professional", "development", "visa"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeFilter === filter
                    ? "bg-red-600 text-white shadow-[0_4px_15px_rgba(220,38,38,0.4)]"
                    : "glass-card text-slate-300 hover:text-white hover:border-white/20"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Courses grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, i) => (
                <Link
                  href={`/courses/${course.slug.current}`}
                  key={course._id}
                  className="glass-card overflow-hidden group block reveal"
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {course.image ? (
                      <img src={course.image} alt={course.title}
                           className="w-full h-full object-cover group-hover:scale-105
                                      transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-red-800 to-[#060f2b]" />
                    )}
                    <div className="course-img-overlay" />
                    {course.level && (
                      <span className="absolute top-3 right-3 bg-red-600 text-white
                                       text-xs font-bold px-2.5 py-1 rounded-full">
                        {course.level}
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    {course.category && (
                      <p className="text-red-400 font-semibold text-xs uppercase tracking-wider mb-2">
                        {course.category}
                      </p>
                    )}
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-red-300
                                   transition-colors"
                        style={{ fontFamily: "var(--font-heading)" }}>
                      {course.title}
                    </h3>
                    <div className="flex items-center justify-between text-slate-400 text-sm mb-4">
                      {course.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {course.duration}
                        </span>
                      )}
                      {course.price && (
                        <span className="text-white font-semibold">
                          ₹{course.price.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    <button className="w-full py-2.5 rounded-lg bg-red-600/20 text-red-300
                                       text-sm font-semibold hover:bg-red-600 hover:text-white
                                       transition-all duration-200 border border-red-600/30">
                      View Course
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 glass-card max-w-md mx-auto">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">
                {Array.isArray(courses) && courses.length === 0
                  ? "Courses are being added — check back soon!"
                  : "No courses in this category."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TESTIMONIALS SECTION
      ══════════════════════════════════════════════════ */}
      <section id="testimonials" className={`relative py-24 section-gradient-alt transition-all duration-300 ${
        cmsGuideActive ? "border-2 border-dashed border-blue-500/60 shadow-[0_0_30px_rgba(59,130,246,0.25)]" : ""
      }`}>
        <CmsIndicator active={cmsGuideActive} schema="testimonial" fields="name, role, quote, photo, rating" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12 reveal">
            <div className="section-tag justify-center">TESTIMONIALS</div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4"
                style={{ fontFamily: "var(--font-heading)" }}>
              What Our Students Say
            </h2>
          </div>

          <div className="testimonial-scroll pb-4">
            {displayTestimonials.map((t, i) => (
              <div key={t._id || i} className="testimonial-card-snap glass-card p-8 flex flex-col">
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(t.rating || 5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-slate-300 italic leading-relaxed flex-1 mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  {t.photo ? (
                    <img src={t.photo} alt={t.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-[#060f2b]
                                     flex items-center justify-center text-white font-bold shrink-0">
                      {(t.name || t.author || "?").charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-white text-sm">{t.name || t.author}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FAQ SECTION (Dynamic Accordion)
      ══════════════════════════════════════════════════ */}
      {faqs && faqs.length > 0 && (
        <section id="faqs" className={`relative py-24 bg-[#060f2b] border-t border-white/5 transition-all duration-300 ${
          cmsGuideActive ? "border-2 border-dashed border-blue-500/60 shadow-[0_0_30px_rgba(59,130,246,0.25)]" : ""
        }`}>
          <CmsIndicator active={cmsGuideActive} schema="faq" fields="question, answer, order" />
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16 reveal">
              <div className="section-tag justify-center">QUESTIONS</div>
              <h2 className="text-4xl font-extrabold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Frequently Asked Questions
              </h2>
              <p className="text-slate-400">Everything you need to know about our services and pathways.</p>
            </div>

            <div className="flex flex-col gap-4">
              {faqs.map((faq, idx) => (
                <FaqAccordionItem key={faq._id || idx} faq={faq} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════
          ENQUIRY / CONTACT SECTION
      ══════════════════════════════════════════════════ */}
      <section id="contact" className={`relative py-24 bg-[#060f2b] border-t border-white/5 overflow-hidden transition-all duration-300 ${
        cmsGuideActive ? "border-2 border-dashed border-blue-500/60 shadow-[0_0_30px_rgba(59,130,246,0.25)]" : ""
      }`}>
        <CmsIndicator active={cmsGuideActive} schema="submission" fields="name, email, phone, country, preferredDestination, service, interestedCourse, message" />
        
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]
                        bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Left */}
            <div className="reveal-left">
              <div className="section-tag">GET IN TOUCH</div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6"
                  style={{ fontFamily: "var(--font-heading)" }}>
                Start Your Journey
                <br />
                <span className="gradient-text-red">Today</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10">
                Have questions? Our expert team is ready to guide you from the first
                consultation to your final visa approval.
              </p>

              {/* Contact info */}
              <div className="flex flex-col gap-5 mb-10">
                {[
                  { icon: Phone, label: "Phone",    value: "+91 (0) 364 XXX XXXX", href: "tel:+91036400000" },
                  { icon: Mail,  label: "Email",    value: "info@jedcms.com",        href: "mailto:info@jedcms.com" },
                  { icon: MapPin, label: "Location", value: "Shillong, Meghalaya, India", href: null },
                ].map((item, i) => {
                  const Icon = item.icon;
                  const inner = (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center
                                      justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-red-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">{item.label}</p>
                        <p className="text-white font-medium">{item.value}</p>
                      </div>
                    </>
                  );
                  return item.href ? (
                    <a key={i} href={item.href} className="flex items-start gap-4 hover:opacity-80 transition-opacity">
                      {inner}
                    </a>
                  ) : (
                    <div key={i} className="flex items-start gap-4">
                      {inner}
                    </div>
                  );
                })}
              </div>

              {/* Why us bullets */}
              <div className="glass-card p-6">
                <p className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">
                  Why choose us?
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    "Free initial consultation",
                    "Dedicated case officer assigned",
                    "95% visa success rate",
                    "End-to-end application support",
                    "Post-arrival guidance",
                  ].map((point, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                      <span className="text-sm text-slate-300">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Enquiry form */}
            <div className="reveal-right">
              <div className="glass-card p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white"
                      style={{ fontFamily: "var(--font-heading)" }}>
                    Send an Enquiry
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Fill in the form and we'll get back to you within 24 hours.
                  </p>
                </div>
                <EnquiryForm courses={courses} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Floating enquiry button */}
      <FloatingEnquire courses={courses} />
    </>
  );
};

/* ─────────────────────────────────────────────────────────────────
   STATEFUL FAQ ACCORDION ITEM
───────────────────────────────────────────────────────────────── */
function FaqAccordionItem({ faq }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="glass-card overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
      >
        <span className="font-bold text-white text-base md:text-lg pr-4" style={{ fontFamily: "var(--font-heading)" }}>
          {faq.question}
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-red-400 shrink-0 transition-transform" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 transition-transform" />
        )}
      </button>
      <div className={`transition-all duration-300 overflow-hidden ${isOpen ? "max-h-48 border-t border-white/5" : "max-h-0"}`}>
        <p className="p-6 text-slate-300 text-sm md:text-base leading-relaxed bg-[#0b152d]/40">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

export default Home;
