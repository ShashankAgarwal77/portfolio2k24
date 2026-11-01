"use client";

import { useEffect, useRef, useState } from "react";
import { DEFAULT_PARAMS, type StarryParams } from "./engine";
import { useStarryEngine } from "./useStarryEngine";

/* Thumbnail for the Playground index: a still frame at rest that comes
   alive while its card is hovered or focused (never under reduced motion). */
const PREVIEW: StarryParams = { ...DEFAULT_PARAMS, cellSize: 10, stars: 12 };

export function StarryAsciiPreview({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  useStarryEngine(canvasRef, PREVIEW, active && !reduced);
  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />;
}
