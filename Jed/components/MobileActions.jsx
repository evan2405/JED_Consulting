"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function MobileActions({ phone }) {
  const path = usePathname();
  if (["/enquire", "/staff", "/admin"].some((p) => path.startsWith(p)))
    return null;
  return (
    <nav className="mobile-action-bar" aria-label="Quick contact">
      {phone && <a href={"tel:" + phone}>Call us</a>}
      <Link href="/counselling">Book counselling ↗</Link>
    </nav>
  );
}
