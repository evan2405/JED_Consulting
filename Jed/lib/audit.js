import "server-only";
import { randomUUID } from "node:crypto";
import { privateClient } from "../Sainity/client.js";
export async function audit(user, action, details = {}) {
  await privateClient("write").create({
    _id: "audit." + randomUUID(),
    _type: "auditEvent",
    actor: user.sub,
    action,
    ...details,
    occurredAt: new Date().toISOString(),
  });
}
