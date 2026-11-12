import * as THREE from "three";

/* ─────────────────────────────────────────────────────────────────────────
   The ASCII pass, in two steps on the GPU.

   1. Cells (one fragment per character cell). Each cell reads a 2 × 3
      patch of the lit 3D render and picks the glyph whose *shape* best
      matches it — so a lit edge becomes / or |, a lamp pool fades through
      : and ; — rather than mapping brightness alone. Chaos lives here too:
      away from Shashank, loud places re-roll their glyphs, flicker and run
      hot; inside his headphone bubble everything settles and warms.

   2. Screen. Every pixel finds its cell, looks the glyph up in an atlas
      and paints it over a dim wash of the cell's own colour, which is what
      makes the light feel ambient rather than printed.
   ───────────────────────────────────────────────────────────────────────── */

/* A curated set: a density ramp plus strokes for edges. Letters stay out —
   they read as words, not as light. */
export const GLYPHS = " .,'`-_:;~^\"!|/\\()[]<>+=*xo%#&@";
const NOISE = "#%&@*+=!/\\x";
/* Flat cells take a classic density ramp; only cells with an edge in them
   are shape-matched. */
const RAMP = " .:-=+*%#@";
const SHAPE_W = 60;
const SHAPE_H = 100;

export const FONT_STACK = `ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace`;

/** 6-D coverage vector per glyph (2 columns × 3 rows, top row first). */
export function glyphShapes(): THREE.Vector3[] {
  const c = document.createElement("canvas");
  c.width = SHAPE_W;
  c.height = SHAPE_H;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  const raw: number[][] = [];
  for (const g of GLYPHS) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, SHAPE_W, SHAPE_H);
    ctx.fillStyle = "#fff";
    ctx.font = `${SHAPE_H * 0.86}px ${FONT_STACK}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(g, SHAPE_W / 2, SHAPE_H / 2 + SHAPE_H * 0.04);
    const px = ctx.getImageData(0, 0, SHAPE_W, SHAPE_H).data;
    const v = [0, 0, 0, 0, 0, 0];
    for (let y = 0; y < SHAPE_H; y++) {
      const row = Math.min(2, Math.floor((y / SHAPE_H) * 3));
      for (let x = 0; x < SHAPE_W; x++) {
        const col = x < SHAPE_W / 2 ? 0 : 1;
        v[row * 2 + col] += px[(y * SHAPE_W + x) * 4] / 255;
      }
    }
    const area = (SHAPE_W / 2) * (SHAPE_H / 3);
    raw.push(v.map((n) => n / area));
  }
  let max = 0;
  raw.forEach((v) => v.forEach((n) => (max = Math.max(max, n))));
  const out: THREE.Vector3[] = [];
  raw.forEach((v) => {
    out.push(new THREE.Vector3(v[0], v[1], v[2]).divideScalar(max));
    out.push(new THREE.Vector3(v[3], v[4], v[5]).divideScalar(max));
  });
  return out;
}

export const ATLAS_COLS = 16;

/** Glyph atlas at the on-screen cell size, white on black. */
export function glyphAtlas(cw: number, ch: number) {
  const rows = Math.ceil(GLYPHS.length / ATLAS_COLS);
  const c = document.createElement("canvas");
  c.width = ATLAS_COLS * cw;
  c.height = rows * ch;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = "#fff";
  ctx.font = `${Math.round(ch * 0.86)}px ${FONT_STACK}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  [...GLYPHS].forEach((g, i) => {
    const x = (i % ATLAS_COLS) * cw + cw / 2;
    const y = Math.floor(i / ATLAS_COLS) * ch + ch / 2 + ch * 0.04;
    ctx.fillText(g, x, y);
  });
  const tex = new THREE.CanvasTexture(c);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  return { tex, rows };
}

/** Width of one monospace cell for a given cell height, in device px. */
export function cellWidth(ch: number) {
  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.font = `${Math.round(ch * 0.86)}px ${FONT_STACK}`;
  return Math.max(4, Math.round(ctx.measureText("M").width * 1.04));
}

