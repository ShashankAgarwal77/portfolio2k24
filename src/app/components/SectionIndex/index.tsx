"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/app/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────
   SectionIndex — the sticky left index shared by the case studies.

   Short labels, scroll-spy via IntersectionObserver, and a fixed position
   outside the layout flow (see .article-index in globals.css).

   Story pages run full-bleed black chapters whatever the site theme, so the
   index checks whether it is currently sitting over a .story-dark section
   and swaps to light-on-dark colours there; otherwise dark text would
   vanish into the black in light mode.
   ───────────────────────────────────────────────────────────────────────── */

export type SectionIndexItem = {
  /** id of the section this entry points at. */
  id: string;
  /** Short label. Keep it to a word or two; the heading carries the detail. */
  label: string;
};

export function SectionIndex({
  items,
  variant = "article",
}: {
  items: SectionIndexItem[];
  /** "story" pages have a wider content column, so the index needs a wider viewport to clear it. */
  variant?: "article" | "story";
}) {
  const navRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const [onDark, setOnDark] = useState(false);

  /* Scroll-spy, worked out from the scroll position rather than an
     observer band, so a jump (index link, scrollbar drag, search) can never
     leave the wrong entry lit: the active section is the last one whose
     start has risen past a third of the viewport. */
  useEffect(() => {
    if (items.length === 0) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.33;
      let current = items[0].id;
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActiveId(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [items]);

  /* Is the index's vertical centre over a forced-dark section? */
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const nav = navRef.current;
      // Hidden below its breakpoint. (offsetParent can't tell: it is always null for position: fixed.)
      if (!nav || getComputedStyle(nav).display === "none") return;
      const rect = nav.getBoundingClientRect();
      const y = rect.top + rect.height / 2;
      const dark = Array.from(document.querySelectorAll<HTMLElement>(".story-dark")).some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= y && r.bottom >= y;
      });
      setOnDark(dark);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      aria-label="Case study sections"
      className={cn("article-index scrollbar-hide", variant === "story" && "article-index--story")}
    >
      <p
        className={cn(
          "mb-3 text-label uppercase transition-colors",
          onDark ? "text-white/50" : "text-slate-400 dark:text-slate-500"
        )}
      >
        On this page
      </p>
      <ul
        className={cn(
          "space-y-px border-l transition-colors",
          onDark ? "border-white/15" : "border-slate-200 dark:border-white/[0.08]"
        )}
      >
        {items.map(({ id, label }) => {
          const isActive = activeId === id;
          return (
            <li key={id} className="relative">
              {isActive && (
                <span
                  className={cn(
                    "absolute left-[-1px] top-1 bottom-1 w-px",
                    onDark ? "bg-white" : "bg-slate-900 dark:bg-slate-100"
                  )}
                />
              )}
              <a
                href={`#${id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "block py-1.5 pl-3 text-caption transition-colors",
                  isActive
                    ? cn("font-semibold", onDark ? "text-white" : "text-slate-900 dark:text-slate-100")
                    : onDark
                      ? "text-white/45 hover:text-white/80"
                      : "text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
                )}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
      <a
        href="#top"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className={cn(
          "mt-5 inline-block pl-3 text-caption transition-colors",
          onDark ? "text-white/45 hover:text-white/80" : "text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
        )}
      >
        ↑ Back to top
      </a>
    </nav>
  );
}
