"use client";

import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';
import {
  ConstellationLines,
  ConstellationStars,
  cornersOf,
  pathEdges,
  useConstellation,
  type Accent,
  type Rect,
} from './constellation';

interface Shot {
  id: number;
  title: string;
  images: {
    hidpi: string;
    normal: string;
    teaser: string;
  };
  html_url: string;
}

/* ─────────────────────────────────────────────────────────────────────────
   DribbbleShots — the shots as a constellation (see constellation.tsx).

   Desktop: shots scatter across a 12-column grid at staggered heights;
   the figure is the shortest path through the cards, so it always fits
   the layout and every line runs clear of every shot. Titles surface
   over the image on hover/focus, so a card is just its image and a star
   can sit on any of its four corners.

   Below lg: a plain one/two-column grid with captions under each shot;
   stars stay, lines go (cards fill the width — no clean path for them).
   ───────────────────────────────────────────────────────────────────────── */

/* One slot per shot; the API returns seven. Slots 7+ (if Dribbble ever
   returns more) fall back to normal grid flow. Negative top margins only
   pull a card into grid cells that are empty in the row above. */
/* Dribbble's `hidpi` URL is the full upload (several MB of PNG for a shot
   shown ~450px wide). Its CDN resizes and re-encodes on request, so ask
   for WebP at the sizes the grid actually draws — keeping Dribbble's own
   crop param so the framing doesn't change. Older non-userupload URLs
   don't take params; they pass through untouched. */
function shotSources(url: string): { src: string; srcSet?: string } {
  if (!url.includes('cdn.dribbble.com/userupload/')) return { src: url };
  const [base, query = ''] = url.split('?');
  const crop = new URLSearchParams(query).get('crop');
  const at = (w: number) => {
    const q = new URLSearchParams();
    if (crop) q.set('crop', crop);
    q.set('resize', `${w}x${Math.round((w * 3) / 4)}`);
    q.set('format', 'webp');
    return `${base}?${q.toString()}`;
  };
  return { src: at(800), srcSet: [480, 800, 1200].map((w) => `${at(w)} ${w}w`).join(', ') };
}

const PLACEMENT = [
  'lg:col-start-1 lg:col-span-4 lg:row-start-1',
  'lg:col-start-6 lg:col-span-3 lg:row-start-1 lg:mt-24',
  'lg:col-start-10 lg:col-span-3 lg:row-start-1 lg:mt-8',
  'lg:col-start-2 lg:col-span-3 lg:row-start-2 lg:mt-12',
  'lg:col-start-7 lg:col-span-3 lg:row-start-2 lg:mt-20',
  'lg:col-start-4 lg:col-span-4 lg:row-start-3 lg:mt-4',
  'lg:col-start-10 lg:col-span-3 lg:row-start-3 lg:-mt-16',
];

/* The lamp-gold of the dock and stars — Dribbble shots share one accent. */
const ACCENT: Accent = { light: '#b45309', dark: '#fde68a' };
const accentOf = () => ACCENT;

const candidates = (media: Rect) => cornersOf(media);
const edges = (cards: Rect[], wide: boolean) => (wide ? pathEdges(cards) : []);

export function DribbbleShots() {
  const [shots, setShots] = useState<Shot[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  /* The shots live below the fold — fetch them when the grid is a
     viewport away instead of competing with the landing's first paint. */
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch('/api/fetchDribbbleShots');
        const data = await response.json();
        if (!cancelled && Array.isArray(data)) setShots(data.slice(0, PLACEMENT.length));
      } catch {
        /* the grid simply stays empty — the section heading still reads */
      }
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          load();
        }
      },
      { rootMargin: '100% 0px' }
    );
    io.observe(host);

    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  const { geo, drawn } = useConstellation({
    rootRef: hostRef,
    itemRefs,
    count: shots.length,
    candidates,
    edges,
  });

  return (
    <div
      ref={hostRef}
      data-drawn={drawn ? '' : undefined}
      className='constellation relative w-full'
    >
      <ConstellationLines geo={geo} active={active} accent={ACCENT} />

      <ul className='relative grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-6'>
        {shots.map((shot, i) => (
          <li
            key={shot.id}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            /* self-start: a stretched grid cell would be taller than its
               shot, and the lines would steer around empty space. */
            className={`self-start transition-opacity duration-500 ${PLACEMENT[i] ?? ''} ${
              active !== null && active !== i ? 'lg:opacity-40' : 'opacity-100'
            }`}
          >
            <a
              href={shot.html_url}
              target='_blank'
              rel='noopener noreferrer'
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive((a) => (a === i ? null : a))}
              onFocus={() => setActive(i)}
              onBlur={() => setActive((a) => (a === i ? null : a))}
              className='group block outline-none focus-visible:ring-1 focus-visible:ring-slate-400 focus-visible:ring-offset-8 focus-visible:ring-offset-transparent dark:focus-visible:ring-white/40'
            >
              <div
                data-media
                className='showcase-halo relative aspect-[4/3] overflow-hidden border border-black/15 bg-slate-950 dark:border-white/15'
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- Dribbble CDN, not in next/image's remote list */}
                <img
                  {...shotSources(shot.images.hidpi || shot.images.normal)}
                  sizes='(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw'
                  alt={shot.title}
                  loading='lazy'
                  decoding='async'
                  className='h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] group-focus-visible:scale-[1.04]'
                />
                {/* Desktop: the title surfaces on hover/focus. */}
                <div className='pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-2 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent px-4 pb-3 pt-10 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 lg:block'>
                  <p className='text-caption line-clamp-1 font-semibold text-white'>
                    {shot.title}
                    <ArrowUpRight size={13} weight='bold' aria-hidden='true' className='ml-1 inline align-[-0.1em]' />
                  </p>
                </div>
              </div>
              {/* Phones/tablets: caption under the shot. */}
              <p className='text-caption mt-3 line-clamp-1 font-semibold text-slate-700 dark:text-white/80 lg:hidden'>
                {shot.title}
                <ArrowUpRight size={13} weight='bold' aria-hidden='true' className='ml-1 inline align-[-0.1em]' />
              </p>
            </a>
          </li>
        ))}
      </ul>

      <ConstellationStars geo={geo} active={active} accentOf={accentOf} />
    </div>
  );
}
