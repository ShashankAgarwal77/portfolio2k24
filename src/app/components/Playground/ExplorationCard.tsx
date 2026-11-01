"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import type { Exploration } from "@/app/(content)/playground/explorations";
import { StarryAsciiPreview } from "./StarryAscii/Preview";

/* Live previews, keyed by slug. A new exploration without one falls back
   to its number set large in Gloock. */
const PREVIEWS: Record<string, (p: { active: boolean }) => React.ReactNode> = {
  "starry-night": StarryAsciiPreview,
};

export function ExplorationCard({ exploration: e }: { exploration: Exploration }) {
  const [active, setActive] = useState(false);
  const Preview = PREVIEWS[e.slug];
  return (
    <Link
      href={`/playground/${e.slug}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className="group flex flex-col gap-4 rounded-2xl outline-none"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 transition-colors group-hover:border-slate-300 group-focus-visible:border-amber-500/60 dark:border-slate-800 dark:bg-slate-950 dark:group-hover:border-slate-700 dark:group-focus-visible:border-amber-200/40">
        {Preview ? (
          <Preview active={active} />
        ) : (
          <span className="fontGloock absolute inset-0 flex items-center justify-center text-display text-slate-300 dark:text-slate-700">
            {e.number}
          </span>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-0.5 font-mono text-[11px] text-slate-500 dark:bg-slate-950/75 dark:text-slate-400">
          {e.number} · {e.date}
        </span>
      </div>
      <div className="flex flex-col gap-1.5 px-1">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-title font-semibold text-slate-800 dark:text-slate-100">{e.title}</h2>
          <ArrowUpRight
            weight="light"
            className="mt-1.5 h-5 w-5 shrink-0 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slate-800 dark:group-hover:text-amber-100"
          />
        </div>
        <p className="text-body text-slate-500 dark:text-slate-400">{e.blurb}</p>
        <ul className="mt-1 flex flex-wrap gap-1.5">
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
    </Link>
  );
}

const SKETCH = ["  .   *    .", "    ·   .    +", " .    ✦    .  "].join("\n");

export function ComingSoonCard() {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
        <pre aria-hidden className="select-none font-mono text-caption leading-tight text-slate-300 dark:text-slate-700">
          {SKETCH}
        </pre>
      </div>
      <div className="flex flex-col gap-1.5 px-1">
        <h2 className="text-title font-semibold text-slate-400 dark:text-slate-500">Next one is brewing</h2>
        <p className="text-body text-slate-400 dark:text-slate-500">
          More experiments land here as they leave the sketchbook.
        </p>
      </div>
    </div>
  );
}
