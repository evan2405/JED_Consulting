import React from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";

// Inline SVG Social Icons
const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const Footer = () => {
  const year = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", href: "/#hero" },
    { label: "Services", href: "/#services" },
    { label: "Courses", href: "/#courses" },
    { label: "Visa Process", href: "/#visa" },
    { label: "Testimonials", href: "/#testimonials" },
    { label: "Contact", href: "/#contact" },
  ];

  const services = [
    "Visa Consultation",
    "Professional Courses",
    "Career Counseling",
    "Application Support",
    "Document Preparation",
    "Post-Arrival Support",
  ];

  const socials = [
    { icon: InstagramIcon, href: "#", label: "Instagram" },
    { icon: TwitterIcon, href: "#", label: "Twitter / X" },
    { icon: LinkedinIcon, href: "#", label: "LinkedIn" },
  ];

  const legal = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
  ];

  return (
    <footer className="bg-[#030a1e] border-t border-white/5">
      {/* ── CTA Banner ── */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2
                className="text-3xl md:text-4xl font-extrabold text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Ready to Start Your Journey?
              </h2>
              <p className="text-slate-400 mt-2">
                Talk to our experts today — your global career is one step away.
              </p>
            </div>
            <Link
              href="/#contact"
              className="btn-primary btn-shimmer shrink-0 text-base px-7 py-3.5"
            >
              Enquire Now
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Footer Grid ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-2xl font-extrabold text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                JED
              </span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Transforming dreams into global success through expert education
              guidance and visa consultancy. Your trusted partner across borders.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-9 h-9 rounded-lg border border-white/10 flex items-center
                               justify-center text-slate-400 hover:bg-red-600 hover:text-white
                               hover:border-red-600 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-sm font-bold text-white uppercase tracking-widest mb-5"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-slate-400
                               hover:text-red-400 transition-colors group"
                  >
                    <ChevronRight
                      className="w-3 h-3 opacity-0 group-hover:opacity-100
                                 -translate-x-1 group-hover:translate-x-0 transition-all"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4
              className="text-sm font-bold text-white uppercase tracking-widest mb-5"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Services
            </h4>
            <ul className="flex flex-col gap-3">
              {services.map((svc) => (
                <li key={svc}>
                  <a
                    href="#services"
                    className="flex items-center gap-2 text-sm text-slate-400
                               hover:text-red-400 transition-colors group"
                  >
                    <ChevronRight
                      className="w-3 h-3 opacity-0 group-hover:opacity-100
                                 -translate-x-1 group-hover:translate-x-0 transition-all"
                    />
                    {svc}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-sm font-bold text-white uppercase tracking-widest mb-5"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Contact Us
            </h4>
            <div className="flex flex-col gap-4">
              {[
                { icon: Phone, value: "+91 (0) 364 XXX XXXX", href: "tel:+91036400000" },
                { icon: Mail, value: "info@jedcms.com", href: "mailto:info@jedcms.com" },
                { icon: MapPin, value: "Shillong, Meghalaya, India", href: null },
              ].map((item, i) => {
                const Icon = item.icon;
                const content = (
                  <>
                    <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center
                                    justify-center shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-red-400" />
                    </div>
                    <p className="text-sm text-slate-400">{item.value}</p>
                  </>
                );
                return item.href ? (
                  <a key={i} href={item.href} className="flex items-start gap-3 hover:opacity-80 transition-opacity">
                    {content}
                  </a>
                ) : (
                  <div key={i} className="flex items-start gap-3">
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Strip ── */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6
                        flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {year} Jed Consultancy. All rights reserved. Made with ♥ in Shillong.
          </p>
          <div className="flex gap-5">
            {legal.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
