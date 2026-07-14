---
name: Shashank Agarwal — Digital Room
description: A confident, minimal designer portfolio that lets case-study work carry the pitch
colors:
  ink-light: "#0f172a"
  ink-dark: "#f1f5f9"
  neutral-bg-light: "#f8fafc"
  neutral-bg-dark: "#020617"
  neutral-surface-light: "#f1f5f9"
  neutral-surface-dark: "#1e293b"
  muted-600: "#475569"
  muted-500: "#64748b"
  muted-400: "#94a3b8"
  glow-sky: "#38bdf8"
  glow-emerald: "#34d399"
  accent-bcas-blue: "#005197"
  accent-bcas-pale: "#e0edfa"
  accent-securehub-teal: "#134e4a"
  accent-securehub-pale: "#ccfbf1"
  accent-oro-gold: "#fbbf24"
  accent-oro-pale: "#fde68a"
  accent-haulkar-blue: "#3b82f6"
  accent-haulkar-pale: "#93c5fd"
typography:
  display:
    fontFamily: "Gloock, Georgia, serif"
    fontSize: "inherit"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "normal"
  headline:
    fontFamily: "Satoshi, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
  title:
    fontFamily: "Satoshi, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.01em"
  body:
    fontFamily: "Satoshi, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.01em"
  label:
    fontFamily: "Satoshi, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.2em"
rounded:
  sm: "6px"
  pill: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.neutral-surface-light}"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.pill}"
    padding: "16px 24px"
  button-primary-hover:
    backgroundColor: "{colors.neutral-surface-light}"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.pill}"
    padding: "16px 24px"
  button-secondary:
    backgroundColor: "{colors.neutral-surface-light}"
    textColor: "{colors.muted-600}"
    rounded: "{rounded.sm}"
    padding: "16px 24px"
  card-project:
    backgroundColor: "transparent"
    textColor: "{colors.ink-light}"
    rounded: "0px"
    padding: "24px"
---

# Design System: Shashank Agarwal — Digital Room

## 1. Overview

**Creative North Star: "The Quiet Portfolio"**

