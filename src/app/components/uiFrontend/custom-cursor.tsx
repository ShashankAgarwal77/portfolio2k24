"use client";

import React from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────
   CustomCursor — a small filled dot at rest that swaps for a larger glowing
   ring over anything interactive, both following the pointer. The glow
   reuses this site's own starry-sky recipe (a bright core + a blurred
   blue-tinted halo, see glowing-stars-animation.tsx's <Glow>) rather than
   inventing a new one.

   Dot and ring are two separate elements cross-fading opacity, not one
   element animating between "filled" and "outlined" — border-color and
   background-color don't tween through a believable in-between state (you'd
   see a muddy semi-filled circle mid-transition), so swapping which layer
   is visible reads far cleaner than trying to morph one shape into the other.

   Dot and ring are solid white with mix-blend-mode: difference rather than
   theme-conditional colors — the site's light/dark toggle only tells you the
   PAGE's theme, not what's actually under the pointer at a given moment
   (case-study backdrop photos, the aurora hero, a bright chip on a dark
   card). Difference blending inverts against whatever pixel is actually
   there, so contrast holds on every surface regardless of theme. The glow
   is deliberately left un-blended (plain translucent blue) — inverting a
   soft color halo produces muddy, unpredictable colors per background,
   where the dot/ring's contrast guarantee actually matters and the glow is
   just a decorative accent.

   Desktop-only by design: mounts (and sets `cursor: none` via the
   .has-custom-cursor class below) only when the device actually has a fine
   pointer with real hover. Touch devices never get a synthetic cursor stuck
   mid-screen, and never lose their native tap affordance.
   ───────────────────────────────────────────────────────────────────────── */

const SIZE = 40; // fixed hit-box the dot/ring center inside — see note above HOVER_SCALE
const RADIUS = SIZE / 2;
const DOT_SIZE = 8;
const RING_SIZE = 16;
const HOVER_SCALE = 1.7;

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, select, textarea, summary, label, .cursor-pointer';

export function CustomCursor() {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  // A light spring so the ring trails the pointer just enough to feel alive
  // without reading as laggy. Skipped entirely under reduced motion, where
  // the ring tracks 1:1.
  const springX = useSpring(rawX, { stiffness: 800, damping: 45, mass: 0.4 });
  const springY = useSpring(rawY, { stiffness: 800, damping: 45, mass: 0.4 });
  const x = prefersReducedMotion ? rawX : springX;
  const y = prefersReducedMotion ? rawY : springY;

  React.useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    setEnabled(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  React.useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX - RADIUS);
      rawY.set(e.clientY - RADIUS);
      setVisible(true);
    };
    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      setHovered(!!target?.closest(INTERACTIVE_SELECTOR));
    };
    const onLeaveWindow = () => setVisible(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
    };
  }, [enabled, rawX, rawY]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center"
      style={{ x, y, width: SIZE, height: SIZE, opacity: visible ? 1 : 0 }}
    >
      {/* The glow — same bright-core-plus-blurred-halo idea as the site's
          twinkling stars, tinted with the same blue the stars glow with.
          Deeper/more saturated in light mode (bg-sky-500) since a pale
          glow washes out against a light page; lighter in dark mode
          (bg-sky-400) to match the stars' own glow color exactly. */}
      <motion.div
        className="absolute rounded-full bg-sky-500/70 dark:bg-sky-400/70 blur-md"
        initial={false}
        animate={{
          opacity: hovered ? 1 : 0,
          scale: hovered ? 1 : 0.6,
        }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }}
        style={{ width: 22, height: 22 }}
      />

      {/* Default state: a small filled dot, white + mix-blend-difference so
          it inverts against whatever is actually underneath. Visible at
          rest, fades out on hover. */}
      <motion.div
        className="absolute rounded-full bg-white mix-blend-difference"
        initial={false}
        animate={{ opacity: hovered ? 0 : 1, scale: hovered ? 0.4 : 1 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
        style={{ width: DOT_SIZE, height: DOT_SIZE }}
      />

      {/* Hover state: the same white + difference-blend treatment as an
          outline instead of a fill, scaled up, with the glow above.
          Invisible at rest so it never doubles up with the dot mid-transition. */}
      <motion.div
        className="absolute rounded-full border border-white mix-blend-difference"
        initial={false}
        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? HOVER_SCALE : 0.6 }}
        transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 30 }}
        style={{ width: RING_SIZE, height: RING_SIZE }}
      />
    </motion.div>
  );
}
