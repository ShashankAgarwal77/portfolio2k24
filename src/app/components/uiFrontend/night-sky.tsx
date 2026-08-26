"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { onVeilLift, veilUp } from "@/app/lib/useReveal";

/* ─────────────────────────────────────────────────────────────────────────
   NightSkyHero — the hero's sky, painted rather than photographed.

   Van Gogh's sky moves in currents, not noise: a few large counter-rotating
   eddies, stars that are lamps with halos rather than points, and drifting
   bands of mist. This component borrows that physics abstractly — no
   brushstroke texture, no literal painting — in two moods that follow the
   site theme:

     · dark  — deep indigo night, periwinkle/teal currents, warm lamp stars
     · light — pale morning sky, the same currents in gold and pale blue,
               a sun-glow low on the right where the moon sat at night

   Layer order (back to front):
     base gradient → mist blobs → flow canvas (swirl trails) → star canvas
     → calm zone (readability radial) → ground dissolve → dawn veil → content

   The moving parts and why they're shaped this way:

   · Two canvases, not one. The flow canvas is never cleared — trails decay
     via a destination-out fade so the currents leave paint behind. Stars
     need crisp twinkle, so they live on a second canvas that IS cleared
     every frame. One canvas would smear the stars into the trails.

   · Scroll is the dawn. As the hero scrolls away, stars fade first, then a
     veil in the page's own background color rises over the sky, and the
     content blurs out — the same blur-to-sharp signature the rest of the
     site reveals with, run in reverse. All scroll transforms stay inside
     this section: the work section below has a sticky card stack, and a
     transform/filter on any of its ancestors would break position: sticky.

   · The cursor is a soft vortex. On pointer-fine devices only, an eased
     cursor position feeds one extra eddy into the field and a few pixels of
     parallax into the mist. Eased, because a current that snaps to the
     cursor reads as a toy; one that lags reads as wind.

   · First paint is never empty. The simulation is "warmed" with a few
     hundred pre-run steps so trails exist before the first visible frame,
     and star ignition is gated on the site loader's veil so the sky lights
     up as the veil lifts, not invisibly underneath it.

   · Reduced motion gets a finished painting: warmed trails and lit stars,
     drawn once, no animation loop, no scroll choreography.
   ───────────────────────────────────────────────────────────────────────── */

type Mode = "night" | "dawn";

type Stroke = { c: string; w: number };

type Palette = {
  strokes: Stroke[];
  strokeAlpha: [number, number];
  /** destination-out alpha per frame — how fast trails decay */
  fade: number;
  motes: { count: number; color: string; alpha: number };
  halos: { color: string; core: string; count: number };
  orb: { x: number; y: number; r: number; halo: number; core: string; glow: string };
};

const PALETTES: Record<Mode, Palette> = {
  night: {
    strokes: [
      { c: "125, 155, 255", w: 1 }, // periwinkle — the body of the sky
      { c: "165, 180, 252", w: 1 },
      { c: "125, 211, 252", w: 0.8 },
      { c: "196, 181, 253", w: 0.6 },
      { c: "103, 232, 249", w: 0.4 },
      { c: "252, 211, 77", w: 0.12 }, // rare gold flecks, star-dust in the current
    ],
    strokeAlpha: [0.14, 0.3],
    fade: 0.052,
    motes: { count: 110, color: "255, 244, 214", alpha: 0.85 },
    halos: { color: "253, 230, 138", core: "255, 248, 225", count: 6 },
    orb: { x: 0.78, y: 0.28, r: 15, halo: 130, core: "255, 248, 225", glow: "253, 230, 138" },
  },
  dawn: {
    strokes: [
      { c: "96, 165, 250", w: 1 },
      { c: "147, 197, 253", w: 1 },
      { c: "196, 181, 253", w: 0.5 },
      { c: "251, 191, 36", w: 0.4 },
      { c: "255, 255, 255", w: 0.5 },
    ],
    strokeAlpha: [0.14, 0.26],
    fade: 0.065,
    motes: { count: 36, color: "217, 150, 60", alpha: 0.4 },
    halos: { color: "252, 211, 77", core: "255, 251, 235", count: 3 },
    /* r: 0 — the morning sun is haze-glow only. A hard disk mid-sky lands
       behind the hero copy and reads as a blob, not a sun. */
    orb: { x: 0.8, y: 0.32, r: 0, halo: 220, core: "255, 251, 235", glow: "252, 211, 77" },
  },
};

