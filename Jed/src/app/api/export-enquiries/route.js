import { privateClient } from "../../../../Sainity/client.js";
import { requireStaff } from "../../../../lib/auth.js";
import { rateLimit } from "../../../../lib/rate-limit.js";
import { csvCell } from "../../../../lib/validation.js";
import { apiError, HttpError } from "../../../../lib/http.js";
import { enquiryFilters, leadFilter } from "../../../../lib/enquiry-filters.js";
import { audit } from "../../../../lib/audit.js";
export async function GET(request) {
  try {
    const user = await requireStaff(["exporter", "admin"]);
    await rateLimit(request, "export", user.sub);
    const p = new URL(request.url).searchParams;
    if (p.has("key"))
      throw new HttpError(400, "URL credentials are not supported.");
    const filters = enquiryFilters(p, { requireDates: true });
    const from = p.get("from"),
      to = p.get("to");
    const records = await privateClient().fetch(
      `*[_type=="submission" && ${leadFilter}] | order(_createdAt desc)[0...1001]{name,email,phone,serviceInterested,service,selectedCourse,courseTitle,interestedCourse,careerGoal,loanType,status,submittedAt,_createdAt}`,
      filters,
    );
    if (records.length > 1000)
      throw new HttpError(
        400,
        "More than 1,000 records match. Choose a shorter date range.",
      );
    await audit(user, "export", {
      recordCount: records.length,
      dateFrom: from,
      dateTo: to,
    });
    const rows = [
      [
        "Name",
        "Email",
        "Phone",
        "Service",
        "Course",
        "Career goal",
        "Loan type",
        "Status",
        "Submitted at",
      ],
      ...records.map((s) => [
        s.name,
        s.email,
        s.phone,
        s.serviceInterested || s.service,
        s.courseTitle || s.selectedCourse || s.interestedCourse,
        s.careerGoal,
        s.loanType,
        s.status,
        s.submittedAt || s._createdAt,
      ]),
    ];
    return new Response(
      "\uFEFF" + rows.map((r) => r.map(csvCell).join(",")).join("\r\n"),
      {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition":
            'attachment; filename="jed-enquiries-' +
            from +
            "-to-" +
            to +
            '.csv"',
          "Cache-Control": "private, no-store",
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  } catch (e) {
    return apiError(e);
  }
}
