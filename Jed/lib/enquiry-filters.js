import { HttpError } from "./http.js";
export const enquiryStatuses = [
  "new",
  "contacted",
  "interested",
  "converted",
  "closed",
];
export const leadFilter =
  '($status=="" || coalesce(status,"new")==$status) && ($service=="" || serviceInterested==$service) && ($q=="" || $q in string::split(string::lower(name)," ") || string::lower(email)==$q || phone==$q) && ($from=="" || coalesce(submittedAt,_createdAt)>=$from) && ($to=="" || coalesce(submittedAt,_createdAt)<=$to)';
export function enquiryFilters(params, { requireDates = false } = {}) {
  const status = params.get("status") || "",
    service = params.get("service") || "",
    q = (params.get("q") || "").trim().toLowerCase(),
    from = params.get("from") || "",
    to = params.get("to") || "";
  if (
    !["", ...enquiryStatuses].includes(status) ||
    !["", "academic", "career", "financial"].includes(service) ||
    q.length > 100 ||
    /[\u0000-\u001f]/.test(q)
  )
    throw new HttpError(400, "Invalid enquiry filters.");
  function date(value, end = false) {
    if (!value) return "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
      throw new HttpError(400, "Choose a valid date.");
    const d = new Date(value + "T00:00:00Z");
    if (!Number.isFinite(+d) || d.toISOString().slice(0, 10) !== value)
      throw new HttpError(400, "Choose a valid date.");
    return value + (end ? "T23:59:59.999Z" : "T00:00:00Z");
  }
  const start = date(from),
    end = date(to, true);
  if (requireDates && (!start || !end))
    throw new HttpError(400, "Choose a valid start and end date.");
  if (
    start &&
    end &&
    (start > end ||
      (requireDates && Date.parse(end) - Date.parse(start) > 93 * 86400000))
  )
    throw new HttpError(400, "Choose a date range of up to 93 days.");
  return { status, service, q, from: start, to: end };
}
