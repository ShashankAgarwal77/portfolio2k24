import * as THREE from "three";
import { glow, HONKS, std, WORLD_HALF, type Shared } from "./materials";
import type { Mood } from "./mood";

/* ─────────────────────────────────────────────────────────────────────────
   The city — an evening grid somewhere between Gurugram and Delhi.

   Five roads each way, 40 m blocks between them, a ring of taller blocks
   at the edge. Most blocks are builder-floor housing: three to six
   storeys, balconies, a black water tank on every other roof, shops with
   neon on the ground floor. Two blocks are special — the office tower you
   leave from (north-west of the main junction, so it stands behind you,
   never between you and the camera) and a neem park. A flyover
   runs east–west along z = −52.

   Everything repeated is instanced; the chaos is the traffic (left-hand
   drive, stopping for the lights, mostly), the neon and the junctions.
   ───────────────────────────────────────────────────────────────────────── */

export const ROADS = [-104, -52, 0, 52, 104];
const RANGES: [number, number][] = [
  [-130, -110],
  [-98, -58],
  [-46, -6],
  [6, 46],
  [58, 98],
  [110, 130],
];
const CITY = 128;
const FLYOVER_Z = -52;
const DECK_Y = 7.5;
const SLAB = 0.15;
const N = WORLD_HALF * 2; // ground size, metres
const GRID = 0.5; // collision cell, metres
const G = N / GRID;

export const SPAWN = { x: -13, z: -13, yaw: Math.PI / 4 };

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
const UNIT_CYL = new THREE.CylinderGeometry(0.5, 0.5, 1, 10).translate(0, 0.5, 0);

/* Collects instances, then becomes one InstancedMesh. */
class Batch {
  private m: THREE.Matrix4[] = [];
  private c: THREE.Color[] = [];
  private q = new THREE.Quaternion();
  constructor(
    private geo: THREE.BufferGeometry,
    private mat: THREE.Material,
    private shadows: { cast?: boolean; receive?: boolean } = { cast: true, receive: true }
  ) {}
  add(x: number, y: number, z: number, sx: number, sy: number, sz: number, rotY = 0, color?: THREE.ColorRepresentation) {
    this.q.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, rotY);
    this.m.push(new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), this.q, new THREE.Vector3(sx, sy, sz)));
    this.c.push(new THREE.Color(color ?? "#ffffff"));
    return this.m.length - 1;
  }
  get count() {
    return this.m.length;
  }
  build(parent: THREE.Object3D) {
    const mesh = new THREE.InstancedMesh(this.geo, this.mat, Math.max(1, this.m.length));
    mesh.count = this.m.length;
    this.m.forEach((m, i) => {
      mesh.setMatrixAt(i, m);
      mesh.setColorAt(i, this.c[i]);
    });
    mesh.castShadow = !!this.shadows.cast;
    mesh.receiveShadow = !!this.shadows.receive;
    mesh.frustumCulled = false;
    parent.add(mesh);
    return mesh;
  }
}

export type LightSource = {
  pos: THREE.Vector3;
  color: THREE.Color;
  intensity: number;
  /** Lamps come on when mood.lampOn passes this; shops are always on. */
  threshold: number;
};

type Lane = {
  axis: "x" | "z";
  coord: number;
  offset: number;
  dir: 1 | -1;
  y: number;
  stops: boolean;
  cars: Car[];
};
type Car = { s: number; v: number; cruise: number; kind: number; slot: number };

const KINDS = [
  { w: 1.8, h: 0.95, l: 4.2, cabin: [1.55, 0.6, 2.1, -0.25], speed: 9.5, weight: 0.5, colors: ["#e9e7e2", "#9ea3a8", "#1c1d20", "#8f2a26", "#2a3d63"], cabinColor: "#1b2129" },
  { w: 1.4, h: 0.85, l: 2.7, cabin: [1.42, 0.95, 1.9, -0.15], speed: 7.5, weight: 0.25, colors: ["#2f7f3a"], cabinColor: "#e2b51e" },
  { w: 0.7, h: 0.75, l: 1.8, cabin: [0.45, 0.85, 0.45, -0.15], speed: 8.5, weight: 0.17, colors: ["#d23b2b", "#e9e7e2", "#2a2b30", "#2e6fb5"], cabinColor: "#2c2c33" },
  { w: 2.5, h: 2.9, l: 11, cabin: [2.56, 0.9, 10.2, 0], speed: 7.5, weight: 0.08, colors: ["#b5452f", "#2e7d4f"], cabinColor: "#ffd28f" },
];

const PLASTER = ["#cbbba0", "#b9a58c", "#d6c7b0", "#a89a88", "#c7a98a", "#9fa39a", "#d2b48c", "#b88a6a", "#e0d6c4", "#c9b3a0"];
const AWNING = ["#2f5f8a", "#2d6b4f", "#9a3b2e", "#c99a2e", "#6b6f73"];
const SHIRTS = ["#e9e5dc", "#7fa7d1", "#7a2f36", "#c7962f", "#5d6a3c", "#8e9196", "#1d1d21", "#c4607d", "#d8c39a", "#3d5a80"];
const PANTS = ["#2b3242", "#4a4337", "#1a1a1d", "#6f6553", "#2e2e33"];
const SKINS = ["#c58c66", "#a8714f", "#8d5a3b", "#d29d78"];
const NEON = ["#ff3d8b", "#2de2e6", "#ffcc33", "#7cff6b", "#ff5533", "#f4f1ea", "#a66bff"];

export class World {
  readonly group = new THREE.Group();
  readonly lights: LightSource[] = [];
  private blocked = new Uint8Array(G * G);
  private height = new Float32Array(G * G);
  private rng = mulberry32(1987);
  private shared: Shared;

  private lampHeads!: THREE.InstancedMesh;
  private lampColors: { color: THREE.Color; threshold: number }[] = [];
  private lastLampOn = -1;

  private junctions: { x: number; z: number; offset: number; bulbs: number[] }[] = [];
  private bulbs!: THREE.InstancedMesh;
  private bulbColors: { axis: "x" | "z"; color: number }[] = [];
  private lastPhaseKey = "";

  private lanes: Lane[] = [];
  private carBody!: THREE.InstancedMesh;
  private carCabin!: THREE.InstancedMesh;
  private carHead!: THREE.InstancedMesh;
  private carTail!: THREE.InstancedMesh;
  private carMeta: { kind: number; color: THREE.Color }[] = [];

  constructor(shared: Shared) {
    this.shared = shared;
    this.buildGround();
    this.buildBlocks();
    this.buildFlyover();
    this.buildStreetFurniture();
    this.buildTraffic();
    this.buildPeople();
  }

  /* ── queries ─────────────────────────────────────────────────────────── */

  private idx(x: number, z: number) {
    const i = Math.floor((x + WORLD_HALF) / GRID);
    const j = Math.floor((z + WORLD_HALF) / GRID);
    if (i < 0 || j < 0 || i >= G || j >= G) return -1;
    return j * G + i;
  }

