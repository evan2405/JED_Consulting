import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import {
  provider,
  random,
  seal,
  flowCookie,
  cookieOptions,
} from "../../../../../lib/auth.js";
export async function GET() {
  try {
    const config = await provider();
    const state = random(),
      nonce = random(),
      verifier = random();
    const redirect = process.env.NEXT_PUBLIC_SITE_URL + "/api/auth/callback";
    const url = new URL(config.authorization_endpoint);
    url.search = new URLSearchParams({
      response_type: "code",
      client_id: process.env.OIDC_CLIENT_ID,
      redirect_uri: redirect,
      scope: "openid profile",
      state,
      nonce,
      code_challenge: createHash("sha256").update(verifier).digest("base64url"),
      code_challenge_method: "S256",
    }).toString();
    const res = NextResponse.redirect(url);
    res.cookies.set(flowCookie, await seal({ state, nonce, verifier }, 600), {
      ...cookieOptions,
      maxAge: 600,
    });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch {
    return Response.json(
      {
        error: "Staff sign-in is not configured or is temporarily unavailable.",
      },
      { status: 503 },
    );
  }
}
