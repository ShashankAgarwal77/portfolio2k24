"use client";

import React from "react";

/* ─────────────────────────────────────────────────────────────────────────
   Annotated — a screenshot with numbered markers and a matching legend.

   The point is to stop describing an interface in prose. A claim pinned to
   the pixel that proves it is read faster than a paragraph making the same
   claim, and it cannot drift out of sync with the product the way prose can.

   Marker positions are percentages of the image box, so they hold at every
   width. The image keeps its lightbox behaviour; markers sit above it and
   pass clicks through so the whole figure stays openable.
   ───────────────────────────────────────────────────────────────────────── */

export type Marker = {
  /** Percentage across the image, 0 to 100. */
  x: number;
  /** Percentage down the image, 0 to 100. */
  y: number;
  /** The claim this marker pins. Keep it to a line. */
  note: string;
};

export function Annotated({
  src,
  alt,
  markers,
  caption,
}: {
  src: string;
  alt: string;
  markers: Marker[];
  caption?: string;
}) {
  return (
    <figure className="annotated">
      <div className="annotated__frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} />
        {markers.map((marker, i) => (
          <span
            key={marker.note}
            className="annotated__marker"
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
            aria-hidden="true"
          >
            {i + 1}
          </span>
        ))}
      </div>

      <figcaption>
        <ol className="annotated__legend">
          {markers.map((marker, i) => (
            <li key={marker.note}>
              <span className="annotated__num">{i + 1}</span>
              <span>{marker.note}</span>
            </li>
          ))}
        </ol>
        {caption && <p className="annotated__caption">{caption}</p>}
      </figcaption>
    </figure>
  );
}
