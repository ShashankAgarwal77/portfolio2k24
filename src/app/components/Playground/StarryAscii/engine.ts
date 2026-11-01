/* ─────────────────────────────────────────────────────────────────────────
   Starry Night, in ASCII — the render engine.

   No DOM, no React: give it a canvas and a params object and it paints.
   The scene is computed as a luminance field (plus a "kind" per cell: sky,
   star, moon, cypress, village, lit window), then every cell is set as one
   glyph from the character ramp.

   How the sky moves: the painting's currents are a stream function — a
   horizontal wind plus a handful of gaussian vortices. Banding that
   function (sin of it) draws stripes that run ALONG the streamlines, which
   is exactly what Van Gogh's strokes do: they bend around the swirls.
   Rotating dashes along each vortex break the stripes into dabs and give
   the whole thing its slow churn.

   Speed: glyphs are blitted from a lazily built sprite atlas (one sprite
   per kind × glyph × colour level), so a frame is one drawImage per cell
   instead of one fillText per cell.
   ───────────────────────────────────────────────────────────────────────── */

export type ColorMode = "mono" | "tint" | "full";
export type PointerMode = "swirl" | "lantern";
export type Theme = "dark" | "light";

export interface StarryParams {
  ramp: string;
  cellSize: number;
  exposure: number;
  contrast: number;
  swirl: number;
  speed: number;
  strokeScale: number;
  stars: number;
  twinkle: number;
  halo: number;
  colorMode: ColorMode;
  tint: TintKey;
  pointerStrength: number;
  pointerRadius: number;
  pointerMode: PointerMode;
  moon: boolean;
  cypress: boolean;
  village: boolean;
  seed: number;
}

export const RAMPS = {
  classic: " .:-=+*#%@",
  bourke:
    " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
  blocks: " ░▒▓█",
  dots: " ·•●",
  stars: " .·:+*✦",
  vincent: " .,:vincentVG",
  binary: " 01",
} as const;
export type RampKey = keyof typeof RAMPS;

export const TINTS = {
  prussian: { label: "Prussian", dark: "#7aa7ff", light: "#1d3f8f" },
  chrome: { label: "Chrome yellow", dark: "#f6cf5f", light: "#9a6b00" },
  viridian: { label: "Viridian", dark: "#5fd3a5", light: "#13664a" },
  vermilion: { label: "Vermilion", dark: "#ff8a66", light: "#b23a1c" },
} as const;
export type TintKey = keyof typeof TINTS;

export const DEFAULT_PARAMS: StarryParams = {
  ramp: RAMPS.classic,
  cellSize: 13,
  exposure: 1.1,
  contrast: 1.15,
  swirl: 1,
  speed: 1,
  strokeScale: 1,
  stars: 14,
  twinkle: 0.6,
  halo: 1,
  colorMode: "full",
  tint: "chrome",
  pointerStrength: 1,
  pointerRadius: 0.18,
  pointerMode: "swirl",
  moon: true,
  cypress: true,
  village: true,
  seed: 1889,
};

/* Cell kinds. Each has its own colour ramp in full-colour mode. */
const SKY = 0;
const STAR = 1;
const MOON = 2;
const CYPRESS = 3;
const VILLAGE = 4;
const WINDOW = 5;
const KINDS = 6;
const LEVELS = 16;
const MAX_GLYPHS = 128;

/* Full-colour ramps, dim → bright. Dark theme is light-on-night; light
   theme is ink-on-paper, so its ramps run pale → saturated instead. */
const FULL: Record<Theme, string[][]> = {
  dark: [
    ["#1b3a7c", "#2f62b5", "#5a95d6", "#a6d0ea", "#f2f6dc"],
    ["#5c4c1c", "#c9a63e", "#f4d468", "#fff4c2", "#ffffff"],
    ["#7a4610", "#d98a2b", "#f5b54a", "#ffe2a0", "#fff8e6"],
    ["#0d2418", "#1d4a30", "#2f6e45", "#4f9a62", "#9ccf8e"],
    ["#1a2147", "#36427a", "#5d6aa6", "#8e98cc", "#c9cff0"],
    ["#a0601a", "#f0a63c", "#ffcf6b", "#ffe7a8", "#fff6dc"],
  ],
  light: [
    ["#b9c7e2", "#7f98c9", "#4469ad", "#25478f", "#132c66"],
    ["#e0c47c", "#c99a2e", "#a87710", "#835a00", "#5e3f00"],
    ["#ebb27a", "#d98a3a", "#b8650e", "#8e4a06", "#663300"],
    ["#9fb59a", "#5f7f5c", "#36573a", "#1f3a24", "#0f2214"],
    ["#a7a9c4", "#7c7fa3", "#555a82", "#363b62", "#1f2344"],
    ["#e8a640", "#c98219", "#a5650a", "#7f4b04", "#5a3300"],
  ],
};