  /** Buildings, posts, trees, carts, the median — and, if asked, cars. */
  isFree(x: number, z: number, r: number, cars = false) {
    if (Math.abs(x) > CITY || Math.abs(z) > CITY) return false;
    for (const [dx, dz] of [
      [-r, -r],
      [r, -r],
      [-r, r],
      [r, r],
      [0, 0],
    ]) {
      const k = this.idx(x + dx, z + dz);
      if (k < 0 || this.blocked[k]) return false;
    }
    return !cars || !this.carAt(x, z, r);
  }

  private carAt(x: number, z: number, r: number) {
    for (const lane of this.lanes) {
      if (lane.y > 0) continue;
      const across = lane.coord + lane.offset;
      const a = lane.axis === "x" ? x : z;
      const c = lane.axis === "x" ? z : x;
      for (const car of lane.cars) {
        const K = KINDS[car.kind];
        if (Math.abs(c - across) < K.w / 2 + r && Math.abs(a - car.s) < K.l / 2 + r) return true;
      }
    }
    return false;
  }

  groundAt(x: number, z: number) {
    const k = this.idx(x, z);
    return k < 0 ? 0 : this.height[k];
  }

  zoneAt(x: number, z: number) {
    if (x > -46 && x < -6 && z > -46 && z < -6) return "the tower";
    if (x > -98 && x < -58 && z > 6 && z < 46) return "neem park";
    if (Math.abs(z - FLYOVER_Z) < 8) return "under the flyover";
    const nearX = ROADS.some((r) => Math.abs(x - r) < 9);
    const nearZ = ROADS.some((r) => Math.abs(z - r) < 9);
    if (nearX && nearZ) return Math.abs(x) < 9 && Math.abs(z) < 9 ? "the big junction" : "a junction";
    if ((Math.abs(x) < 9 || Math.abs(z) < 9) && (nearX || nearZ)) return "main road";
    if (nearX || nearZ) return "side street";
    return "back lanes";
  }

  private block(x0: number, z0: number, x1: number, z1: number, h?: number) {
    for (let z = Math.floor(z0 / GRID) * GRID; z < z1; z += GRID) {
      for (let x = Math.floor(x0 / GRID) * GRID; x < x1; x += GRID) {
        const k = this.idx(x + GRID / 2, z + GRID / 2);
        if (k < 0) continue;
        if (h === undefined) this.blocked[k] = 1;
        else this.height[k] = h;
      }
    }
  }
  private post(x: number, z: number, r: number) {
    this.block(x - r, z - r, x + r, z + r);
  }

  /* ── ground, roads, markings ─────────────────────────────────────────── */

  private buildGround() {
    const s = this.shared;
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(N, N).rotateX(-Math.PI / 2), std(s, "#2a2a2f", { roughness: 1, surface: "asphalt" }));
    ground.receiveShadow = true;
    this.group.add(ground);

    const white = new Batch(UNIT_BOX, std(s, "#cfccc4", { roughness: 0.8 }), { receive: true });
    const yellow = new Batch(UNIT_BOX, std(s, "#c9a227", { roughness: 0.8 }), { receive: true });
    const near = (v: number) => ROADS.some((r) => Math.abs(v - r) < 8);

