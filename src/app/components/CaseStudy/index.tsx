"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/app/lib/utils";
import { BentoGrid, BentoGridItem } from "../Animations/bento-grids";

/* ─────────────────────────────────────────────────────────────────────────
   Case Study wrapper components for MDX pages.
   All visual styling lives here so prose stays clean.
   ───────────────────────────────────────────────────────────────────────── */

/* CaseStudyHero — top of the page, sets stakes & metadata */
export function CaseStudyHero({
  client,
  role,
  timeframe,
  audience,
  headline,
  kicker,
}: {
  client: string;
  role: string;
  timeframe: string;
  audience?: string;
  headline: string;
  kicker?: string;
}) {
  return (
    <header className="pt-24 md:pt-32 pb-12 md:pb-16">
      {kicker && (
        <p className="mb-4 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          {kicker}
        </p>
      )}
      <h1 className="mb-10 text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400">
        {headline}
      </h1>
      <dl className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 mt-12">
        <Meta label="Client" value={client} />
        <Meta label="Role" value={role} />
        <Meta label="Timeframe" value={timeframe} />
        {audience && <Meta label="Written for" value={audience} />}
      </dl>
    </header>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] md:text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 mb-2">
        {label}
      </dt>
      <dd className="text-sm md:text-base font-medium text-slate-900 dark:text-slate-100 leading-snug">
        {value}
      </dd>
    </div>
  );
}

/* TLDR — legacy single-card variant (kept for backwards compat) */
export function TLDR({ children }: { children: React.ReactNode }) {
  return (
    <aside className="my-16 md:my-20 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/60 dark:bg-slate-900/40 backdrop-blur p-6 md:p-8">
      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-3">
        TL;DR
      </p>
      <div className="text-base md:text-lg leading-relaxed text-slate-800 dark:text-slate-200 [&>p]:mb-3 last:[&>p]:mb-0">
        {children}
      </div>
    </aside>
  );
}

/* TLDRBento — bento-grid TL;DR built on the site's BentoGrid primitive. */
type TLDRItem = {
  label: string;
  title: string;
  body?: string;
  size: "hero" | "wide" | "small";
  tone?: "default" | "primary";
};

export function TLDRBento({ items }: { items: TLDRItem[] }) {
  return (
    <section className="my-16 md:my-20">
      <div className="mb-6 flex items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          TL;DR
        </span>
        <span className="h-px flex-1 bg-slate-200 dark:bg-white/[0.08]" />
      </div>
      <BentoGrid className="md:auto-rows-auto">
        {items.map((item) => (
          <BentoGridItem
            key={item.label}
            title={item.title}
            description={item.body}
            header={<TLDRHeader label={item.label} tone={item.tone ?? "default"} />}
            className={cn(
              "!p-5 md:!p-6 !space-y-3 dark:!border-white/[0.08] !justify-start",
              item.size === "hero" ? "md:col-span-2" : "md:col-span-1"
            )}
          />
        ))}
      </BentoGrid>
    </section>
  );
}

function TLDRHeader({
  label,
  tone,
}: {
  label: string;
  tone: "default" | "primary";
}) {
  if (tone === "primary") {
    return (
      <div className="relative flex w-full min-h-[6rem] rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-white/[0.08]">
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-indigo-500/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-rose-500/25 blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.18] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative flex items-end p-4 w-full">
          <span className="text-[10px] uppercase tracking-[0.22em] text-slate-200">
            {label}
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className="relative flex w-full min-h-[6rem] rounded-xl bg-dot-black/[0.2] dark:bg-dot-white/[0.15] [mask-image:radial-gradient(ellipse_at_center,white,transparent)] border border-transparent dark:border-white/[0.05] bg-neutral-100 dark:bg-black overflow-hidden">
      <div className="relative flex items-end p-4 w-full">
        <span className="text-[10px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
          {label}
        </span>
      </div>
    </div>
  );
}

