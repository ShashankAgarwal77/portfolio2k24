"use client";

import React, { useEffect, useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";
import {
  animate,
  motion,
  MotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/app/lib/utils";
import { useRevealChildren } from "@/app/lib/useReveal";
import { MediaLightbox } from "@/app/components/MediaLightbox";

/* ─────────────────────────────────────────────────────────────────────────
   Story — the building blocks of a case study told like a product page.

   The page is a run of chapters rather than an article: a headline, a
   visual, a line or two. Reading is optional; scanning is the default.

   Two kinds of motion, kept apart on purpose:
     · scroll-LINKED (parallax, tilt, word fill, the progress bar) is driven
       by framer's useScroll and only ever moves transforms and opacity. It
       never leaves content hidden: at any scroll position the value is
       simply wherever the scroll puts it.
     · scroll-TRIGGERED reveals reuse the site's one blur-to-sharp system
       (useRevealChildren), so these pages fade in like every other page
       and inherit its safeguards (cleared filters, hidden-tab skip,
       reduced-motion opt-out).

   Tones: "dark" chapters are full-bleed black whatever the site theme, the
   cinematic beats. "theme" chapters follow light / dark like the rest of
   the site.
   ───────────────────────────────────────────────────────────────────────── */

type Tone = "dark" | "theme";

const toneSection: Record<Tone, string> = {
  dark: "story-dark bg-black text-white",
  theme: "text-slate-900 dark:text-slate-100",
};

const toneMuted: Record<Tone, string> = {
  dark: "text-white/60",
  theme: "text-slate-600 dark:text-slate-400",
};

/* ── Progress ─────────────────────────────────────────────────────────── */

export function StoryProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return <motion.div className="story-progress" style={{ scaleX }} aria-hidden="true" />;
}

/* ── Shimmer: a light sweep through clipped text ──────────────────────── */

export function Shimmer({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("story-shimmer", className)}>{children}</span>;
}

/* ── Hero ─────────────────────────────────────────────────────────────── */

export function StoryHero({
  eyebrow,
  title,
  lede,
  meta,
  backdrop,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede: string;
  meta?: string;
  backdrop?: StaticImageData | string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "22%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.08, reduce ? 1.08 : 1.22]);
  const bgOpacity = useTransform(scrollYProgress, [0, 1], [0.5, reduce ? 0.5 : 0.1]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -140]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.75], [1, reduce ? 1 : 0]);

  return (
    <section ref={ref} className="story-dark relative flex min-h-[100svh] items-center overflow-hidden bg-black text-white">
      {backdrop && (
        <motion.div className="absolute inset-0" style={{ y: bgY, scale: bgScale, opacity: bgOpacity }} aria-hidden="true">
          <Image src={backdrop} alt="" fill priority sizes="100vw" className="object-cover" />
        </motion.div>
      )}
      <div className="story-hero__veil" aria-hidden="true" />

      <motion.div style={{ y: textY, opacity: textOpacity }} className="relative mx-auto w-full max-w-6xl px-6 py-32">
        <p className="mb-6 text-label uppercase text-white/60">{eyebrow}</p>
        <h1 className="max-w-5xl text-display font-semibold text-balance">{title}</h1>
        <p className="mt-8 max-w-2xl text-body text-white/70">{lede}</p>
        {meta && <p className="mt-6 text-caption text-white/50">{meta}</p>}
      </motion.div>

      <div className="story-scroll-cue" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}

/* ── Count-up numbers ─────────────────────────────────────────────────── */

function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    const target = Number(value.replace(/,/g, ""));
    if (!el || !Number.isFinite(target) || target === 0) return;
    if (document.visibilityState !== "visible") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Already on screen: leave the final number, never flash it back to 0.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setDisplay("0");
    let stop: (() => void) | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const controls = animate(0, target, {
          duration: 1.4,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: (v) => setDisplay(Math.round(v).toLocaleString("en-US")),
        });
        stop = () => controls.stop();
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop?.();
      setDisplay(value);
    };
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}

