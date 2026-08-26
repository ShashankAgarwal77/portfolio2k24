# Handoff — Ethereal "Starry Night" Redesign

Context doc for continuing work in a fresh session. Read this before touching
the hero, atmosphere, dock, or work-showcase systems. Last updated: 2026-08-26.

## The vision

The landing page is one continuous journey inspired by Van Gogh's Starry
Night — **abstract interpretation, never literal**: steal the physics (swirling
currents, halo stars, drifting mist), not the painting.

> night meadow hero (cosmos) → mist layer (work) → mountains (contact:
> the landing) — with a fog sweep when a case study opens

Dual mood follows the theme class on `<html>` (manual toggle, no next-themes):
**dark = indigo night**, **light = pale dawn morning** — same physics, different
palette. All of it is atmosphere BEHIND content; the work showcase's layout,
slider, and legibility were deliberately left untouched (recruiters skim —
"scannable first" is a core design principle in `PRODUCT.md`/`DESIGN.md`).

## Component map

| Piece | File | What it is |
|---|---|---|
| Night sky hero | `src/app/components/uiFrontend/night-sky.tsx` | `NightSkyHero` — canvas flow-field (vortex eddies), star canvas, mist, meadow foreground, scroll-linked "dawn" exit |
| Work-section mist | `atmosphere.tsx` + `mist-background.tsx` | `WorkAtmosphere` = `MistBackground` (WebGL FBM domain-warped mist shader as the section background, top mask-feathered into the hero, theme-reactive palette uniforms, warm-gold cursor glow) + 11 dark-mode stars |
| Hero page assembly | `src/app/components/uiFrontend/hero.tsx` | NightSkyHero → #work (WorkAtmosphere + heading + WorkShowcase) → dribbble → ContactSection |
| Contact / landing | `src/app/components/uiFrontend/contact-section.tsx` | Two painted ridges (mountain_far/near.png): scroll-settle parallax + differential cursor parallax (near faster/further than far, clamped), 7 glowing dark-mode stars, hero's CTA pill verbatim + mailto shashank.ux@outlook.com. No CSS mist here — the paintings carry their own (a CSS mist band read as a blue field and was removed). |
| Footer | `uiFrontend/footer.tsx` | Deliberately surface-less: transparent, no band, beams animation removed (GPU cost + broke the single-background illusion). Dark page bg gradient ends on #020617, same as it starts — never reintroduce a fade to pure black. |
| Work showcase | `src/app/components/uiFrontend/work-showcase.tsx` | WebGL glass-wipe slider (pre-existing) + this redesign's halo/breath/wisps/surfacing/rail-twinkle |
| Case-study transition | `src/app/components/PageTransition/index.tsx` | Card-expand overlay + cloud fog sweep |
| Dock | `Animations/floating-dock.tsx` + `uiFrontend/floating-dock.tsx` | "Moonlit glass" treatment, Phosphor icons |
| All atmosphere CSS | `src/app/globals.css` | Named blocks: `.night-sky`, `.cloud-band`/`.cloud-puff`, `.cloud-art`, `.work-atmosphere`, showcase block, `.dock-glass` |

Assets: `public/homepage_assets/` — `hero_section_foreground.png` (3840×960
meadow), `mountain_far.png` (3840×800), `mountain_near.png` (3840×700).
The mountains bake their indigo color in (dark dawn silhouettes read
correctly in light mode) — only theme-neutral assets get CSS tinting. The painterly cloud PNGs were **removed** (deployed
performance + user preference for pure ethereal fog); all fog is now
CSS gradients.

## PERFORMANCE (learned the hard way — deployed site lagged)

The lag was the blur stack: many huge `filter: blur(52–72px)` surfaces,
all continuously animating, forced per-frame GPU re-filtering. Rules now:

- **No `filter: blur()` on any large or animated element.** Fog softness
  comes from radial/linear gradients, which are pre-soft and free. The
  only remaining blurs: the dock's small `backdrop-filter` and the
  one-shot loader wordmark.
- Atmosphere animates **transform/opacity only**.
- Canvas caps: flow dpr ≤ 1.25, stars dpr ≤ 1.5, particles 200/90
  (desktop/mobile) — see `night-sky.tsx`.
- The fixed fog veil sits fully off-viewport (translate) outside its
  scroll window, so it costs nothing at rest.

## Load-bearing implementation rules (violating these breaks things)

1. **Two canvases in the hero.** Flow trails are never cleared (they decay via
   `destination-out` fade); stars twinkle on a canvas cleared every frame. One
   canvas would smear stars into trails.
2. **Trail fade needs the periodic strong pass.** 8-bit alpha rounding leaves
   every painted pixel stuck at ~4% ghost alpha under a small per-frame fade —
   an extra `destination-out` at 0.16 every 48 frames grinds the floor down.
   Without it the sky silts up over long sessions.
3. **The cursor eddy dies when the cursor stops** (600ms). A parked cursor
   with a live vortex paints a permanent dense ring.
4. **No transform/filter on any ancestor of the work section's sticky
   content.** All scroll choreography stays inside its own section. Same
   reason the site-wide reveal clears `filter` after animating (`useReveal.ts`).
