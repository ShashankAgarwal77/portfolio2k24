import { NextResponse } from "next/server";
import {
  AUDIT360_ACCESS_COOKIE,
  audit360AccessToken,
  audit360PasswordMatches,
} from "@/app/lib/case-study-access";

export async function POST(request: Request) {
  let input = "";
  try {
    const body = await request.json();
    if (typeof body?.password === "string") input = body.password.slice(0, 200);
  } catch {}

  if (!process.env.AUDIT360_PASSWORD) {
    console.error("AUDIT360_PASSWORD is not set; the Audit360 case study cannot be unlocked.");
  }

  if (!audit360PasswordMatches(input)) {
    // Slows guessing without needing any server-side state.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUDIT360_ACCESS_COOKIE, audit360AccessToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/case-study/audit360",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
