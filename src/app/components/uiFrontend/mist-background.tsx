"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────
   MistBackground — WebGL FBM mist, the work section's background.

   Adapted from a reference shader (domain-warped fractal brownian motion:
   fbm(uv + fbm(uv + fbm(uv))) gives the fluid, self-folding mist) with
   this site's changes:

   · Scoped to the section, not the page — the canvas fills the work
     section behind its content; a CSS mask feathers its top edge into
     the hero's meadow and its bottom into the page, so the mist reads
     as having drifted down from the hero scene.
   · Theme-reactive — palette uniforms follow the `dark` class live
     (night: page void → moonlit indigo mist with periwinkle folds;
     dawn: paper → pale blue mist with warm cream folds). The base color
     IS the page background, so unmasked mist blends seamlessly.
   · Cursor glow is warm lamp-gold, the same light the stars carry.
   · Performance (the deployed site has lagged before): the buffer
     renders at 0.45× CSS size (soft mist hides upscaling entirely) with
     dpr capped at 1, fbm runs 5 octaves not 6, the loop pauses when the
     section is offscreen or the tab is hidden, and time accumulates only
     while running so resume never jumps. Reduced motion renders exactly
     one frame and stops.
   ───────────────────────────────────────────────────────────────────────── */

const RES_SCALE = 0.45;

const VS = /* glsl */ `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FS = /* glsl */ `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec3 u_base;
uniform vec3 u_mist;
uniform vec3 u_accent;
uniform vec3 u_glow;
uniform float u_gain;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.x *= u_resolution.x / u_resolution.y;

  vec2 mPos = u_mouse / u_resolution.xy;
  mPos.x *= u_resolution.x / u_resolution.y;
  float dist = distance(uv, mPos);

  vec2 q = vec2(fbm(uv + 0.05 * u_time), fbm(uv + vec2(1.0, 1.0)));
  vec2 r = vec2(
    fbm(uv + q + vec2(1.7, 9.2) + 0.11 * u_time),
    fbm(uv + q + vec2(8.3, 2.8) + 0.09 * u_time)
  );
  float f = fbm(uv + r);

  vec3 color = mix(u_base, u_mist, f);
  color = mix(color, u_accent, dot(q, r) * 0.45);

  float mouseGlow = smoothstep(0.4, 0.0, dist);
  color = mix(color, u_glow, mouseGlow * 0.07);

  gl_FragColor = vec4(color * u_gain, 1.0);
}`;

type Palette = {
  base: [number, number, number];
  mist: [number, number, number];
  accent: [number, number, number];
  glow: [number, number, number];
  gain: number;
};

/* base = the page background itself, so the masked edges dissolve into
   the page with no seam. */
const NIGHT: Palette = {
  base: [0.008, 0.024, 0.09], // #020617
  mist: [0.21, 0.25, 0.4],
  accent: [0.34, 0.4, 0.6],
  glow: [0.95, 0.86, 0.5], // lamp gold, same family as the stars
  gain: 1.1,
};

const DAWN: Palette = {
  base: [0.973, 0.98, 0.988], // #f8fafc
  mist: [0.79, 0.84, 0.93],
  accent: [0.96, 0.9, 0.77],
  glow: [0.99, 0.87, 0.55],
  gain: 1.0,
};

const isDark = () => document.documentElement.classList.contains("dark");

export function MistBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) return; // no context — the page background simply shows

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VS));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const posAttrib = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posAttrib);
    gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);

    const loc = {
      time: gl.getUniformLocation(program, "u_time"),
      res: gl.getUniformLocation(program, "u_resolution"),
      mouse: gl.getUniformLocation(program, "u_mouse"),
      base: gl.getUniformLocation(program, "u_base"),
      mist: gl.getUniformLocation(program, "u_mist"),
      accent: gl.getUniformLocation(program, "u_accent"),
      glow: gl.getUniformLocation(program, "u_glow"),
      gain: gl.getUniformLocation(program, "u_gain"),
    };

    const applyPalette = () => {
      const p = isDark() ? NIGHT : DAWN;
      gl.uniform3fv(loc.base, p.base);
      gl.uniform3fv(loc.mist, p.mist);
      gl.uniform3fv(loc.accent, p.accent);
      gl.uniform3fv(loc.glow, p.glow);
      gl.uniform1f(loc.gain, p.gain);
    };
    applyPalette();

    let W = 0;
    let H = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width * RES_SCALE));
      H = Math.max(1, Math.round(rect.height * RES_SCALE));
      if (canvas.width !== W || canvas.height !== H) {
        canvas.width = W;
        canvas.height = H;
        gl.viewport(0, 0, W, H);
      }
    };
    resize();

    /* Eased cursor in buffer space; parked far away until it moves. */
    const mouse = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4 };
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - rect.left) * RES_SCALE;
      mouse.ty = (rect.height - (e.clientY - rect.top)) * RES_SCALE;
    };

    /* Time advances only while rendering — pausing never causes a jump. */
    let t = 0;
    let last = 0;
    let raf = 0;
    let running = false;

    /* Scroll-linked visibility: the canvas overlaps the hero's bottom for
       the blend, but the fog belongs to the WORK section — so it is fully
       transparent while the section sits below the viewport (the hero at
       rest stays clean) and scrubs in as the section approaches, reaching
       full strength once the section top is ~45% up the screen. Scrolling
       back up reverses it. Host = .work-atmosphere, which spans exactly
       the section. */
    const host = canvas.parentElement;
    const updateVisibility = () => {
      if (!host) return 1;
      const top = host.getBoundingClientRect().top;
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - top) / (vh * 0.55)));
      canvas.style.opacity = p.toFixed(3);
      return p;
    };

    const drawFrame = () => {
      gl.uniform1f(loc.time, t);
      gl.uniform2f(loc.res, W, H);
      gl.uniform2f(loc.mouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const frame = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      /* Invisible fog costs nothing: skip the draw (and hold time still)
         while the scroll position keeps the canvas at opacity 0. */
      if (updateVisibility() > 0.001) {
        t += dt * 0.001;
        mouse.x += (mouse.tx - mouse.x) * 0.05;
        mouse.y += (mouse.ty - mouse.y) * 0.05;
        drawFrame();
      }
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

    /* First frame immediately: an opaque WebGL canvas is BLACK until its
       first draw, and the loop only starts once the section scrolls into
       view — without this, the section top could flash black. */
    updateVisibility();
    drawFrame();

    const mo = new MutationObserver(() => {
      applyPalette();
      if (!running) drawFrame();
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) drawFrame();
    });
    ro.observe(canvas);

    if (reduced) {
      /* One finished frame, no loop, no cursor — visibility still follows
         scroll so the hero stays clean at rest. */
      t = 8;
      drawFrame();
      const onScroll = () => updateVisibility();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        mo.disconnect();
        ro.disconnect();
        window.removeEventListener("scroll", onScroll);
      };
    }

    let inView = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && document.visibilityState === "visible") start();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(canvas);
    const onVisibility = () => {
      if (document.visibilityState === "hidden") stop();
      else if (inView) start();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      stop();
      io.disconnect();
      mo.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("mousemove", onMouseMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return <canvas ref={canvasRef} className="work-atmosphere__mist" aria-hidden="true" />;
}
