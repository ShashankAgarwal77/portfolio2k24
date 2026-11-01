"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  DownloadSimple,
  Pause,
  Play,
  Shuffle,
  SlidersHorizontal,
  X,
} from "@phosphor-icons/react";

import { Reveal } from "@/app/components/Reveal";
import { DEFAULT_PARAMS, type StarryParams } from "./engine";
import { useStarryEngine } from "./useStarryEngine";
import { Controls } from "./Controls";

/* Starry Night, in ASCII — the studio: the canvas, a HUD for the verbs
   (play, shuffle, export, copy), and the tuning panel. On desktop the
   panel sits beside the canvas; below lg it becomes a bottom sheet so the
   sky stays visible while you tune it. */

export function StarryAsciiStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [params, setParams] = useState<StarryParams>(DEFAULT_PARAMS);
  /* Starts paused; the effect below presses play unless the reader asked
     for reduced motion. Starting false means reduced-motion readers never
     see a single animated frame. */
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const engine = useStarryEngine(canvasRef, params, playing);
  const drag = useDragControls();

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(rm);
    setPlaying(!rm);
  }, []);

  const set = useCallback((patch: Partial<StarryParams>) => {
    setParams((p) => ({ ...p, ...patch }));
  }, []);

  const flash = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? null : t)), 1800);
  }, []);

  const shuffle = useCallback(() => {
    set({ seed: 1 + Math.floor(Math.random() * 9998) });
  }, [set]);

  const exportPng = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return flash("Couldn't export");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `starry-night-ascii-${params.seed}.png`;
      a.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 4000);
      flash("PNG saved");
    }, "image/png");
  }, [flash, params.seed]);

  const copyText = async () => {
    const e = engine.current;
    if (!e) return;
    try {
      await navigator.clipboard.writeText(e.toText());
      flash(`Copied ${e.grid.cols} × ${e.grid.rows} characters`);
    } catch {
      flash("Clipboard blocked");
    }
  };

  /* Space plays/pauses, R reshuffles — unless you're typing a ramp. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, [contenteditable]") || e.metaKey || e.ctrlKey) return;
      if (e.code === "Space" && !t.closest("button")) {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.key === "r" || e.key === "R") {
        shuffle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shuffle]);

  const local = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top] as const;
  };

  return (
    <>
      <Reveal
        as="main"
        className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 pb-28 pt-10 md:px-8 md:pt-14"
      >
        <header className="flex flex-col gap-3">
          <Link
            href="/playground"
            className="group inline-flex w-fit items-center gap-1.5 text-caption text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft weight="light" className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Playground
          </Link>
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <h1 className="shrink-0 bg-gradient-to-br from-slate-500 to-slate-700 bg-clip-text py-1 text-headline font-semibold text-transparent dark:from-slate-300 dark:to-slate-500">
              starry night, in <span className="fontGloock italic pe-2">ascii</span>
            </h1>
            <p className="max-w-md text-caption text-slate-500 dark:text-slate-400 lg:pb-3 lg:text-right">
              Van Gogh&rsquo;s 1889 sky rebuilt as a flow field and set in type. Drag to stir the
              currents, tap to drop a ripple, tune everything.
            </p>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="relative h-[62svh] min-h-[380px] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 lg:h-[calc(100svh-16rem)] lg:min-h-[520px]">
            <canvas
              ref={canvasRef}
              aria-label="Animated ASCII rendering of a swirling starry night sky with a crescent moon, a cypress and a village"
              role="img"
              className="absolute inset-0 h-full w-full touch-none"
              onPointerMove={(e) => engine.current?.pointerMove(...local(e))}
              onPointerLeave={() => engine.current?.pointerLeave()}
              onPointerDown={(e) => {
                const [x, y] = local(e);
                engine.current?.pointerMove(x, y);
                engine.current?.ripple(x, y);
              }}
            />

            <div className="absolute right-3 top-3 flex gap-1.5">
              <HudButton label={playing ? "Pause" : "Play"} onClick={() => setPlaying((p) => !p)}>
                {playing ? <Pause weight="light" /> : <Play weight="light" />}
              </HudButton>
              <HudButton label="Shuffle seed" onClick={shuffle}>
                <Shuffle weight="light" />
              </HudButton>
              <HudButton label="Export PNG" onClick={exportPng}>
                <DownloadSimple weight="light" />
              </HudButton>
              <HudButton label="Copy as text" onClick={copyText}>
                <Copy weight="light" />
              </HudButton>
              <HudButton
                label="Tune"
                onClick={() => {
                  /* Park the stage at the top so the sky stays in view above
                     the sheet while you tune it. */
                  const top = canvasRef.current?.getBoundingClientRect().top ?? 0;
                  window.scrollBy({ top: top - 12, behavior: reduced ? "auto" : "smooth" });
                  setSheet(true);
                }}
                className="lg:hidden"
              >
                <SlidersHorizontal weight="light" />
              </HudButton>
            </div>

            <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 font-mono text-[11px] text-slate-500 dark:bg-slate-950/70 dark:text-slate-400">
              <span className={playing ? "text-amber-600 dark:text-amber-200" : ""}>
                {playing ? "●" : "○"}
              </span>
              seed {params.seed}
              {!playing && reduced && <span>· paused for reduced motion</span>}
            </div>

            <AnimatePresence>
              {toast && (
                <motion.div
                  key={toast}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  role="status"
                  className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-slate-900 px-3 py-1 text-caption text-white dark:bg-amber-100 dark:text-slate-900"
                >
                  {toast}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <aside
            aria-label="Controls"
            className="hidden overflow-y-auto rounded-2xl border border-slate-200 bg-white/60 p-5 dark:border-slate-800 dark:bg-slate-950/60 lg:block lg:h-[calc(100svh-16rem)] lg:min-h-[520px]"
          >
            <Controls params={params} set={set} onReset={() => setParams(DEFAULT_PARAMS)} />
          </aside>
        </section>
      </Reveal>

      <AnimatePresence>
        {sheet && (
          <motion.div
            key="sheet"
            role="dialog"
            aria-label="Controls"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            drag="y"
            dragControls={drag}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) setSheet(false);
            }}
            className="fixed inset-x-0 bottom-0 z-[55] flex max-h-[52svh] flex-col rounded-t-2xl border-t border-slate-200 bg-white shadow-[0_-12px_40px_rgb(2_6_23/0.18)] dark:border-slate-800 dark:bg-slate-950 lg:hidden"
          >
            {/* Drag lives on the handle row; the body scrolls. */}
            <div
              className="flex touch-none items-center justify-between px-5 pb-2 pt-3"
              onPointerDown={(e) => drag.start(e)}
            >
              <span className="text-label uppercase text-slate-400 dark:text-slate-500">Tune</span>
              <span className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-slate-300 dark:bg-slate-700" />
              <button
                type="button"
                aria-label="Close controls"
                onClick={() => setSheet(false)}
                onPointerDown={(e) => e.stopPropagation()}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900"
              >
                <X weight="light" className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-y-auto overscroll-contain px-5 pb-8">
              <Controls params={params} set={set} onReset={() => setParams(DEFAULT_PARAMS)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function HudButton({
  label,
  onClick,
  children,
  className,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/85 text-slate-600 transition-colors hover:border-amber-500/40 hover:text-slate-900 dark:border-slate-700/80 dark:bg-slate-950/75 dark:text-slate-300 dark:hover:border-amber-200/40 dark:hover:text-amber-100 [&>svg]:h-[18px] [&>svg]:w-[18px] ${className ?? ""}`}
    >
      {children}
    </button>
  );
}