/* StatGrid — anchor stats up top */
export function StatGrid({
  items,
}: {
  items: Array<{ label: string; value: string; sublabel?: string }>;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 my-16 md:my-20">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-slate-200 dark:border-white/[0.08] p-6 bg-white/40 dark:bg-slate-900/30"
        >
          <p className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 mb-2 leading-none">
            {item.value}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug">
            {item.label}
          </p>
          {item.sublabel && (
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
              {item.sublabel}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

/* Pullquote — large emphasized statement */
export function Pullquote({
  children,
  attribution,
}: {
  children: React.ReactNode;
  attribution?: string;
}) {
  return (
    <figure className="my-16 md:my-20">
      <blockquote className="border-l-2 border-slate-900 dark:border-slate-100 pl-6 md:pl-8">
        <p className="text-xl md:text-2xl lg:text-3xl font-medium leading-snug tracking-tight text-slate-900 dark:text-slate-100 italic">
          {children}
        </p>
      </blockquote>
      {attribution && (
        <figcaption className="mt-4 pl-6 md:pl-8 text-sm text-slate-500 dark:text-slate-400">
          — {attribution}
        </figcaption>
      )}
    </figure>
  );
}

/* MediaFrame — image / video / placeholder slot */
export function MediaFrame({
  src,
  alt,
  caption,
  aspect = "16/9",
  placeholder,
}: {
  src?: string;
  alt?: string;
  caption?: string;
  aspect?: "16/9" | "4/3" | "1/1" | "21/9";
  placeholder?: string;
}) {
  const aspectClass = {
    "16/9": "aspect-[16/9]",
    "4/3": "aspect-[4/3]",
    "1/1": "aspect-square",
    "21/9": "aspect-[21/9]",
  }[aspect];

  return (
    <figure className="my-16 md:my-20">
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800",
          aspectClass
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt ?? ""}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 max-w-md">
              {placeholder ?? "Asset placeholder"}
            </p>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-slate-500 dark:text-slate-400 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* TradeoffTable — option cards. The "Chosen" indicator floats so it
   never breaks the title's wrapping. */
export function TradeoffTable({
  options,
}: {
  options: Array<{ name: string; pro: string; con: string; verdict?: string }>;
}) {
  return (
    <div className="my-16 md:my-20 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
      {options.map((opt) => {
        const isChosen = opt.verdict === "chosen";
        return (
          <div
            key={opt.name}
            className={cn(
              "relative rounded-2xl border p-6 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1",
              isChosen
                ? "border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-900/60 shadow-lg dark:shadow-slate-950/50"
                : "border-slate-200 dark:border-white/[0.08] bg-white/40 dark:bg-slate-900/20"
            )}
          >
            {isChosen && (
              <span className="absolute top-4 right-4 text-[9px] uppercase tracking-[0.18em] text-slate-100 dark:text-slate-900 bg-slate-900 dark:bg-slate-100 rounded-full px-2 py-0.5">
                Chosen
              </span>
            )}
            <h4 className={cn(
              "text-lg font-semibold text-slate-900 dark:text-slate-100 leading-snug",
              isChosen && "pr-20"
            )}>
              {opt.name}
            </h4>
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400 mb-1.5">
                Upside
              </p>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {opt.pro}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-rose-600 dark:text-rose-400 mb-1.5">
                Cost
              </p>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {opt.con}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* GovernanceCard — for the inside-the-skill section */
export function GovernanceCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-4 rounded-2xl border border-slate-200 dark:border-white/[0.08] p-6 md:p-7 bg-white/40 dark:bg-slate-900/30 transition-colors hover:border-slate-300 dark:hover:border-white/[0.15]">
      <h4 className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 leading-snug">
        {title}
      </h4>
      <div className="text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
        {children}
      </div>
    </div>
  );
}

/* GovernanceGrid — wraps GovernanceCards in a 2-column layout for breath */
export function GovernanceGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-10 md:my-12 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 [&>div]:my-0">
      {children}
    </div>
  );
}

/* InlineNote — tiny inline gloss for unfamiliar terms */
export function InlineNote({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block align-baseline mx-1 px-2 py-0.5 rounded-md text-[0.8em] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 italic">
      ({children})
    </span>
  );
}

/* Section — optional wrapper if you want named sections with anchor IDs */
export function Section({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      {children}
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   NumberedPrinciples — editorial numbered list. Use Principle as children.
   Replaces card-grid layouts where prose-with-numbers reads better.
   ───────────────────────────────────────────────────────────────────────── */
export function Principle({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  // Marker — actually rendered by NumberedPrinciples below.
  // Kept as a real component so it works standalone if needed.
  return (
    <div className="my-6">
      <h4 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2 leading-snug">
        {title}
      </h4>
      <div className="text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-400">
        {children}
      </div>
    </div>
  );
}

export function NumberedPrinciples({ children }: { children: React.ReactNode }) {
  const principles = React.Children.toArray(children).filter(
    React.isValidElement
  );
  return (
    <div className="my-12 md:my-16 border-t border-slate-200 dark:border-white/[0.08]">
      {principles.map((child, i) => {
        const { title, children: content } = (child as React.ReactElement).props as {
          title: string;
          children: React.ReactNode;
        };
        return (
          <div
            key={`${title}-${i}`}
            className="group relative grid grid-cols-[auto_1fr] gap-6 md:gap-12 py-8 md:py-10 border-b border-slate-200 dark:border-white/[0.08] transition-colors hover:bg-slate-50/40 dark:hover:bg-white/[0.02]"
          >
            <div className="text-3xl md:text-5xl font-extralight text-slate-300 dark:text-slate-700 tabular-nums leading-none pt-1 transition-colors group-hover:text-slate-700 dark:group-hover:text-slate-300 select-none">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="min-w-0">
              <h4 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2 leading-snug">
                {title}
              </h4>
              <div className="text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-400 [&>p]:m-0 [&>p+p]:mt-3">
                {content}
              </div>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-12 w-px bg-gradient-to-b from-transparent via-indigo-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   TableOfContents — sticky left nav. Auto-detects h2 elements in the
   article and tracks the active section via IntersectionObserver.
   ───────────────────────────────────────────────────────────────────────── */
export function TableOfContents() {
  const [headings, setHeadings] = useState<Array<{ id: string; text: string }>>(
    []
  );
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const els = Array.from(document.querySelectorAll("article h2"));
    const items = els
      .map((el) => ({ id: el.id, text: el.textContent ?? "" }))
      .filter((item) => item.id && item.text);
    setHeadings(items);
    if (items.length > 0) setActiveId(items[0].id);
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400 mb-4 pl-3">
        On this page
      </p>
      <ul className="space-y-1 border-l border-slate-200 dark:border-white/[0.08]">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <li key={heading.id} className="relative">
              {isActive && (
                <span className="absolute left-[-1px] top-0 bottom-0 w-px bg-slate-900 dark:bg-slate-100" />
              )}
              <a
                href={`#${heading.id}`}
                className={cn(
                  "block text-xs leading-snug py-1.5 pl-3 transition-colors",
                  isActive
                    ? "text-slate-900 dark:text-slate-100 font-medium"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                )}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* CaseStudyProse — 2-column layout:
   left  : sticky TableOfContents
   center: article content
*/
export function CaseStudyProse({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative max-w-7xl mx-auto px-6 md:px-10">
      <div className="lg:grid lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-16 xl:gap-20">
        {/* Left: sticky TOC */}
        <aside className="hidden lg:block pt-32">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
            <TableOfContents />
          </div>
        </aside>

        {/* Center */}
        <div className="min-w-0">
          <article className="max-w-3xl mx-auto">{children}</article>
          <div className="pb-32" />
        </div>
      </div>
    </div>
  );
}
