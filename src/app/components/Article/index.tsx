"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/app/lib/utils";
import { useRevealChildren } from "@/app/lib/useReveal";
import { MediaLightbox } from "@/app/components/MediaLightbox";

/* ─────────────────────────────────────────────────────────────────────────
   ArticleShell — reading chrome for long-form MDX posts.

   Deliberately the only component a post needs: the body stays plain
   markdown so the page reads like an article rather than a widget stack.

   Provides
     · a sticky left index with short labels (scroll-spy via IntersectionObserver)
     · a blur-to-sharp reveal on each top-level block as it scrolls in,
       shared with the rest of the site via useRevealChildren
   ───────────────────────────────────────────────────────────────────────── */

type IndexItem = {
  /** Slug of the h2 this entry points at — matches mdx-components' slugify. */
  id: string;
  /** Short label. Keep it to a word or two; the heading carries the detail. */
  label: string;
};

export function ArticleShell({
  index,
  children,
}: {
  index: IndexItem[];
  children: React.ReactNode;
}) {
  /* Each top-level markdown block blurs in as it scrolls up. Blocks already
     on screen at mount are left alone, since the page-transition reveal in
     template.tsx is already animating them. */
  const contentRef = useRevealChildren<HTMLElement>();
  const [activeId, setActiveId] = useState<string>(index[0]?.id ?? "");

  /* Scroll-spy for the index. */
  useEffect(() => {
    if (index.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-88px 0px -68% 0px", threshold: 0 }
    );
    index.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [index]);

  return (
    <div className="relative">
      {/* The index is taken out of the layout flow entirely (see
          .article-index) so it costs no horizontal space. That lets the
          article centre on the viewport rather than inside a grid column
          offset by the index's width. */}
      <nav
        aria-label="Article sections"
        className="article-index scrollbar-hide"
      >
        <ul className="space-y-px border-l border-slate-200 dark:border-white/[0.08]">
          {index.map(({ id, label }) => {
            const isActive = activeId === id;
            return (
              <li key={id} className="relative">
                {isActive && (
                  <span className="absolute left-[-1px] top-1 bottom-1 w-px bg-slate-900 dark:bg-slate-100" />
                )}
                <a
                  href={`#${id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "block py-1.5 pl-3 text-xs leading-snug transition-colors",
                    isActive
                      ? "font-medium text-slate-900 dark:text-slate-100"
                      : "text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
                  )}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-6">
        <article
          ref={contentRef}
          className="media-openable mx-auto w-full max-w-[42rem] pt-28 pb-32 [&>*:first-child]:mt-0"
        >
          {children}
        </article>
      </div>

      {/* Rendered outside <article> on purpose: the reveal hides and shows
          the article's direct children, and the viewer must not be one. */}
      <MediaLightbox containerRef={contentRef} />
    </div>
  );
}
