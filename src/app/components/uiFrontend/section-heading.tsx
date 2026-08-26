"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { useIsomorphicLayoutEffect } from "@/app/lib/useReveal";

/* ─────────────────────────────────────────────────────────────────────────
   SectionHeading — a section heading that arrives with the same shimmer
   fade the hero headline uses: each word fades up from nothing while a
   soft white glow blooms behind it, one word after the next.

   The recipe (opacity 0 → 1 with textShadow none → a 10px white glow, one
   second per word, staggered by 0.2s) is lifted verbatim from
   TextGenerateEffect so the two headings read as the same gesture. What is
   different here is deliberate:

     · a real <h2>, taking the Title role — the Headline role belongs to
       the hero's H1 alone, one per page (DESIGN.md §3);
     · no Gloock emphasis word. The hero already spends the site's single
       serif flourish; a second one on the same page would spend it twice
       (the One-Word Serif Rule).

   Nothing here can strand the text invisible. The default render is plain,
   visible markup; the animated version only replaces it once the document
   is confirmed to be rendering, so a crawler, a print, or a tab that never
   paints gets a readable heading instead of a blank line. Swapping in a
   layout effect keeps that exchange ahead of first paint, and the word
   spans mount fresh at that point, which is what lets their `initial`
   apply at all — framer only reads it when a motion element mounts.
   ───────────────────────────────────────────────────────────────────────── */

/** The hero's glow, to the pixel — this is the "shimmer" half of the effect. */
const GLOW = "0 0 10px rgba(255,255,255,0.7)";
const WORD_DURATION = 1;
const WORD_STAGGER = 0.2;

export function SectionHeading({
  text,
  className,
}: {
  text: string;
  /** Type role and colour come from the caller; motion comes from here. */
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const ref = React.useRef<HTMLHeadingElement>(null);
  const [armed, setArmed] = React.useState(false);
  const [shown, setShown] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const arm = () => {
      if (document.visibilityState !== "visible") return false;
      setArmed(true);
      return true;
    };
    if (arm()) return;

    /* Mounted in a tab that is not on screen — a middle-click or a
       "open in new tab" from somewhere else. That is not the same as a
       page that will never render, so wait for the tab rather than
       giving up the effect: whoever opened it still deserves the
       animation when they get to it. Anything that never becomes
       visible simply keeps the plain heading. */
    const onVisible = () => {
      if (arm()) document.removeEventListener("visibilitychange", onVisible);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [prefersReducedMotion]);

  React.useEffect(() => {
    const el = ref.current;
    if (!armed || !el) return;
    /* A low threshold on purpose: the words start faded out, and a
       demanding ratio is how a reveal ends up never firing. */
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed]);

  if (!armed) {
    return (
      <h2 ref={ref} className={className}>
        {text}
      </h2>
    );
  }

  return (
    <h2 ref={ref} className={className}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, textShadow: "none" }}
          animate={
            shown
              ? { opacity: 1, textShadow: GLOW }
              : { opacity: 0, textShadow: "none" }
          }
          transition={{
            duration: WORD_DURATION,
            delay: shown ? i * WORD_STAGGER : 0,
          }}
          /* inline-block keeps each word a single shimmering unit rather
             than letting a line break split one mid-glow; whitespace-pre
             preserves the space that inline-block would otherwise eat. */
          className={cn("inline-block whitespace-pre")}
        >
          {word}{" "}
        </motion.span>
      ))}
    </h2>
  );
}
