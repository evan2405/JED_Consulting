"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

export default function LocationMap({
  embedUrl,
  mapUrl,
  organization,
  location,
}) {
  const [open, setOpen] = useState(false);
  return (
    <section className="section container" aria-labelledby="office-map-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">VISIT OUR OFFICE</p>
          <h2 id="office-map-title">Find us in {location || "Shillong"}</h2>
        </div>
        {mapUrl && (
          <a
            className="text-link"
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Get directions ↗
          </a>
        )}
      </div>
      <div className="location-map">
        {open ? (
          <iframe
            src={embedUrl}
            title={`${organization} location on Google Maps`}
            width="1200"
            height="400"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <div className="location-map-placeholder">
            <MapPin size={36} aria-hidden="true" />
            <h3>{organization}</h3>
            <p>{location}</p>
            <button
              type="button"
              className="button"
              onClick={() => setOpen(true)}
            >
              Load Google Map
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
