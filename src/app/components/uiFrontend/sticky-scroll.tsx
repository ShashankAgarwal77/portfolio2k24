"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Reveal — subtle upward slide + fade as the block enters the viewport.
 * Honours prefers-reduced-motion: when motion is off, content renders fully
 * visible with no transform (never gated blank behind an animation).
 */
function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "p" | "section";
}) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  const variants: Variants = reduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.4 } },
      }
    : {
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: EASE, delay },
        },
      };

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
    >
      {children}
    </MotionTag>
  );
}

function Chapter({
  index,
  title,
  children,
}: {
  index: string;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Reveal as="section" className="mx-auto w-full max-w-[68ch]">
      <div className="flex items-baseline gap-x-4">
        <span className="select-none text-sm font-medium tabular-nums tracking-widest text-slate-400 dark:text-slate-500">
          {index}
        </span>
        <h3 className="text-[clamp(1.5rem,3.2vw,2.5rem)] font-bold leading-[1.15] tracking-tight text-balance text-slate-700 dark:text-slate-100">
          {title}
        </h3>
      </div>
      <div className="mt-5 space-y-5 text-base lg:text-lg leading-relaxed text-slate-500 dark:text-slate-300">
        {children}
      </div>
    </Reveal>
  );
}

export function StickyScrollRevealDemo() {
  return (
    <div className="flex flex-col gap-y-12 lg:gap-y-16 pt-6">
      {/* Dek — sets the first-person tone before the chapters begin. */}
      <Reveal as="p" className="mx-auto w-full max-w-[68ch] text-lg lg:text-xl leading-relaxed text-slate-500 dark:text-slate-300">
        Every designer has an origin story. Mine runs through engineering
        lecture halls, a pandemic full of half-broken AR prototypes, and a long
        chase after why{" "}
        <span className="fontGloock italic text-slate-700 dark:text-slate-100">
          craft
        </span>{" "}
        is worth it. Here is how the pieces came together.
      </Reveal>

      {/* 1 — It started with code. */}
      <Chapter index="01" title="It started with code.">
        <p>
          I graduated in computer science from Galgotias in 2022, hooked on one
          thing — watching a few lines of code turn into something you can see
          and touch on screen. That small magic trick, text becoming interface,
          never stopped feeling like a superpower.
        </p>
      </Chapter>

      {/* 2 — But I wanted to shape it. */}
      <Chapter index="02" title="But I wanted to shape it.">
        <p>
          Engineering taught me the <em className="not-italic font-medium text-slate-700 dark:text-slate-200">how</em>;
          design was the <em className="not-italic font-medium text-slate-700 dark:text-slate-200">why</em>. So I
          taught myself UX — chasing craft and real impact instead of waiting
          for the industry to catch up. The more I built, the more I wanted a
          say in what got built in the first place.
        </p>
      </Chapter>

      {/* 3 — AR was my proving ground. */}
      <Chapter index="03" title="AR was my proving ground.">
        <p>
          During the pandemic I threw myself into AR design-and-build
          competitions. A lot of failures, a few wins — including top 50 of
          10,000+ at Facebook&apos;s School of Innovation — and I was all in.
          Constraints, deadlines, and a webcam were enough to teach me how to
          ship.
        </p>
      </Chapter>

      {/* 4 — Now I design with AI in the loop. */}
      <Chapter index="04" title="Now I design with AI in the loop.">
        <p>
          Today I pair design craft with AI — shipping production-ready
          frontends with Claude Code and moving products from problem to prod in
          a fraction of the usual time. The tools changed; the obsession with
          getting the details right did not.
        </p>
      </Chapter>

      {/* 5 — At national scale. */}
      <Chapter index="05" title="At national scale.">
        <p>
          I now lead UX for platforms used across India&apos;s government —
          including aviation security for the Ministry of Civil Aviation — and
          build the design systems that keep AI-generated UI on the rails. From
          a single line of code to systems a country runs on, the throughline
          has always been the same: make it real, make it work, make it careful.
        </p>
      </Chapter>
    </div>
  );
}
