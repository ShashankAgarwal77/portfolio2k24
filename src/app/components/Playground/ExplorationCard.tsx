"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import type { Exploration } from "@/app/(content)/playground/explorations";
import { StarryAsciiPreview } from "./StarryAscii/Preview";

/* Live previews, keyed by slug. A new exploration without one falls back
   to its number set large in Gloock. */
const PREVIEWS: Record<string, (p: { active: boolean }) => React.ReactNode> = {
  "starry-night": StarryAsciiPreview,
};

/* ─────────────────────────────────────────────────────────────────────────
   ExplorationStack — the Playground index as a deck of cards on scroll.
   Each card pins in its own full-height slot; the next card slides up over
   it while the one underneath eases back (scale) and dims (an overlay's
   opacity). Transform/opacity only — no filter — so nothing becomes a
   containing block for the sticky slots.
   ───────────────────────────────────────────────────────────────────────── */

type Card = { kind: "exploration"; exploration: Exploration } | { kind: "soon" };

export function ExplorationStack({ explorations }: { explorations: Exploration[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const cards: Card[] = [
    ...explorations.map((exploration) => ({ kind: "exploration" as const, exploration })),
    { kind: "soon" as const },
  ];
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <div ref={ref} className="relative">
      {cards.map((card, i) => (
        <StackSlot key={i} index={i} total={cards.length} progress={scrollYProgress}>
          {card.kind === "exploration" ? (
            <ExplorationCard exploration={card.exploration} />
          ) : (
            <ComingSoonCard />
          )}
        </StackSlot>
      ))}
    </div>
  );
}

function StackSlot({
  index,
  total,
  progress,
  children,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  children: React.ReactNode;
}) {
  /* A card starts receding once the stack scrolls past it, and ends smaller
     the deeper it sits under the cards that land on top. */
  const start = index / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - 1 - index) * 0.05]);
  const shade = useTransform(progress, [start, 1], [0, Math.min(0.5, (total - 1 - index) * 0.25)]);

  return (
    <div className="sticky top-0 flex h-[100svh] items-center justify-center">
      <motion.div
        style={{ scale, top: `calc(${index} * 1.5rem)` }}
        className="relative w-full origin-top"
      >
        {children}
        <motion.div
          aria-hidden
          style={{ opacity: shade }}
          className="pointer-events-none absolute inset-0 rounded-3xl bg-slate-100 dark:bg-slate-950"
        />
      </motion.div>
    </div>
  );
}

const cardShell =
  "flex h-[72svh] max-h-[640px] min-h-[460px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_60px_-28px_rgb(2_6_23/0.25)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-[0_24px_60px_-28px_rgb(0_0_0/0.8)] md:flex-row";

export function ExplorationCard({ exploration: e }: { exploration: Exploration }) {
  const ref = useRef<HTMLAnchorElement>(null);
  /* The front card's preview runs on its own; hover/focus also wakes it. */
  const inView = useInView(ref, { amount: 0.6 });
  const [hover, setHover] = useState(false);
  const Preview = PREVIEWS[e.slug];
  return (
    <Link
      ref={ref}
      href={`/playground/${e.slug}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className={`group outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 ${cardShell} rounded-3xl`}
    >
      <div className="relative min-h-0 flex-1 bg-slate-100 dark:bg-slate-950 md:flex-[1.6]">
        {Preview ? (
          <Preview active={inView || hover} />
        ) : (
          <span className="fontGloock absolute inset-0 flex items-center justify-center text-display text-slate-300 dark:text-slate-700">
            {e.number}
          </span>
        )}
      </div>
      <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200 p-6 dark:border-slate-800 md:w-[34%] md:justify-between md:border-l md:border-t-0 md:p-8">
        <div className="flex flex-col gap-3">
          <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
            {e.number} · {e.date}
          </span>
          <h2 className="text-title font-semibold text-slate-800 dark:text-slate-100">{e.title}</h2>
          <p className="text-body text-slate-500 dark:text-slate-400">{e.blurb}</p>
          <ul className="flex flex-wrap gap-1.5">
            {e.tags.map((t) => (
              <li
                key={t}
                className="rounded-full border border-slate-200 px-2.5 py-0.5 text-caption text-slate-500 dark:border-slate-800 dark:text-slate-400"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
        <span className="inline-flex items-center gap-1.5 text-caption font-medium text-slate-700 dark:text-slate-200">
          Open exploration
          <ArrowUpRight
            weight="light"
            className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:group-hover:text-amber-100"
          />
        </span>
      </div>
    </Link>
  );
}

const SKETCH = ["  .   *    .", "    ·   .    +", " .    ✦    .  "].join("\n");

export function ComingSoonCard() {
  return (
    <div className={cardShell}>
      <div className="relative flex min-h-0 flex-1 items-center justify-center bg-slate-50 dark:bg-slate-900/40 md:flex-[1.6]">
        <pre aria-hidden className="select-none font-mono text-body leading-tight text-slate-300 dark:text-slate-700">
          {SKETCH}
        </pre>
      </div>
      <div className="flex shrink-0 flex-col gap-3 border-t border-dashed border-slate-200 p-6 dark:border-slate-800 md:w-[34%] md:justify-center md:border-l md:border-t-0 md:p-8">
        <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">next</span>
        <h2 className="text-title font-semibold text-slate-400 dark:text-slate-500">Next one is brewing</h2>
        <p className="text-body text-slate-400 dark:text-slate-500">
          More experiments land here as they leave the sketchbook.
        </p>
      </div>
    </div>
  );
}