const QUAD_VERT = /* glsl */ `
  void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

export function cellMaterial(shapes: THREE.Vector3[]) {
  const noise = [...NOISE].map((g) => GLYPHS.indexOf(g)).filter((i) => i >= 0);
  const ramp = [...RAMP].map((g) => GLYPHS.indexOf(g)).filter((i) => i >= 0);
  return new THREE.ShaderMaterial({
    vertexShader: QUAD_VERT,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      tScene: { value: null },
      tDepth: { value: null },
      tMask: { value: null },
      uCells: { value: new THREE.Vector2() },
      uScene: { value: new THREE.Vector2() },
      uShape: { value: shapes },
      uNoise: { value: noise },
      uRamp: { value: ramp },
      uTime: { value: 0 },
      uMotion: { value: 1 },
      uExposure: { value: 1 },
      uChar: { value: new THREE.Vector2() },
      uBubbleR: { value: 10 },
      uBubble: { value: 1 },
      uChaosGain: { value: 1 },
      uCellAspect: { value: 0.6 },
      uHaze: { value: new THREE.Color() },
      uHazeAmt: { value: 0.5 },
      uCharDepth: { value: 0.5 },
      uDepthScale: { value: 300 },
      uXray: { value: new THREE.Color("#c99a72") },
    },
    defines: { GLYPHS: GLYPHS.length, NOISE: noise.length, RAMP: ramp.length },
    fragmentShader: /* glsl */ `
      uniform sampler2D tScene;
      uniform sampler2D tDepth;
      uniform sampler2D tMask;
      uniform vec2 uCells;
      uniform vec2 uScene;
      uniform vec3 uShape[GLYPHS * 2];
      uniform float uNoise[NOISE];
      uniform float uRamp[RAMP];
      uniform float uTime;
      uniform float uMotion;
      uniform float uExposure;
      uniform vec2 uChar;
      uniform float uBubbleR;
      uniform float uBubble;
      uniform float uChaosGain;
      uniform float uCellAspect;
      uniform vec3 uHaze;
      uniform float uHazeAmt;
      uniform float uCharDepth;
      uniform float uDepthScale;
      uniform vec3 uXray;

      float hash(vec2 p) {
        p = fract(p * vec2(234.34, 435.345));
        p += dot(p, p + 34.23);
        return fract(p.x * p.y);
      }
      vec3 aces(vec3 x) {
        return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
      }

      void main() {
        vec2 cell = floor(gl_FragCoord.xy);

        /* Smog: things further back than Shashank sink into the haze. */
        float depth = texture2D(tDepth, (cell + 0.5) / uCells).r;
        float hz = clamp(((depth - uCharDepth) * uDepthScale - 4.0) / 50.0, 0.0, 1.0) * uHazeAmt;

        float lum[6];
        vec3 sum = vec3(0.0);
        float chaos = 0.0;
        float open = 0.0;
        float him = 0.0;
        float ghost = 0.0;
        for (int j = 0; j < 3; j++) {
          for (int i = 0; i < 2; i++) {
            vec2 uv = (cell * vec2(2.0, 3.0) + vec2(float(i), float(j)) + 0.5) / uScene;
            vec4 sc = texture2D(tScene, uv);
            vec3 c = pow(aces(sc.rgb * uExposure), vec3(1.0 / 2.2));
            bool isHim = sc.a > 0.95;
            if (isHim) {
              /* Black hoodie, black pyjamas: a floor on brightness keeps him
                 legible at night, with the shading still on top. */
              c = max(c * 1.25, vec3(0.2, 0.2, 0.235)) + vec3(0.04);
              him += 1.0;
            } else {
              chaos += sc.a / 0.8;
              open += 1.0;
              c = mix(c, uHaze, hz);
              /* Behind a building or under the flyover he still shows, as
                 a faint dotted silhouette, so it reads as "behind", never
                 as standing on top. */
              if (texture2D(tMask, uv).r > 0.5 && mod(cell.x + cell.y, 2.0) < 0.5) {
                c = mix(c, uXray, 0.4);
                ghost += 1.0;
              }
            }
            lum[(2 - j) * 2 + i] = dot(c, vec3(0.2126, 0.7152, 0.0722));
            sum += c;
          }
        }
        vec3 col = sum / 6.0;

        /* The bubble: an ellipse around him in cell space. */
        vec2 d = cell + 0.5 - uChar;
        d.x *= uCellAspect;
        float dist = length(vec2(d.x, d.y * 1.1));
        float calm = uBubble * (1.0 - smoothstep(uBubbleR * 0.45, uBubbleR, dist));
        float e = open > 0.0 ? chaos / open : 0.0;
        e = clamp(e * uChaosGain * (1.0 - calm), 0.0, 1.0);
        if (him > 2.5) e = 0.0;

        vec3 v0 = vec3(lum[0], lum[1], lum[2]);
        vec3 v1 = vec3(lum[3], lum[4], lum[5]);
        float mx = max(max(max(v0.x, v0.y), max(v0.z, v1.x)), max(v1.y, v1.z));
        if (mx > 0.001) {
          v0 = pow(v0 / mx, vec3(1.6)) * mx;
          v1 = pow(v1 / mx, vec3(1.6)) * mx;
        }
        float density = mix(1.12, 0.94, calm);
        v0 *= density;
        v1 *= density;

        /* Chaos: re-roll on a jittery clock — faster where it is louder. */
        float tick = floor(uTime * (2.0 + 10.0 * e) + hash(cell) * 9.0) * uMotion;
        float n1 = hash(cell + tick * 1.731);
        float n2 = hash(cell * 1.37 + tick * 0.913 + 4.1);
        float n3 = hash(cell * 0.71 + tick * 2.17 + 9.7);
        v0 += (vec3(n1, n2, n3) - 0.5) * e * 0.2;
        v1 += (vec3(n3, n1, n2) - 0.5) * e * 0.2;

        float hi = max(max(max(v0.x, v0.y), max(v0.z, v1.x)), max(v1.y, v1.z));
        float lo = min(min(min(v0.x, v0.y), min(v0.z, v1.x)), min(v1.y, v1.z));
        float mean = (v0.x + v0.y + v0.z + v1.x + v1.y + v1.z) / 6.0;
        int bi = 0;
        if (hi - lo < 0.14) {
          bi = int(uRamp[int(clamp(mean * 1.3, 0.0, 0.999) * float(RAMP))]);
        } else {
          float best = 1e9;
          for (int g = 0; g < GLYPHS; g++) {
            vec3 a = uShape[g * 2] - v0;
            vec3 b = uShape[g * 2 + 1] - v1;
            float dd = dot(a, a) + dot(b, b);
            if (dd < best) { best = dd; bi = g; }
          }
        }
        if (n1 < e * e * 0.3 && mx > 0.07) {
          bi = int(uNoise[int(floor(n2 * float(NOISE)))]);
        }

        col *= 1.0 + (n3 - 0.5) * e * 0.75;
        col = mix(col, col * vec3(1.1, 1.0, 0.84) + vec3(0.02, 0.012, 0.0), calm * 0.7);
        if (him > 0.5 && him < 5.5) col *= 1.12;

        gl_FragColor = vec4(col, float(bi) / 255.0);
      }
    `,
  });
}

export function screenMaterial(atlas: THREE.Texture, atlasRows: number) {
  return new THREE.ShaderMaterial({
    vertexShader: QUAD_VERT,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      tCell: { value: null },
      tAtlas: { value: atlas },
      uCellPx: { value: new THREE.Vector2() },
      uCells: { value: new THREE.Vector2() },
      uAtlas: { value: new THREE.Vector2(ATLAS_COLS, atlasRows) },
      uView: { value: new THREE.Vector2() },
    },
    fragmentShader: /* glsl */ `
      uniform sampler2D tCell;
      uniform sampler2D tAtlas;
      uniform vec2 uCellPx;
      uniform vec2 uCells;
      uniform vec2 uAtlas;
      uniform vec2 uView;

      void main() {
        vec2 px = gl_FragCoord.xy;
        vec2 cell = floor(px / uCellPx);
        vec4 cd = texture2D(tCell, (cell + 0.5) / uCells);
        float g = floor(cd.a * 255.0 + 0.5);
        vec2 local = fract(px / uCellPx);
        vec2 tile = vec2(mod(g, uAtlas.x), floor(g / uAtlas.x));
        vec2 auv = vec2((tile.x + local.x) / uAtlas.x, 1.0 - (tile.y + 1.0 - local.y) / uAtlas.y);
        float a = texture2D(tAtlas, auv).r;

        vec3 col = cd.rgb;
        vec3 bg = col * 0.4;
        vec3 fg = clamp(col * 1.5 + 0.03, 0.0, 1.0);
        vec3 outc = mix(bg, fg, a);

        vec2 uv = px / uView - 0.5;
        outc *= 1.0 - 0.32 * pow(length(uv * vec2(1.0, 1.15)) * 1.25, 2.4);
        gl_FragColor = vec4(outc, 1.0);
      }
    `,
  });
}
