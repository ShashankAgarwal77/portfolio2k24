"use client";

import React from "react";
import { MistBackground } from "./mist-background";

/* ─────────────────────────────────────────────────────────────────────────
   WorkAtmosphere — the case-study section's environment.

   A WebGL FBM mist (mist-background.tsx) is the section's background:
   its top edge is mask-feathered into the hero's meadow so the mist
   reads as having drifted down out of the hero scene, and its base
   color is the page background so it dissolves seamlessly at every
   edge. A few faint hand-seated stars twinkle over it in dark mode.
   Everything is decorative and pointer-transparent; the section's
   content wrapper carries `relative` so it paints above this layer.

   (History, so it isn't re-tried: gradient fog plumes and painterly
   cloud PNGs both lived here before — the clouds lagged deployed
   hardware, the plume choreography read as artificial. The shader mist
   replaced both.)
   ───────────────────────────────────────────────────────────────────────── */

/* Star seats: [left %, top %, scale, twinkle delay s]. Hand-placed to hug
   the section's edges — the middle belongs to the showcase card. */
const STAR_SEATS: [number, number, number, number][] = [
  [4, 12, 1, 0],
  [9, 38, 0.7, 1.3],
  [6, 74, 0.85, 2.6],
  [13, 90, 0.6, 0.8],
  [88, 8, 0.9, 1.9],
  [94, 30, 0.65, 3.2],
  [91, 62, 1, 0.4],
  [96, 84, 0.7, 2.1],
  [48, 4, 0.6, 1.1],
  [30, 6, 0.8, 2.9],
  [68, 5, 0.7, 0.2],
];

export function WorkAtmosphere() {
  return (
    <div aria-hidden="true" className="work-atmosphere">
      <MistBackground />
      <div className="work-atmosphere__stars">
        {STAR_SEATS.map(([x, y, s, d], i) => (
          <span
            key={i}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: `scale(${s})`,
              animationDelay: `${d}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
