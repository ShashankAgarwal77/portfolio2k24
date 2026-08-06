"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   Shared blur-to-sharp reveal.

   Two entry points use this:
     · useRevealChildren — staggers a container's direct children in as they
       scroll into view (section reveals, article blocks)
     · useRevealOnMount  — reveals a single element once, on mount (page
       transitions, via template.tsx)

   Notes on the implementation choices, both of which matter:

   1. Inline styles, not a stylesheet class. Targets carry their own utility
      classes and we need to win the cascade unconditionally.

   2. The filter is CLEARED once the transition finishes, rather than left at
      blur(0px). A lingering `filter` makes an element a containing block for
      fixed descendants and can disturb `position: sticky` inside it, and this
      site has sticky card stacks and sticky nav rails. Nothing keeps a filter
      after it has finished animating.
   ───────────────────────────────────────────────────────────────────────── */

const BLUR = "blur(8px)";
const SHARP = "blur(0px)";
const DURATION_MS = 600;
const EASE = "filter 0.6s ease-out, opacity 0.6s ease-out";

/* useLayoutEffect warns during SSR; client components still render on the
   server, so fall back to useEffect there. */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Nothing may be hidden unless it can also be shown again. Browsers freeze
   transitions in a hidden document, so a page that mounts while backgrounded
   (opened in a background tab, or fetched by a crawler or screenshot service)
   would hide its content and never get the frame that reveals it. When the
   document is not visible at mount, skip the effect entirely: the content
   simply renders, which is always better than rendering blank. */
const canAnimate = () =>
  typeof document !== "undefined" &&
  document.visibilityState === "visible" &&
  !prefersReducedMotion();

const hide = (el: HTMLElement) => {
  el.style.filter = BLUR;
  el.style.opacity = "0";
  el.style.transition = EASE;
  el.style.willChange = "filter, opacity";
};

/* Animate to visible, then strip every inline style we set so the element is
   left exactly as the stylesheet intended. */
const show = (el: HTMLElement, delayMs = 0) => {
  el.style.transitionDelay = delayMs ? `${delayMs}ms` : "";
  el.style.filter = SHARP;
  el.style.opacity = "1";
  window.setTimeout(() => {
    el.style.filter = "";
    el.style.opacity = "";
    el.style.transition = "";
    el.style.transitionDelay = "";
    el.style.willChange = "";
  }, DURATION_MS + delayMs + 60);
};

const clear = (el: HTMLElement) => {
  el.style.filter = "";
  el.style.opacity = "";
  el.style.transition = "";
  el.style.transitionDelay = "";
  el.style.willChange = "";
};

/**
 * Reveals a container's direct children as they scroll into view.
 *
 * Children already on screen at mount are shown immediately and without
 * animation: the page-transition reveal is already animating them, and
 * running both produces a visible double fade.
 *
 * Opt a child out entirely with `data-reveal="off"`.
 */
export function useRevealChildren<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    if (!root || !canAnimate()) return;

    const blocks = (Array.from(root.children) as HTMLElement[]).filter(
      (el) => el.dataset.reveal !== "off"
    );
    if (blocks.length === 0) return;

    /* How far up the viewport a block must reach before it reveals. */
    const triggerLine = () => window.innerHeight * 0.88;

    let pending: HTMLElement[] = [];
    const line = triggerLine();

    blocks.forEach((el) => {
      if (el.getBoundingClientRect().top < line) return; // already on screen
      hide(el);
      pending.push(el);
    });

    if (pending.length === 0) return;

    let ticking = false;

    const check = () => {
      ticking = false;
      const l = triggerLine();
      const stillPending: HTMLElement[] = [];
      pending.forEach((el) => {
        if (el.getBoundingClientRect().top < l) show(el);
        else stillPending.push(el);
      });
      pending = stillPending;
      if (pending.length === 0) detach();
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(check);
    };

    /* Failsafe. A reveal must never be the reason content is missing. If the
       page is being printed, or is backgrounded before the reader ever
       scrolled, drop every pending block straight to visible with no
       transition. Covers print-to-PDF and headless capture, neither of which
       scrolls and both of which would otherwise photograph blank sections. */
    const revealAllNow = () => {
      pending.forEach(clear);
      pending = [];
      detach();
    };

    const detach = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("beforeprint", revealAllNow);
      document.removeEventListener("visibilitychange", onHide);
    };

    function onHide() {
      if (document.visibilityState === "hidden") revealAllNow();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("beforeprint", revealAllNow);
    document.addEventListener("visibilitychange", onHide);

    return () => {
      detach();
      blocks.forEach(clear);
    };
  }, []);

  return ref;
}

/**
 * Reveals a single element once, on mount. Used for the page transition.
 */
export function useRevealOnMount<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || !canAnimate()) return;

    hide(el);

    /* Flush the hidden state so the transition has a starting value. A rAF
       would be the usual way to wait a frame, but it never fires in a
       background tab, which would leave the page blurred until it was
       focused. A forced reflow is synchronous and visibility-independent. */
    void el.offsetHeight;
    show(el);

    return () => clear(el);
  }, []);

  return ref;
}
