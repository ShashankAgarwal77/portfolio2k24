"use client";

import React from "react";

/* ─────────────────────────────────────────────────────────────────────────
   CustomCursor — a small filled dot at rest that swaps for a larger glowing
   ring over anything interactive, both following the pointer. The glow
   reuses this site's own starry-sky recipe (a bright core + a blurred
   blue-tinted halo) rather than inventing a new one.

   Zero framework in the hot path, by design. The transform is written
   synchronously in the mousemove handler, so the compositor picks it up
   the same frame — a motion-value/rAF pipeline (the previous build)
   batches the write to the NEXT frame, and with the native cursor hidden
   that one frame reads as lag. Hover and visibility flips are classList
   toggles driven by refs, so pointer movement never re-renders React;
   the dot/ring/glow cross-fades are plain CSS transitions
   (globals.css, .custom-cursor* rules).

   Dot and ring are two separate elements cross-fading opacity, not one
   element animating between "filled" and "outlined" — border-color and
   background-color don't tween through a believable in-between state, so
   swapping which layer is visible reads far cleaner than morphing.

   Dot and ring are solid white with mix-blend-mode: difference rather than
   theme-conditional colors — the site's light/dark toggle only tells you
   the PAGE's theme, not what's actually under the pointer. Difference
   blending inverts against whatever pixel is actually there, so contrast
   holds on every surface. The glow stays un-blended (translucent blue) —
   inverting a soft halo produces muddy colors per background.

   Desktop-only by design: mounts (and sets `cursor: none` via the
   .has-custom-cursor class) only when the device has a fine pointer with
   real hover. Touch devices never get a synthetic cursor stuck mid-screen.
   ───────────────────────────────────────────────────────────────────────── */

const SIZE = 40; // fixed hit-box the dot/ring center inside
const RADIUS = SIZE / 2;

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, select, textarea, summary, label, .cursor-pointer';

export function CustomCursor() {
  const [enabled, setEnabled] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    setEnabled(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  React.useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    if (!root) return;

    document.documentElement.classList.add("has-custom-cursor");

    let visible = false;
    let hovered = false;

    const onMove = (e: MouseEvent) => {
      root.style.transform = `translate3d(${e.clientX - RADIUS}px, ${e.clientY - RADIUS}px, 0)`;
      if (!visible) {
        visible = true;
        root.style.opacity = "1";
      }
    };
    const onOver = (e: MouseEvent) => {
      const h = !!(e.target as Element | null)?.closest(INTERACTIVE_SELECTOR);
      if (h !== hovered) {
        hovered = h;
        root.classList.toggle("custom-cursor--hover", h);
      }
    };
    const onLeaveWindow = () => {
      visible = false;
      root.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="custom-cursor"
      style={{ width: SIZE, height: SIZE }}
    >
      <span className="custom-cursor__glow" />
      <span className="custom-cursor__dot" />
      <span className="custom-cursor__ring" />
    </div>
  );
}
