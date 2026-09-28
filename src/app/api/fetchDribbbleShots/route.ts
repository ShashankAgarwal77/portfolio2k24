import { NextResponse } from "next/server";

/* Moved from pages/api/fetchDribbbleShots.ts — Next 16 disallows a root
   `pages/` directory alongside `src/app`, and an App Router route handler
   is the native shape for this anyway. Same public path, same response. */
export async function GET() {
  const response = await fetch(
    "https://api.dribbble.com/v2/user/shots?access_token=9a196114b5cb58681e43cada47a2f264bb97e7fc15cc1987f8d1ff21de2e4120"
  );
  const data = await response.json();

  return NextResponse.json(data);
}
