import { NextResponse } from "next/server";
import {
  accessCookie,
  accessToken,
  isLockedStudy,
  passwordEnvName,
  passwordMatches,
} from "@/app/lib/case-study-access";

export async function POST(request: Request, { params }: { params: Promise<{ study: string }> }) {
  const { study } = await params;
  if (!isLockedStudy(study)) return NextResponse.json({ ok: false }, { status: 404 });

  let input = "";
  try {
    const body = await request.json();
    if (typeof body?.password === "string") input = body.password.slice(0, 200);
  } catch {}

  if (!process.env[passwordEnvName(study)]) {
    console.error(`${passwordEnvName(study)} is not set; the ${study} case study cannot be unlocked.`);
  }

  if (!passwordMatches(study, input)) {
    // Slows guessing without needing any server-side state.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(accessCookie(study), accessToken(study), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: `/case-study/${study}`,
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
