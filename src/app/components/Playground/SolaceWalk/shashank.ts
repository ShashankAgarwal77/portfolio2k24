import * as THREE from "three";
import { keepAlpha, patch, type Shared } from "./materials";
import type { World } from "./world";

/* ─────────────────────────────────────────────────────────────────────────
   Shashank — 5'11", lean, black hoodie, straight-to-baggy black pyjamas,
   headphones over an even mop of straight-to-curly hair, pine-green
   Wayfarer-style acetate frames, brown eyes, fair-to-brown skin.

   A real rig, built from pivots so every joint rotates about the right
   point:

     root (ground, facing)
       pelvis ── hip L/R ── knee ── ankle (shoe)
         └─ spine ── shoulder L/R ── elbow ── wrist (hand)
                └─ neck ── head (glasses, eyes, hair, headphones)

   The model faces +z. Walking is driven by distance covered, so the feet
   never skate; turning is led by the head, then the body follows.
   ───────────────────────────────────────────────────────────────────────── */

const C = {
  skin: "#c58c66",
  hoodie: "#151518",
  hoodieDeep: "#0f0f12",
  pants: "#111114",
  hair: "#1d1511",
  frames: "#1f7a5c",
  eye: "#5b3a22",
  shoes: "#e6e1d8",
  sole: "#9b968e",
  phones: "#2b2d31",
  phonesRing: "#9aa0a8",
  strings: "#d8d4cc",
};

export const WALK = 1.45; // m/s, an unhurried after-work pace
export const RUN = 4.2; // m/s with Shift — late for the metro
const STRIDE = 1.5; // metres per full cycle (two steps)
const RUN_STRIDE = 2.7;
const RADIUS = 0.3;

const tau = Math.PI * 2;
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
const damp = (k: number, dt: number) => 1 - Math.exp(-k * dt);

type Limb = { hip: THREE.Group; knee: THREE.Group; ankle: THREE.Group };
type Arm = { shoulder: THREE.Group; elbow: THREE.Group; wrist: THREE.Group };

export class Shashank {
  readonly root = new THREE.Group();
  readonly pos = new THREE.Vector3();
  yaw = 0;
  headphones = 1;
  headphonesTarget = 1;
  speed = 0;
  /** 0 walking → 1 running. */
  runT = 0;

  private pelvis = new THREE.Group();
  private spine = new THREE.Group();
  private neck = new THREE.Group();
  private head = new THREE.Group();
  private phonesGroup = new THREE.Group();
  private legs: [Limb, Limb];
  private arms: [Arm, Arm];

  private vel = new THREE.Vector2();
  private phase = 0;
  private headYaw = 0;
  private headPitch = 0;
  private turnRate = 0;
  private lookTarget = 0;
  private lookTimer = 3;
  private t = 0;
  private groundY = 0;