5. **Framer scrub and CSS keyframes never share an element** — both write
   `transform` and cancel each other. Pattern used everywhere: outer div owns
   the framer style, inner div owns the CSS animation (see showcase breath
   wrapper, cloud-art slots vs. img flip).
6. **Never crop the meadow vertically.** The figure's head is near the top of
   the painted area; `object-fit: cover` decapitates him. Aspect-true scaling
   only. Bottom edge has a mask fade (91%→100%) so it never guillotines.
7. **PageTransition's clone must stay frame-identical to the card** — scrim
   gradients are duplicated in `work-showcase.tsx` and `PageTransition/index.tsx`;
   change one, change both.
8. **Star ignition and text reveals gate on the veil** (`onVeilLift` from
   `lib/useReveal.ts`) so entrances play as the first-visit loader lifts, not
   under it. Everything has a timeout failsafe — content must never be missing
   because an animation didn't run.
9. **Reduced motion is fully handled**: static pre-warmed sky painting, fog at
   fixed opacity, no scrub transforms, plain navigation instead of the expand
   transition. The global `prefers-reduced-motion` rule kills CSS keyframes.
10. **`data-reveal="off"`** on any direct child of the `Reveal` wrapper that
    choreographs its own appearance (hero, CloudBand).

## Asset pipeline (for any future painterly assets)

- **Keep exports near-neutral** if they must serve both themes — theme
  tinting is done in CSS, baked color locks an asset to one mood.
- **Trim to painted bounds.** The first meadow export wasted 25% of its width
  on transparent margins and needed CSS overscan gymnastics (now just 103%
  for the meadow — parallax slack only).
- **Check every export**: alpha-scan for (a) painted bounds, (b) neutral
  fringe RGB (red halos = background-removal residue; check against a LIGHT
  background), (c) zero pinholes. Scan method: draw to canvas at ¼ scale,
  walk columns/rows for alpha bounds, average RGB of semi-transparent pixels.
- Mind the PERFORMANCE section before adding image layers to the
  atmosphere: every composited decorative layer has a cost.

## Tuning knobs (user feedback tends to hit these)

- **Mist mood**: the `NIGHT`/`DAWN` palettes in `mist-background.tsx`
  (base MUST stay equal to the page background — #020617 / #f8fafc — or
  the masked edges show seams). `mist`/`accent` set the fold colors,
  `gain` the overall brightness.
- **Mist speed**: the `0.05/0.11/0.09 * u_time` factors in the shader.
- **Mist cost**: `RES_SCALE` (0.45) and the fbm octave count (5).
- **Mist edges**: the mask-image stops on `.work-atmosphere__mist`.
- **Card presence**: `.showcase-halo` shadows, `.cloud-art--front` opacity.
- **Meadow scale floor on phones**: `max(103%, 900px)` — 900px is calibrated
  to the figure at ~63% across; bigger pushes him off a 375px screen.

## Known caveats & environment quirks

- **The in-app browser pane cannot screenshot scrolled states** (stale/blank
  frames) and throttles rAF when scrolled — verify scroll choreography via
  computed styles + hit-testing, or eyeball on a real browser. At-rest
  screenshots are reliable.
- The expand transition once appeared "stuck" in that pane — it was frozen
  rAF + dev-mode first-compile latency; the 6s failsafe carried it. Fine on
  real browsers.
- Cloud/meadow exports still carry faint red/blue edge fringing — invisible
  on the night sky, *check light mode* if it ever shimmers at silhouettes.
- The impeccable design hook flags the sky/glass palettes as outside
  DESIGN.md — **intentional, user-approved**; DESIGN.md hasn't been updated
  with the "night sky system" yet (open task).

## Decision log (user-approved; don't relitigate silently)

- Abstract Van Gogh, dual mood, aurora fully replaced, hero+dawn scope.
- Meadow full-bleed, phone floor keeps figure readable.
- Dock: moonlit glass (the ONE sanctioned glassmorphism) + warm gold hover
  halos; Phosphor icons `weight="light"` (dock only so far).
- Showcase: "Option A" — set the card INTO the scene (indigo scrim, moonlight
  rim = 2nd Flat-Card-Rule exception after cta-lift, 4px/7s breath, front
  wisps, scroll surfacing, rail star-twinkle) + cloud sweep in the expand
  transition. **Rejected**: floating-islands redesign, scroll-pinned journey
  (both hurt recruiter skimming).
- Fog/cloud history (do not re-try): painterly cloud PNGs → REMOVED
  (deployed lag). Viewport-filling top-down fog wipe → rejected ("too
  linear"). Rising gradient plumes → replaced at user's request by the
  current WebGL FBM mist shader (user-supplied reference, recolored to
  our palettes) as the work section's background.

## Open threads

1. **Icon unification** — rest of site (about page, corner brackets, etc.)
   still on hugeicons/Tabler; user wants Phosphor everywhere "later".
2. **DESIGN.md update** — document the night-sky/glass palettes to clear the
   design-hook drift warnings.
3. **Eyeball passes pending on a real browser**: seam cloud-crossing with the
   painterly assets, expand-transition fog sweep timing, light-mode fog.
4. **Ultrawide meadow** — corners dissolve to page bg on very wide screens
   (vignette look, accepted); a wider export would fill them if ever wanted.
5. Case-study pages themselves haven't received the ethereal treatment.
