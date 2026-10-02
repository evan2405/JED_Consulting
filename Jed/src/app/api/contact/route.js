import { assertPrivateStorage } from "../../../../lib/storage-privacy.js";
import { createHash } from "node:crypto";
import { privateClient } from "../../../../Sainity/client.js";
import { getCourses, getService } from "../../../../Sainity/queries.js";
import { validateEnquiry } from "../../../../lib/validation.js";
import {
  readJson,
  sameOrigin,
  apiError,
  HttpError,
} from "../../../../lib/http.js";
import { rateLimit } from "../../../../lib/rate-limit.js";
import { notifyLead } from "../../../../lib/notifications.js";
export async function POST(request) {
  try {
    sameOrigin(request);
    await rateLimit(request);
    const body = await readJson(request);
    if (body?.website) return Response.json({ success: true });
    const key = request.headers.get("idempotency-key");
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        key || "",
      )
    )
      throw new HttpError(
        400,
        "A valid submission identifier is required. Please reload the form.",
      );
    const { courses } = await getCourses();
    const { errors, data } = validateEnquiry(
      body,
      courses.map((c) => c._id),
    );
    if (Object.keys(errors).length)
      return Response.json({ success: false, errors }, { status: 400 });
    const selected = courses.find((c) => c._id === data.selectedCourse);
    if (data.counsellingSlug) {
      const service = await getService(data.counsellingSlug);
      if (!service || service.service !== data.serviceInterested)
        throw new HttpError(
          400,
          "The selected counselling service is unavailable. Please choose another service.",
        );
    }
    const payload = { ...data, courseTitle: selected?.title || "" };
    const digest = createHash("sha256")
      .update(JSON.stringify(payload))
      .digest("hex");
    const id = "enquiry." + key.toLowerCase();
    await assertPrivateStorage();
    const writer = privateClient("write");
    const record = await writer.createIfNotExists({
      _id: id,
      _type: "submission",
      ...payload,
      payloadDigest: digest,
      status: "new",
      notificationStatus: "pending",
      submittedAt: new Date().toISOString(),
      consentVersion: "2026-09-26",
    });
    if (record.payloadDigest !== digest)
      throw new HttpError(
        409,
        "This submission identifier has already been used. Reload to send a different enquiry.",
      );
    if (record.notificationStatus !== "sent") {
      try {
        await notifyLead(id);
      } catch {
        console.error(
          JSON.stringify({ event: "lead_notification_pending", id }),
        );
      }
    }
    return Response.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (!(error instanceof HttpError))
      console.error(JSON.stringify({ event: "enquiry_save_failed" }));
    const response = apiError(error);
    if (error.status === 429) response.headers.set("Retry-After", "600");
    return response;
  }
}
export function GET() {
  return Response.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } },
  );
}