  constructor(shared: Shared) {
    const mats = new Map<string, THREE.Material>();
    const mat = (color: string, roughness = 0.85, metalness = 0) => {
      const key = `${color}${roughness}${metalness}`;
      if (!mats.has(key)) {
        mats.set(key, patch(new THREE.MeshStandardMaterial({ color, roughness, metalness }), shared, { character: true }));
      }
      return mats.get(key)!;
    };
    const add = (
      parent: THREE.Object3D,
      geo: THREE.BufferGeometry,
      material: THREE.Material,
      p: [number, number, number],
      r: [number, number, number] = [0, 0, 0],
      s: [number, number, number] = [1, 1, 1]
    ) => {
      const m = new THREE.Mesh(geo, material);
      m.position.set(...p);
      m.rotation.set(...r);
      m.scale.set(...s);
      m.castShadow = true;
      m.layers.enable(1);
      parent.add(m);
      return m;
    };
    const pivot = (parent: THREE.Object3D, p: [number, number, number]) => {
      const g = new THREE.Group();
      g.position.set(...p);
      parent.add(g);
      return g;
    };

    const hoodie = mat(C.hoodie, 0.95);
    const pants = mat(C.pants, 0.95);
    const skin = mat(C.skin, 0.7);

    this.root.add(this.pelvis);
    this.pelvis.position.y = 0.95;
    add(this.pelvis, new THREE.CapsuleGeometry(0.14, 0.08, 4, 12), pants, [0, 0, 0], [0, 0, Math.PI / 2], [1, 1.25, 0.85]);

    /* Legs: baggy pyjama thigh, a shin that flares a little at the cuff,
       off-white sneakers — the brightest thing on him, so steps read. */
    const leg = (side: 1 | -1): Limb => {
      const hip = pivot(this.pelvis, [side * 0.095, -0.02, 0]);
      add(hip, new THREE.CylinderGeometry(0.088, 0.076, 0.47, 12), pants, [0, -0.225, 0]);
      const knee = pivot(hip, [0, -0.45, 0]);
      add(knee, new THREE.SphereGeometry(0.077, 10, 8), pants, [0, 0, 0]);
      add(knee, new THREE.CylinderGeometry(0.072, 0.086, 0.43, 12), pants, [0, -0.215, 0]);
      const ankle = pivot(knee, [0, -0.43, 0]);
      add(ankle, new THREE.BoxGeometry(0.11, 0.075, 0.27), mat(C.shoes, 0.6), [0, -0.025, 0.05]);
      add(ankle, new THREE.BoxGeometry(0.115, 0.022, 0.28), mat(C.sole, 0.8), [0, -0.068, 0.05]);
      return { hip, knee, ankle };
    };
    this.legs = [leg(1), leg(-1)];

    /* Torso: a relaxed hoodie, kangaroo pocket, drawstrings, the hood
       bunched at the back of the neck. */
    this.pelvis.add(this.spine);
    this.spine.position.y = 0.06;
    add(this.spine, new THREE.CapsuleGeometry(0.165, 0.28, 6, 14), hoodie, [0, 0.25, 0], [0, 0, 0], [1.3, 1, 0.84]);
    add(this.spine, new THREE.CapsuleGeometry(0.15, 0.04, 4, 12), hoodie, [0, 0.47, 0], [0, 0, Math.PI / 2], [1.05, 1.42, 0.9]);
    add(this.spine, new THREE.BoxGeometry(0.25, 0.12, 0.03), mat(C.hoodieDeep, 1), [0, 0.13, 0.135]);
    add(this.spine, new THREE.SphereGeometry(0.12, 12, 8), hoodie, [0, 0.52, -0.1], [0, 0, 0], [1.35, 0.72, 0.85]);
    for (const sx of [-1, 1]) {
      add(this.spine, new THREE.CylinderGeometry(0.006, 0.006, 0.15, 4), mat(C.strings, 0.8), [sx * 0.04, 0.4, 0.142]);
    }

    const arm = (side: 1 | -1): Arm => {
      const shoulder = pivot(this.spine, [side * 0.205, 0.475, 0]);
      add(shoulder, new THREE.SphereGeometry(0.07, 10, 8), hoodie, [0, 0, 0]);
      add(shoulder, new THREE.CapsuleGeometry(0.06, 0.2, 4, 10), hoodie, [0, -0.145, 0]);
      const elbow = pivot(shoulder, [0, -0.29, 0]);
      add(elbow, new THREE.CapsuleGeometry(0.054, 0.18, 4, 10), hoodie, [0, -0.12, 0]);
      const wrist = pivot(elbow, [0, -0.255, 0]);
      add(wrist, new THREE.SphereGeometry(0.045, 10, 8), skin, [0, -0.045, 0.005], [0, 0, 0], [0.82, 1.15, 0.6]);
      return { shoulder, elbow, wrist };
    };
    this.arms = [arm(1), arm(-1)];

    /* Neck and head. */
    this.spine.add(this.neck);
    this.neck.position.y = 0.56;
    add(this.neck, new THREE.CylinderGeometry(0.048, 0.052, 0.11, 10), skin, [0, 0.045, 0]);
    this.neck.add(this.head);
    this.head.position.y = 0.1;
    add(this.head, new THREE.SphereGeometry(0.105, 18, 14), skin, [0, 0.025, 0], [0, 0, 0], [0.93, 1.13, 1.04]);
    add(this.head, new THREE.ConeGeometry(0.02, 0.05, 6), skin, [0, 0.0, 0.112], [Math.PI / 2, 0, 0]);
    for (const sx of [-1, 1]) {
      add(this.head, new THREE.SphereGeometry(0.035, 8, 6), skin, [sx * 0.098, 0.02, 0], [0, 0, 0], [0.45, 1, 0.75]); // ears
      add(this.head, new THREE.SphereGeometry(0.013, 8, 6), mat(C.eye, 0.4), [sx * 0.038, 0.034, 0.097]);
    }

    /* Wayfarer frames in pine-green acetate: heavy brow line, trapezoid
       rims, a keyhole bridge, temples running back over the ears. */
    const frames = mat(C.frames, 0.32, 0.05);
    for (const sx of [-1, 1]) {
      add(this.head, new THREE.BoxGeometry(0.058, 0.016, 0.014), frames, [sx * 0.039, 0.054, 0.113]);
      add(this.head, new THREE.BoxGeometry(0.05, 0.01, 0.012), frames, [sx * 0.039, 0.016, 0.11]);
      add(this.head, new THREE.BoxGeometry(0.01, 0.042, 0.012), frames, [sx * 0.067, 0.036, 0.11]);
      add(this.head, new THREE.BoxGeometry(0.008, 0.034, 0.012), frames, [sx * 0.012, 0.034, 0.112]);
      add(this.head, new THREE.BoxGeometry(0.008, 0.012, 0.12), frames, [sx * 0.098, 0.05, 0.05]);
    }
    add(this.head, new THREE.BoxGeometry(0.016, 0.008, 0.012), frames, [0, 0.046, 0.116]);

    /* Hair: an even mop, as much at the sides and back as on top — a base
       volume plus curls scattered over it, leaving the face clear. */
    const hair = mat(C.hair, 1);
    add(this.head, new THREE.SphereGeometry(0.118, 16, 12), hair, [0, 0.085, -0.02], [0, 0, 0], [1.1, 0.88, 1.08]);
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const curl = new THREE.IcosahedronGeometry(1, 1);
    for (let k = 0; k < 34; k++) {
      const theta = rnd() * tau;
      const phi = Math.acos(1 - rnd() * 1.15); // upper cap down past the ears
      const dir = new THREE.Vector3(Math.sin(phi) * Math.sin(theta), Math.cos(phi), Math.sin(phi) * Math.cos(theta));
      if (dir.z > 0.45 && dir.y < 0.62) continue; // keep the face open
      const r = 0.034 + rnd() * 0.018;
      add(this.head, curl, hair, [dir.x * 0.124, 0.07 + dir.y * 0.11, -0.012 + dir.z * 0.124], [rnd() * 3, rnd() * 3, 0], [r, r * 0.9, r]);
    }
    for (const sx of [-1, 0.2, 1]) {
      add(this.head, curl, hair, [sx * 0.045, 0.125, 0.095], [0.4, sx, 0], [0.035, 0.026, 0.03]); // fringe
    }

    /* Headphones: band over the hair, cups on the ears. They live on the
       head; pressing H slides them down around the neck. */
    this.head.add(this.phonesGroup);
    const phones = mat(C.phones, 0.5, 0.2);
    const band = add(this.phonesGroup, new THREE.TorusGeometry(0.152, 0.014, 6, 24, Math.PI), phones, [0, 0.03, -0.005]);
    band.scale.set(1, 1.08, 1);
    for (const sx of [-1, 1]) {
      add(this.phonesGroup, new THREE.CylinderGeometry(0.052, 0.052, 0.04, 16), phones, [sx * 0.145, 0.02, -0.005], [0, 0, Math.PI / 2]);
      add(this.phonesGroup, new THREE.TorusGeometry(0.04, 0.006, 6, 16), mat(C.phonesRing, 0.35, 0.6), [sx * 0.168, 0.02, -0.005], [0, Math.PI / 2, 0]);
    }

    /* A soft contact shadow so he sits on the ground even at night. */
    const blob = new THREE.Mesh(
      new THREE.CircleGeometry(0.42, 24).rotateX(-Math.PI / 2),
      keepAlpha(new THREE.MeshBasicMaterial({ color: "#000000", opacity: 0.42 }))
    );
    blob.position.y = 0.02;
    blob.renderOrder = 1;
    this.root.add(blob);
  }

