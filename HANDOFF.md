# Handoff — Ethereal "Starry Night" Redesign

Context doc for continuing work in a fresh session. Read this before touching
the hero, atmosphere, dock, or work-showcase systems. Last updated: 2026-08-26.

## The vision

The landing page is one continuous journey inspired by Van Gogh's Starry
Night — **abstract interpretation, never literal**: steal the physics (swirling
currents, halo stars, drifting mist), not the painting.

> night meadow hero → up through a parting cloud band → the work floating
> above the clouds → through the clouds one last time into a case study

Dual mood follows the theme class on `<html>` (manual toggle, no next-themes):
**dark = indigo night**, **light = pale dawn morning** — same physics, different
palette. All of it is atmosphere BEHIND content; the work showcase's layout,
slider, and legibility were deliberately left untouched (recruiters skim —
"scannable first" is a core design principle in `PRODUCT.md`/`DESIGN.md`).

## Component map

| Piece | File | What it is |
|---|---|---|
| Night sky hero | `src/app/components/uiFrontend/night-sky.tsx` | `NightSkyHero` — canvas flow-field (vortex eddies), star canvas, mist, meadow foreground, scroll-linked "dawn" exit |
| Cloud band + work air | `src/app/components/uiFrontend/atmosphere.tsx` | `CloudBand` (fog belt at hero/work seam, parts on scroll) + `WorkAtmosphere` (wisps + 11 stars behind showcase) |
| Hero page assembly | `src/app/components/uiFrontend/hero.tsx` | NightSkyHero → CloudBand → #work (WorkAtmosphere + heading + WorkShowcase) |
| Work showcase | `src/app/components/uiFrontend/work-showcase.tsx` | WebGL glass-wipe slider (pre-existing) + this redesign's halo/breath/wisps/surfacing/rail-twinkle |
| Case-study transition | `src/app/components/PageTransition/index.tsx` | Card-expand overlay + cloud fog sweep |
| Dock | `Animations/floating-dock.tsx` + `uiFrontend/floating-dock.tsx` | "Moonlit glass" treatment, Phosphor icons |
| All atmosphere CSS | `src/app/globals.css` | Named blocks: `.night-sky`, `.cloud-band`/`.cloud-puff`, `.cloud-art`, `.work-atmosphere`, showcase block, `.dock-glass` |

Assets: `public/homepage_assets/` — `hero_section_foreground.png` (3840×960
meadow), `cloud_bank.png` (3000×800 dense), `cloud_wisp_a/b.png` (2000×900
wispy). All user-generated, painterly, transparent PNG.

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

## Asset pipeline (for new painterly assets)

- **Clouds must be near-neutral grey-white.** Theme tinting is 100% CSS
  (`.cloud-art`: brightness 1.05 dawn / 0.4 night + 2px blur; the sky behind
  lends the blue). Baked color would lock assets to one mood.
- **Trim to painted bounds.** The first meadow export wasted 25% of its width
  on transparent margins and needed CSS overscan gymnastics (now just 103%
  for the meadow — parallax slack only).
- **Check every export**: alpha-scan for (a) painted bounds, (b) neutral
  fringe RGB (red halos = background-removal residue; check against a LIGHT
  background), (c) zero pinholes. Scan method: draw to canvas at ¼ scale,
  walk columns/rows for alpha bounds, average RGB of semi-transparent pixels.
- Full generation prompts for meadow and clouds are reproducible from the
  rules above: painterly impressionist, PNG alpha, content-to-edges,
  decontaminated edges, ≥3000px wide.

## Tuning knobs (user feedback tends to hit these)

- **Fog density**: `.dark .cloud-puff--*` alphas (procedural haze bed,
  currently 0.12–0.3 under the art) and `.cloud-art` night brightness (0.4).
  History: fog was invisible at 0.14 peaks — dark mode needs ~0.3+ effective.
- **Fog drift speed**: `cloud-drift-a/b` keyframes (34–62s, 9–10vw travel).
- **Cloud sizes**: `.cloud-art-slot--band-*` widths.
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
- Hybrid clouds: procedural haze bed under painterly PNGs.

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
