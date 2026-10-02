"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { safeUrl } from "../lib/validation";
export default function Updates({ banners }) {
  const [hidden, setHidden] = useState(false);
  if (hidden || !banners.length) return null;
  return (
    <aside className="updates">
      <div className="container">
        <span className="update-label">LATEST UPDATES</span>
        <div>
          {banners.map((b) => (
            <span key={b._id}>
              {b.title}
              {safeUrl(b.ctaLink) && (
                <>
                  {" "}
                  ·{" "}
                  <a href={safeUrl(b.ctaLink)}>
                    {b.ctaText || "Find out more"} →
                  </a>
                </>
              )}
            </span>
          ))}
        </div>
        <button aria-label="Dismiss updates" onClick={() => setHidden(true)}>
          <X size={17} />
        </button>
      </div>
    </aside>
  );
}
