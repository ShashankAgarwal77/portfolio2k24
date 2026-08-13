"use client";

import React from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────
   CustomCursor — a small off-white ring that follows the pointer, scaling
   up with a soft glow over anything interactive. The glow reuses this
   site's own starry-sky recipe (a bright core + a blurred blue-tinted halo,
   see glowing-stars-animation.tsx's <Glow>) rather than inventing a new one.

   Desktop-only by design: mounts (and sets `cursor: none` via the
   .has-custom-cursor class below) only when the device actually has a fine
   pointer with real hover. Touch devices never get a synthetic cursor stuck
   mid-screen, and never lose their native tap affordance.
   ───────────────────────────────────────────────────────────────────────── */

const SIZE = 40; // fixed hit-box the ring centers inside — see note above HOVER_SCALE
const RADIUS = SIZE / 2;
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
          twinkling stars, tinted with the same blue the stars glow with. */}
      <motion.div
        className="absolute rounded-full bg-sky-400/70 blur-md"
        initial={false}
        animate={{
          opacity: hovered ? 1 : 0,
          scale: hovered ? 1 : 0.6,
        }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }}
        style={{ width: 22, height: 22 }}
      />

      {/* The ring itself — off-white outline, transparent center. */}
      <motion.div
        className="relative rounded-full border border-white/80"
        initial={false}
        animate={{ scale: hovered ? HOVER_SCALE : 1 }}
        transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 30 }}
        style={{ width: 16, height: 16 }}
      />
    </motion.div>
  );
}
