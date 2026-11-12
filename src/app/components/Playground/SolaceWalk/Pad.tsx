"use client";

import React, { useRef, useState } from "react";
import { ArrowDownLeft, ArrowDownRight, ArrowUpLeft, ArrowUpRight, Headphones } from "@phosphor-icons/react";

/* The on-screen pad: a 3 × 3 grid at 85% opacity. W A S D sit on the
   edges, the diagonals in the corners, headphones in the middle. It works
   as buttons or as a joystick — press anywhere and slide, and the
   direction follows your thumb in eight steps. Slide out past the pad's
   edge to run, the touch version of holding Shift. */

type Props = {
  /** Direction currently walking, from keys or pad (0 = up, clockwise). */
  active: number;
  headphones: boolean;
  running: boolean;
  onDir: (dir: number, run: boolean) => void;
  onHeadphones: () => void;
};

/* Grid order, row by row, as directions (−2 = the centre button). */
const CELLS = [7, 0, 1, 6, -2, 2, 5, 4, 3];
const LABEL: Record<number, React.ReactNode> = {
  0: "W",
  2: "D",
  4: "S",
  6: "A",
  1: <ArrowUpRight weight="bold" />,
  3: <ArrowDownRight weight="bold" />,
  5: <ArrowDownLeft weight="bold" />,
  7: <ArrowUpLeft weight="bold" />,
};
const NAME = ["up", "up right", "right", "down right", "down", "down left", "left", "up left"];

export function Pad({ active, headphones, running, onDir, onHeadphones }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [centrePressed, setCentrePressed] = useState(false);
  const centre = useRef(false);

  const read = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    const d = Math.hypot(x, y);
    if (d < r.width / 6) return { dir: -1, run: false };
    return { dir: (Math.round(Math.atan2(x, -y) / (Math.PI / 4)) + 8) % 8, run: d > r.width * 0.62 };
  };
  const dirAt = (e: React.PointerEvent) => read(e).dir;

  const onDown = (e: React.PointerEvent) => {
    e.preventDefault();
    ref.current!.setPointerCapture(e.pointerId);
    const d = dirAt(e);
    centre.current = d === -1;
    setCentrePressed(d === -1);
    onDir(d, false);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!ref.current!.hasPointerCapture(e.pointerId)) return;
    const { dir: d, run } = read(e);
    if (d !== -1) {
      centre.current = false;
      setCentrePressed(false);
    }
    onDir(d, run);
  };
  const onUp = (e: React.PointerEvent) => {
    if (centre.current && dirAt(e) === -1) onHeadphones();
    centre.current = false;
    setCentrePressed(false);
    onDir(-1, false);
  };

  return (
    <div
      ref={ref}
      role="group"
      aria-label="Walk controls"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onContextMenu={(e) => e.preventDefault()}
      className="grid touch-none select-none grid-cols-3 gap-1 rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-1.5 opacity-[0.85] shadow-[0_8px_30px_rgb(0_0_0/0.35)] backdrop-blur-sm"
    >
      {CELLS.map((d) =>
        d === -2 ? (
          <span
            key="centre"
            role="button"
            aria-label={headphones ? "Take headphones off" : "Put headphones on"}
            aria-pressed={headphones}
            className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors [&>svg]:h-5 [&>svg]:w-5 ${
              centrePressed
                ? "bg-amber-200/30 text-amber-100"
                : headphones
                  ? "bg-amber-200/15 text-amber-200"
                  : "bg-white/5 text-slate-300"
            }`}
          >
            <Headphones weight={headphones ? "fill" : "light"} />
          </span>
        ) : (
          <span
            key={d}
            role="button"
            aria-label={`Walk ${NAME[d]}`}
            className={`flex h-11 w-11 items-center justify-center rounded-xl font-mono text-[13px] transition-colors [&>svg]:h-4 [&>svg]:w-4 ${
              active === d ? (running ? "bg-amber-300 text-slate-950 ring-2 ring-amber-200/60" : "bg-amber-200/90 text-slate-950") : d % 2 === 0 ? "bg-white/[0.07] text-slate-200" : "text-slate-300"
            }`}
          >
            {LABEL[d]}
          </span>
        )
      )}
    </div>
  );
}
