import * as THREE from "three";

/* The light follows the visitor's own clock. 5 pm is golden hour, then
   sunset, blue hour, night, late night. Daytime visits are held at an
   after-work dusk — this is a walk home, never a lunch break. */

export type Mood = {
  hours: number;
  held: boolean;
  /** Evening progress: 0 golden hour → 1 small hours. */
  e: number;
  label: string;
  sunDir: THREE.Vector3;
  sunColor: THREE.Color;
  sunIntensity: number;
  sky: THREE.Color;
  ground: THREE.Color;
  hemi: number;
  haze: THREE.Color;
  hazeAmount: number;
  /** Lamps switch on one by one as this passes each lamp's own threshold. */
  lampOn: number;
  windows: number;
  exposure: number;
};

type Key = {
  e: number;
  elev: number;
  azim: number;
  sun: string;
  sunI: number;
  sky: string;
  ground: string;
  hemi: number;
  haze: string;
  hazeA: number;
  exposure: number;
};

/* Azimuth in degrees, 0 = +x (east), 90 = −z (north). The sun sets in the
   west; after dark the "sun" is the moon, high in the south-east. */
const KEYS: Key[] = [
  { e: 0.0, elev: 11, azim: 195, sun: "#ffb06a", sunI: 2.6, sky: "#c08a72", ground: "#3a2a22", hemi: 1.0, haze: "#c99068", hazeA: 0.55, exposure: 1.0 },
  { e: 0.25, elev: 3, azim: 190, sun: "#ff7442", sunI: 1.5, sky: "#8a5b72", ground: "#2a1f26", hemi: 0.8, haze: "#a4676c", hazeA: 0.55, exposure: 1.05 },
  { e: 0.4, elev: 28, azim: 200, sun: "#5d72b8", sunI: 0.45, sky: "#4a5c96", ground: "#24222f", hemi: 1.1, haze: "#475486", hazeA: 0.5, exposure: 1.15 },
  { e: 0.6, elev: 42, azim: -30, sun: "#93a6d8", sunI: 0.32, sky: "#2e3760", ground: "#1f1a22", hemi: 1.0, haze: "#3a3048", hazeA: 0.5, exposure: 1.2 },
  { e: 1.0, elev: 48, azim: -55, sun: "#8ea0cf", sunI: 0.24, sky: "#222a4c", ground: "#18141c", hemi: 0.85, haze: "#262033", hazeA: 0.42, exposure: 1.3 },
];

const HOURS = [17, 18.25, 18.75, 19.75, 23.5, 24];
const EVENING = [0, 0.25, 0.4, 0.6, 0.9, 0.93];

export function eveningOf(h: number): { e: number; held: boolean } {
  if (h >= 17) {
    for (let i = 0; i < HOURS.length - 1; i++) {
      if (h < HOURS[i + 1]) {
        const t = (h - HOURS[i]) / (HOURS[i + 1] - HOURS[i]);
        return { e: EVENING[i] + (EVENING[i + 1] - EVENING[i]) * t, held: false };
      }
    }
  }
  if (h < 6) return { e: 0.93 + 0.07 * (h / 6), held: false };
  return { e: 0.1, held: true };
}

const c1 = new THREE.Color();
const c2 = new THREE.Color();
function mixHex(a: string, b: string, t: number, out: THREE.Color) {
  c1.set(a);
  c2.set(b);
  return out.copy(c1).lerp(c2, t);
}

export function createMood(): Mood {
  return {
    hours: 17,
    held: false,
    e: 0,
    label: "",
    sunDir: new THREE.Vector3(),
    sunColor: new THREE.Color(),
    sunIntensity: 1,
    sky: new THREE.Color(),
    ground: new THREE.Color(),
    hemi: 1,
    haze: new THREE.Color(),
    hazeAmount: 0.5,
    lampOn: 0,
    windows: 0.5,
    exposure: 1,
  };
}

export function updateMood(m: Mood, hours: number) {
  const { e, held } = eveningOf(hours);
  m.hours = hours;
  m.held = held;
  m.e = e;

  let i = 0;
  while (i < KEYS.length - 2 && e > KEYS[i + 1].e) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const t = THREE.MathUtils.smoothstep(e, a.e, b.e);
  const lerp = (x: number, y: number) => x + (y - x) * t;

  /* The sun → moon handover happens in blue hour, where both are faint, so
     the jump in direction never shows. */
  const elev = THREE.MathUtils.degToRad(lerp(a.elev, b.elev));
  const azim = THREE.MathUtils.degToRad(t < 0.5 ? a.azim : b.azim);
  m.sunDir.set(Math.cos(elev) * Math.cos(azim), Math.sin(elev), -Math.cos(elev) * Math.sin(azim));
  mixHex(a.sun, b.sun, t, m.sunColor);
  m.sunIntensity = lerp(a.sunI, b.sunI);
  mixHex(a.sky, b.sky, t, m.sky);
  mixHex(a.ground, b.ground, t, m.ground);
  m.hemi = lerp(a.hemi, b.hemi);
  mixHex(a.haze, b.haze, t, m.haze);
  m.hazeAmount = lerp(a.hazeA, b.hazeA);
  m.exposure = lerp(a.exposure, b.exposure);

  m.lampOn = THREE.MathUtils.smoothstep(e, 0.08, 0.42);
  m.windows = 0.3 + 0.4 * THREE.MathUtils.smoothstep(e, 0, 0.5) - 0.35 * THREE.MathUtils.smoothstep(e, 0.85, 1);

  m.label = held
    ? "after hours"
    : e < 0.18
      ? "golden hour"
      : e < 0.33
        ? "sunset"
        : e < 0.52
          ? "blue hour"
          : e < 0.88
            ? "night"
            : "small hours";
}

export function clockLabel(hours: number) {
  const h = Math.floor(hours) % 24;
  const min = Math.floor((hours - Math.floor(hours)) * 60);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(min).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
}
