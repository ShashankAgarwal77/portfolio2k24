import * as THREE from "three";

/* Every material in the world goes through patch(). Besides the usual
   lighting it writes one extra number into the alpha channel of the scene
   render, which the ASCII pass reads back:

     1.0          → this pixel is Shashank
     0.0 – 0.8    → how chaotic this spot of the city is (chaos map, a
                    material's own floor — traffic and neon are always
                    loud — and honks, which flare up around a car)

   It also gives surfaces their wear, all from world position so nothing
   needs UVs: grainy patched asphalt, paving tiles with grout, plaster with
   rain streaks, a dirty plinth and a ledge at every floor, lit windows
   with frames, mullions and the odd iron grille. In ASCII those small
   value changes are what turn flat colour into texture and edges.

   And it carries the cutaway, and the character's soft rim, so a black
   hoodie still reads at night. */

export const WORLD_HALF = 160;
export const HONKS = 4;

export function createShared(chaosMap: THREE.Texture) {
  return {
    uChaosMap: { value: chaosMap },
    uWorldHalf: { value: WORLD_HALF },
    uWindows: { value: 0.5 },
    uTime: { value: 0 },
    uRimColor: { value: new THREE.Color("#ffc78f") },
    uRim: { value: 0.5 },
    uCutPos: { value: new THREE.Vector3() },
    uCamDir: { value: new THREE.Vector3(0, 1, 0) },
    uCutR: { value: 4 },
    /** x, z, strength of recent honks. */
    uHonk: { value: Array.from({ length: HONKS }, () => new THREE.Vector3()) },
  };
}
export type Shared = ReturnType<typeof createShared>;

export type WindowOpts = {
  /** Window grid: metres per column, metres per floor. */
  cell: [number, number];
  /** Pane size as a share of the cell. */
  size: [number, number];
  warm: string;
  cool: string;
  /** Share of cool (TV / office) windows. */
  coolShare: number;
  /** Multiplies the global lit share. */
  density: number;
  /** How dark an unlit pane is against the wall. */
  dark: number;
  /** Share of windows behind an iron grille. */
  grilles?: number;
};

export type Surface = "asphalt" | "paving" | "plaster" | "dust" | "concrete";

type PatchOpts = {
  character?: boolean;
  chaos?: number;
  windows?: WindowOpts;
  surface?: Surface;
};

const glsl = (n: number) => (Number.isInteger(n) ? n.toFixed(1) : String(n));
const vec3 = (hex: string) => {
  const c = new THREE.Color(hex);
  return `vec3(${glsl(c.r)}, ${glsl(c.g)}, ${glsl(c.b)})`;
};

const SURFACES: Record<Surface, string> = {
  /* Grain, large repaired patches, and a darker worn band where wheels run. */
  asphalt: `
    float g = solaceNoise(vSW.xz * 2.3) * 0.55 + solaceNoise(vSW.xz * 0.21) * 0.45;
    float patchy = step(0.74, solaceNoise(vSW.xz * 0.09 + 3.0));
    diffuseColor.rgb *= (0.72 + 0.5 * g) * mix(1.0, 1.22, patchy);`,
  /* 0.6 m tiles, each its own shade, dark grout, a few cracked ones. */
  paving: `
    vec2 tt = vSW.xz / 0.6;
    vec2 tf = fract(tt);
    float grout = max(step(tf.x, 0.07), step(tf.y, 0.07));
    float shade = 0.8 + 0.34 * solaceHash(floor(tt));
    diffuseColor.rgb *= mix(shade * (0.9 + 0.2 * solaceNoise(vSW.xz * 0.7)), 0.5, grout);`,
  /* Rain streaks down from every sill, a grimy plinth, a ledge per floor,
     damp patches; roofs get dust. */
  plaster: `
    vec3 pn = normalize(vSN);
    if (abs(pn.y) < 0.5) {
      float along = abs(pn.x) > 0.5 ? vSW.z : vSW.x;
      float streak = solaceNoise(vec2(along * 2.6, vSW.y * 0.22));
      float damp = smoothstep(0.62, 0.8, solaceNoise(vec2(along * 0.35, vSW.y * 0.3) + 7.0));
      float ledge = step(fract((vSW.y - 0.15) / 3.2), 0.045);
      float plinth = 1.0 - 0.32 * (1.0 - smoothstep(0.6, 1.1, vSW.y));
      diffuseColor.rgb *= (0.8 + 0.3 * streak) * (1.0 - 0.25 * damp) * (1.0 - 0.38 * ledge) * plinth;
    } else {
      diffuseColor.rgb *= 0.62 + 0.4 * solaceNoise(vSW.xz * 1.4);
    }`,
  dust: `
    diffuseColor.rgb *= 0.7 + 0.45 * (solaceNoise(vSW.xz * 1.1) * 0.6 + solaceNoise(vSW.xz * 0.17) * 0.4);`,
  concrete: `
    diffuseColor.rgb *= 0.8 + 0.3 * solaceNoise(vSW.xz * 1.7 + vSW.y * 1.3);`,
};

