import Link from "next/link";
import Image from "next/image";
import { safeUrl } from "../lib/validation";
export default function BannerSections({ banners, position }) {
  const items = banners.filter((b) => b.placement === position);
  if (!items.length) return null;
  return (
    <aside className="container banner-sections" aria-label="Announcements">
      {items.map((b) => (
        <div key={b._id} className="counselling-banner">
          {b.image?.startsWith("https://cdn.sanity.io/") && (
            <Image
              src={b.image}
              loading="lazy"
              alt={b.imageAlt || b.title}
              width={160}
              height={100}
              sizes="160px"
            />
          )}
          <div>
            <h3>{b.title}</h3>
            <p>{b.subtitle}</p>
          </div>
          {safeUrl(b.ctaLink) && (
            <Link className="button" href={safeUrl(b.ctaLink)}>
              {b.ctaText || "Learn more"} ↗
            </Link>
          )}
        </div>
      ))}
    </aside>
  );
}
