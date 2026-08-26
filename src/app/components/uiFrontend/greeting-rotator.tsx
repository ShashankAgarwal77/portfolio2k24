"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────
   GreetingRotator — the hero's "Hi", cycling through greetings from
   around the world, all transliterated in Latin script. Each word rolls
   in from below as the previous rolls up and out (the site scrolls down
   through its world; the greetings rise up through theirs).

   The wrapper is a framer layout container so the line's width eases
   smoothly between words of different lengths instead of snapping —
   "I'm Shashank Agarwal" glides rather than jumps.

   Reduced motion: a static "Hi", no timer at all.
   ───────────────────────────────────────────────────────────────────────── */

const GREETINGS = [
  "Hi", // English
  "Namaste", // Hindi
  "Bonjour", // French
  "Hola", // Spanish
  "Hallo", // German
  "Dia dhuit", // Irish
  "Hej", // Danish
  "Ciao", // Italian
  "Olá", // Portuguese
];

const HOLD_MS = 2400;

export function GreetingRotator() {
  const reduced = useReducedMotion() ?? false;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => {
      /* Hidden tabs skip ahead silently otherwise — hold the word. */
      if (document.visibilityState === "hidden") return;
      setIndex((v) => (v + 1) % GREETINGS.length);
    }, HOLD_MS);
    return () => window.clearInterval(timer);
  }, [reduced]);

  if (reduced) return <span>Hi</span>;

  return (
    <motion.span
      layout
      transition={{ layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
      className="inline-flex overflow-hidden align-bottom"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={GREETINGS[index]}
          initial={{ y: "115%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-115%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block whitespace-nowrap"
        >
          {GREETINGS[index]}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}
