"use client";

import React, { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import CloudBank from "../../../../public/homepage_assets/cloud_bank.png";
import CloudWispA from "../../../../public/homepage_assets/cloud_wisp_a.png";
import CloudWispB from "../../../../public/homepage_assets/cloud_wisp_b.png";

/* ─────────────────────────────────────────────────────────────────────────
   Atmosphere — the cloud layer between the hero and the work section, and
   the thin air that hangs around the work itself.

   The page reads as one journey: night meadow → up through a cloud band →
   the work floating above the clouds. Two components carry it:

   · CloudBand — a belt of fog straddling the hero/work seam. It occupies
     zero layout height (its negative margins equal its height), so it is
     pure overlap: the bottom of the meadow and the top of the work section
     both sit behind it. Scroll drives the story — the fog builds as the
     seam approaches, then PARTS (left half slides left, right half slides
     right, the belt thins) to reveal the section heading, which keeps its
     own shimmer reveal underneath.

   · WorkAtmosphere — barely-there drifting wisps and, in dark mode, a few
     faint stars behind the showcase. Atmosphere stays BEHIND the work:
     the card, scrim, and rail are untouched, per the scannable-first rule.

   Hybrid-ready: each puff is a plain div whose visual comes entirely from
   CSS. Swapping a puff's background for a painterly cloud PNG (same
   workflow as the hero meadow) needs only a `.cloud-puff--img` variant —
   the choreography here doesn't change.

   Reduced motion: the band holds at a fixed mid opacity with no parting
   motion, and the global CSS rule freezes the drift keyframes.
   ───────────────────────────────────────────────────────────────────────── */

export function CloudBand() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  /* 0 → band's top touches the viewport bottom; 1 → band has scrolled past
     the viewport top. The fog is thickest mid-crossing, then parts. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const bandOpacity = useTransform(scrollYProgress, [0, 0.25, 0.6, 1], [0, 1, 1, 0.25]);
  const bandY = useTransform(scrollYProgress, [0, 1], ["5%", "-8%"]);
  const leftX = useTransform(scrollYProgress, [0.35, 1], ["0%", "-13%"]);
  const rightX = useTransform(scrollYProgress, [0.35, 1], ["0%", "13%"]);

  return (
    <motion.div
      ref={ref}
      data-reveal="off"
      aria-hidden="true"
      className="cloud-band"
      style={reduced ? { opacity: 0.55 } : { opacity: bandOpacity, y: bandY }}
    >
      {/* Each half: procedural puffs underneath as the haze bed, painterly
          cloud art on top carrying the visible cloudscape. The art sits in
          positioned slot divs (slot owns drift animation, image owns the
          flip) because a keyframe writing transform on the image itself
          would cancel the mirror. */}
      <motion.div
        className="cloud-band__half"
        style={reduced ? undefined : { x: leftX }}
      >
        <div className="cloud-puff cloud-puff--a" />
        <div className="cloud-puff cloud-puff--c" />
        <div className="cloud-art-slot cloud-art-slot--band-a">
          <Image src={CloudBank} alt="" sizes="60vw" draggable={false} className="cloud-art" />
        </div>
        <div className="cloud-art-slot cloud-art-slot--band-c">
          <Image src={CloudWispA} alt="" sizes="45vw" draggable={false} className="cloud-art" />
        </div>
      </motion.div>
      <motion.div
        className="cloud-band__half"
        style={reduced ? undefined : { x: rightX }}
      >
        <div className="cloud-puff cloud-puff--b" />
        <div className="cloud-puff cloud-puff--d" />
        <div className="cloud-puff cloud-puff--e" />
        <div className="cloud-art-slot cloud-art-slot--band-b">
          <Image src={CloudBank} alt="" sizes="55vw" draggable={false} className="cloud-art -scale-x-100" />
        </div>
        <div className="cloud-art-slot cloud-art-slot--band-d">
          <Image src={CloudWispB} alt="" sizes="45vw" draggable={false} className="cloud-art" />
        </div>
      </motion.div>
    </motion.div>
  );
}

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
      <div className="work-atmosphere__wisp work-atmosphere__wisp--a" />
      <div className="work-atmosphere__wisp work-atmosphere__wisp--b" />
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
