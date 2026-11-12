import * as THREE from "three";
import { cellMaterial, cellWidth, GLYPHS, glyphAtlas, glyphShapes, screenMaterial } from "./ascii";
import { createShared, type Shared } from "./materials";
import { clockLabel, createMood, updateMood, type Mood } from "./mood";
import { Shashank } from "./shashank";
import { SPAWN, World } from "./world";

/* ─────────────────────────────────────────────────────────────────────────
   SolaceEngine — owns the WebGL renderer and the frame:

     scene (lit, shadowed, at 2 × 3 samples per cell, chaos in alpha)
       + mask (Shashank alone, no depth test — for the see-through ghost)
       → cell pass (glyph + colour per cell, chaos vs. calm)
       → screen pass (glyph atlas over an ambient wash)

   Input is screen-relative: W is always up the screen, whatever the
   isometric ground is doing underneath.
   ───────────────────────────────────────────────────────────────────────── */

export type SolaceStatus = {
  clock: string;
  mood: string;
  held: boolean;
  zone: string;
  headphones: boolean;
  /** 0 = up, clockwise to 7 = up-left; −1 = standing still. */
  dir: number;
  running: boolean;
};

const CELL_CSS = 11; // cell height in CSS px
/* Scale is set in cell rows per metre, not metres per screen, so he is the
   same size in type on a phone and on a big monitor; a bigger screen just
   shows more city. */
const ROWS_PER_M = 7.5;
const ELEV = THREE.MathUtils.degToRad(30);
const CAM_DIST = 120;
const NEAR = 1;
const FAR = 420;
const POOL = 16;
const LIGHT_GAIN = 4;
const BUBBLE_M = 5.2; // bubble radius in metres
const SQ = Math.SQRT1_2;
const SCREEN_UP = new THREE.Vector2(-SQ, -SQ); // world (x, z)
const SCREEN_RIGHT = new THREE.Vector2(SQ, -SQ);

