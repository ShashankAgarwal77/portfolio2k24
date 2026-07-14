import { NextResponse } from "next/server";

// Revalidate the feed at most once an hour so we don't hammer the Graph API
// (limit is 200 calls/hour/user) and pages stay fast.
export const revalidate = 3600;

export type InstagramMedia = {
  id: string;
  caption: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  // The image we actually render. For videos this is the poster frame.
  displayUrl: string;
  permalink: string;
  timestamp: string;
};

type GraphMedia = {
  id: string;
  caption?: string;
  media_type: InstagramMedia["mediaType"];
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
};

// A small curated fallback so the gallery looks alive in local dev before a
// token is configured (and if the Graph API ever errors in production).
const FALLBACK: InstagramMedia[] = [
  "photo-1506905925346-21bda4d32df4",
  "photo-1470071459604-3b5ec3a7fe05",
  "photo-1441974231531-c6227db76b6e",
  "photo-1493246507139-91e8fad9978e",
  "photo-1426604966848-d7adac402bff",
  "photo-1418065460487-3e41a6c84dc5",
  "photo-1447752875215-b2761acb3c5d",
  "photo-1500534623283-312aade485b7",
  "photo-1470770841072-f978cf4d019e",
  "photo-1472214103451-9374bd1c798e",
  "photo-1433086966358-54859d0ed716",
  "photo-1439853949127-fa647821eba0",
].map((slug, i) => ({
  id: `fallback-${i}`,
  caption:
    "Sample frame — connect your Instagram token to show your real feed here.",
  mediaType: "IMAGE" as const,
  displayUrl: `https://images.unsplash.com/${slug}?auto=format&fit=crop&w=900&q=70`,
  permalink: "https://www.instagram.com/",
  timestamp: new Date(0).toISOString(),
}));

function normalize(items: GraphMedia[]): InstagramMedia[] {
  return items
    .map((m) => ({
      id: m.id,
      caption: m.caption ?? "",
      mediaType: m.media_type,
      // Videos expose the poster via thumbnail_url; images/albums via media_url.
      displayUrl:
        m.media_type === "VIDEO"
          ? m.thumbnail_url ?? m.media_url ?? ""
          : m.media_url ?? "",
      permalink: m.permalink,
      timestamp: m.timestamp,
    }))
    .filter((m) => m.displayUrl);
}

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  // No token yet — serve the curated fallback instead of an error so the page
  // renders during setup.
  if (!token) {
    return NextResponse.json({ items: FALLBACK, source: "fallback" as const });
  }

  const fields =
    "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
  const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=24&access_token=${token}`;

  try {
    const res = await fetch(url, { next: { revalidate } });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Instagram Graph API error", res.status, detail);
      return NextResponse.json({ items: FALLBACK, source: "fallback" as const });
    }

    const json = (await res.json()) as { data?: GraphMedia[] };
    const items = normalize(json.data ?? []);

    if (items.length === 0) {
      return NextResponse.json({ items: FALLBACK, source: "fallback" as const });
    }

    return NextResponse.json({ items, source: "instagram" as const });
  } catch (err) {
    console.error("Instagram Graph API request failed", err);
    return NextResponse.json({ items: FALLBACK, source: "fallback" as const });
  }
}
