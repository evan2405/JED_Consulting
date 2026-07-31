"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const [isScrolled, setIsScrolled]           = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: "Home",     href: "/#hero" },
    { label: "Services", href: "/#services" },
    { label: "Courses",  href: "/#courses" },
    { label: "Visa",     href: "/#visa" },
    { label: "Contact",  href: "/#contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#060f2b] shadow-[0_4px_30px_rgba(0,0,0,0.4)] border-b border-white/10"
            : "glass-nav"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">

            {/* ── Logo ── */}
            <Link href="/#hero" className="flex items-center gap-2 group">
              <div className="relative">
                <span
                  className="text-2xl font-extrabold text-white tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  JED
                </span>
                <span
                  className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-red-500 rounded-full
                             scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                />
              </div>
              <div className="h-5 w-px bg-white/20 mx-1" />
              <span className="text-sm text-slate-400 hidden sm:block font-medium">
                Consultancy
              </span>
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="relative text-sm font-medium text-slate-300 hover:text-white
                             transition-colors duration-200 group py-1"
                >
                  {link.label}
                  <span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 rounded-full
                               group-hover:w-full transition-all duration-300"
                  />
                </Link>
              ))}
            </div>

            {/* ── CTA + Mobile Toggle ── */}
            <div className="flex items-center gap-3">
              <Link
                href="/#contact"
                className="hidden md:flex btn-primary btn-shimmer text-sm px-5 py-2.5"
              >
                Enquire Now
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white
                           hover:bg-white/10 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen
                  ? <X className="w-6 h-6" />
                  : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <span
            className="text-2xl font-extrabold text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            JED <span className="text-red-500">.</span>
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-2 flex-1">
          {navLinks.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-4 rounded-xl
                         text-lg font-semibold text-white hover:bg-white/5
                         hover:text-red-400 transition-all duration-200 group border border-transparent
                         hover:border-white/10"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {link.label}
              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </nav>

        {/* Mobile CTA */}
        <div className="mt-auto pt-6 border-t border-white/10">
          <Link
            href="/#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="btn-primary btn-shimmer w-full justify-center text-base py-4"
          >
            Enquire Now
            <ArrowUpRight className="w-5 h-5" />
          </Link>
          <p className="text-center text-xs text-slate-500 mt-4">
            Jed Consultancy · Shillong, Meghalaya
          </p>
        </div>
      </div>
    </>
  );
};

export default Navbar;
