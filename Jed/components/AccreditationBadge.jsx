import React from "react";

export default function AccreditationBadge({ accreditation }) {
  if (!accreditation) return null;
  return (
    <div className="flex items-center mt-4">
      <span className="text-sm font-medium text-slate-300 mr-2">Accreditation:</span>
      <span className="px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-sm font-medium">
        {accreditation}
      </span>
    </div>
  );
}