This is a designer's site built on the belief that confidence doesn't need to shout. The palette is almost entirely neutral (Tailwind's slate scale, used deliberately rather than by default), the type system is a single variable sans (Satoshi) for structure and a single italic serif (Gloock) reserved for one emphasis word per moment. Color only appears as domain accents — one hue per case study, revealed on hover, never resting on the page. The system explicitly rejects loud gradients-as-decoration, dense card grids, and generic SaaS-portfolio scaffolding; a recruiter skimming fast should read craft in the restraint itself, not in visual noise competing with the work.

**Key Characteristics:**
- Neutral-first: slate ink/bg carries 90%+ of every screen.
- One accent hue per project, not a global brand color — the work's domain picks the color, not the template.
- Gloock italic is a single-word flourish, never a paragraph face.
- Flat surfaces with hairline borders; corner-bracket icons stand in for shadow-driven card chrome.
- Motion (aurora hero, shimmer CTA, canvas-reveal accents) is decorative but never load-bearing — content is legible with it disabled.

## 2. Colors

Almost monochrome at rest; color is spent on purpose, one hue per case study.

### Primary
- **Deep Ink** (#0f172a light / #f1f5f9 dark): headline and body text color — the only "always visible" tone in the system.

### Secondary
- **Sky Glow** (#38bdf8): radial hover glow behind the primary "Check it out!" pill button. Decorative only, never a text or fill color.
- **Emerald Thread** (#34d399): the thin underline glow beneath the primary button on hover.

### Tertiary — Domain Accents (revealed on hover only)
- **BCAS Aviation Blue** (#005197) + **BCAS Pale** (#e0edfa): government security case study canvas-reveal.
- **Secure Hub Teal** (#134e4a) + **Secure Hub Pale** (#ccfbf1): cybersecurity case study canvas-reveal.
- **Oro Gold** (#fbbf24) + **Oro Pale** (#fde68a): gold-loan fintech case study canvas-reveal.
- **Haulkar Blue** (#3b82f6) + **Haulkar Pale** (#93c5fd): gig-logistics case study canvas-reveal.

### Neutral
- **Paper** (#f8fafc): light-mode page background start.
- **Cool Mist** (#e2e8f0): light-mode page background gradient end.
- **Void** (#020617): dark-mode page background (foreground + bg share this near-black slate).
- **Surface** (#f1f5f9 light / #1e293b dark): card interiors, pill buttons, keypoint chips.
- **Muted Ink** (#475569 / #64748b / #94a3b8): body copy, subtitles, secondary labels — three steps of the same slate ramp used by text weight, not by separate hues.

### Named Rules
**The One Hue Rule.** Each case study owns exactly one accent pair, spent only inside its own hover-reveal canvas. No accent color ever appears in global chrome (nav, footer, buttons) — those stay slate.

## 3. Typography

**Display Font:** Gloock (with Georgia, serif fallback)
**Body Font:** Satoshi (variable, weights 1–999, with system sans-serif fallback)

**Character:** A single technical variable sans carries every weight the interface needs; Gloock's italic serif is dropped in for exactly one word at a time as a signature flourish, never a running face.

### Hierarchy
- **Display** (400, inherits parent size, italic, line-height 1.1): the final word of the hero headline and select emphasis words (e.g. "formally" on the About page) — always via `.fontGloock`, never a full heading.
- **Headline** (700, clamp(2.25rem, 5vw, 4.5rem), line-height 1.1): hero heading, case-study titles (scale up to 7xl on case-study pages specifically).
- **Title** (700, 1.5rem, line-height 1.3, tracking wide): project card titles.
- **Body** (400, 1.125rem–1.5rem responsive, line-height 1.6, tracking wide): all paragraph copy; cap prose at 65–75ch.
- **Label** (600, 0.875rem, tracking 0.2em, uppercase): case-study metadata fields, keypoint chips.

### Named Rules
**The One-Word Serif Rule.** Gloock italic marks a single word of emphasis per view. It is never used for a full heading, paragraph, or navigation label — its rarity is what makes it read as a signature rather than a font choice.

## 4. Elevation

Flat by default. Cards and chips carry no box-shadow; depth is implied by a hairline border (`border-black/20` light, `border-white/20` dark) and four small corner-bracket icons standing in for a frame, not by drop shadow. The one exception is the primary hero CTA, which carries a soft ambient `shadow-xl` to lift it off the aurora background specifically because it sits over animated motion, not a flat surface.

### Shadow Vocabulary
- **cta-lift** (`box-shadow: theme('boxShadow.xl')`): reserved for the single primary CTA sitting over the animated aurora hero background.

### Named Rules
**The Flat-Card Rule.** Project cards and keypoint chips never use box-shadow. Depth comes from a 1px border and corner-bracket icons only.

## 5. Components

### Buttons
- **Primary ("Check it out!")** — **Shape:** pill (`rounded-full`). **Style:** `bg-slate-100` / `dark:bg-slate-800`, 1px `border-slate-300` (light) or borderless dark fill, `ring-1 ring-white/10`, text `slate-900` / `dark:white`, `shadow-xl`. **Hover:** a sky-400 radial glow fades in behind the pill (`opacity-0 → group-hover:opacity-100`, 500ms) plus an emerald-400 underline thread at 40% opacity.
- **Secondary ("Read Full Case Study ➜")** — **Shape:** `rounded-md` (6px). **Style:** 1px `border-slate-400` / `dark:border-slate-800`, animated diagonal shimmer gradient background (`linear-gradient(110deg, #cbd5e1 45%, #f1f5f9 55%, #cbd5e1)` light / `linear-gradient(110deg, #000103 80%, #1e2631 90%, #000103)` dark) running on an infinite 2s loop, text `slate-800` / `dark:slate-300`. **Focus:** `ring-2 ring-slate-400 ring-offset-2 ring-offset-slate-50`.

### Chips (keypoint tags)
- **Style:** `bg-slate-300/60` light / `bg-slate-900/60` dark, `rounded-md`, centered label text, no border.

### Cards / Containers (project cards)
- **Corner Style:** square (no radius on the card itself; `rounded-md` only on the inner thumbnail image).
- **Background:** transparent — the page background shows through.
- **Shadow Strategy:** none at rest (see Elevation → Flat-Card Rule); on hover, a full-bleed `CanvasRevealEffect` in the case study's domain accent fades in behind the content at `opacity: 0 → 1`.
- **Border:** 1px, `border-black/20` light / `border-white/20` dark.
- **Signature detail:** four small outline-icon corner brackets (`-top-3 -left-3` etc.) substitute for a shadow or highlighted-card treatment — the frame is drawn, not lit.
- **Internal Padding:** 24px (`p-6`), 32px (`p-8`) at `md`.

### Navigation (footer)
- Flat, no background chrome beyond the page gradient. Links (Home, About, LinkedIn, Photography, Visual Arts, Dribbble) sit in a single row/wrap, slate ink text, no active-state pill or underline — restraint carries through into the nav itself.

## 6. Do's and Don'ts

### Do:
- **Do** keep every accent color scoped to its own case study's hover-reveal canvas — never promote a project accent to global chrome.
- **Do** use Gloock italic for exactly one emphasis word at a time; treat it as a signature mark, not a display face.
- **Do** keep cards flat (border + corner brackets), never add a box-shadow to a card to "make it pop."
- **Do** cap body copy at 65–75ch and keep the slate ramp (600/500/400) as the only body-text variation.
- **Do** make every motion effect (aurora, shimmer, canvas-reveal, AOS fades) optional to comprehension — the page must read fine with `prefers-reduced-motion` collapsing them to instant/static.

### Don't:
- **Don't** introduce a global "brand color" — this system has no single primary hue by design; slate + per-project accent is the whole palette.
- **Don't** use `border-left`/`border-right` colored stripes on cards or chips; the existing frame language is a full hairline border plus corner brackets, not a side accent.
- **Don't** stack multiple case-study accent colors on the same view — one hue per hover state, never blended.
- **Don't** reach for generic SaaS-portfolio patterns (hero-metric stat rows, tiny uppercase eyebrows above every section, identical icon-card grids) — the brief is confident-minimal, and those patterns read as templated, not deliberate.
- **Don't** add drop shadows to buttons or cards beyond the single documented `cta-lift` exception on the aurora hero CTA.