/* The eddies. Relative coordinates; strength sign is spin direction. The
   layout echoes the painting's double swirl — one large eddy upper-left,
   its counter-rotating partner right of center, a small one near the
   horizon — without quoting it. */
const VORTICES = [
  { x: 0.3, y: 0.34, r: 0.34, s: 30 },
  { x: 0.66, y: 0.24, r: 0.26, s: -24 },
  { x: 0.86, y: 0.6, r: 0.2, s: 18 },
  { x: 0.12, y: 0.72, r: 0.18, s: -14 },
];

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

const currentMode = (): Mode =>
  document.documentElement.classList.contains("dark") ? "night" : "dawn";

function useSky(
  sectionRef: React.RefObject<HTMLDivElement>,
  flowRef: React.RefObject<HTMLCanvasElement>,
  starRef: React.RefObject<HTMLCanvasElement>,
  reduced: boolean
) {
  useEffect(() => {
    const section = sectionRef.current;
    const flow = flowRef.current;
    const starsCanvas = starRef.current;
    if (!section || !flow || !starsCanvas) return;

    const flowCtx = flow.getContext("2d");
    const starCtx = starsCanvas.getContext("2d");
    if (!flowCtx || !starCtx) return;

    let mode: Mode = currentMode();
    let W = 0;
    let H = 0;
    /* Trails are soft by nature — a lower pixel ratio on the flow canvas is
       invisible and halves its fill cost. Stars stay crisp. */
    const flowDpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const starDpr = Math.min(window.devicePixelRatio || 1, 2);

    const coarse = !window.matchMedia("(pointer: fine)").matches;
    const small = window.innerWidth < 768;
    const PARTICLES = small ? 110 : 230;

    type Particle = {
      x: number; y: number; px: number; py: number;
      stroke: Stroke; alpha: number; width: number;
      speed: number; life: number;
    };
    type Mote = { x: number; y: number; r: number; phase: number; tw: number; delay: number };
    type Halo = { x: number; y: number; r: number; halo: number; delay: number };

    let particles: Particle[] = [];
    let motes: Mote[] = [];
    let halos: Halo[] = [];

    const pickStroke = (p: Palette): Stroke => {
      const total = p.strokes.reduce((a, s) => a + s.w, 0);
      let roll = Math.random() * total;
      for (const s of p.strokes) {
        roll -= s.w;
        if (roll <= 0) return s;
      }
      return p.strokes[0];
    };

    const spawn = (pal: Palette, anywhere: boolean): Particle => ({
      x: Math.random() * W,
      y: anywhere ? Math.random() * H : Math.random() * H * 0.9,
      px: 0,
      py: 0,
      stroke: pickStroke(pal),
      alpha: pal.strokeAlpha[0] + Math.random() * (pal.strokeAlpha[1] - pal.strokeAlpha[0]),
      width: 0.7 + Math.random() * 1.1,
      speed: 0.65 + Math.random() * 0.75,
      life: 4000 + Math.random() * 8000,
    });

    const seed = () => {
      const pal = PALETTES[mode];
      particles = Array.from({ length: PARTICLES }, () => {
        const p = spawn(pal, true);
        p.px = p.x;
        p.py = p.y;
        return p;
      });
      /* Stars live in the upper two-thirds; the ground dissolve owns the rest. */
      motes = Array.from({ length: pal.motes.count }, () => ({
        x: Math.random(),
        y: 0.06 + Math.random() * 0.62,
        r: 0.5 + Math.random() * 1.1,
        phase: Math.random() * Math.PI * 2,
        tw: 0.4 + Math.random() * 1.2,
        delay: Math.random() * 1400,
      }));
      const seats: [number, number][] = [
        [0.14, 0.2], [0.36, 0.12], [0.52, 0.3], [0.24, 0.5], [0.62, 0.5], [0.92, 0.14],
      ];
      halos = seats.slice(0, pal.halos.count).map(([x, y], i) => ({
        x, y,
        r: 1.6 + Math.random() * 1.6,
        halo: 26 + Math.random() * 30,
        delay: 250 + i * 140,
      }));
    };

    const resize = () => {
      const rect = flow.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      flow.width = Math.round(W * flowDpr);
      flow.height = Math.round(H * flowDpr);
      flowCtx.setTransform(flowDpr, 0, 0, flowDpr, 0, 0);
      starsCanvas.width = Math.round(W * starDpr);
      starsCanvas.height = Math.round(H * starDpr);
      starCtx.setTransform(starDpr, 0, 0, starDpr, 0, 0);
      seed();
    };

    /* Pointer state — the cursor's eddy, eased toward the real cursor.
       lastMove matters: the eddy only blows while the cursor is actually
       moving. A parked cursor with a permanent vortex traps particles in a
       tight orbit and paints an ever-denser ring around itself. */
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, strength: 0, target: 0, lastMove: 0 };

    const fieldAt = (x: number, y: number, t: number, out: { u: number; v: number }) => {
      const S = Math.min(W, H);
      /* A slow ambient drift, so still air never reads as dead air. */
      let u = 6 + Math.sin(t * 0.00012 + y * 0.004) * 2.5;
      let v = Math.sin(t * 0.00017 + x * 0.003) * 2.2;
      for (let i = 0; i < VORTICES.length; i++) {
        const vo = VORTICES[i];
        /* Eddy centers breathe on decade-long ellipses — a living sky. */
        const cx = (vo.x + Math.sin(t * 0.00003 + i * 1.7) * 0.02) * W;
        const cy = (vo.y + Math.cos(t * 0.000024 + i * 2.3) * 0.016) * H;
        const dx = x - cx;
        const dy = y - cy;
        const r = vo.r * S;
        const d2 = dx * dx + dy * dy;
        const d = Math.sqrt(d2) + 0.0001;
        const f = vo.s * Math.exp(-d2 / (r * r));
        u += (-dy / d) * f;
        v += (dx / d) * f;
      }
      if (pointer.strength > 0.001) {
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const r = 170;
        const d2 = dx * dx + dy * dy;
        const d = Math.sqrt(d2) + 0.0001;
        const f = 26 * pointer.strength * Math.exp(-d2 / (r * r));
        u += (-dy / d) * f;
        v += (dx / d) * f;
      }
      out.u = u;
      out.v = v;
    };

    const vel = { u: 0, v: 0 };

    let fadeFrame = 0;

    const step = (dt: number, t: number) => {
      const pal = PALETTES[mode];
      /* Decay first: yesterday's paint recedes, today's goes on top. */
      flowCtx.globalCompositeOperation = "destination-out";
      flowCtx.fillStyle = `rgba(0, 0, 0, ${pal.fade})`;
      flowCtx.fillRect(0, 0, W, H);
      /* The per-frame fade alone can never finish the job: 8-bit alpha
         rounding leaves every painted pixel stuck at a ~4% ghost floor
         (A·(1−fade) rounds back to A once A < 0.5/fade), so a long session
         slowly silts the whole sky with haze. A stronger pass every ~0.8s
         grinds that floor down to invisibility, and is far too small a
         step to read as a pulse in a moving field. */
      if (++fadeFrame % 48 === 0) {
        flowCtx.fillStyle = "rgba(0, 0, 0, 0.16)";
        flowCtx.fillRect(0, 0, W, H);
      }
      flowCtx.globalCompositeOperation = "source-over";
      flowCtx.lineCap = "round";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life -= dt;
        fieldAt(p.x, p.y, t, vel);
        p.px = p.x;
        p.py = p.y;
        p.x += vel.u * p.speed * (dt / 1000);
        p.y += vel.v * p.speed * (dt / 1000);

        if (p.life <= 0 || p.x < -24 || p.x > W + 24 || p.y < -24 || p.y > H + 24) {
          particles[i] = spawn(pal, false);
          particles[i].px = particles[i].x;
          particles[i].py = particles[i].y;
          continue;
        }

        flowCtx.strokeStyle = `rgba(${p.stroke.c}, ${p.alpha})`;
        flowCtx.lineWidth = p.width;
        flowCtx.beginPath();
        flowCtx.moveTo(p.px, p.py);
        flowCtx.lineTo(p.x, p.y);
        flowCtx.stroke();
      }
    };

    let igniteAt = performance.now();

    const drawStars = (now: number) => {
      const pal = PALETTES[mode];
      starCtx.clearRect(0, 0, W, H);

      /* The orb — moon at night, sun-glow at dawn. */
      const ox = pal.orb.x * W;
      const oy = pal.orb.y * H;
      const orbRamp = easeOutCubic(clamp01((now - igniteAt) / 1600));
      if (orbRamp > 0) {
        const g = starCtx.createRadialGradient(ox, oy, 0, ox, oy, pal.orb.halo);
        g.addColorStop(0, `rgba(${pal.orb.glow}, ${0.5 * orbRamp})`);
        g.addColorStop(0.35, `rgba(${pal.orb.glow}, ${0.16 * orbRamp})`);
        g.addColorStop(1, `rgba(${pal.orb.glow}, 0)`);
        starCtx.fillStyle = g;
        starCtx.beginPath();
        starCtx.arc(ox, oy, pal.orb.halo, 0, Math.PI * 2);
        starCtx.fill();
        if (pal.orb.r > 0) {
          starCtx.fillStyle = `rgba(${pal.orb.core}, ${0.9 * orbRamp})`;
          starCtx.beginPath();
          starCtx.arc(ox, oy, pal.orb.r, 0, Math.PI * 2);
          starCtx.fill();
        }
      }

      /* Lamp stars — a halo is most of what a star is here. */
      for (const h of halos) {
        const ramp = easeOutCubic(clamp01((now - igniteAt - h.delay) / 900));
        if (ramp <= 0) continue;
        const x = h.x * W;
        const y = h.y * H;
        const breathe = 0.82 + 0.18 * Math.sin(now * 0.0006 + h.x * 20);
        const g = starCtx.createRadialGradient(x, y, 0, x, y, h.halo);
        g.addColorStop(0, `rgba(${pal.halos.color}, ${0.34 * ramp * breathe})`);
        g.addColorStop(0.4, `rgba(${pal.halos.color}, ${0.1 * ramp * breathe})`);
        g.addColorStop(1, `rgba(${pal.halos.color}, 0)`);
        starCtx.fillStyle = g;
        starCtx.beginPath();
        starCtx.arc(x, y, h.halo, 0, Math.PI * 2);
        starCtx.fill();
        starCtx.fillStyle = `rgba(${pal.halos.core}, ${0.95 * ramp})`;
        starCtx.beginPath();
        starCtx.arc(x, y, h.r, 0, Math.PI * 2);
        starCtx.fill();
      }

      /* Star dust. */
      for (const m of motes) {
        const ramp = easeOutCubic(clamp01((now - igniteAt - m.delay) / 800));
        if (ramp <= 0) continue;
        const tw = 0.6 + 0.4 * Math.sin(now * 0.001 * m.tw + m.phase);
        starCtx.fillStyle = `rgba(${pal.motes.color}, ${pal.motes.alpha * tw * ramp})`;
        starCtx.beginPath();
        starCtx.arc(m.x * W, m.y * H, m.r, 0, Math.PI * 2);
        starCtx.fill();
      }
    };

    /* Pre-run the flow so the first visible frame already has a painted sky. */
    const warm = (steps: number) => {
      const t = performance.now();
      for (let i = 0; i < steps; i++) step(24, t + i * 24);
    };

    let raf = 0;
    let running = false;
    let last = 0;
    let healFrame = 0;

    const frame = (now: number) => {
      const dt = Math.min(now - last, 48);
      last = now;
      /* Self-heal: ResizeObserver callbacks queued while the document is
         hidden can be lost, leaving the buffer sized for a stale layout
         (the canvas then stretches to fit). Cheap to check, ugly to miss. */
      if (++healFrame % 120 === 0) {
        const r = flow.getBoundingClientRect();
        if (Math.abs(r.width - W) > 2 || Math.abs(r.height - H) > 2) {
          resize();
          warm(80);
        }
      }
      /* Ease the cursor's eddy — lag is what makes it read as wind — and
         let it die down once the cursor has been still for a beat. */
      if (now - pointer.lastMove > 600) pointer.target = 0;
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      pointer.strength += (pointer.target - pointer.strength) * 0.04;
      section.style.setProperty("--sky-mx", `${((pointer.x / Math.max(W, 1)) * 2 - 1).toFixed(3)}`);
      section.style.setProperty("--sky-my", `${((pointer.y / Math.max(H, 1)) * 2 - 1).toFixed(3)}`);
      step(dt, now);
      drawStars(now);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();

    if (reduced) {
      /* A finished painting, no loop: warmed currents, fully lit stars. */
      warm(320);
      igniteAt = -1e7;
      drawStars(performance.now());
      const ro = new ResizeObserver(() => {
        resize();
        warm(320);
        drawStars(performance.now());
      });
      ro.observe(section);
      const mo = new MutationObserver(() => {
        const next = currentMode();
        if (next === mode) return;
        mode = next;
        seed();
        flowCtx.clearRect(0, 0, W, H);
        warm(320);
        drawStars(performance.now());
      });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      return () => {
        ro.disconnect();
        mo.disconnect();
      };
    }

    warm(160);

    /* Star ignition waits for the first-landing veil, so the sky lights up
       as the loader fades instead of invisibly underneath it. */
    let cancelVeil: (() => void) | undefined;
    if (veilUp()) {
      cancelVeil = onVeilLift(() => {
        igniteAt = performance.now() + 200;
      });
      igniteAt = performance.now() + 6000; // failsafe if the event never fires
    }

    const onPointerMove = (e: PointerEvent) => {
      if (coarse) return;
      const rect = section.getBoundingClientRect();
      pointer.tx = e.clientX - rect.left;
      pointer.ty = e.clientY - rect.top;
      pointer.target = 1;
      pointer.lastMove = performance.now();
    };
    const onPointerLeave = () => {
      pointer.target = 0;
    };
    section.addEventListener("pointermove", onPointerMove, { passive: true });
    section.addEventListener("pointerleave", onPointerLeave, { passive: true });

    /* Only animate while the sky can actually be seen — in the viewport AND
       in a visible document. Both observers gate the same start/stop pair. */
    let inView = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && document.visibilityState === "visible") start();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(section);
    const onVisibility = () => {
      if (document.visibilityState === "hidden") stop();
      else if (inView) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(() => {
      resize();
      warm(120);
    });
    ro.observe(section);

    const mo = new MutationObserver(() => {
      const next = currentMode();
      if (next === mode) return;
      mode = next;
      seed();
      flowCtx.clearRect(0, 0, W, H);
      warm(120);
      igniteAt = performance.now() - 2000; // no re-ignition ceremony on toggle
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    start();

    return () => {
      stop();
      cancelVeil?.();
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);
}

export function NightSkyHero({ children }: { children: React.ReactNode }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLCanvasElement>(null);
  const starRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion() ?? false;

  useSky(sectionRef, flowRef, starRef, reduced);

  /* The dawn: 0 at rest, 1 when the hero has fully scrolled away. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const layersY = useTransform(scrollYProgress, [0, 1], ["0%", "11%"]);
  const starsOpacity = useTransform(scrollYProgress, [0.05, 0.55], [1, 0]);
  const dawnOpacity = useTransform(scrollYProgress, [0.12, 0.72], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentBlurPx = useTransform(scrollYProgress, [0.05, 0.5], [0, 7]);
  const contentFilter = useMotionTemplate`blur(${contentBlurPx}px)`;

  return (
    <div ref={sectionRef} className="night-sky relative h-screen overflow-hidden">
      {/* Sky — decorative throughout; screen readers get only the content. */}
      <motion.div
        aria-hidden="true"
        className="night-sky__layers pointer-events-none"
        style={reduced ? undefined : { y: layersY }}
      >
        <div className="night-sky__base" />
        <div className="night-sky__mist">
          <div className="night-sky__mist-blob night-sky__mist-blob--a" />
          <div className="night-sky__mist-blob night-sky__mist-blob--b" />
          <div className="night-sky__mist-blob night-sky__mist-blob--c" />
        </div>
        <motion.canvas
          ref={flowRef}
          className="night-sky__canvas"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />
        <motion.canvas
          ref={starRef}
          className="night-sky__canvas"
          style={reduced ? undefined : { opacity: starsOpacity }}
        />
      </motion.div>

      {/* Static overlays — these track the viewport, not the parallaxed sky. */}
      <div aria-hidden="true" className="night-sky__calm pointer-events-none" />
      <div aria-hidden="true" className="night-sky__ground pointer-events-none" />

      {/* Foreground meadow — the nearest layer, so it tracks the cursor a
          little more than the mist and in the opposite phase of nothing:
          same direction, larger amplitude, which is what sells the depth.
          It sits under the dawn veil so the scroll-away dissolves it with
          the rest of the scene. */}
      <Image
        src="/homepage_assets/hero_section_foreground.png"
        alt=""
        aria-hidden="true"
        width={3840}
        height={960}
        priority
        sizes="100vw"
        draggable={false}
        className="night-sky__foreground pointer-events-none select-none"
      />

      <motion.div
        aria-hidden="true"
        className="night-sky__dawn pointer-events-none"
        style={reduced ? undefined : { opacity: dawnOpacity }}
      />

      <motion.div
        className="relative z-10 h-full"
        style={
          reduced
            ? undefined
            : { y: contentY, opacity: contentOpacity, filter: contentFilter }
        }
      >
        {children}
      </motion.div>
    </div>
  );
}