const THEME = {
  dark: { bg: "#020617", ink: "#e2e8f0" },
  light: { bg: "#f8fafc", ink: "#0f172a" },
};

/* ── small maths ─────────────────────────────────────────────────────── */

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

function hex(h: string): [number, number, number] {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rampColor(stops: string[], t: number): [number, number, number] {
  const x = clamp01(t) * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(x));
  const f = x - i;
  const a = hex(stops[i]);
  const b = hex(stops[i + 1]);
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
}

function mix(a: [number, number, number], b: [number, number, number], t: number) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

const rgb = (c: number[], a = 1) =>
  `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

/** mulberry32 — tiny seeded PRNG. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash2(i: number, j: number, s: number) {
  let h = Math.imul(i, 374761393) + Math.imul(j, 668265263) + Math.imul(s, 982451653);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function noise(x: number, y: number, s: number) {
  const i = Math.floor(x);
  const j = Math.floor(y);
  const fx = x - i;
  const fy = y - j;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = hash2(i, j, s);
  const b = hash2(i + 1, j, s);
  const c = hash2(i, j + 1, s);
  const d = hash2(i + 1, j + 1, s);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}

/* ── scene furniture ─────────────────────────────────────────────────── */

interface Vortex {
  u: number;
  v: number;
  r: number;
  rings: number;
  spin: number;
  dashes: number;
  orbit: number;
  phase: number;
}

interface Star {
  u: number;
  v: number;
  core: number;
  halo: number;
  freq: number;
  phase: number;
}

interface House {
  u0: number;
  u1: number;
  base: number;
  top: number;
  roof: number;
  windows: { u: number; v: number }[];
}

/* The painting's composition, roughly: a rolling double swirl through the
   middle, smaller eddies scattered around it. */
const VORTICES: Vortex[] = [
  { u: 0.42, v: 0.36, r: 0.14, rings: 4, spin: 1, dashes: 5, orbit: 0.012, phase: 0 },
  { u: 0.63, v: 0.29, r: 0.11, rings: -3.5, spin: -1, dashes: 4, orbit: 0.01, phase: 2 },
  { u: 0.22, v: 0.16, r: 0.07, rings: 2.5, spin: 1, dashes: 3, orbit: 0.008, phase: 4 },
  { u: 0.78, v: 0.52, r: 0.08, rings: 2.5, spin: 1, dashes: 3, orbit: 0.01, phase: 1 },
  { u: 0.3, v: 0.6, r: 0.06, rings: -2, spin: -1, dashes: 3, orbit: 0.006, phase: 3 },
  { u: 0.95, v: 0.38, r: 0.06, rings: 2, spin: 1, dashes: 3, orbit: 0.006, phase: 5 },
];

const MOON_U = 0.86;
const MOON_V = 0.17;
const MOON_R = 0.075;

function hill(u: number) {
  return 0.76 + 0.022 * Math.sin(u * 7 + 0.6) + 0.012 * Math.sin(u * 17 + 2.1);
}

/* ── the engine ──────────────────────────────────────────────────────── */

export class StarryEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private params: StarryParams = { ...DEFAULT_PARAMS };
  private theme: Theme = "dark";

  private dpr = 1;
  private cssW = 0;
  private cssH = 0;
  private cw = 8;
  private ch = 12;
  private cols = 0;
  private rows = 0;
  private ox = 0;
  private oy = 0;
  private aspect = 1;

  private lum = new Float32Array(0);
  private kind = new Uint8Array(0);
  private glyph = new Uint8Array(0);
  private us = new Float32Array(0);
  private vs = new Float32Array(0);

  private glyphs: string[] = [];
  private blank: boolean[] = [];
  private atlas: HTMLCanvasElement;
  private actx: CanvasRenderingContext2D;
  private slots = new Int32Array(KINDS * MAX_GLYPHS * LEVELS);
  private nextSlot = 0;
  private atlasCols = 32;

  private stars: Star[] = [];
  private houses: House[] = [];
  private windowCells = new Map<number, number>();

  private flowT = 0;
  private clock = 0;
  private pointer = { u: -1, v: -1, lastMove: -1e9, act: 0 };
  private ripples: { u: number; v: number; t: number }[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false })!;
    this.atlas = document.createElement("canvas");
    this.actx = this.atlas.getContext("2d")!;
    this.seedScene();
  }

  /* ── configuration ─────────────────────────────────────────────────── */

  setParams(next: StarryParams) {
    const prev = this.params;
    this.params = { ...next };
    if (next.seed !== prev.seed) this.seedScene();
    if (next.cellSize !== prev.cellSize || next.ramp !== prev.ramp) {
      this.layout();
    } else if (next.colorMode !== prev.colorMode || next.tint !== prev.tint) {
      this.resetAtlas();
    }
  }

  setTheme(theme: Theme) {
    if (theme === this.theme) return;
    this.theme = theme;
    this.resetAtlas();
  }

  resize(cssW: number, cssH: number, dpr: number) {
    this.cssW = Math.max(1, cssW);
    this.cssH = Math.max(1, cssH);
    this.dpr = dpr;
    this.layout();
  }

  /* ── pointer ───────────────────────────────────────────────────────── */

  pointerMove(x: number, y: number) {
    this.pointer.u = x / this.cssW;
    this.pointer.v = y / this.cssH;
    this.pointer.lastMove = this.clock;
  }

  pointerLeave() {
    this.pointer.lastMove = -1e9;
  }

  ripple(x: number, y: number) {
    this.ripples.push({ u: x / this.cssW, v: y / this.cssH, t: this.clock });
    if (this.ripples.length > 6) this.ripples.shift();
  }

  /* ── time ──────────────────────────────────────────────────────────── */

  /** Advance the simulation by dt seconds. */
  step(dt: number) {
    this.clock += dt;
    this.flowT += dt * this.params.speed;
    const target = this.clock - this.pointer.lastMove < 0.7 ? 1 : 0;
    this.pointer.act += (target - this.pointer.act) * Math.min(1, dt * (target ? 6 : 1.6));
    this.ripples = this.ripples.filter((r) => this.clock - r.t < 2.4);
  }

  /* ── output ────────────────────────────────────────────────────────── */

  get background() {
    return THEME[this.theme].bg;
  }

  get grid() {
    return { cols: this.cols, rows: this.rows };
  }

  toText() {
    const lines: string[] = [];
    for (let r = 0; r < this.rows; r++) {
      let line = "";
      for (let c = 0; c < this.cols; c++) {
        line += this.glyphs[this.glyph[r * this.cols + c]] ?? " ";
      }
      lines.push(line.replace(/\s+$/, ""));
    }
    return lines.join("\n");
  }

  render() {
    if (!this.cols || !this.rows) return;
    this.compute();
    this.draw();
  }

  /* ── internals ─────────────────────────────────────────────────────── */

  private seedScene() {
    const rand = rng(this.params.seed);

    /* Star 0 is the painting's big morning star beside the cypress; the
       rest scatter across the upper sky, kept clear of the moon. */
    const stars: Star[] = [
      { u: 0.29, v: 0.27, core: 0.016, halo: 0.07, freq: 0.9, phase: 0 },
    ];
    let guard = 0;
    while (stars.length < 60 && guard++ < 2000) {
      const u = 0.03 + rand() * 0.94;
      const v = 0.04 + rand() * 0.56;
      if (Math.hypot(u - MOON_U, v - MOON_V) < 0.14) continue;
      if (stars.some((s) => Math.hypot(s.u - u, s.v - v) < 0.07)) continue;
      const big = rand() < 0.3;
      const core = big ? 0.011 + rand() * 0.008 : 0.005 + rand() * 0.005;
      stars.push({
        u,
        v,
        core,
        halo: core * (3.5 + rand() * 3),
        freq: 0.6 + rand() * 2.2,
        phase: rand() * Math.PI * 2,
      });
    }
    this.stars = stars;

    /* The village: houses huddled on the lower slope, a lit window or two
       each. Widths are in height units so roofs stay square on any screen. */
    const houses: House[] = [];
    let u = 0.33 + rand() * 0.03;
    while (u < 0.97) {
      const w = 0.05 + rand() * 0.045;
      const base = 0.88 + rand() * 0.07;
      const tall = 0.04 + rand() * 0.035;
      const windows = [];
      const nWin = 1 + Math.floor(rand() * 2);
      for (let k = 0; k < nWin; k++) {
        windows.push({ u: (k + 0.5 + (rand() - 0.5) * 0.4) / nWin, v: 0.35 + rand() * 0.35 });
      }
      houses.push({ u0: u, u1: w, base, top: tall, roof: tall * (0.45 + rand() * 0.3), windows });
      u += w * 0.7 + 0.01 + rand() * 0.04;
    }
    this.houses = houses;
    this.mapWindows();
  }

  private layout() {
    const p = this.params;
    this.glyphs = Array.from(p.ramp.length ? p.ramp : " ").slice(0, MAX_GLYPHS);
    this.blank = this.glyphs.map((g) => g.trim() === "");

    const font = this.font();
    this.actx.font = font;
    const m = this.actx.measureText("M").width;
    this.cw = Math.max(2, Math.round(m));
    this.ch = Math.max(3, Math.round(p.cellSize * this.dpr * 1.12));

    const W = Math.round(this.cssW * this.dpr);
    const H = Math.round(this.cssH * this.dpr);
    if (this.canvas.width !== W) this.canvas.width = W;
    if (this.canvas.height !== H) this.canvas.height = H;

    this.cols = Math.max(1, Math.floor(W / this.cw));
    this.rows = Math.max(1, Math.floor(H / this.ch));
    this.ox = Math.floor((W - this.cols * this.cw) / 2);
    this.oy = Math.floor((H - this.rows * this.ch) / 2);
    this.aspect = (this.cols * this.cw) / (this.rows * this.ch);

    const n = this.cols * this.rows;
    this.lum = new Float32Array(n);
    this.kind = new Uint8Array(n);
    this.glyph = new Uint8Array(n);
    this.us = new Float32Array(this.cols);
    this.vs = new Float32Array(this.rows);
    for (let c = 0; c < this.cols; c++) this.us[c] = (c + 0.5) / this.cols;
    for (let r = 0; r < this.rows; r++) this.vs[r] = (r + 0.5) / this.rows;

    this.mapWindows();
    this.resetAtlas();
  }

  private font() {
    return `${Math.round(this.params.cellSize * this.dpr)}px ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace`;
  }

  /* Each window lands on exactly one cell whatever the cell size, so a
     coarse grid still gets its lights instead of aliasing them away. */
  private mapWindows() {
    this.windowCells.clear();
    if (!this.cols) return;
    const A = this.aspect;
    this.houses.forEach((h, hi) => {
      h.windows.forEach((w, wi) => {
        const u = h.u0 + (w.u * h.u1) / A;
        const v = h.base - h.top * (1 - w.v);
        const c = Math.min(this.cols - 1, Math.floor(u * this.cols));
        const r = Math.min(this.rows - 1, Math.floor(v * this.rows));
        this.windowCells.set(r * this.cols + c, hi * 3.1 + wi * 1.7);
      });
    });
  }

  private resetAtlas() {
    this.slots.fill(-1);
    this.nextSlot = 0;
    const cap = KINDS * (this.glyphs.length + LEVELS);
    const rows = Math.ceil(cap / this.atlasCols);
    this.atlas.width = this.atlasCols * this.cw;
    this.atlas.height = rows * this.ch;
    this.atlasCap = rows * this.atlasCols;
  }
  private atlasCap = 0;

  private colorFor(kind: number, level: number) {
    const t = level / (LEVELS - 1);
    const p = this.params;
    if (p.colorMode === "mono") {
      return rgb(hex(THEME[this.theme].ink), 0.3 + 0.7 * t);
    }
    if (p.colorMode === "tint") {
      const tint = hex(TINTS[p.tint][this.theme]);
      const bg = hex(THEME[this.theme].bg);
      /* Stars and the moon get pushed toward the theme's ink so they still
         pop in a one-hue palette. */
      const hot = kind === STAR || kind === MOON || kind === WINDOW;
      const base = mix(bg, tint, 0.35 + 0.65 * t) as [number, number, number];
      return rgb(hot ? mix(base, hex(THEME[this.theme].ink), 0.35 * t) : base);
    }
    return rgb(rampColor(FULL[this.theme][kind], t));
  }

  /** Sprite slot for (kind, glyph, level); drawn on first use. */
  private slot(kind: number, g: number, level: number) {
    const key = (kind * MAX_GLYPHS + g) * LEVELS + level;
    let s = this.slots[key];
    if (s >= 0) return s;
    if (this.nextSlot >= this.atlasCap) {
      /* Atlas full (a long custom ramp): grow it and start over. */
      const rows = Math.ceil(this.atlasCap / this.atlasCols) * 2;
      this.slots.fill(-1);
      this.nextSlot = 0;
      this.atlas.height = rows * this.ch;
      this.atlasCap = rows * this.atlasCols;
    }
    s = this.nextSlot++;
    this.slots[key] = s;
    const x = (s % this.atlasCols) * this.cw;
    const y = Math.floor(s / this.atlasCols) * this.ch;
    const a = this.actx;
    a.clearRect(x, y, this.cw, this.ch);
    a.font = this.font();
    a.textAlign = "center";
    a.textBaseline = "middle";
    a.fillStyle = this.colorFor(kind, level);
    a.fillText(this.glyphs[g], x + this.cw / 2, y + this.ch / 2 + this.dpr * 0.5);
    return s;
  }

  private compute() {
    const p = this.params;
    const { cols, rows, us, vs, lum, kind } = this;
    const A = this.aspect;
    const T = this.flowT;
    const clock = this.clock;
    const swirl = p.swirl;
    const B = 10 * p.strokeScale;
    const TAU = Math.PI * 2;
    const seed = p.seed;

    /* Vortices drift on small orbits so the composition breathes. */
    const vx: number[] = [];
    const vy: number[] = [];
    const vr2: number[] = [];
    const vk: number[] = [];
    const vs_: number[] = [];
    const vd: number[] = [];
    for (const v of VORTICES) {
      vx.push(v.u * A + Math.cos(T * 0.13 + v.phase) * v.orbit * 3);
      vy.push(v.v + Math.sin(T * 0.11 + v.phase) * v.orbit * 2);
      vr2.push(v.r * v.r);
      vk.push(v.rings * swirl * p.strokeScale);
      vs_.push(v.spin);
      vd.push(v.dashes);
    }

    /* The pointer is one more vortex — or, in lantern mode, a glow. */
    const pa = this.pointer.act * p.pointerStrength;
    const pr = p.pointerRadius;
    const pu = this.pointer.u * A;
    const pv = this.pointer.v;
    if (pa > 0.01 && p.pointerMode === "swirl") {
      vx.push(pu);
      vy.push(pv);
      vr2.push(pr * pr);
      vk.push(3.5 * pa * p.strokeScale);
      vs_.push(1);
      vd.push(5);
    }
    const nv = vx.length;
    const lantern = pa > 0.01 && p.pointerMode === "lantern" ? pa : 0;

    const rip = this.ripples.map((r) => ({
      x: r.u * A,
      y: r.v,
      rad: (clock - r.t) * 0.55,
      fade: 1 - (clock - r.t) / 2.4,
    }));

    for (let r = 0; r < rows; r++) {
      const v = vs[r];
      const row = r * cols;
      for (let c = 0; c < cols; c++) {
        const u = us[c];
        const x = u * A;
        const i = row + c;

        /* Stream function: horizontal wind with a lazy wobble… */
        const n = noise(x * 2.2, v * 2.2 + T * 0.03, seed);
        let psi = B * (v + 0.025 * Math.sin(x * 5 + T * 0.25) + 0.05 * (n - 0.5));
        let wsum = 0;
        let dash = 0;
        /* …plus the vortices, which wrap the wind's stripes into rings. */
        for (let k = 0; k < nv; k++) {
          const dx = x - vx[k];
          const dy = v - vy[k];
          const d2 = dx * dx + dy * dy;
          if (d2 > vr2[k] * 25) continue;
          const g = Math.exp(-Math.sqrt(d2 / vr2[k]));
          psi += vk[k] * g;
          if (g > 0.03) {
            const w = Math.sqrt(g);
            dash += w * Math.sin(vd[k] * Math.atan2(dy, dx) - vs_[k] * T * 0.9);
            wsum += w;
          }
        }
        const w0 = Math.max(0, 1 - wsum);
        dash += w0 * Math.sin(x * 22 * p.strokeScale + n * 4 - T * 0.7);
        dash /= wsum + w0 || 1;

        /* Cubed band = thin bright strokes over a dark ground, so the
           structure reads instead of dissolving into texture. */
        const band = 0.5 + 0.5 * Math.sin(psi * TAU);
        let L =
          0.04 +
          0.6 * band * band * band * (0.6 + 0.4 * dash) +
          0.08 * n;

        if (lantern) {
          const dx = x - pu;
          const dy = v - pv;
          L += lantern * 0.55 * Math.exp(-(dx * dx + dy * dy) / (pr * pr));
        }
        for (let k = 0; k < rip.length; k++) {
          const q = rip[k];
          const d = Math.hypot(x - q.x, v - q.y) - q.rad;
          L += 0.6 * q.fade * Math.exp(-(d * d) / 0.0009);
        }

        lum[i] = L;
        kind[i] = SKY;
      }
    }

    if (p.moon) this.paintMoon();
    this.paintStars();
    this.paintTerrain();
    this.quantise();
  }

  private paintMoon() {
    const { cols, rows, us, vs, lum, kind } = this;
    const A = this.aspect;
    const p = this.params;
    const mx = MOON_U * A;
    const reach = MOON_R * (2.4 + 2 * p.halo);
    const c0 = Math.max(0, Math.floor(((mx - reach) / A) * cols));
    const c1 = Math.min(cols - 1, Math.ceil(((mx + reach) / A) * cols));
    const r0 = Math.max(0, Math.floor((MOON_V - reach) * rows));
    const r1 = Math.min(rows - 1, Math.ceil((MOON_V + reach) * rows));
    const T = this.flowT;
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        const i = r * cols + c;
        const dx = us[c] * A - mx;
        const dy = vs[r] - MOON_V;
        const d = Math.hypot(dx, dy);
        /* Crescent: the disc minus an offset disc. */
        const bite = Math.hypot(dx + MOON_R * 0.5, dy + MOON_R * 0.2);
        if (d < MOON_R && bite > MOON_R * 0.88) {
          lum[i] = 1.05;
          kind[i] = MOON;
          continue;
        }
        if (d < MOON_R) {
          lum[i] = Math.max(lum[i] * 0.4, 0.22);
          kind[i] = MOON;
          continue;
        }
        const h = d / (MOON_R * (1 + p.halo * 1.4));
        const glow = Math.exp(-h * 1.6) * (0.55 + 0.45 * Math.cos(h * 9 - T * 0.8));
        const add = 0.75 * glow * p.halo;
        lum[i] += add;
        if (add > 0.16) kind[i] = MOON;
      }
    }
  }

  private paintStars() {
    const { cols, rows, us, vs, lum, kind } = this;
    const A = this.aspect;
    const p = this.params;
    const T = this.flowT;
    const n = Math.min(this.stars.length, Math.round(p.stars));
    for (let s = 0; s < n; s++) {
      const st = this.stars[s];
      const sx = st.u * A;
      const halo = st.halo * (0.4 + p.halo * 0.9);
      const reach = Math.max(st.core * 2.5, halo * 2.2);
      const tw =
        1 + p.twinkle * 0.55 * Math.sin(this.clock * st.freq * 2.4 + st.phase);
      const c0 = Math.max(0, Math.floor(((sx - reach) / A) * cols));
      const c1 = Math.min(cols - 1, Math.ceil(((sx + reach) / A) * cols));
      const r0 = Math.max(0, Math.floor((st.v - reach) * rows));
      const r1 = Math.min(rows - 1, Math.ceil((st.v + reach) * rows));
      /* A core smaller than a cell would vanish; floor it at half a cell. */
      const minCore = 0.6 / rows;
      const core = Math.max(st.core * 1.4, minCore);
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const i = r * cols + c;
          const dx = us[c] * A - sx;
          const dy = vs[r] - st.v;
          const d = Math.hypot(dx, dy);
          const cv = Math.exp(-((d / core) ** 2)) * 1.25;
          const hv =
            halo > 0
              ? 0.5 *
                Math.exp(-d / (halo * 0.55)) *
                (0.55 + 0.45 * Math.cos((d / halo) * 8 - T * 1.1 + st.phase))
              : 0;
          const add = (cv + hv) * tw;
          lum[i] += add;
          if (add > 0.2 && kind[i] !== MOON) kind[i] = STAR;
        }
      }
    }
  }

  private paintTerrain() {
    const { cols, rows, us, vs, lum, kind } = this;
    const A = this.aspect;
    const p = this.params;
    const T = this.flowT;
    const clock = this.clock;

    /* Steeple first: it pokes above the hills into the sky. */
    const steepleU = 0.62;
    const steepleW = 0.011;
    const steepleTop = 0.6;

    for (let r = 0; r < rows; r++) {
      const v = vs[r];
      for (let c = 0; c < cols; c++) {
        const u = us[c];
        const x = u * A;
        const i = r * cols + c;
        const hv = hill(u);

        if (p.village) {
          const dx = Math.abs(x - steepleU * A);
          const spire = steepleTop + (dx / steepleW) * 0.05;
          if (dx < steepleW && v > spire && v < hv + 0.05) {
            lum[i] = 0.55;
            kind[i] = VILLAGE;
          }
        }

        if (v > hv) {
          /* Ground: moonlit ridge line, then horizontal field strokes. */
          const depth = v - hv;
          const ridge = depth < 1.2 / rows ? 0.5 : 0;
          const field =
            0.12 + 0.16 * (0.5 + 0.5 * Math.sin(v * 95 + Math.sin(x * 6) * 3));
          lum[i] = Math.max(ridge, field);
          kind[i] = VILLAGE;

          if (p.village) {
            for (const h of this.houses) {
              const hx = h.u0 * A;
              const hw = h.u1;
              const lx = x - hx;
              if (lx < 0 || lx > hw) continue;
              const top = h.base - h.top;
              const roofLine = top - h.roof * (1 - Math.abs(lx / hw - 0.5) * 2);
              if (v > roofLine && v < h.base) {
                lum[i] = v < top ? 0.62 : 0.42;
              }
            }
          }
        }

        if (p.cypress) {
          /* The cypress: a flame. Width swells from the tip, flickers in
             lobes, and the tip sways the most. */
          const tip = 0.1;
          if (v > tip) {
            const t = (v - tip) / (1 - tip);
            const lobe = 0.012 * Math.sin(v * 38 + T * 1.3) * t;
            const half = 0.095 * Math.pow(t, 0.55) * (1 - 0.18 * t) + lobe;
            const sway = 0.014 * Math.sin(T * 0.7 + v * 5) * (1 - t);
            const dx = x - 0.16 * A - sway;
            if (Math.abs(dx) < half) {
              const k = dx / half;
              /* Vertical, wavering strokes — the cypress burns upward
                 while the sky flows sideways. */
              const stroke =
                0.5 + 0.5 * Math.sin(k * 9 + Math.sin(v * 22 - T * 1.2) * 1.4);
              const rim = Math.abs(k) > 0.8 ? 0.12 : 0;
              lum[i] = 0.28 + 0.34 * stroke * stroke + rim;
              kind[i] = CYPRESS;
            }
          }
        }
      }
    }

    if (p.village) {
      this.windowCells.forEach((phase, i) => {
        if (i >= lum.length || kind[i] === CYPRESS) return;
        lum[i] = 0.92 + 0.12 * Math.sin(clock * 1.7 + phase) * Math.sin(clock * 0.53 + phase * 2);
        kind[i] = WINDOW;
      });
    }
  }

  private quantise() {
    const p = this.params;
    const { lum, glyph } = this;
    const ng = this.glyphs.length;
    const ex = p.exposure;
    const ct = p.contrast;
    for (let i = 0; i < lum.length; i++) {
      let L = (lum[i] * ex - 0.5) * ct + 0.5;
      L = L < 0 ? 0 : L > 1 ? 1 : L;
      lum[i] = L;
      glyph[i] = Math.min(ng - 1, (L * ng) | 0);
    }
  }

  private draw() {
    const { ctx, cols, rows, cw, ch, ox, oy, lum, kind, glyph, blank } = this;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = this.background;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    const ac = this.atlasCols;
    for (let r = 0; r < rows; r++) {
      const y = oy + r * ch;
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const g = glyph[i];
        if (blank[g]) continue;
        const s = this.slot(kind[i], g, Math.round(lum[i] * (LEVELS - 1)));
        ctx.drawImage(
          this.atlas,
          (s % ac) * cw,
          Math.floor(s / ac) * ch,
          cw,
          ch,
          ox + c * cw,
          y,
          cw,
          ch
        );
      }
    }
  }
}
