import { cookies } from "next/headers";
import { sameOrigin, apiError } from "../../../../../lib/http.js";
import { sessionCookie } from "../../../../../lib/auth.js";
export async function POST(request) {
  try {
    sameOrigin(request);
    (await cookies()).delete(sessionCookie);
    return Response.json({ success: true });
  } catch (e) {
    return apiError(e);
  }
}