    for (const r of ROADS) {
      for (const axis of ["x", "z"] as const) {
        const place = (b: Batch, a: number, across: number, len: number, wid: number) =>
          axis === "x" ? b.add(a, 0, r + across, len, 0.02, wid) : b.add(r + across, 0, a, wid, 0.02, len);
        // Double yellow centre line, dashed lane lines.
        for (let a = -CITY; a < CITY; a += 2) {
          if (near(a) || near(a + 2)) continue;
          if (!(axis === "x" && r === FLYOVER_Z)) {
            place(yellow, a + 1, 0.14, 2, 0.1);
            place(yellow, a + 1, -0.14, 2, 0.1);
          }
        }
        for (let a = -CITY; a < CITY; a += 7) {
          if (near(a) || near(a + 3)) continue;
          place(white, a + 1.5, 3.3, 3, 0.12);
          place(white, a + 1.5, -3.3, 3, 0.12);
        }
        // Zebra crossings on every arm of every junction.
        for (const j of ROADS) {
          for (const side of [-1, 1]) {
            for (let k = -5; k <= 5; k++) {
              place(white, j + side * 9.6, k * 1.05, 2.4, 0.5);
            }
          }
        }
      }
    }
    white.build(this.group);
    yellow.build(this.group);
  }

  /* ── blocks ──────────────────────────────────────────────────────────── */

  private buildBlocks() {
    const s = this.shared;
    const slabs = new Batch(UNIT_BOX, std(s, "#77716a", { roughness: 0.95, surface: "paving" }), { receive: true });
    const inner = new Batch(UNIT_BOX, std(s, "#ffffff", { roughness: 1, surface: "dust" }), { receive: true });
    const homes = new Batch(
      UNIT_BOX,
      std(s, "#ffffff", {
        roughness: 0.92,
        surface: "plaster",
        windows: { cell: [2.2, 3.2], size: [0.46, 0.44], warm: "#ffc27a", cool: "#9fc4ff", coolShare: 0.22, density: 1, dark: 0.6, grilles: 0.4 },
      })
    );
    const concrete = new Batch(UNIT_BOX, std(s, "#8d877d", { surface: "concrete" }));
    const tanks = new Batch(UNIT_CYL, std(s, "#141416", { roughness: 0.6 }));
    const shutters = new Batch(UNIT_BOX, std(s, "#5d6166", { roughness: 0.5, metalness: 0.4 }), { receive: true });
    const signs = new Batch(UNIT_BOX, glow(s, "#ffffff", 2.4, 0.7), {});
    const shops = new Batch(UNIT_BOX, glow(s, "#ffffff", 1.1, 0.55), {});
    const acs = new Batch(UNIT_BOX, std(s, "#c9c8c0", { roughness: 0.6 }));
    const awnings = new Batch(UNIT_BOX, std(s, "#ffffff", { roughness: 0.9 }));
    this.scooters = new Batch(UNIT_BOX, std(s, "#ffffff", { roughness: 0.45, metalness: 0.3 }));
    this.seats = new Batch(UNIT_BOX, std(s, "#17171a", { roughness: 0.7 }));

    this.trees = new Batch(UNIT_CYL, std(s, "#3a2c22"));
    this.canopy = new Batch(new THREE.IcosahedronGeometry(1, 0), std(s, "#ffffff", { flat: true, roughness: 0.85 }));

    RANGES.forEach(([x0, x1], i) => {
      RANGES.forEach(([z0, z1], j) => {
        slabs.add((x0 + x1) / 2, 0, (z0 + z1) / 2, x1 - x0, SLAB, z1 - z0);
        this.block(x0, z0, x1, z1, SLAB);
        const ring = i === 0 || i === 5 || j === 0 || j === 5;

        if (i === 2 && j === 2) return this.buildTower(x0, z0, x1, z1, inner);
        if (i === 1 && j === 3) return this.buildPark(x0, z0, x1, z1, inner);

        inner.add((x0 + x1) / 2, 0, (z0 + z1) / 2, x1 - x0 - 6, SLAB + 0.02, z1 - z0 - 6, 0, "#4f463d");

        const rows: { axis: "x" | "z"; a0: number; a1: number; front: number; inward: 1 | -1; depth: number }[] = [];
        if (!ring) {
          rows.push({ axis: "x", a0: x0 + 3, a1: x1 - 3, front: z0 + 3, inward: 1, depth: 14 });
          rows.push({ axis: "x", a0: x0 + 3, a1: x1 - 3, front: z1 - 3, inward: -1, depth: 14 });
        } else if (i === 0 || i === 5) {
          const front = i === 0 ? x1 - 3 : x0 + 3;
          rows.push({ axis: "z", a0: z0 + 3, a1: z1 - 3, front, inward: i === 0 ? -1 : 1, depth: 14 });
        } else {
          const front = j === 0 ? z1 - 3 : z0 + 3;
          rows.push({ axis: "x", a0: x0 + 3, a1: x1 - 3, front, inward: j === 0 ? -1 : 1, depth: 14 });
        }

        for (const row of rows) {
          let a = row.a0;
          while (a < row.a1 - 4) {
            const f = Math.min(row.a1 - a, 7 + this.rng() * 5);
            const floors = (ring ? 6 : 3) + Math.floor(this.rng() * (ring ? 7 : 4));
            const h = floors * 3.2 + 0.5;
            const d = row.depth - this.rng() * 2;
            const mid = a + f / 2;
            const centre = row.front + (row.inward * d) / 2;
            const color = PLASTER[Math.floor(this.rng() * PLASTER.length)];
            const put = (b: Batch, along: number, y: number, across: number, sa: number, sy: number, sc: number, c?: string) =>
              row.axis === "x" ? b.add(along, y, across, sa, sy, sc, 0, c) : b.add(across, y, along, sc, sy, sa, 0, c);

            put(homes, mid, SLAB, centre, f - 0.5, h, d, color);
            const fx0 = row.axis === "x" ? mid - f / 2 + 0.25 : centre - d / 2;
            const fz0 = row.axis === "x" ? centre - d / 2 : mid - f / 2 + 0.25;
            this.block(fx0 - 0.3, fz0 - 0.3, fx0 + (row.axis === "x" ? f - 0.5 : d) + 0.3, fz0 + (row.axis === "x" ? d : f - 0.5) + 0.3);

            // Balconies with a parapet, one per upper floor.
            const bw = f * (0.45 + this.rng() * 0.2);
            const boff = (this.rng() - 0.5) * (f - bw - 1);
            for (let k = 1; k < floors; k++) {
              const y = SLAB + k * 3.2;
              put(concrete, mid + boff, y, row.front - row.inward * 0.45, bw, 0.14, 0.9);
              put(concrete, mid + boff, y, row.front - row.inward * 0.88, bw, 0.95, 0.07);
            }
            // Roof: the black water tank, sometimes a stair room.
            if (this.rng() < 0.75) {
              put(tanks, mid + (this.rng() - 0.5) * (f - 3), SLAB + h, centre + (this.rng() - 0.5) * (d - 4), 1.4, 1.3, 1.4);
            }
            if (this.rng() < 0.5) put(concrete, mid - f * 0.2, SLAB + h, centre + row.inward * d * 0.2, 2.4, 2.6, 2.4);
            // Split AC units hung on the front wall, the city's real facade.
            for (let k = 0; k < floors; k++) {
              if (this.rng() < 0.5) {
                put(acs, mid + (this.rng() - 0.5) * (f - 2.2), SLAB + k * 3.2 + 1.9 + this.rng() * 0.4, row.front - row.inward * 0.2, 0.85, 0.55, 0.36);
              }
            }

            // Ground floor: a lit shop or a shutter, and a sign above it.
            const main = Math.abs(row.front) < 10 || Math.abs(row.front - FLYOVER_Z) < 10;
            const frontOut = row.front - row.inward * 0.06;
            if (this.rng() < (main ? 0.7 : 0.4)) {
              const tube = this.rng() < 0.5;
              const sc = tube ? "#dfeaff" : "#ffd29a";
              put(shops, mid, SLAB + 0.1, frontOut, f * 0.7, 2.6, 0.06, sc);
              this.addLight(row, mid, 1.6, 1.4, sc, 4, 0);
              put(awnings, mid, SLAB + 2.75, row.front - row.inward * 0.6, f * 0.78, 0.07, 1.2, AWNING[Math.floor(this.rng() * AWNING.length)]);
              this.parkScooters(row, mid, f, main ? 4 : 2);
            } else {
              put(shutters, mid, SLAB, frontOut, f * 0.8, 2.8, 0.08);
            }
            if (this.rng() < (main ? 0.9 : 0.45)) {
              const nc = NEON[Math.floor(this.rng() * NEON.length)];
              put(signs, mid, SLAB + 3.05, row.front - row.inward * 0.12, f * 0.7, 0.75, 0.14, nc);
              this.addLight(row, mid, 3.3, 1.2, nc, 5, 0);
            }
            a += f;
          }
        }
      });
    });

    slabs.build(this.group);
    inner.build(this.group);
    homes.build(this.group);
    concrete.build(this.group);
    tanks.build(this.group);
    shutters.build(this.group);
    signs.build(this.group);
    shops.build(this.group);
    acs.build(this.group);
    awnings.build(this.group);
    this.scooters.build(this.group);
    this.seats.build(this.group);
    this.buildKerbs();
    this.buildMedians();
  }

  private scooters!: Batch;
  private seats!: Batch;
  /* Two-wheelers parked nose-in at the kerb outside shops, at an angle. */
  private parkScooters(row: { axis: "x" | "z"; front: number; inward: 1 | -1 }, mid: number, f: number, max: number) {
    const n = Math.floor(this.rng() * (max + 1));
    const colors = ["#c8352a", "#e9e7e2", "#24252a", "#2f64a8", "#8a8f96", "#d9a92a"];
    for (let k = 0; k < n; k++) {
      const along = mid - f * 0.4 + (k + 0.5) * Math.min(1.1, (f * 0.8) / Math.max(1, n));
      const across = row.front - row.inward * 2.15;
      const x = row.axis === "x" ? along : across;
      const z = row.axis === "x" ? across : along;
      const rot = (row.axis === "x" ? 0 : Math.PI / 2) + 0.55;
      this.scooters.add(x, SLAB + 0.12, z, 0.55, 0.62, 1.65, rot, colors[Math.floor(this.rng() * colors.length)]);
      this.seats.add(x, SLAB + 0.74, z, 0.4, 0.1, 0.7, rot);
      this.post(x, z, 0.45);
    }
  }

  /* Painted kerbs — black and yellow, one metre at a time. */
  private buildKerbs() {
    const s = this.shared;
    const kerb = new Batch(UNIT_BOX, std(s, "#ffffff", { roughness: 0.8 }), { receive: true });
    for (const [x0, x1] of RANGES) {
      for (const [z0, z1] of RANGES) {
        const edge = (ax: "x" | "z", from: number, to: number, at: number) => {
          for (let a = from, k = 0; a < to; a += 1, k++) {
            const c = k % 2 ? "#141416" : "#d4ad22";
            if (ax === "x") kerb.add(a + 0.5, 0, at, 1, SLAB + 0.09, 0.26, 0, c);
            else kerb.add(at, 0, a + 0.5, 0.26, SLAB + 0.09, 1, 0, c);
          }
        };
        edge("x", x0, x1, z0 + 0.13);
        edge("x", x0, x1, z1 - 0.13);
        edge("z", z0, z1, x0 + 0.13);
        edge("z", z0, z1, x1 - 0.13);
      }
    }
    kerb.build(this.group);
  }

  /* A planted concrete median down both arterials. You cross at the
     junctions, like everyone is supposed to. */
  private buildMedians() {
    const s = this.shared;
    const median = new Batch(UNIT_BOX, std(s, "#8a857c", { surface: "concrete" }));
    const shrubs = new Batch(new THREE.IcosahedronGeometry(1, 0), std(s, "#ffffff", { flat: true }));
    const greens = ["#33502a", "#3f6232", "#2a4422"];
    for (const axis of ["x", "z"] as const) {
      for (let k = 0; k < ROADS.length + 1; k++) {
        const from = k === 0 ? -CITY : ROADS[k - 1] + 10;
        const to = k === ROADS.length ? CITY : ROADS[k] - 10;
        if (to - from < 2) continue;
        const mid = (from + to) / 2;
        if (axis === "x") {
          median.add(mid, 0, 0, to - from, 0.45, 1.1);
          this.block(from, -0.75, to, 0.75);
        } else {
          median.add(0, 0, mid, 1.1, 0.45, to - from);
          this.block(-0.75, from, 0.75, to);
        }
        for (let a = from + 1.2; a < to - 1; a += 2.4) {
          const r = 0.45 + this.rng() * 0.25;
          const g = greens[Math.floor(this.rng() * greens.length)];
          if (axis === "x") shrubs.add(a, 0.6, (this.rng() - 0.5) * 0.3, r, r * 0.8, r, this.rng() * 3, g);
          else shrubs.add((this.rng() - 0.5) * 0.3, 0.6, a, r, r * 0.8, r, this.rng() * 3, g);
        }
      }
    }
    median.build(this.group);
    shrubs.build(this.group);
  }

  private addLight(
    row: { axis: "x" | "z"; front: number; inward: 1 | -1 },
    along: number,
    y: number,
    out: number,
    color: string,
    intensity: number,
    threshold: number
  ) {
    const across = row.front - row.inward * out;
    const pos = row.axis === "x" ? new THREE.Vector3(along, y, across) : new THREE.Vector3(across, y, along);
    this.lights.push({ pos, color: new THREE.Color(color), intensity, threshold });
  }

  private trees!: Batch;
  private canopy!: Batch;
  private addTree(x: number, z: number, scale = 1) {
    const h = (3.4 + this.rng() * 1.4) * scale;
    const y = this.groundAt(x, z);
    this.trees.add(x, y, z, 0.32 * scale, h, 0.32 * scale);
    const greens = ["#2f4a26", "#3b5a2c", "#26401f", "#45663a"];
    for (let k = 0; k < 3; k++) {
      const r = (1.3 + this.rng() * 0.8) * scale;
      const a = this.rng() * Math.PI * 2;
      this.canopy.add(
        x + Math.cos(a) * 0.8 * scale,
        y + h + (this.rng() - 0.2) * 0.9 * scale,
        z + Math.sin(a) * 0.8 * scale,
        r,
        r * 0.8,
        r,
        this.rng() * 3,
        greens[Math.floor(this.rng() * greens.length)]
      );
    }
    this.post(x, z, 0.35);
  }

  private buildTower(x0: number, z0: number, x1: number, z1: number, inner: Batch) {
    const s = this.shared;
    inner.add((x0 + x1) / 2, 0, (z0 + z1) / 2, x1 - x0 - 2, SLAB + 0.02, z1 - z0 - 2, 0, "#8a8378");
    const glass = std(s, "#2a3542", {
      roughness: 0.3,
      metalness: 0.5,
      windows: { cell: [1.5, 3.6], size: [0.88, 0.72], warm: "#ffe0ae", cool: "#dbe8ff", coolShare: 0.7, density: 1.3, dark: 0.35 },
    });
    const tower = new THREE.Mesh(UNIT_BOX, glass);
    tower.position.set(-32, SLAB, -32);
    tower.scale.set(24, 66, 24);
    tower.castShadow = tower.receiveShadow = true;
    this.group.add(tower);
    this.block(-44.4, -44.4, -19.6, -19.6);

    // Lobby glow on the two faces that look at the junction.
    const lobby = glow(s, "#ffe2b8", 1.3, 0.3);
    for (const [px, pz, sx, sz] of [
      [-32, -20.05, 20, 0.05],
      [-20.05, -32, 0.05, 20],
    ]) {
      const m = new THREE.Mesh(UNIT_BOX, lobby);
      m.position.set(px, SLAB, pz);
      m.scale.set(sx, 4.2, sz);
      this.group.add(m);
    }
    this.lights.push({ pos: new THREE.Vector3(-26, 2, -17), color: new THREE.Color("#ffe2b8"), intensity: 6, threshold: 0 });
    this.lights.push({ pos: new THREE.Vector3(-17, 2, -26), color: new THREE.Color("#ffe2b8"), intensity: 6, threshold: 0 });

    // Planters with young trees across the plaza.
    const planter = new Batch(UNIT_BOX, std(s, "#57534c"));
    for (const [px, pz] of [
      [-10, -24],
      [-24, -10],
      [-10, -38],
      [-38, -10],
    ]) {
      planter.add(px, SLAB, pz, 2.4, 0.6, 2.4);
      this.post(px, pz, 1.3);
      this.addTree(px, pz, 0.7);
    }
    planter.build(this.group);
  }

  private buildPark(x0: number, z0: number, x1: number, z1: number, inner: Batch) {
    const s = this.shared;
    const cx = (x0 + x1) / 2;
    const cz = (z0 + z1) / 2;
    inner.add(cx, 0, cz, x1 - x0 - 4, SLAB + 0.02, z1 - z0 - 4, 0, "#2c4426");
    const path = new Batch(UNIT_BOX, std(s, "#8c857a"), { receive: true });
    const r = 12;
    path.add(cx, SLAB, cz - r, 2 * r + 2.4, 0.04, 2.4);
    path.add(cx, SLAB, cz + r, 2 * r + 2.4, 0.04, 2.4);
    path.add(cx - r, SLAB, cz, 2.4, 0.04, 2 * r);
    path.add(cx + r, SLAB, cz, 2.4, 0.04, 2 * r);
    path.build(this.group);

    const lampPost = new Batch(UNIT_CYL, std(s, "#2f3033"));
    const lampHead = new Batch(new THREE.SphereGeometry(0.28, 10, 8), glow(s, "#ffd9a0", 3.2, 0), {});
    for (const [dx, dz] of [
      [-r, -r],
      [r, -r],
      [-r, r],
      [r, r],
      [0, -r],
      [0, r],
      [-r, 0],
      [r, 0],
    ]) {
      const x = cx + dx + (dx === 0 ? 0 : -Math.sign(dx) * 1.6);
      const z = cz + dz + (dz === 0 ? 1.6 : -Math.sign(dz) * 1.6);
      lampPost.add(x, SLAB, z, 0.12, 3.2, 0.12);
      lampHead.add(x, SLAB + 3.3, z, 1, 1, 1);
      this.post(x, z, 0.2);
      this.lights.push({ pos: new THREE.Vector3(x, 3.3, z), color: new THREE.Color("#ffd9a0"), intensity: 7, threshold: 0.2 + this.rng() * 0.3 });
    }
    lampPost.build(this.group);
    lampHead.build(this.group);

    for (let k = 0; k < 34; k++) {
      const x = x0 + 4 + this.rng() * (x1 - x0 - 8);
      const z = z0 + 4 + this.rng() * (z1 - z0 - 8);
      const onPath = Math.abs(Math.max(Math.abs(x - cx), Math.abs(z - cz)) - r) < 2.5;
      if (onPath) continue;
      this.addTree(x, z, 0.9 + this.rng() * 0.5);
    }
  }

  /* ── flyover ─────────────────────────────────────────────────────────── */

  private buildFlyover() {
    const s = this.shared;
    const conc = std(s, "#77726a", { roughness: 0.95, surface: "concrete" });
    const deck = new THREE.Mesh(UNIT_BOX, conc);
    deck.position.set(0, DECK_Y - 1, FLYOVER_Z);
    deck.scale.set(2 * CITY + 4, 1, 12.4);
    deck.castShadow = deck.receiveShadow = true;
    this.group.add(deck);
    const road = new THREE.Mesh(UNIT_BOX, std(s, "#2a2a2f", { roughness: 1, chaos: 0.6, surface: "asphalt" }));
    road.position.set(0, DECK_Y, FLYOVER_Z);
    road.scale.set(2 * CITY + 4, 0.02, 11.6);
    road.receiveShadow = true;
    this.group.add(road);
    for (const side of [-1, 1]) {
      const wall = new THREE.Mesh(UNIT_BOX, conc);
      wall.position.set(0, DECK_Y, FLYOVER_Z + side * 6);
      wall.scale.set(2 * CITY + 4, 0.9, 0.35);
      wall.castShadow = true;
      this.group.add(wall);
    }

    const pillars = new Batch(UNIT_CYL, conc);
    const caps = new Batch(UNIT_BOX, conc);
    for (let x = -CITY + 6; x < CITY; x += 18) {
      if (ROADS.some((r) => Math.abs(x - r) < 9)) continue;
      pillars.add(x, 0, FLYOVER_Z, 1.9, DECK_Y - 1.6, 1.9);
      caps.add(x, DECK_Y - 1.8, FLYOVER_Z, 2.2, 0.8, 7);
      this.post(x, FLYOVER_Z, 1.1);
    }
    pillars.build(this.group);
    caps.build(this.group);
  }

  /* ── lamps, trees, traffic lights ───────────────────────────────────── */

  private buildStreetFurniture() {
    const s = this.shared;
    const metal = std(s, "#34363a", { roughness: 0.6, metalness: 0.3 });
    const posts = new Batch(UNIT_CYL, metal);
    const arms = new Batch(UNIT_BOX, metal);
    const heads = new Batch(UNIT_BOX, glow(s, "#ffffff", 1, 0.2), {});
    const near = (v: number, d: number) => ROADS.some((r) => Math.abs(v - r) < d);

    const lamp = (x: number, y: number, z: number, toward: THREE.Vector2, h: number, color: string) => {
      posts.add(x, y, z, 0.16, h, 0.16);
      arms.add(x + toward.x * 0.7, y + h - 0.08, z + toward.y * 0.7, Math.abs(toward.x) * 1.4 + 0.08, 0.08, Math.abs(toward.y) * 1.4 + 0.08);
      heads.add(x + toward.x * 1.4, y + h - 0.16, z + toward.y * 1.4, 0.55, 0.12, 0.55);
      const threshold = this.rng();
      this.lampColors.push({ color: new THREE.Color(color), threshold });
      this.lights.push({ pos: new THREE.Vector3(x + toward.x * 1.4, y + h - 0.4, z + toward.y * 1.4), color: new THREE.Color(color), intensity: 14, threshold });
      if (y < 1) this.post(x, z, 0.2);
    };

    for (const r of ROADS) {
      // Arterials get cold LED; everything else the old sodium amber.
      const color = r === 0 ? "#dfe8ff" : "#ffad55";
      for (let a = -CITY + 9; a < CITY; a += 18) {
        if (near(a, 11)) continue;
        for (const side of [-1, 1]) {
          lamp(a, SLAB, r + side * 7, new THREE.Vector2(0, -side), 6.4, color); // along x
          lamp(r + side * 7, SLAB, a, new THREE.Vector2(-side, 0), 6.4, color); // along z
          if (near(a + 9, 10)) continue;
          if (this.rng() < 0.6) this.addTree(a + 9, r + side * 8.3);
          if (this.rng() < 0.6) this.addTree(r + side * 8.3, a + 9);
        }
      }
    }
    // Lamps down the middle of the flyover deck.
    for (let a = -CITY + 12; a < CITY; a += 24) {
      lamp(a, DECK_Y, FLYOVER_Z, new THREE.Vector2(0, 1), 4.5, "#dfe8ff");
    }

    posts.build(this.group);
    arms.build(this.group);
    this.lampHeads = heads.build(this.group);
    this.trees.build(this.group);
    this.canopy.build(this.group);

    // Traffic lights: a pole on every corner of every junction.
    const poles = new Batch(UNIT_CYL, metal);
    const boxes = new Batch(UNIT_BOX, std(s, "#1d1e21"));
    const bulbs = new Batch(new THREE.SphereGeometry(0.13, 8, 6), glow(s, "#ffffff", 1, 0.5), {});
    ROADS.forEach((jx, ix) => {
      ROADS.forEach((jz, iz) => {
        const junction = { x: jx, z: jz, offset: (ix * 5 + iz * 3) % 22, bulbs: [] as number[] };
        for (const sx of [-1, 1]) {
          for (const sz of [-1, 1]) {
            const x = jx + sx * 7.4;
            const z = jz + sz * 7.4;
            const y = SLAB;
            poles.add(x, y, z, 0.16, 4.2, 0.16);
            boxes.add(x, y + 3.3, z, 0.38, 1.25, 0.38);
            this.post(x, z, 0.2);
            const axis = sx === sz ? "x" : "z";
            [0xff2a1f, 0xffb000, 0x2bff6a].forEach((color, k) => {
              junction.bulbs.push(bulbs.add(x - sx * 0.2, y + 4.3 - k * 0.38, z - sz * 0.2, 1, 1, 1));
              this.bulbColors.push({ axis, color });
            });
          }
        }
        this.junctions.push(junction);
      });
    });
    poles.build(this.group);
    boxes.build(this.group);
    this.bulbs = bulbs.build(this.group);
  }

  /* ── traffic ─────────────────────────────────────────────────────────── */

  private buildTraffic() {
    const s = this.shared;
    for (const r of ROADS) {
      for (const axis of ["x", "z"] as const) {
        for (const dir of [1, -1] as const) {
          for (const dist of [2.1, 4.7]) {
            // India drives on the left.
            const offset = (axis === "x" ? -dir : dir) * dist;
            this.lanes.push({ axis, coord: r, offset, dir, y: 0, stops: true, cars: [] });
          }
        }
      }
    }
    for (const dir of [1, -1] as const) {
      this.lanes.push({ axis: "x", coord: FLYOVER_Z, offset: -dir * 2.8, dir, y: DECK_Y, stops: false, cars: [] });
    }

    const body = new Batch(UNIT_BOX, std(s, "#ffffff", { roughness: 0.4, metalness: 0.3, chaos: 0.9 }));
    const cabin = new Batch(UNIT_BOX, std(s, "#ffffff", { roughness: 0.3, metalness: 0.2, chaos: 0.9 }));
    const head = new Batch(UNIT_BOX, glow(s, "#fff1cf", 3.2, 0.9), {});
    const tail = new Batch(UNIT_BOX, glow(s, "#ff2a20", 2.2, 0.9), {});

    for (const lane of this.lanes) {
      const n = lane.y > 0 ? 7 : 3 + Math.floor(this.rng() * 3);
      const spacing = (2 * CITY) / n;
      for (let k = 0; k < n; k++) {
        let pick = this.rng();
        let kind = 0;
        while (kind < KINDS.length - 1 && pick > KINDS[kind].weight) pick -= KINDS[kind++].weight;
        if (kind === 3 && Math.abs(lane.offset) < 3) kind = 0; // buses keep to the outer lane
        const K = KINDS[kind];
        const color = new THREE.Color(K.colors[Math.floor(this.rng() * K.colors.length)]);
        const slot = body.add(0, 0, 0, 1, 1, 1, 0, color);
        cabin.add(0, 0, 0, 1, 1, 1, 0, K.cabinColor);
        for (let l = 0; l < 2; l++) {
          head.add(0, 0, 0, 1, 1, 1);
          tail.add(0, 0, 0, 1, 1, 1);
        }
        this.carMeta.push({ kind, color });
        lane.cars.push({ s: -CITY + k * spacing + this.rng() * spacing * 0.5, v: K.speed, cruise: K.speed * (0.8 + this.rng() * 0.4), kind, slot });
      }
    }
    this.carBody = body.build(this.group);
    this.carCabin = cabin.build(this.group);
    this.carHead = head.build(this.group);
    this.carTail = tail.build(this.group);
    for (const m of [this.carBody, this.carCabin, this.carHead, this.carTail]) {
      m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    }
    this.carHead.castShadow = this.carTail.castShadow = false;
  }

  private phase(j: { offset: number }, axis: "x" | "z", t: number): "g" | "a" | "r" {
    const p = (t + j.offset) % 22;
    if (axis === "x") return p < 9 ? "g" : p < 11 ? "a" : "r";
    return p < 11 ? "r" : p < 20 ? "g" : "a";
  }

  private m4 = new THREE.Matrix4();
  private q = new THREE.Quaternion();
  private v = new THREE.Vector3();
  private sc = new THREE.Vector3();

  /** Recent horns: x, z, strength. They flare the chaos around the car. */
  readonly honks = Array.from({ length: HONKS }, () => new THREE.Vector3());
  private honkNext = 0;
  private honk(x: number, z: number) {
    this.honks[this.honkNext++ % HONKS].set(x, z, 1);
  }

  private stepTraffic(dt: number, t: number, walker: THREE.Vector3) {
    const L = 2 * CITY;
    for (const lane of this.lanes) {
      const cars = lane.cars;
      cars.sort((a, b) => a.s * lane.dir - b.s * lane.dir);
      for (let i = 0; i < cars.length; i++) {
        const car = cars[i];
        const K = KINDS[car.kind];
        let target = car.cruise;

        const lead = cars[(i + 1) % cars.length];
        if (lead !== car) {
          let gap = (lead.s - car.s) * lane.dir;
          if (gap < 0) gap += L;
          gap -= (K.l + KINDS[lead.kind].l) / 2;
          target = Math.min(target, Math.max(0, gap - 2.2) * 1.3);
        }

        /* Someone on the road ahead: brake, and lean on the horn. */
        if (lane.y === 0) {
          const across = lane.coord + lane.offset;
          const wa = lane.axis === "x" ? walker.x : walker.z;
          const wc = lane.axis === "x" ? walker.z : walker.x;
          const ahead = (wa - car.s) * lane.dir;
          if (Math.abs(wc - across) < K.w / 2 + 1 && ahead > 0 && ahead < 15) {
            target = Math.min(target, Math.max(0, ahead - K.l / 2 - 1.6) * 1.5);
            if (ahead < 11 && car.v > 0.5 && Math.random() < dt * 1.2) {
              this.honk(lane.axis === "x" ? car.s : across, lane.axis === "x" ? across : car.s);
            }
          }
        }

        if (lane.stops) {
          const pos = car.s * lane.dir;
          for (const r of ROADS) {
            const stopLine = r * lane.dir - 11.2;
            const d = stopLine - pos - K.l / 2;
            if (d > -0.5 && d < 18) {
              const jx = lane.axis === "x" ? r : lane.coord;
              const jz = lane.axis === "x" ? lane.coord : r;
              const j = this.junctions.find((q) => q.x === jx && q.z === jz)!;
              const state = this.phase(j, lane.axis, t);
              if (state === "r" || (state === "a" && d > 3)) target = Math.min(target, Math.max(0, d - 0.3) * 1.2);
            }
          }
        }

        car.v += THREE.MathUtils.clamp(target - car.v, -9 * dt, 3 * dt);
        car.s += lane.dir * car.v * dt;
        if (car.s > CITY) car.s -= L;
        if (car.s < -CITY) car.s += L;
      }
    }
  }

  private writeTraffic() {
    for (const lane of this.lanes) {
      const yaw = lane.axis === "x" ? (lane.dir > 0 ? Math.PI / 2 : -Math.PI / 2) : lane.dir > 0 ? 0 : Math.PI;
      this.q.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, yaw);
      const fx = lane.axis === "x" ? lane.dir : 0;
      const fz = lane.axis === "z" ? lane.dir : 0;
      for (const car of lane.cars) {
        const K = KINDS[car.kind];
        const fade = 1 - THREE.MathUtils.smoothstep(Math.abs(car.s), CITY - 8, CITY);
        const x = lane.axis === "x" ? car.s : lane.coord + lane.offset;
        const z = lane.axis === "z" ? car.s : lane.coord + lane.offset;
        const y = lane.y + 0.25;

        this.m4.compose(this.v.set(x, y, z), this.q, this.sc.set(K.w * fade, K.h * fade, K.l * fade));
        this.carBody.setMatrixAt(car.slot, this.m4);
        const [cw, ch, cl, cz] = K.cabin;
        this.m4.compose(this.v.set(x + fx * cz, y + K.h * fade, z + fz * cz), this.q, this.sc.set(cw * fade, ch * fade, cl * fade));
        this.carCabin.setMatrixAt(car.slot, this.m4);

        for (let l = 0; l < 2; l++) {
          const side = (l === 0 ? -1 : 1) * K.w * 0.33;
          const single = car.kind === 2;
          const sx = single ? 0 : side;
          const lx = -fz * sx;
          const lz = fx * sx;
          const lightScale = single && l === 1 ? 0 : fade;
          this.m4.compose(this.v.set(x + lx + fx * (K.l / 2), y + K.h * 0.55, z + lz + fz * (K.l / 2)), this.q, this.sc.set(0.32 * lightScale, 0.16 * lightScale, 0.06 * lightScale));
          this.carHead.setMatrixAt(car.slot * 2 + l, this.m4);
          this.m4.compose(this.v.set(x + lx - fx * (K.l / 2), y + K.h * 0.6, z + lz - fz * (K.l / 2)), this.q, this.sc.set(0.3 * lightScale, 0.12 * lightScale, 0.06 * lightScale));
          this.carTail.setMatrixAt(car.slot * 2 + l, this.m4);
        }
      }
    }
    for (const m of [this.carBody, this.carCabin, this.carHead, this.carTail]) m.instanceMatrix.needsUpdate = true;
  }

  /* ── people ──────────────────────────────────────────────────────────── */

  /* Pedestrians walking the pavement round each block, and a few chai and
     fruit carts at the corners with their own bulb. Each person is four
     instances — two legs, a torso, a head — so they actually stride. */
  private people: { x0: number; z0: number; x1: number; z1: number; t: number; v: number; dir: 1 | -1; wait: number; slot: number; phase: number }[] = [];
  private pLegs!: THREE.InstancedMesh;
  private pBody!: THREE.InstancedMesh;
  private pHead!: THREE.InstancedMesh;
  private euler = new THREE.Euler(0, 0, 0, "YXZ");
  private q2 = new THREE.Quaternion();
  private off = new THREE.Vector3();

  private buildPeople() {
    const s = this.shared;
    const legs = new Batch(UNIT_BOX, std(s, "#ffffff", { chaos: 0.55 }));
    const body = new Batch(UNIT_BOX, std(s, "#ffffff", { chaos: 0.55 }));
    const head = new Batch(new THREE.SphereGeometry(0.12, 8, 6), std(s, "#ffffff", { chaos: 0.55 }));
    const pick = <T,>(a: T[]) => a[Math.floor(this.rng() * a.length)];

    RANGES.forEach(([x0, x1], i) => {
      RANGES.forEach(([z0, z1], j) => {
        const ring = i === 0 || i === 5 || j === 0 || j === 5;
        const n = ring ? 2 : 4 + Math.floor(this.rng() * 3);
        for (let k = 0; k < n; k++) {
          const slot = body.add(0, 0, 0, 1, 1, 1, 0, pick(SHIRTS));
          const pants = pick(PANTS);
          legs.add(0, 0, 0, 1, 1, 1, 0, pants);
          legs.add(0, 0, 0, 1, 1, 1, 0, pants);
          head.add(0, 0, 0, 1, 1, 1, 0, pick(SKINS));
          this.people.push({
            x0: x0 + 1.6,
            z0: z0 + 1.6,
            x1: x1 - 1.6,
            z1: z1 - 1.6,
            t: this.rng() * 400,
            v: 0.9 + this.rng() * 0.6,
            dir: this.rng() < 0.5 ? 1 : -1,
            wait: 0,
            slot,
            phase: this.rng() * Math.PI * 2,
          });
        }
      });
    });
    this.pLegs = legs.build(this.group);
    this.pBody = body.build(this.group);
    this.pHead = head.build(this.group);
    for (const m of [this.pLegs, this.pBody, this.pHead]) m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // Carts: a box on the pavement, a tarp on top, one bare bulb.
    const cart = new Batch(UNIT_BOX, std(s, "#5a4632", { surface: "concrete" }));
    const tarp = new Batch(UNIT_BOX, std(s, "#ffffff", { roughness: 0.9 }));
    const bulb = new Batch(new THREE.SphereGeometry(0.1, 8, 6), glow(s, "#ffcf8a", 4, 0.2), {});
    const spots: [number, number, number][] = [
      [8.6, 25, 1], [-8.6, -29, 1], [25, 8.6, 0], [-29, 60.6, 0], [25, -60.6, 0], [-60.6, -29, 1],
      [8.6, 61, 1], [-65, 8.6, 0], [79, -8.6, 0], [-8.6, -83, 1], [61, 43.6, 0], [-83, 43.6, 0],
    ];
    for (const [x, z, rot] of spots) {
      const ry = rot ? Math.PI / 2 : 0;
      cart.add(x, SLAB + 0.35, z, 1.8, 0.6, 0.9, ry);
      tarp.add(x, SLAB + 2.15, z, 2.1, 0.06, 1.3, ry, pick(AWNING));
      bulb.add(x, SLAB + 1.95, z, 1, 1, 1);
      this.block(x - (rot ? 0.6 : 1.1), z - (rot ? 1.1 : 0.6), x + (rot ? 0.6 : 1.1), z + (rot ? 1.1 : 0.6));
      this.lights.push({ pos: new THREE.Vector3(x, SLAB + 1.9, z), color: new THREE.Color("#ffcf8a"), intensity: 5, threshold: 0 });
    }
    cart.build(this.group);
    tarp.build(this.group);
    bulb.build(this.group);
  }

  private perimeterAt(p: { x0: number; z0: number; x1: number; z1: number }, t: number): [number, number, number, number] {
    const w = p.x1 - p.x0;
    const h = p.z1 - p.z0;
    const P = 2 * (w + h);
    let d = ((t % P) + P) % P;
    if (d < w) return [p.x0 + d, p.z0, 1, 0];
    d -= w;
    if (d < h) return [p.x1, p.z0 + d, 0, 1];
    d -= h;
    if (d < w) return [p.x1 - d, p.z1, -1, 0];
    d -= w;
    return [p.x0, p.z1 - d, 0, -1];
  }

  private stepPeople(dt: number, walker: THREE.Vector3) {
    for (const p of this.people) {
      const [x, z] = this.perimeterAt(p, p.t);
      // Nobody walks through him: they pause if he's right in the way.
      const close = (x - walker.x) ** 2 + (z - walker.z) ** 2 < 0.8;
      p.wait = close ? 0.6 : Math.max(0, p.wait - dt);
      if (p.wait <= 0) p.t += p.v * p.dir * dt;
    }
  }

  private writePeople() {
    for (const p of this.people) {
      const [x, z, dx, dz] = this.perimeterAt(p, p.t);
      const moving = p.wait <= 0 ? 1 : 0;
      const ph = p.t * 4.2 + p.phase;
      const yaw = Math.atan2(dx * p.dir, dz * p.dir);
      this.q.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, yaw);
      const y = SLAB + 0.03 * Math.abs(Math.sin(ph)) * moving;
      this.m4.compose(this.v.set(x, y + 0.82, z), this.q, this.sc.set(0.42, 0.62, 0.26));
      this.pBody.setMatrixAt(p.slot, this.m4);
      this.m4.compose(this.v.set(x, y + 1.6, z), this.q, this.sc.set(1, 1.1, 1));
      this.pHead.setMatrixAt(p.slot, this.m4);
      // Legs swing from the hip.
      for (let l = 0; l < 2; l++) {
        this.euler.set(Math.sin(ph + l * Math.PI) * 0.45 * moving, yaw, 0);
        this.q2.setFromEuler(this.euler);
        this.off.set((l === 0 ? 1 : -1) * 0.1, -0.82, 0).applyQuaternion(this.q2);
        this.m4.compose(this.v.set(x + this.off.x, y + 0.82 + this.off.y, z + this.off.z), this.q2, this.sc.set(0.15, 0.82, 0.17));
        this.pLegs.setMatrixAt(p.slot * 2 + l, this.m4);
      }
    }
    for (const m of [this.pLegs, this.pBody, this.pHead]) m.instanceMatrix.needsUpdate = true;
  }

  /* ── per frame ───────────────────────────────────────────────────────── */

  private tmp = new THREE.Color();

  update(dt: number, t: number, mood: Mood, walker: THREE.Vector3) {
    this.shared.uWindows.value = mood.windows;
    this.shared.uTime.value = t;

    if (Math.abs(mood.lampOn - this.lastLampOn) > 0.002) {
      this.lastLampOn = mood.lampOn;
      this.lampColors.forEach((l, i) => {
        const on = THREE.MathUtils.clamp((mood.lampOn - l.threshold * 0.9) * 10, 0, 1);
        this.lampHeads.setColorAt(i, this.tmp.copy(l.color).multiplyScalar(0.15 + on * 3.2));
      });
      this.lampHeads.instanceColor!.needsUpdate = true;
    }

    const key = this.junctions.map((j) => this.phase(j, "x", t) + this.phase(j, "z", t)).join("");
    if (key !== this.lastPhaseKey) {
      this.lastPhaseKey = key;
      let b = 0;
      for (const j of this.junctions) {
        for (let k = 0; k < j.bulbs.length; k++, b++) {
          const { axis, color } = this.bulbColors[b];
          const state = this.phase(j, axis, t);
          const which = state === "r" ? 0xff2a1f : state === "a" ? 0xffb000 : 0x2bff6a;
          this.bulbs.setColorAt(j.bulbs[k], this.tmp.setHex(color).multiplyScalar(color === which ? 3.4 : 0.08));
        }
      }
      this.bulbs.instanceColor!.needsUpdate = true;
    }

    if (dt > 0) {
      this.stepTraffic(dt, t, walker);
      this.stepPeople(dt, walker);
    }
    this.writeTraffic();
    this.writePeople();
    this.honks.forEach((h, i) => {
      h.z = Math.max(0, h.z - dt * 0.8);
      this.shared.uHonk.value[i].copy(h);
    });
  }

  /** On-ness of a light source right now, for the light pool. */
  lightLevel(l: LightSource, mood: Mood) {
    if (l.threshold === 0) return 1 - 0.5 * THREE.MathUtils.smoothstep(mood.e, 0.9, 1);
    return THREE.MathUtils.clamp((mood.lampOn - l.threshold * 0.9) * 10, 0, 1);
  }

  /* ── chaos map ───────────────────────────────────────────────────────── */

  static chaosTexture() {
    const S = 256;
    const data = new Float32Array(S * S);
    const bytes = new Uint8Array(S * S);
    const roadDist = (v: number) => Math.min(...ROADS.map((r) => Math.abs(v - r)));
    for (let j = 0; j < S; j++) {
      for (let i = 0; i < S; i++) {
        const x = ((i + 0.5) / S) * 2 * WORLD_HALF - WORLD_HALF;
        const z = ((j + 0.5) / S) * 2 * WORLD_HALF - WORLD_HALF;
        const dx = roadDist(x);
        const dz = roadDist(z);
        const d = Math.min(dx, dz);
        let c = 0.14 + 0.6 * (1 - THREE.MathUtils.smoothstep(d, 5, 16));
        if (dx < 9 && dz < 9) c += 0.25; // junctions
        if (Math.abs(x) < 7 || Math.abs(z) < 7) c += 0.12; // the arterials
        if (Math.abs(z - FLYOVER_Z) < 9) c += 0.15;
        if (x > -98 && x < -58 && z > 6 && z < 46) c = 0.06 + 0.3 * (1 - THREE.MathUtils.smoothstep(Math.min(x + 98, -58 - x, z - 6, 46 - z), 0, 6));
        if (x > -46 && x < -8 && z > -46 && z < -8) c = Math.min(c, 0.45);
        if (Math.abs(x) > CITY || Math.abs(z) > CITY) c = 0.2;
        data[j * S + i] = Math.min(1, c);
      }
    }
    // Two box blurs soften the zones into each other.
    const tmp = new Float32Array(S * S);
    for (let pass = 0; pass < 2; pass++) {
      for (let j = 0; j < S; j++)
        for (let i = 0; i < S; i++) {
          let sum = 0;
          let n = 0;
          for (let k = -3; k <= 3; k++) {
            const ii = Math.min(S - 1, Math.max(0, i + k));
            sum += data[j * S + ii];
            n++;
          }
          tmp[j * S + i] = sum / n;
        }
      for (let j = 0; j < S; j++)
        for (let i = 0; i < S; i++) {
          let sum = 0;
          let n = 0;
          for (let k = -3; k <= 3; k++) {
            const jj = Math.min(S - 1, Math.max(0, j + k));
            sum += tmp[jj * S + i];
            n++;
          }
          data[j * S + i] = sum / n;
        }
    }
    for (let k = 0; k < S * S; k++) bytes[k] = Math.round(data[k] * 255);
    const tex = new THREE.DataTexture(bytes, S, S, THREE.RedFormat, THREE.UnsignedByteType);
    tex.magFilter = THREE.LinearFilter;
    tex.minFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
  }
}
