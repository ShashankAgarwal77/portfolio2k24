"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Headphones, MagnifyingGlassMinus, MagnifyingGlassPlus, Pause, Play } from "@phosphor-icons/react";

import { Reveal } from "@/app/components/Reveal";
import type { SolaceStatus } from "./engine";
import { useSolaceEngine } from "./useSolaceEngine";
import { Pad } from "./Pad";

/* Solace, in chaos — the studio: the walkable ASCII city, a quiet HUD
   (clock, mood, where you are), the verbs top-right and the pad
   bottom-left. Keys: W A S D or arrows to walk, Shift to run, H for
   headphones, + / − to zoom, Space to pause. */

const WALK_KEYS = new Set(["KeyW", "KeyA", "KeyS", "KeyD", "ShiftLeft", "ShiftRight"]);
const ARROWS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);

export function SolaceStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);
  const [status, setStatus] = useState<SolaceStatus | null>(null);
  const [walked, setWalked] = useState(false);
  const onStatus = useCallback((s: SolaceStatus) => {
    setStatus(s);
    if (s.dir >= 0) setWalked(true);
  }, []);
  const { engine, failed } = useSolaceEngine(canvasRef, playing, onStatus);

  useEffect(() => {
    const typing = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      return !!t.closest?.("input, textarea, select, [contenteditable]") || e.metaKey || e.ctrlKey || e.altKey;
    };
    const engaged = () => !!stageRef.current?.matches(":hover, :focus-within");

    const down = (e: KeyboardEvent) => {
      if (typing(e)) return;
      const en = engine.current;
      if (!en) return;
      if (WALK_KEYS.has(e.code) || (ARROWS.has(e.code) && engaged())) {
        if (ARROWS.has(e.code)) e.preventDefault();
        en.key(e.code, true);
      } else if (e.code === "KeyH" && !e.repeat) {
        en.toggleHeadphones();
      } else if (e.code === "Equal" || e.code === "NumpadAdd") {
        en.zoomBy(0.85);
      } else if (e.code === "Minus" || e.code === "NumpadSubtract") {
        en.zoomBy(1 / 0.85);
      } else if (e.code === "Space" && engaged() && !(e.target as HTMLElement).closest("button")) {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    const up = (e: KeyboardEvent) => engine.current?.key(e.code, false);
    const blur = () => engine.current?.clearKeys();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, [engine]);

  const headphones = status?.headphones ?? true;

  return (
    <Reveal as="main" className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 pb-28 pt-10 md:px-8 md:pt-14">
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
            solace, in <span className="fontGloock italic pe-2">chaos</span>
          </h1>
          <p className="max-w-md text-caption text-slate-500 dark:text-slate-400 lg:pb-3 lg:text-right">
            An evening walk home through the city, set in type. The noise is everywhere; the headphones carry the
            calm. The light follows your own clock.
          </p>
        </div>
      </header>

      <div
        ref={stageRef}
        tabIndex={0}
        aria-label="Walkable ASCII city. W A S D or arrow keys to walk, Shift to run, H for headphones, plus and minus to zoom."
        className="relative h-[76svh] min-h-[460px] overflow-hidden rounded-2xl border border-slate-200 bg-[#0d0c12] outline-none focus-visible:ring-2 focus-visible:ring-amber-200/60 dark:border-slate-800 lg:h-[calc(100svh-13rem)] lg:min-h-[560px]"
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Isometric ASCII rendering of a city at dusk, with Shashank walking through it"
          className="absolute inset-0 h-full w-full touch-none"
        />

        {failed && (
          <p className="absolute inset-0 flex items-center justify-center p-8 text-center text-caption text-slate-400">
            This piece needs WebGL, which isn&rsquo;t available in this browser.
          </p>
        )}

        {status && (
          <div className="pointer-events-none absolute left-3 top-14 flex flex-col gap-1 font-mono md:top-3 text-[11px] leading-none">
            <span className="flex w-fit items-center gap-2 rounded-full bg-slate-950/70 px-3 py-1.5 text-slate-300">
              <span className={playing ? "text-amber-200" : "text-slate-500"}>{playing ? "●" : "○"}</span>
              {status.clock} · {status.mood}
            </span>
            <span className="w-fit rounded-full bg-slate-950/60 px-3 py-1.5 text-slate-400">{status.zone}</span>
          </div>
        )}

        <div className="absolute right-3 top-3 flex gap-1.5">
          <HudButton label={playing ? "Pause" : "Play"} onClick={() => setPlaying((p) => !p)}>
            {playing ? <Pause weight="light" /> : <Play weight="light" />}
          </HudButton>
          <HudButton
            label={headphones ? "Take headphones off (H)" : "Put headphones on (H)"}
            pressed={headphones}
            onClick={() => engine.current?.toggleHeadphones()}
          >
            <Headphones weight={headphones ? "fill" : "light"} />
          </HudButton>
          <HudButton label="Zoom in (+)" onClick={() => engine.current?.zoomBy(0.85)}>
            <MagnifyingGlassPlus weight="light" />
          </HudButton>
          <HudButton label="Zoom out (−)" onClick={() => engine.current?.zoomBy(1 / 0.85)}>
            <MagnifyingGlassMinus weight="light" />
          </HudButton>
        </div>

        <div className="absolute bottom-3 left-3">
          <Pad
            active={status?.dir ?? -1}
            headphones={headphones}
            running={status?.running ?? false}
            onDir={(d, run) => engine.current?.setPad(d, run)}
            onHeadphones={() => engine.current?.toggleHeadphones()}
          />
        </div>

        <div
          className={`pointer-events-none absolute bottom-3 right-3 hidden rounded-full bg-slate-950/70 px-3 py-1.5 font-mono text-[11px] text-slate-400 transition-opacity duration-700 md:block ${
            walked ? "opacity-0" : "opacity-100"
          }`}
        >
          W A S D walk · Shift run · H headphones · + − zoom
        </div>
      </div>
    </Reveal>
  );
}

function HudButton({
  label,
  onClick,
  pressed,
  children,
}: {
  label: string;
  onClick: () => void;
  pressed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-full border bg-slate-950/75 transition-colors hover:border-amber-200/40 hover:text-amber-100 [&>svg]:h-[18px] [&>svg]:w-[18px] ${
        pressed ? "border-amber-200/40 text-amber-200" : "border-slate-700/80 text-slate-300"
      }`}
    >
      {children}
    </button>
  );
}