export class SolaceEngine {
  onStatus?: (s: SolaceStatus) => void;

  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, NEAR, FAR);
  private shared: Shared;
  private world: World;
  readonly me: Shashank;
  private mood: Mood = createMood();

  private hemi = new THREE.HemisphereLight();
  private sun = new THREE.DirectionalLight();
  private pool: THREE.PointLight[] = [];
  private halo = new THREE.PointLight("#ffb878", 0, 7, 2);
  private poolTimer = 0;

  private sceneRT: THREE.WebGLRenderTarget;
  private maskRT: THREE.WebGLRenderTarget;
  private cellRT: THREE.WebGLRenderTarget;
  private maskMat = new THREE.MeshBasicMaterial({ color: "#ffffff", depthTest: false });
  private cellMat: THREE.ShaderMaterial;
  private screenMat: THREE.ShaderMaterial | null = null;
  private atlas: THREE.Texture | null = null;
  private quad: THREE.Mesh;
  private quadScene = new THREE.Scene();
  private quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  private W = 1;
  private H = 1;
  private cw = 7;
  private ch = 11;
  private cols = 1;
  private rows = 1;
  private viewH = 10;
  private zoom = 1;

  private keys = new Set<string>();
  private padDir = -1;
  private padRun = false;
  private move = new THREE.Vector2();
  private target = new THREE.Vector3();
  private time = 0;
  private hoursOverride: number | null = null;
  private reduced = false;
  private bubble = 1;
  private statusKey = "";
  private dir = -1;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(1);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.shadowMap.autoUpdate = false;

    this.shared = createShared(World.chaosTexture());
    this.world = new World(this.shared);
    this.scene.add(this.world.group);
    this.me = new Shashank(this.shared);
    this.me.place(SPAWN.x, SPAWN.z, SPAWN.yaw, this.world);
    this.scene.add(this.me.root);
    this.target.set(this.me.pos.x, this.me.pos.y + 0.9, this.me.pos.z);

    this.scene.add(this.hemi);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    const sc = this.sun.shadow.camera;
    sc.left = sc.bottom = -26;
    sc.right = sc.top = 26;
    sc.near = 1;
    sc.far = 160;
    this.sun.shadow.bias = -0.0006;
    this.sun.shadow.normalBias = 0.04;
    this.scene.add(this.sun, this.sun.target);
    for (let i = 0; i < POOL; i++) {
      const l = new THREE.PointLight("#ffffff", 0, 18, 2);
      this.pool.push(l);
      this.scene.add(l);
    }
    this.scene.add(this.halo);

    const rtOpts = { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, generateMipmaps: false };
    this.sceneRT = new THREE.WebGLRenderTarget(1, 1, { ...rtOpts, type: THREE.HalfFloatType, depthTexture: new THREE.DepthTexture(1, 1) });
    this.maskRT = new THREE.WebGLRenderTarget(1, 1, rtOpts);
    this.cellRT = new THREE.WebGLRenderTarget(1, 1, rtOpts);

    this.cellMat = cellMaterial(glyphShapes());
    this.cellMat.uniforms.tScene.value = this.sceneRT.texture;
    this.cellMat.uniforms.tDepth.value = this.sceneRT.depthTexture;
    this.cellMat.uniforms.tMask.value = this.maskRT.texture;
    this.cellMat.uniforms.uDepthScale.value = FAR - NEAR;

    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.cellMat);
    this.quad.frustumCulled = false;
    this.quadScene.add(this.quad);
  }

  /* ── input ───────────────────────────────────────────────────────────── */

  key(code: string, down: boolean) {
    if (down) this.keys.add(code);
    else this.keys.delete(code);
  }
  clearKeys() {
    this.keys.clear();
    this.padDir = -1;
    this.padRun = false;
  }
  setPad(dir: number, run = false) {
    this.padDir = dir;
    this.padRun = run;
  }
  toggleHeadphones() {
    this.me.headphonesTarget = this.me.headphonesTarget > 0.5 ? 0 : 1;
  }
  zoomBy(f: number) {
    this.zoom = THREE.MathUtils.clamp(this.zoom * f, 0.6, 1.6);
    this.frame();
  }
  setReduced(r: boolean) {
    this.reduced = r;
    this.cellMat.uniforms.uMotion.value = r ? 0 : 1;
  }
  setHours(h: number | null) {
    this.hoursOverride = h;
  }

  private readInput() {
    let sx = 0;
    let sy = 0;
    const k = this.keys;
    if (k.has("KeyW") || k.has("ArrowUp")) sy += 1;
    if (k.has("KeyS") || k.has("ArrowDown")) sy -= 1;
    if (k.has("KeyD") || k.has("ArrowRight")) sx += 1;
    if (k.has("KeyA") || k.has("ArrowLeft")) sx -= 1;
    if (this.padDir >= 0 && sx === 0 && sy === 0) {
      const a = (this.padDir * Math.PI) / 4;
      sx = Math.round(Math.sin(a));
      sy = Math.round(Math.cos(a));
    }
    if (sx === 0 && sy === 0) {
      this.dir = -1;
      this.move.set(0, 0);
      return;
    }
    this.dir = (Math.round(Math.atan2(sx, sy) / (Math.PI / 4)) + 8) % 8;
    this.move
      .set(0, 0)
      .addScaledVector(SCREEN_UP, sy)
      .addScaledVector(SCREEN_RIGHT, sx)
      .normalize();
  }

  /* ── sizing ──────────────────────────────────────────────────────────── */

  resize(cssW: number, cssH: number, dpr: number) {
    this.W = Math.max(1, Math.round(cssW * dpr));
    this.H = Math.max(1, Math.round(cssH * dpr));
    this.renderer.setSize(this.W, this.H, false);

    const ch = Math.max(6, Math.round(CELL_CSS * dpr));
    if (ch !== this.ch || !this.atlas) {
      this.ch = ch;
      this.cw = cellWidth(ch);
      this.atlas?.dispose();
      this.screenMat?.dispose();
      const { tex, rows } = glyphAtlas(this.cw, this.ch);
      this.atlas = tex;
      this.screenMat = screenMaterial(tex, rows);
      this.screenMat.uniforms.tCell.value = this.cellRT.texture;
    }
    this.cols = Math.ceil(this.W / this.cw);
    this.rows = Math.ceil(this.H / this.ch);
    this.sceneRT.setSize(this.cols * 2, this.rows * 3);
    this.maskRT.setSize(this.cols * 2, this.rows * 3);
    this.cellRT.setSize(this.cols, this.rows);

    const cu = this.cellMat.uniforms;
    cu.uCells.value.set(this.cols, this.rows);
    cu.uScene.value.set(this.cols * 2, this.rows * 3);
    cu.uCellAspect.value = this.cw / this.ch;
    const su = this.screenMat!.uniforms;
    su.uCellPx.value.set(this.cw, this.ch);
    su.uCells.value.set(this.cols, this.rows);
    su.uView.value.set(this.W, this.H);
    this.frame();
  }

  /** The camera frustum covers the whole cell grid, which overhangs the
      canvas on the right and top by less than a cell. */
  private frame() {
    this.viewH = (this.H / this.ch / ROWS_PER_M) * this.zoom;
    const upp = this.viewH / this.H;
    const c = this.camera;
    c.left = (-this.W / 2) * upp;
    c.right = (-this.W / 2 + this.cols * this.cw) * upp;
    c.bottom = (-this.H / 2) * upp;
    c.top = (-this.H / 2 + this.rows * this.ch) * upp;
    c.updateProjectionMatrix();
  }

  /* ── frame ───────────────────────────────────────────────────────────── */

  private v = new THREE.Vector3();
  private sunDir = new THREE.Vector3();

  step(dt: number) {
    this.time += dt;
    const now = new Date();
    const hours = this.hoursOverride ?? now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
    updateMood(this.mood, hours);
    const m = this.mood;

    this.readInput();
    this.world.update(dt, this.time, m, this.me.pos);
    const run = this.keys.has("ShiftLeft") || this.keys.has("ShiftRight") || this.padRun;
    this.me.update(dt, dt > 0 ? this.move : this.move.set(0, 0), run, this.world);

    // Camera eases after him; under reduced motion it simply sits on him.
    const k = this.reduced ? 1 : 1 - Math.exp(-dt * 4.5);
    this.target.lerp(this.v.set(this.me.pos.x, this.me.pos.y + 0.9, this.me.pos.z), dt > 0 ? k : 1);
    this.camera.position.set(
      this.target.x + Math.cos(ELEV) * Math.sin(Math.PI / 4) * CAM_DIST,
      this.target.y + Math.sin(ELEV) * CAM_DIST,
      this.target.z + Math.cos(ELEV) * Math.cos(Math.PI / 4) * CAM_DIST
    );
    this.camera.lookAt(this.target);
    this.camera.updateMatrixWorld();
    this.shared.uCutPos.value.set(this.me.pos.x, this.me.pos.y + 0.9, this.me.pos.z);
    this.shared.uCamDir.value.copy(this.camera.position).sub(this.target).normalize();

    // Sky and sun / moon.
    this.hemi.color.copy(m.sky);
    this.hemi.groundColor.copy(m.ground);
    this.hemi.intensity = m.hemi;
    this.sun.color.copy(m.sunColor);
    this.sun.intensity = m.sunIntensity;
    /* Low sun keeps its colour, but shadows are cast from at least 24°
       up — a 66 m tower at 10° would black out half the city. */
    const sd = this.sunDir.copy(m.sunDir);
    sd.y = Math.max(sd.y, Math.sin(THREE.MathUtils.degToRad(24)));
    sd.normalize();
    this.sun.position.copy(this.target).addScaledVector(sd, 80);
    this.sun.target.position.copy(this.target);
    this.sun.target.updateMatrixWorld();

    // The nearest lamps, shops and neon get the real point lights.
    this.poolTimer -= dt;
    if (this.poolTimer <= 0) {
      this.poolTimer = 0.15;
      this.assignLights();
    }

    // Headphones: the bubble follows them, and so does the warm halo.
    this.bubble += (this.me.headphones - this.bubble) * (dt > 0 ? 1 - Math.exp(-dt * 5) : 1);
    this.halo.position.set(this.me.pos.x, this.me.pos.y + 1.7, this.me.pos.z + 0.3);
    this.halo.intensity = 2.6 * this.bubble * (0.4 + 0.6 * THREE.MathUtils.smoothstep(m.e, 0.1, 0.5));
    this.shared.uRim.value = 0.18 + 0.32 * this.bubble;

    this.emitStatus();
  }

  private assignLights() {
    const tx = this.target.x;
    const tz = this.target.z;
    const ranked = this.world.lights
      .map((l) => ({ l, d: (l.pos.x - tx) ** 2 + (l.pos.z - tz) ** 2, level: this.world.lightLevel(l, this.mood) }))
      .filter((r) => r.level > 0.01 && r.d < 40 * 40)
      /* Rank by how much light actually reaches the middle of the view,
         so a street lamp beats a dim shop sign at the same distance. */
      .sort((a, b) => (b.l.intensity * b.level) / (b.d + 16) - (a.l.intensity * a.level) / (a.d + 16));
    this.pool.forEach((p, i) => {
      const r = ranked[i];
      if (!r) {
        p.intensity = 0;
        return;
      }
      p.position.copy(r.l.pos);
      p.color.copy(r.l.color);
      p.intensity = r.l.intensity * r.level * LIGHT_GAIN;
    });
  }

  private emitStatus() {
    if (!this.onStatus) return;
    const s: SolaceStatus = {
      clock: clockLabel(this.mood.hours),
      mood: this.mood.label,
      held: this.mood.held,
      zone: this.world.zoneAt(this.me.pos.x, this.me.pos.z),
      headphones: this.me.headphonesTarget > 0.5,
      dir: this.dir,
      running: this.me.runT > 0.5,
    };
    const key = `${s.clock}|${s.mood}|${s.zone}|${s.headphones}|${s.dir}|${s.running}`;
    if (key !== this.statusKey) {
      this.statusKey = key;
      this.onStatus(s);
    }
  }

  render() {
    const r = this.renderer;
    const m = this.mood;

    // 1 · the lit scene
    this.renderer.shadowMap.needsUpdate = true;
    r.setRenderTarget(this.sceneRT);
    r.setClearColor(m.haze, 0);
    r.clear();
    r.render(this.scene, this.camera);

    // 2 · Shashank alone, through walls
    this.camera.layers.set(1);
    this.scene.overrideMaterial = this.maskMat;
    r.setRenderTarget(this.maskRT);
    r.setClearColor(0x000000, 0);
    r.clear();
    r.render(this.scene, this.camera);
    this.scene.overrideMaterial = null;
    this.camera.layers.set(0);

    // 3 · cells
    const cu = this.cellMat.uniforms;
    const head = this.v.set(this.me.pos.x, this.me.pos.y + 1.0, this.me.pos.z).project(this.camera);
    cu.uChar.value.set((head.x * 0.5 + 0.5) * this.cols, (head.y * 0.5 + 0.5) * this.rows);
    cu.uCharDepth.value = head.z * 0.5 + 0.5;
    const rowsPerMetre = this.H / this.ch / this.viewH;
    cu.uBubbleR.value = BUBBLE_M * rowsPerMetre * (0.35 + 0.65 * this.bubble) * (1 + 0.025 * Math.sin(this.time * 1.3));
    cu.uBubble.value = this.bubble;
    cu.uChaosGain.value = 1 + 0.45 * (1 - this.bubble);
    cu.uTime.value = this.time;
    cu.uExposure.value = m.exposure;
    cu.uHaze.value.copy(m.haze).convertLinearToSRGB();
    cu.uHazeAmt.value = m.hazeAmount;
    this.quad.material = this.cellMat;
    r.setRenderTarget(this.cellRT);
    r.render(this.quadScene, this.quadCam);

    // 4 · screen
    this.quad.material = this.screenMat!;
    r.setRenderTarget(null);
    r.render(this.quadScene, this.quadCam);
  }

  /** The last frame as plain text — far clearer than a screenshot for
      judging composition and the rig. */
  toText() {
    const buf = new Uint8Array(this.cols * this.rows * 4);
    this.renderer.readRenderTargetPixels(this.cellRT, 0, 0, this.cols, this.rows, buf);
    const lines: string[] = [];
    for (let r = this.rows - 1; r >= 0; r--) {
      let line = "";
      for (let c = 0; c < this.cols; c++) line += GLYPHS[buf[(r * this.cols + c) * 4 + 3]] ?? "?";
      lines.push(line);
    }
    return lines.join("\n");
  }

  dispose() {
    this.scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose();
    });
    this.shared.uChaosMap.value.dispose();
    this.sceneRT.depthTexture?.dispose();
    [this.sceneRT, this.maskRT, this.cellRT].forEach((t) => t.dispose());
    this.cellMat.dispose();
    this.screenMat?.dispose();
    this.atlas?.dispose();
    /* No forceContextLoss: React may mount again on this same canvas, and
       a lost context can't be reused. */
    this.renderer.dispose();
  }
}
