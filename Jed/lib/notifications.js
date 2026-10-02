import "server-only";
import { privateClient } from "../Sainity/client.js";
export async function notifyLead(id) {
  const url = process.env.LEAD_NOTIFICATION_WEBHOOK;
  if (!url || !process.env.LEAD_NOTIFICATION_SECRET) return false;
  if (new URL(url).protocol !== "https:")
    throw new Error("Notification endpoint must use HTTPS");
  const result = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.LEAD_NOTIFICATION_SECRET,
      "Idempotency-Key": id,
    },
    body: JSON.stringify({
      event: "new_enquiry",
      id,
      staffUrl: process.env.NEXT_PUBLIC_SITE_URL + "/staff",
    }),
    signal: AbortSignal.timeout(5000),
  });
  if (!result.ok) throw new Error("Notification delivery failed");
  await privateClient("write")
    .patch(id)
    .set({ notificationStatus: "sent", notifiedAt: new Date().toISOString() })
    .commit();
  return true;
}
