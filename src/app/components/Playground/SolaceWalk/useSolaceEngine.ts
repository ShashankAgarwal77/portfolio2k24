"use client";

import { useEffect, useRef, useState } from "react";
import { SolaceEngine, type SolaceStatus } from "./engine";

/* Owns one SolaceEngine for a canvas: sizing and the frame loop, gated the
   same way as the other Playground pieces — it only runs while playing, on
   screen and in a visible tab. Stopped, it holds a still frame. */
export function useSolaceEngine(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  playing: boolean,
  onStatus: (s: SolaceStatus) => void
) {
  const engineRef = useRef<SolaceEngine | null>(null);
  const playingRef = useRef(playing);
  const statusRef = useRef(onStatus);
  const kickRef = useRef<() => void>(() => {});
  const [failed, setFailed] = useState(false);
  playingRef.current = playing;
  statusRef.current = onStatus;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let engine: SolaceEngine;
    try {
      engine = new SolaceEngine(canvas);
    } catch (err) {
      console.error(err);
      setFailed(true);
      return;
    }
    engineRef.current = engine;
    if (process.env.NODE_ENV !== "production") (window as unknown as { __solace: SolaceEngine }).__solace = engine;
    engine.onStatus = (s) => statusRef.current(s);
    const hours = new URLSearchParams(window.location.search).get("h");
    if (hours !== null && !Number.isNaN(Number(hours))) engine.setHours(((Number(hours) % 24) + 24) % 24);
    engine.setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    let inView = true;
    let raf = 0;
    let last = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(now - last, 100) / 1000;
      last = now;
      engine.step(dt);
      engine.render();
    };
    const still = () => {
      engine.step(0);
      engine.render();
    };
    const kick = () => {
      const run = playingRef.current && inView && document.visibilityState === "visible";
      if (run && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
        engine.clearKeys();
      }
      if (!raf) still();
    };
    kickRef.current = kick;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      engine.resize(r.width, r.height, Math.min(window.devicePixelRatio || 1, 2));
      if (!raf) still();
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      kick();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", kick);
    kick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", kick);
      engineRef.current = null;
      engine.dispose();
    };
  }, [canvasRef]);

  useEffect(() => {
    kickRef.current();
  }, [playing]);

  return { engine: engineRef, failed };
}
