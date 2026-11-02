"use client";

import React from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { cn } from "@/app/lib/utils";
import { useRevealChildren } from "@/app/lib/useReveal";
import { MediaLightbox } from "@/app/components/MediaLightbox";
import { SectionIndex, type SectionIndexItem } from "@/app/components/SectionIndex";
import { StoryProgress } from "@/app/components/Story";

/* ─────────────────────────────────────────────────────────────────────────
   ArticleShell — the case studies, read like a long-form blog post.

   The MDX body stays plain markdown; the shell owns everything around it so
   every case study gets the same reading chrome:
     · a post header: kicker, title, dek, byline with read time
     · a cover image and an at-a-glance fact row
     · a sticky left index (wide screens) or a Contents list (narrow ones)
     · a blur-to-sharp reveal on each top-level block as it scrolls in,
       shared with the rest of the site via useRevealChildren
     · a next-read link at the end
   ───────────────────────────────────────────────────────────────────────── */

/** id is the slug of the h2 the entry points at — matches mdx-components' slugify. */
type IndexItem = SectionIndexItem;

type NextRead = { href: string; kicker: string; title: string };

export function ArticleShell({
  index,
  kicker,
  title,
  dek,
  meta,
  readTime,
  cover,
  coverAlt = "",
  facts,
  next,
  children,
}: {
  index: IndexItem[];
  kicker: string;
  title: React.ReactNode;
  dek: string;
  /** Role · team · dates. Sits under the author's name. */
  meta: string;
  /** Minutes. Counted by hand from the body at ~230 wpm. */
  readTime: number;
  cover?: StaticImageData;
  coverAlt?: string;
  facts?: { value: string; label: string }[];
  next?: NextRead;
  children: React.ReactNode;
}) {
  /* Each top-level markdown block blurs in as it scrolls up. Blocks already
     on screen at mount are left alone, since the page-transition reveal in
     template.tsx is already animating them. */
  const contentRef = useRevealChildren<HTMLElement>();

  return (
    <div className="relative">
      <StoryProgress />
      <SectionIndex items={index} />

      <div className="px-6">
        <header className="mx-auto w-full max-w-[42rem] pt-28 md:pt-36">
          <p className="mb-5 text-label uppercase text-slate-500 dark:text-slate-400">{kicker}</p>
          <h1 className="text-[clamp(2.25rem,4.6vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-balance text-slate-900 dark:text-slate-100">
            {title}
          </h1>
          <p className="mt-6 text-[1.25rem] leading-[1.6] text-slate-600 dark:text-slate-400">{dek}</p>

          <div className="mt-8 flex items-baseline gap-6 border-b border-slate-200 pb-8 text-caption text-slate-500 dark:border-white/[0.08] dark:text-slate-400">
            <p className="min-w-0">{meta}</p>
            <p className="ml-auto shrink-0">{readTime} min read</p>
          </div>
        </header>

        {cover && (
          <div className="mx-auto mt-10 w-full max-w-[42rem]">
            <figure className="bleed-wide overflow-hidden rounded-2xl border border-slate-200 dark:border-white/[0.08]">
              <Image src={cover} alt={coverAlt} priority sizes="(min-width: 1280px) 60rem, 100vw" className="h-auto w-full" />
            </figure>
          </div>
        )}

        {facts && (
          <dl className="mx-auto mt-10 grid w-full max-w-[42rem] grid-cols-2 gap-x-6 gap-y-6 rounded-2xl bg-slate-100/70 p-6 dark:bg-white/[0.04] sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="sr-only">{f.label}</dt>
                <dd className="text-[1.5rem] font-semibold leading-tight tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
                  {f.value}
                </dd>
                <dd className="mt-1 text-caption text-slate-500 dark:text-slate-400">{f.label}</dd>
              </div>
            ))}
          </dl>
        )}

        {/* The sticky index only fits beside the column on wide screens;
            below that the same list sits here, folded. */}
        <details className="article-contents group mx-auto mt-8 w-full max-w-[42rem] rounded-2xl border border-slate-200 dark:border-white/[0.08] xl:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-caption font-semibold text-slate-900 dark:text-slate-100">
            Contents
            <span className="text-slate-400 transition-transform group-open:rotate-45" aria-hidden="true">
              +
            </span>
          </summary>
          <ol className="space-y-1 px-5 pb-5">
            {index.map(({ id, label }, i) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="flex gap-3 py-1 text-caption text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                >
                  <span className="w-5 tabular-nums text-slate-400 dark:text-slate-500">{String(i + 1).padStart(2, "0")}</span>
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </details>

        <article
          ref={contentRef}
          className="article-body media-openable mx-auto w-full max-w-[42rem] pt-8 pb-20 [&>*:first-child]:mt-0"
        >
          {children}
        </article>

        <footer className="mx-auto w-full max-w-[42rem] pb-40">
          {next && (
            <Link
              href={next.href}
              className="group block rounded-2xl border border-slate-200 p-6 transition-colors hover:border-slate-400 dark:border-white/[0.08] dark:hover:border-white/25"
            >
              <p className="text-label uppercase text-slate-500 dark:text-slate-400">Next read · {next.kicker}</p>
              <p className="mt-3 flex items-end justify-between gap-6 text-title font-semibold text-balance text-slate-900 dark:text-slate-100">
                {next.title}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 dark:text-slate-500"
                >
                  →
                </span>
              </p>
            </Link>
          )}
        </footer>
      </div>

      {/* Rendered outside <article> on purpose: the reveal hides and shows
          the article's direct children, and the viewer must not be one. */}
      <MediaLightbox containerRef={contentRef} />
    </div>
  );
}

/** A figure with a caption. `wide` lets it break past the reading measure on large screens. */
export function Figure({
  src,
  alt,
  caption,
  wide,
  width = 2400,
  height = 1600,
}: {
  src: string;
  alt: string;
  caption?: React.ReactNode;
  wide?: boolean;
  width?: number;
  height?: number;
}) {
  return (
    <figure className={cn("my-12", wide && "bleed-wide")}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={wide ? "(min-width: 1280px) 60rem, 100vw" : "(min-width: 768px) 42rem, 100vw"}
        className="h-auto w-full rounded-xl border border-slate-200 dark:border-white/[0.08]"
      />
      {caption && (
        <figcaption className="mx-auto mt-4 max-w-[36rem] text-center text-caption text-slate-500 dark:text-slate-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
