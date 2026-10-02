import { privateClient } from "../../../../../Sainity/client.js";
import { requireStaff } from "../../../../../lib/auth.js";
import { audit } from "../../../../../lib/audit.js";
import {
  apiError,
  HttpError,
  readJson,
  sameOrigin,
} from "../../../../../lib/http.js";
import { rateLimit } from "../../../../../lib/rate-limit.js";
import {
  enquiryFilters,
  leadFilter,
  enquiryStatuses,
} from "../../../../../lib/enquiry-filters.js";
export async function GET(request) {
  try {
    const user = await requireStaff();
    await rateLimit(request, "staff", user.sub);
    const params = new URL(request.url).searchParams;
    const after = params.get("after") || "";
    const filters = enquiryFilters(params);
    if (after.length > 200) throw new HttpError(400, "Invalid filter.");
    const leads = await privateClient().fetch(
      `*[_type=="submission" && _id>$after && ${leadFilter}] | order(_id asc)[0...51]{_id,name,email,phone,serviceInterested,service,courseTitle,interestedCourse,careerGoal,loanType,message,status,owner,submittedAt,_createdAt,notificationStatus,counsellingSlug,source}`,
      { after, ...filters },
    );
    await audit(user, "view_leads", {
      recordCount: Math.min(leads.length, 50),
    });
    return Response.json(
      {
        leads: leads.slice(0, 50),
        next: leads.length > 50 ? leads[49]._id : null,
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (e) {
    return apiError(e);
  }
}
export async function PATCH(request) {
  try {
    sameOrigin(request);
    const user = await requireStaff(["manager", "admin"]);
    await rateLimit(request, "staff", user.sub);
    const body = await readJson(request, 2000);
    if (
      !body ||
      typeof body.id !== "string" ||
      !/^[a-zA-Z0-9_.-]{1,150}$/.test(body.id) ||
      !enquiryStatuses.includes(body.status) ||
      typeof body.owner !== "string" ||
      body.owner.length > 100
    )
      throw new HttpError(400, "Invalid lead update.");
    const client = privateClient("write");
    const record = await client.getDocument(body.id);
    if (record?._type !== "submission")
      throw new HttpError(404, "Lead not found.");
    await audit(user, "update_lead", { recordId: body.id });
    await client
      .patch(body.id)
      .set({
        status: body.status,
        owner: body.owner.trim(),
        updatedAt: new Date().toISOString(),
      })
      .commit();
    return Response.json({ success: true });
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE(request) {
  try {
    sameOrigin(request);
    const user = await requireStaff(["admin"]);
    await rateLimit(request, "staff", user.sub);
    const body = await readJson(request, 1000);
    if (
      !body ||
      typeof body.id !== "string" ||
      !/^[a-zA-Z0-9_.-]{1,150}$/.test(body.id) ||
      body.confirm !== true
    )
      throw new HttpError(400, "Confirm the enquiry to delete.");
    const client = privateClient("write");
    const record = await client.getDocument(body.id);
    if (record?._type !== "submission")
      throw new HttpError(404, "Enquiry not found.");
    await audit(user, "delete_lead", { recordId: body.id });
    await client.delete(body.id);
    return Response.json(
      { success: true },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (e) {
    return apiError(e);
  }
}
