"use client";

import React from "react";

/* ─────────────────────────────────────────────────────────────────────────
   MediaMarquee — a slow horizontal strip of thumbnails.

   The track holds the set twice and translates by half its width, so the
   loop is seamless with no JS. The second set is aria-hidden, since a
   screen reader should hear each item once; its images are marked
   data-lightbox="clone" so they still open on click but take no tab stop
   (an aria-hidden subtree must not contain focusable elements).

   Motion pauses on hover and on keyboard focus. Under reduced motion the
   animation is dropped entirely and the strip becomes a normal horizontal
   scroller, so the content stays reachable either way.
   ───────────────────────────────────────────────────────────────────────── */

export type MarqueeItem = {
  src: string;
  alt: string;
};

export function MediaMarquee({
  items,
  duration = "72s",
  label,
}: {
  items: MarqueeItem[];
  /** Slower is quieter. One full pass of the set. */
  duration?: string;
  label: string;
}) {
  if (items.length === 0) return null;

  return (
    <section
      className="media-marquee"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="media-marquee__viewport">
        <ul
          className="media-marquee__track"
          style={{ "--marquee-duration": duration } as React.CSSProperties}
        >
          {items.map((item) => (
            <li key={item.src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.alt} loading="lazy" />
            </li>
          ))}
          {items.map((item) => (
            <li key={`${item.src}-clone`} aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt=""
                loading="lazy"
                data-lightbox="clone"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