export function patch<M extends THREE.Material>(mat: M, shared: Shared, opts: PatchOpts = {}): M {
  const chaos = opts.chaos ?? 0;
  const w = opts.windows;
  const normals = !!w || opts.surface === "plaster";
  const key = `solace:${opts.character ? "c" : ""}:${chaos}:${opts.surface ?? ""}:${w ? JSON.stringify(w) : ""}`;

  mat.customProgramCacheKey = () => key;
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, shared);

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
        varying vec3 vSW;
        ${normals ? "varying vec3 vSN;" : ""}`
      )
      .replace(
        "#include <project_vertex>",
        `#include <project_vertex>
        vec4 sw = vec4(transformed, 1.0);
        ${normals ? "vec3 sn = objectNormal;" : ""}
        #ifdef USE_INSTANCING
          sw = instanceMatrix * sw;
          ${normals ? "sn = mat3(instanceMatrix) * sn;" : ""}
        #endif
        vSW = (modelMatrix * sw).xyz;
        ${normals ? "vSN = normalize(mat3(modelMatrix) * sn);" : ""}`
      );

    let frag = shader.fragmentShader.replace(
      "#include <common>",
      `#include <common>
      varying vec3 vSW;
      ${normals ? "varying vec3 vSN;" : ""}
      uniform sampler2D uChaosMap;
      uniform float uWorldHalf;
      uniform float uWindows;
      uniform float uTime;
      uniform vec3 uRimColor;
      uniform float uRim;
      uniform vec3 uCutPos;
      uniform vec3 uCamDir;
      uniform float uCutR;
      uniform vec3 uHonk[${HONKS}];
      float solaceHash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }
      float solaceNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(solaceHash(i), solaceHash(i + vec2(1.0, 0.0)), f.x),
                   mix(solaceHash(i + vec2(0.0, 1.0)), solaceHash(i + vec2(1.0, 1.0)), f.x), f.y);
      }`
    );

    if (!opts.character) {
      /* Cutaway: anything standing between the camera and Shashank
         dissolves in a dithered circle around him. Ground and pavements
         stay. */
      frag = frag.replace(
        "#include <clipping_planes_fragment>",
        `#include <clipping_planes_fragment>
        {
          vec3 rel = vSW - uCutPos;
          float toward = dot(rel, uCamDir);
          if (toward > 0.8 && vSW.y > 0.35) {
            float perp = length(rel - uCamDir * toward);
            float cut = smoothstep(uCutR, uCutR * 0.6, perp);
            if (cut > solaceHash(floor(gl_FragCoord.xy) * 0.37)) discard;
          }
        }`
      );
    }

    if (opts.surface) {
      frag = frag.replace("#include <color_fragment>", `#include <color_fragment>\n{${SURFACES[opts.surface]}\n}`);
    }

    if (w) {
      const sx = w.size[0] * 0.5;
      const sy = w.size[1] * 0.5;
      frag = frag.replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        {
          vec3 wn = normalize(vSN);
          if (abs(wn.y) < 0.5) {
            float along = abs(wn.x) > 0.5 ? vSW.z : vSW.x;
            vec2 g = vec2(along, vSW.y - 0.6) / vec2(${glsl(w.cell[0])}, ${glsl(w.cell[1])});
            vec2 id = floor(g);
            vec2 f = fract(g) - 0.5;
            float pane = step(abs(f.x), ${glsl(sx)}) * step(abs(f.y), ${glsl(sy)}) * step(0.0, id.y);
            float glass = step(abs(f.x), ${glsl(sx - 0.05)}) * step(abs(f.y), ${glsl(sy - 0.06)}) * pane;
            vec2 seed = id + wn.xz * 31.7 + floor(vSW.xz / 7.0) * 3.1;
            float mull = step(abs(f.x), 0.022);
            float grille = step(1.0 - ${glsl(w.grilles ?? 0)}, solaceHash(seed + 3.7)) * step(0.55, fract(f.y * 9.0));
            glass *= 1.0 - mull;
            float h = solaceHash(seed);
            float lit = step(h, uWindows * ${glsl(w.density)});
            float tone = solaceHash(seed + 7.3);
            float cool = step(1.0 - ${glsl(w.coolShare)}, tone);
            float tv = mix(1.0, 0.75 + 0.25 * sin(uTime * (5.0 + tone * 9.0) + tone * 40.0), cool);
            /* A curtain half drawn: lit panes are brighter at the top. */
            float curtain = mix(1.0, 0.55 + 0.45 * smoothstep(-0.5, 0.4, f.y), step(0.5, fract(tone * 7.1)));
            vec3 wc = mix(${vec3(w.warm)}, ${vec3(w.cool)}, cool) * (0.55 + 0.9 * fract(tone * 13.1)) * tv * curtain;
            totalEmissiveRadiance += wc * lit * glass * (1.0 - grille * 0.75);
            diffuseColor.rgb *= 1.0 - glass * ${glsl(w.dark)};
            diffuseColor.rgb *= 1.0 - (pane - glass) * 0.45;
          }
        }`
      );
    }

    if (opts.character) {
      /* Ortho camera: the view direction is +z in view space everywhere. */
      frag = frag.replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        totalEmissiveRadiance += uRimColor * pow(1.0 - abs(normal.z), 2.5) * uRim;`
      );
    }

    frag = frag.replace(
      "#include <dithering_fragment>",
      `#include <dithering_fragment>
      ${
        opts.character
          ? "gl_FragColor.a = 1.0;"
          : `{
        vec2 cuv = (vSW.xz + uWorldHalf) / (2.0 * uWorldHalf);
        float chaos = max(texture2D(uChaosMap, cuv).r, ${glsl(chaos)});
        for (int i = 0; i < ${HONKS}; i++) {
          chaos = max(chaos, uHonk[i].z * (1.0 - smoothstep(2.0, 11.0, length(vSW.xz - uHonk[i].xy))));
        }
        gl_FragColor.a = clamp(chaos, 0.0, 1.0) * 0.8;
      }`
      }`
    );
    shader.fragmentShader = frag;
  };
  return mat;
}

/* Transparent overlays (contact shadow, steam) must not disturb the tag in
   the alpha channel: blend colour as usual, keep destination alpha. */
export function keepAlpha<M extends THREE.Material>(mat: M): M {
  mat.transparent = true;
  mat.depthWrite = false;
  mat.blending = THREE.CustomBlending;
  mat.blendSrc = THREE.SrcAlphaFactor;
  mat.blendDst = THREE.OneMinusSrcAlphaFactor;
  mat.blendSrcAlpha = THREE.ZeroFactor;
  mat.blendDstAlpha = THREE.OneFactor;
  return mat;
}

export function std(shared: Shared, color: string, opts: PatchOpts & { roughness?: number; metalness?: number; flat?: boolean } = {}) {
  return patch(
    new THREE.MeshStandardMaterial({
      color,
      roughness: opts.roughness ?? 0.9,
      metalness: opts.metalness ?? 0,
      flatShading: opts.flat ?? false,
    }),
    shared,
    opts
  );
}

/** Unlit, for light sources. Colours above 1 read as glare in the ASCII pass. */
export function glow(shared: Shared, color: string, strength: number, chaos = 0) {
  const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(strength) });
  return patch(m, shared, { chaos });
}
