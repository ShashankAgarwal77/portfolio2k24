"use client";

import { useEffect, useRef } from "react";
import { StarryEngine, type StarryParams } from "./engine";

/* Owns one StarryEngine for a canvas: sizing, theme, and the frame loop.

   The loop only runs while ALL of these hold — playing, on screen
   (IntersectionObserver), and the tab visible — the same gating the hero
   sky uses. Anything that changes the picture while stopped (params,
   theme, resize) paints a single still frame instead. */
export function useStarryEngine(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  params: StarryParams,
  playing: boolean
) {
  const engineRef = useRef<StarryEngine | null>(null);
  const paramsRef = useRef(params);
  const playingRef = useRef(playing);
  const kickRef = useRef<() => void>(() => {});
  paramsRef.current = params;
  playingRef.current = playing;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = new StarryEngine(canvas);
    engineRef.current = engine;
    engine.setParams(paramsRef.current);

    const root = document.documentElement;
    const syncTheme = () => engine.setTheme(root.classList.contains("dark") ? "dark" : "light");
    syncTheme();

    let inView = true;
    let raf = 0;
    let last = 0;
    let interval = 1000 / 60;
    let cost = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const elapsed = now - last;
      if (elapsed < interval - 1) return;
      last = now;
      const t0 = performance.now();
      engine.step(Math.min(elapsed, 100) / 1000);
      engine.render();
      /* Adaptive frame rate: drop to 30fps when a frame costs more than a
         comfortable share of the 16ms budget (big screens, tiny cells). */
      cost = cost * 0.9 + (performance.now() - t0) * 0.1;
      interval = cost > 11 ? 1000 / 30 : cost < 6 ? 1000 / 60 : interval;
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
    const mo = new MutationObserver(() => {
      syncTheme();
      if (!raf) still();
    });
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
    document.addEventListener("visibilitychange", kick);

    kick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", kick);
      engineRef.current = null;
    };
  }, [canvasRef]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.setParams(params);
    kickRef.current();
  }, [params]);

  useEffect(() => {
    kickRef.current();
  }, [playing]);

  return engineRef;
}
