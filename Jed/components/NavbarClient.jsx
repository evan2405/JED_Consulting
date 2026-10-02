"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, ArrowUpRight } from "lucide-react";

const services = [
  {
    id: "academic",
    title: "Academic Counselling",
    href: "/counselling/academic",
  },
  { id: "career", title: "Career Counselling", href: "/career" },
  { id: "financial", title: "Financial Counselling", href: "/financial" },
];

export default function NavbarClient() {
  const [open, setOpen] = useState(false),
    [servicesOpen, setServicesOpen] = useState(false);
  const toggle = useRef(null),
    drop = useRef(null);
  function close() {
    setOpen(false);
    setServicesOpen(false);
  }
  return (
    <header
      className="site-header"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          if (servicesOpen) {
            setServicesOpen(false);
            drop.current?.focus();
          } else {
            close();
            toggle.current?.focus();
          }
        }
      }}
    >
      <div className="container nav-row">
        <Link href="/" className="brand" onClick={close}>
          <Image src="/logo.png" width={56} height={60} alt="" priority />
          <span>
            J.ed<span>LEARN. GROW. GO FURTHER.</span>
          </span>
        </Link>
        <button
          ref={toggle}
          className="menu-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="main-nav"
          aria-label="Main navigation"
          className={open ? "navigation open" : "navigation"}
        >
          <Link onClick={close} href="/courses">
            Courses
          </Link>
          <div
            className="nav-dropdown"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget))
                setServicesOpen(false);
            }}
          >
            <button
              ref={drop}
              aria-expanded={servicesOpen}
              aria-controls="services-menu"
              onClick={() => setServicesOpen(!servicesOpen)}
            >
              Services <ChevronDown size={15} />
            </button>
            {servicesOpen && (
              <div id="services-menu" className="dropdown-panel">
                {services.map((s) => (
                  <Link
                    key={s.id}
                    href={s.href}
                    prefetch={false}
                    onClick={close}
                  >
                    {s.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link onClick={close} href="/#about">
            Why J.ed
          </Link>
          <Link onClick={close} href="/placements">
            Placement
          </Link>
          <Link onClick={close} href="/contact">
            Contact
          </Link>
          <Link onClick={close} href="/enquire" className="button small">
            Let’s talk <ArrowUpRight size={17} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
