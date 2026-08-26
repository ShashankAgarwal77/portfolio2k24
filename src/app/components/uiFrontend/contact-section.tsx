"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import MountainFar from "../../../../public/homepage_assets/mountain_far.png";
import MountainNear from "../../../../public/homepage_assets/mountain_near.png";

/* ─────────────────────────────────────────────────────────────────────────
   ContactSection — the landing at the end of the journey.

   The page descends: cosmos (hero) → cloud layer (work) → solid ground
   (here). So this is deliberately the CALMEST section on the site — two
   painted mountain ridges, a breath of valley mist, a few last stars in
   dark mode, and the contact ask. No spectacle; arrival.

   Motion is one gesture: as the section scrolls into view the ridges
   settle into place at different rates (far slower than near), which is
   the only depth cue the ending needs. Transform-only, eased, and skipped
   entirely under reduced motion.

   The CTA pill is the hero's "Let's connect" verbatim — the page opens
   and closes on the same door (PRODUCT.md: frictionless path to contact).
   ───────────────────────────────────────────────────────────────────────── */

/* Last stars: [left %, top %, scale, twinkle delay s] — low and sparse,
   an echo of the hero's sky, not a reprise. Dark mode only (CSS). */
const STAR_SEATS: [number, number, number, number][] = [
  [8, 14, 0.8, 0.4],
  [21, 30, 0.6, 2.2],
  [38, 10, 0.7, 1.1],
  [58, 24, 0.6, 3.0],
  [74, 12, 0.85, 0.0],
  [88, 28, 0.65, 1.7],
  [95, 8, 0.7, 2.6],
];

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });
  /* The ridges settle: both start slightly sunken and rise into place,
     the near one travelling further — parallax without a single listener
     beyond framer's scroll subscription. */
  const farY = useTransform(scrollYProgress, [0, 1], ["14%", "0%"]);
  const nearY = useTransform(scrollYProgress, [0, 1], ["30%", "0%"]);

  /* Cursor parallax — the meadow's trick, retuned for terrain. Each ridge
     eases toward the cursor at its own lag and amplitude (near: faster and
     further; far: slow and slight), which is what sells the depth — two
     layers moving in lockstep would read as one flat picture sliding.
     Framer owns the scroll transform on the outer wrappers, so the cursor
     writes to separate INNER wrappers — the two must never share a
     transform. The base scale gives each layer bleed so its edges never
     show while it drifts. */
  const farPxRef = useRef<HTMLDivElement>(null);
  const nearPxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const section = sectionRef.current;
    const far = farPxRef.current;
    const near = nearPxRef.current;
    if (!section || !far || !near) return;

    const s = { tx: 0, ty: 0, fx: 0, fy: 0, nx: 0, ny: 0 };
    const clamp = (v: number) => Math.min(1, Math.max(-1, v));
    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      /* Clamped: a cursor far outside the section must not drive the
         ridges past their edge bleed. */
      s.tx = clamp(((e.clientX - r.left) / Math.max(r.width, 1)) * 2 - 1);
      s.ty = clamp(((e.clientY - r.top) / Math.max(r.height, 1)) * 2 - 1);
    };

    let raf = 0;
    let running = false;
    const tick = () => {
      s.fx += (s.tx - s.fx) * 0.025;
      s.fy += (s.ty - s.fy) * 0.025;
      s.nx += (s.tx - s.nx) * 0.07;
      s.ny += (s.ty - s.ny) * 0.07;
      far.style.transform = `translate3d(${(s.fx * 7).toFixed(2)}px, ${(s.fy * 4).toFixed(2)}px, 0) scale(1.02)`;
      near.style.transform = `translate3d(${(s.nx * 16).toFixed(2)}px, ${(s.ny * 9).toFixed(2)}px, 0) scale(1.035)`;
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(section);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="contact-section relative w-screen ml-[calc(50%-50vw)] overflow-hidden pt-24 md:pt-36"
      aria-label="Contact"
    >
      <div aria-hidden="true" className="contact-stars">
        {STAR_SEATS.map(([x, y, s, d], i) => (
          <span
            key={i}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: `scale(${s})`,
              animationDelay: `${d}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-4 flex flex-col items-center gap-5 md:gap-7 text-center">
        <h2 className="text-title font-semibold lowercase text-slate-600 dark:text-white text-balance">
          let&apos;s build something <span className="fontGloock">together.</span>
        </h2>
        <p className="text-body font-normal max-w-xl text-slate-600 dark:text-slate-400 text-balance">
          Open to product design roles, collaborations, and good
          conversations — I&apos;m one message away.
        </p>

        <div className="mt-3 md:mt-5 flex flex-col items-center gap-5">
          {/* The hero CTA, verbatim — same door at both ends of the page. */}
          <a
            href="https://www.linkedin.com/in/shashank-agarwal11/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-slate-100 dark:bg-slate-800 no-underline group cursor-pointer relative rounded-full p-px text-white inline-block shadow-xl">
              <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </span>
              <div className="text-caption font-semibold relative flex px-4 py-2 md:px-6 md:py-4 justify-center z-10 rounded-full border border-slate-300 dark:border-none dark:bg-zinc-950 ring-1 ring-white/10 text-slate-900 dark:text-white">
                Let&apos;s connect
              </div>
              <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
            </button>
          </a>
          <a
            href="mailto:shashank.ux@outlook.com"
            className="text-caption font-normal text-slate-500 dark:text-slate-400 underline underline-offset-4 decoration-slate-400/40 transition-colors hover:text-slate-800 dark:hover:text-slate-200"
          >
            or write to shashank.ux@outlook.com
          </a>
        </div>
      </div>

      {/* The ground. Near ridge is in flow and sets the height; the far
          ridge hangs behind it; a gradient mist breathes in the valley
          between them (gradients only — the performance rule). Positive
          top margin: the content must never sit on the ridges. */}
      <div aria-hidden="true" className="contact-mountains mt-10 md:mt-16">
        <motion.div
          className="contact-ridge contact-ridge--far"
          style={reduced ? undefined : { y: farY }}
        >
          <div ref={farPxRef} className="contact-ridge__parallax contact-ridge__parallax--far">
            <Image
              src={MountainFar}
              alt=""
              sizes="100vw"
              draggable={false}
              className="contact-ridge__img"
            />
          </div>
        </motion.div>
        <motion.div
          className="contact-ridge contact-ridge--near"
          style={reduced ? undefined : { y: nearY }}
        >
          <div ref={nearPxRef} className="contact-ridge__parallax contact-ridge__parallax--near">
            <Image
              src={MountainNear}
              alt=""
              sizes="100vw"
              draggable={false}
              className="contact-ridge__img"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
