import React from "react";

export default function DownloadButton({ url, label = "Download Syllabus" }) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block btn-primary btn-shimmer mt-4"
    >
      {label}
    </a>
  );
}
