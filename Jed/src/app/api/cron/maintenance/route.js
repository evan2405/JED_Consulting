import { authorizedJob } from "../../../../../lib/job-auth.js";
import { privateClient } from "../../../../../Sainity/client.js";
import { notifyLead } from "../../../../../lib/notifications.js";
export async function GET(request) {
  if (!authorizedJob(request, process.env.CRON_SECRET))
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const client = privateClient("write");
    const days = Number(process.env.RETENTION_DAYS);
    const retentionEnabled = process.env.RETENTION_ENABLED === "true";
    if (
      retentionEnabled &&
      (!Number.isInteger(days) || days < 30 || days > 36500)
    )
      throw new Error("Invalid retention configuration");
    const pending = await client.fetch(
      '*[_type=="submission" && notificationStatus=="pending"] | order(_createdAt asc)[0...25]{_id}',
    );
    let notified = 0;
    for (const record of pending) {
      try {
        if (await notifyLead(record._id)) notified++;
      } catch {
        console.error(
          JSON.stringify({
            event: "notification_retry_failed",
            id: record._id,
          }),
        );
      }
    }
    let deleted = 0;
    if (retentionEnabled) {
      const cutoff = new Date(Date.now() - days * 86400000).toISOString();
      const expired = await client.fetch(
        '*[_type=="submission" && coalesce(submittedAt,_createdAt)<$cutoff][0...100]{_id}',
        { cutoff },
      );
      if (expired.length) {
        const tx = client.transaction();
        for (const r of expired) tx.delete(r._id);
        await tx.commit();
        deleted = expired.length;
      }
    }
    return Response.json(
      { notified, deleted },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    console.error(JSON.stringify({ event: "maintenance_failed" }));
    return Response.json({ error: "Maintenance failed" }, { status: 503 });
  }
}