  place(x: number, z: number, yaw: number, world: World) {
    this.pos.set(x, world.groundAt(x, z), z);
    this.groundY = this.pos.y;
    this.yaw = yaw;
    this.root.position.copy(this.pos);
    this.root.rotation.y = yaw;
  }

  /** move: desired world-space direction on the ground (unit or zero). */
  update(dt: number, move: THREE.Vector2, run: boolean, world: World) {
    this.t += dt;
    const moving = move.lengthSq() > 0;
    const top = moving && run ? RUN : WALK;

    // Ease velocity toward the wish, then collide axis by axis so walls slide.
    const k = damp(moving ? (run ? 5 : 7) : 9, dt);
    this.vel.x += (move.x * top - this.vel.x) * k;
    this.vel.y += (move.y * top - this.vel.y) * k;
    const nx = this.pos.x + this.vel.x * dt;
    if (world.isFree(nx, this.pos.z, RADIUS, true)) this.pos.x = nx;
    else this.vel.x = 0;
    const nz = this.pos.z + this.vel.y * dt;
    if (world.isFree(this.pos.x, nz, RADIUS, true)) this.pos.z = nz;
    else this.vel.y = 0;
    this.groundY += (world.groundAt(this.pos.x, this.pos.z) - this.groundY) * damp(18, dt);
    this.pos.y = this.groundY;

    const speed = this.vel.length();
    this.speed = speed;
    /* 0 → walk, 1 → run, blended by actual speed so the gait changes as
       he picks up pace rather than snapping. */
    const runT = THREE.MathUtils.smoothstep(speed, WALK * 1.05, RUN * 0.9);
    this.runT = runT;
    const stride = THREE.MathUtils.lerp(STRIDE, RUN_STRIDE, runT);
    this.phase = (this.phase + ((speed * dt) / stride) * tau) % tau;
    const amp = THREE.MathUtils.clamp(speed / WALK, 0, 1);

    /* Facing. The head leads into the turn; the body catches up. */
    let headWant = 0;
    if (moving) {
      const want = Math.atan2(move.x, move.y);
      const diff = wrap(want - this.yaw);
      const step = diff * damp(THREE.MathUtils.lerp(7.5, 5.5, runT), dt);
      this.yaw = wrap(this.yaw + step);
      this.turnRate += (step / Math.max(dt, 1e-4) - this.turnRate) * damp(10, dt);
      headWant = THREE.MathUtils.clamp(wrap(want - this.yaw) * 0.85, -0.95, 0.95);
      this.lookTimer = 2 + Math.random() * 3;
      this.lookTarget = 0;
    } else {
      this.turnRate += (0 - this.turnRate) * damp(8, dt);
      // Idle: glance around now and then, then settle forward again.
      this.lookTimer -= dt;
      if (this.lookTimer < 0) {
        this.lookTarget = this.lookTarget === 0 ? (Math.random() - 0.5) * 1.5 : 0;
        this.lookTimer = this.lookTarget === 0 ? 3 + Math.random() * 4 : 1.4 + Math.random() * 1.6;
      }
      headWant = this.lookTarget;
    }
    this.headYaw += (headWant - this.headYaw) * damp(moving ? 12 : 4, dt);

    this.root.position.copy(this.pos);
    this.root.rotation.y = this.yaw;

    this.pose(amp, runT, dt);
  }