export function StatBand({ stats, tone = "theme" }: { stats: { value: string; label: string }[]; tone?: Tone }) {
  const ref = useRevealChildren<HTMLDivElement>();
  return (
    <section className={cn("px-6 py-20", toneSection[tone])}>
      <div ref={ref} className="mx-auto grid max-w-6xl grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="story-stat font-semibold">
              <CountUp value={s.value} />
            </p>
            <p className={cn("mt-2 text-caption", toneMuted[tone])}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Word fill: a statement that lights up as you scroll through it ───── */

function Word({ progress, range, children }: { progress: MotionValue<number>; range: [number, number]; children: string }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {children}{" "}
    </motion.span>
  );
}

export function FillText({ id, text, tone = "theme", eyebrow }: { id?: string; text: string; tone?: Tone; eyebrow?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");

  return (
    <section id={id} className={cn("px-6 py-32 md:py-44", toneSection[tone])}>
      <div className="mx-auto max-w-5xl">
        {eyebrow && <p className={cn("mb-8 text-label uppercase", toneMuted[tone])}>{eyebrow}</p>}
        <p ref={ref} className="text-headline font-semibold text-balance">
          {reduce
            ? text
            : words.map((w, i) => (
                <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
                  {w}
                </Word>
              ))}
        </p>
      </div>
    </section>
  );
}

/* ── Chapter: eyebrow, big title, a line or two, then anything ────────── */

export function Chapter({
  id,
  eyebrow,
  title,
  lede,
  tone = "theme",
  align = "left",
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  tone?: Tone;
  align?: "left" | "center";
  children?: React.ReactNode;
}) {
  const ref = useRevealChildren<HTMLDivElement>();
  return (
    <section id={id} className={cn("scroll-mt-0 px-6 py-24 md:py-36", toneSection[tone])}>
      <div ref={ref} className={cn("mx-auto max-w-6xl", align === "center" && "text-center")}>
        {eyebrow && <p className={cn("mb-5 text-label uppercase", toneMuted[tone])}>{eyebrow}</p>}
        <h2 className={cn("max-w-4xl text-headline font-semibold text-balance", align === "center" && "mx-auto")}>{title}</h2>
        {lede && <p className={cn("mt-6 max-w-2xl text-body", toneMuted[tone], align === "center" && "mx-auto")}>{lede}</p>}
        {children && <div className="mt-16">{children}</div>}
      </div>
    </section>
  );
}

/* ── Parallax screenshot: rises, flattens and settles as it scrolls in ── */

export function ParallaxShot({
  src,
  alt,
  caption,
  tone = "theme",
  width = 2880,
  height = 1800,
}: {
  src: string;
  alt: string;
  caption?: string;
  tone?: Tone;
  width?: number;
  height?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 22, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.86, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 60, 0]);

  return (
    <figure ref={ref} className="story-shot">
      <motion.div style={{ rotateX, scale, y, transformPerspective: 1400 }} className="story-shot__frame">
        <Image src={src} alt={alt} width={width} height={height} sizes="(min-width: 1280px) 72rem, 100vw" className="h-auto w-full" />
      </motion.div>
      {caption && <figcaption className={cn("mx-auto mt-6 max-w-2xl text-center text-caption", toneMuted[tone])}>{caption}</figcaption>}
    </figure>
  );
}

/* ── Detail close-up: the image drifts inside its frame ───────────────── */

export function DetailZoom({
  src,
  alt,
  caption,
  tone = "theme",
  aspect = "aspect-[4/3]",
  position = "object-top",
}: {
  src: string | StaticImageData;
  alt: string;
  caption?: string;
  tone?: Tone;
  aspect?: string;
  /** object-position: which edge to keep when the frame crops. */
  position?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-7%", "7%"]);

  return (
    <figure>
      <div ref={ref} className={cn("story-detail relative overflow-hidden rounded-3xl", aspect)}>
        <motion.div className="absolute inset-x-0 -inset-y-[8%]" style={{ y }}>
          <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 40rem, 100vw" className={cn("object-cover", position)} />
        </motion.div>
      </div>
      {caption && <figcaption className={cn("mt-4 text-caption", toneMuted[tone])}>{caption}</figcaption>}
    </figure>
  );
}

/* ── Sticky steps: the picture holds still while the steps scroll past ─ */

export type StoryStep = {
  eyebrow: string;
  title: string;
  body: string;
  src: string;
  alt: string;
};

export function StickySteps({ steps, tone = "dark" }: { steps: StoryStep[]; tone?: Tone }) {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* The active step is the last one whose centre has risen past 65% of the
     viewport height,
     worked out from the scroll position itself rather than an observer, so
     a fast jump (anchor link, scrollbar drag) can never skip a step. */
  useEffect(() => {
    const pick = () => {
      const line = window.innerHeight * 0.65;
      let best = 0;
      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top + r.height / 2 <= line) best = i;
      });
      setActive(best);
    };
    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, []);

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <div>
        {steps.map((s, i) => (
          <div
            key={s.title}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            data-step={i}
            className={cn(
              "flex flex-col justify-center py-10 transition-opacity duration-500 lg:min-h-[70vh] lg:py-0",
              active === i ? "opacity-100" : "lg:opacity-30"
            )}
          >
            <p className={cn("mb-3 text-label uppercase", toneMuted[tone])}>
              {String(i + 1).padStart(2, "0")} · {s.eyebrow}
            </p>
            <h3 className="text-title font-semibold text-balance">{s.title}</h3>
            <p className={cn("mt-4 max-w-md text-body", toneMuted[tone])}>{s.body}</p>
            {/* Below lg the picture sits with its step instead of sticking. */}
            <div className="story-shot__frame mt-8 lg:hidden">
              <Image src={s.src} alt={s.alt} width={2880} height={1800} sizes="100vw" className="h-auto w-full" />
            </div>
          </div>
        ))}
      </div>

      <div className="hidden lg:block">
        <div className="sticky top-[15vh]">
          <div className="story-shot__frame relative aspect-[16/10]">
            {steps.map((s, i) => (
              <Image
                key={s.src}
                src={s.src}
                alt={active === i ? s.alt : ""}
                aria-hidden={active === i ? undefined : true}
                fill
                sizes="(min-width: 1280px) 42rem, 60vw"
                className={cn(
                  "object-cover object-top transition-[opacity,transform] duration-700 ease-out",
                  active === i ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"
                )}
              />
            ))}
          </div>
          <div className="mt-6 flex gap-2" aria-hidden="true">
            {steps.map((s, i) => (
              <span key={s.title} className={cn("h-1 flex-1 rounded-full transition-colors duration-500", active >= i ? "bg-white" : "bg-white/20")} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Cards: variants, tiles, rules ────────────────────────────────────── */

export function Cards({
  items,
  tone = "theme",
  columns = 3,
}: {
  items: { label?: string; title: string; body?: string; highlight?: string }[];
  tone?: Tone;
  columns?: 2 | 3 | 4;
}) {
  const ref = useRevealChildren<HTMLDivElement>();
  const cols = { 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <div ref={ref} className={cn("grid gap-4", cols)}>
      {items.map((c) => (
        <div key={c.title} className={cn("story-card", tone === "dark" && "story-card--dark", c.highlight && "story-card--chosen")}>
          <div className="mb-6 flex items-center justify-between gap-3">
            {c.label && <p className={cn("text-label uppercase", toneMuted[tone])}>{c.label}</p>}
            {c.highlight && <span className="story-pill">{c.highlight}</span>}
          </div>
          <p className="text-title font-semibold text-balance">{c.title}</p>
          {c.body && <p className={cn("mt-3 text-caption", toneMuted[tone])}>{c.body}</p>}
        </div>
      ))}
    </div>
  );
}

/* ── Rank ladder: the chain of command, senior first ──────────────────── */

export function RankLadder({ ranks, tone = "theme" }: { ranks: string[]; tone?: Tone }) {
  const ref = useRevealChildren<HTMLOListElement>();
  return (
    <ol ref={ref} className="flex flex-wrap items-center gap-2">
      {ranks.map((r, i) => (
        <li key={r} className="flex items-center gap-2">
          <span className={cn("story-rank", tone === "dark" && "story-rank--dark")} style={{ opacity: 1 - i * 0.09 }}>
            {r}
          </span>
          {i < ranks.length - 1 && <span className={cn("text-caption", toneMuted[tone])}>›</span>}
        </li>
      ))}
    </ol>
  );
}

/* ── Big number: one figure carries the whole beat ────────────────────── */

export function BigNumber({ value, label, tone = "theme" }: { value: string; label: string; tone?: Tone }) {
  return (
    <div>
      <p className="story-bignum font-semibold">
        <Shimmer>
          <CountUp value={value} />
        </Shimmer>
      </p>
      <p className={cn("mt-4 max-w-md text-body", toneMuted[tone])}>{label}</p>
    </div>
  );
}

/* ── Split: text on one side, a visual on the other ───────────────────── */

export function Split({ children, visual, reverse }: { children: React.ReactNode; visual: React.ReactNode; reverse?: boolean }) {
  return (
    <div className={cn("grid items-center gap-12 lg:grid-cols-2 lg:gap-20", reverse && "lg:[&>*:first-child]:order-2")}>
      <div>{children}</div>
      <div>{visual}</div>
    </div>
  );
}

/* ── Openable: every image inside opens full size on click ────────────── */

export function Openable({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <>
      <div ref={ref} className={cn("media-openable", className)}>
        {children}
      </div>
      <MediaLightbox containerRef={ref} />
    </>
  );
}