  private pose(amp: number, run: number, dt: number) {
    const p = this.phase;
    const idle = 1 - amp;
    const t = this.t;
    const s = Math.sin(p);
    const L = THREE.MathUtils.lerp;

    /* Pelvis: bob twice a cycle (highest over the planted foot when
       walking; a run has a flight phase, so the bob grows and the body
       sits lower); a little hip swing and roll; at rest, a weight shift. */
    this.pelvis.position.y = 0.95 + L(0.024, 0.05, run) * amp * Math.cos(2 * p) - L(0.012, 0.06, run) * amp;
    this.pelvis.position.x = 0.012 * idle * Math.sin(t * 0.55);
    this.pelvis.rotation.y = L(0.09, 0.14, run) * amp * s;
    this.pelvis.rotation.z = 0.035 * amp * s + 0.015 * idle * Math.sin(t * 0.55);

    /* Legs. Walking, the thigh swings ±30° and the knee folds through the
       swing phase; running, the thigh drives to ±50°, the knee tucks high
       under the hip, and the foot pushes off hard behind. */
    this.legs.forEach((leg, i) => {
      const ph = p + (i === 0 ? 0 : Math.PI);
      const swing = Math.sin(ph);
      const forward = Math.cos(ph);
      const thigh = -L(0.52, 0.88, run) * amp * swing - 0.12 * run;
      const kneeWalk = 0.08 + 0.95 * Math.pow(Math.max(0, forward), 1.6);
      const kneeRun = 0.3 + 1.75 * Math.pow(Math.max(0, forward), 1.1) + 0.3 * Math.max(0, -swing);
      const knee = amp * L(kneeWalk, kneeRun, run);
      leg.hip.rotation.x = thigh;
      leg.knee.rotation.x = knee;
      const pushOff = amp * L(0.35, 0.7, run) * Math.max(0, -forward) * Math.max(0, -swing);
      leg.ankle.rotation.x = -(thigh + knee) * 0.85 + pushOff;
    });

    /* Spine: counter-twist against the hips, lean into the pace and into
       turns, breathe at rest. */
    this.spine.rotation.y = -L(0.13, 0.2, run) * amp * s;
    this.spine.rotation.x = L(0.07, 0.26, run) * amp + 0.01 * Math.sin(t * 1.7) * idle;
    this.spine.rotation.z = THREE.MathUtils.clamp(-this.turnRate * L(0.05, 0.08, run), -0.2, 0.2);
    this.spine.scale.y = 1 + 0.01 * Math.sin(t * 1.7) * idle;

    /* Arms swing against the legs. Walking, elbows soft and bending more
       on the forward swing; running, elbows locked near 90° and the swing
       driven from the shoulder. */
    this.arms.forEach((arm, i) => {
      const side = i === 0 ? 1 : -1;
      const swing = Math.sin(p + (i === 0 ? 0 : Math.PI));
      arm.shoulder.rotation.x = L(0.42, 0.85, run) * amp * swing + 0.02 * idle * Math.sin(t * 1.7) - 0.1 * run;
      arm.shoulder.rotation.z = side * (0.07 + L(0.03, 0.1, run) * amp);
      const elbowWalk = 0.18 + 0.12 * idle + amp * (0.15 + 0.35 * Math.max(0, -swing));
      const elbowRun = 1.35 + 0.25 * Math.max(0, -swing);
      arm.elbow.rotation.x = -L(elbowWalk, elbowRun, run);
      arm.wrist.rotation.x = -0.1 * amp;
    });

    /* Head: steadied against the bob, held up against the lean, leading
       turns, glancing around at rest — and, with the headphones on, a
       small nod to whatever's playing (about 96 bpm). */
    const nod = this.headphones * (amp > 0.3 ? 0.02 * (1 - run) * Math.sin(p * 2) : 0.035 * Math.max(0, Math.sin(t * Math.PI * 3.2)) * idle);
    this.headPitch += (-L(0.04, 0.2, run) * amp + nod - this.headPitch) * damp(14, dt);
    this.neck.rotation.y = this.headYaw * 0.35 - this.spine.rotation.y * 0.6;
    this.head.rotation.y = this.headYaw * 0.65;
    this.head.rotation.x = this.headPitch;
    this.head.rotation.z = -this.spine.rotation.z * 0.5;

    /* Headphones: on the head ↔ around the neck. */
    this.headphones += (this.headphonesTarget - this.headphones) * damp(6, dt);
    const h = THREE.MathUtils.smootherstep(this.headphones, 0, 1);
    this.phonesGroup.position.set(0, L(-0.2, 0, h), L(0.012, 0, h));
    this.phonesGroup.rotation.x = L(1.95, 0, h);
    this.phonesGroup.scale.setScalar(L(1.12, 1, h));
  }
}
