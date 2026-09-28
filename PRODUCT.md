# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Two readers, layered — the site must serve both in order:

1. **Recruiters and hiring managers** (primary surface audience): screening quickly, comparing many candidates in a short window, arriving with limited attention and scanning for signal — credibility, craft, clarity of thinking — not reading every word.
2. **Design Directors and senior design leadership** (primary depth audience): they discount process narratives by default; the case-study depth — real decisions, reversals, self-audits, verifiable numbers — is written for them.

The skim must land first; the deep read must reward the reader who stays.

## Product Purpose
A personal portfolio for Shashank Agarwal, a product designer. It showcases case studies — Audit360 (NeGD UX-audit platform for the Government of India), BCAS/eBCAS 2.0 (national aviation-security compliance platform), Secure Hub (cybersecurity employee monitoring), Oro (gold-loan fintech app), Haulkar (gig-logistics app) — plus Dribbble shots. Success means a reader leaves remembering him as sharp and credible, understanding the depth of his design process (not just polished outcomes), and finding it easy to reach out directly.

Photography and visual arts were de-scoped (2026-08-27): the portfolio is design work only. The footer's Photography / Visual Arts links are legacy and should eventually be removed, not built out.

## Positioning
He takes government-scale products from problem to production — including work engineers would normally gate — with AI as the multiplier, never the identity. The claim is proven by shipped national platforms: BCAS (487 production-ready screens in 6 weeks, 4 designers, 0 engineers) and Audit360 (a 480-rule national UX standard rewritten to be machine-readable, then the platform that runs on it). Craft leads; AI is the how.

## Operating Context
- Evaluation happens in two passes: a fast screening skim (landing, headlines, outcomes), then — for readers the skim earns — long-form case-study reads structured like Medium articles.
- Contact is LinkedIn only (https://www.linkedin.com/in/shashank-agarwal11/); there is deliberately no public email.
- The resume is served from the site (`public/Shashank-Agarwal-Resume.pdf`, linked from the dock).
- Dribbble shots load live from the Dribbble API via `/api/fetchDribbbleShots`.

## Capabilities and Constraints
Fact-integrity rules that bind all future work:

- **Never write unbuilt work as shipped.** Proposed-but-unbuilt designs (BCAS floor-plan CAD confidence idea — pitched to the panel only; Audit360 dispute pipeline and severity/role filtering) appear only as clearly labelled proposals.
- **BCAS confidentiality**: the agency stays unnamed in narrative prose ("a national civil aviation security regulator"), testimonials anonymized, screenshots as published. The live prototype is behind a sign-in wall and is deliberately not linked.
- **Two Audit360 numbers are unstable and block new published claims** until verified: whether 5,463 counts websites or page URLs (~5× headline difference), and whether unroutable guidelines are silently dropped.
- No BCAS usage data exists yet (product in progress); no measured accuracy or ground truth for Audit360. Write these honestly rather than hiding them.
- He under-reports his own work — check Figma artifacts before accepting "I didn't do that."

## Brand Commitments
- Name: Shashank Agarwal. Personality: confident & minimal — quiet confidence, restrained, high-craft, lets the work speak.
- **AI is a craft multiplier, never an identity.** Headlines stay outcome-first; AI lives in supporting copy backed by proof points. Never label him an "AI-native designer."
- Contact CTA commitment: LinkedIn, no public email.

## Anti-references
No specific anti-reference named. Default to avoiding the generic "built with a portfolio template" look and stiff agency-brochure tone, consistent with the confident-minimal brief.

## Evidence on Hand
- **Audit360**: mastersheet-evidenced standard rewrite (480 → 411 guidelines, 22-field schema, automation coverage ~21% → ~63%); full research in `docs/audit360-knowledge-base.md`; Feb 2025 – Mar 2026, in production.
- **BCAS**: 487 production-ready screens, 6 weeks to pitch, 4 designers, 0 engineers; Lucknow airport field research; the verified "14,500 credits on module one" reversal fact (the old "₹3.5L cost avoided" claim was retired as unverifiable).
- Dribbble shots via live API; published case-study screenshots; resume PDF.
- **Absences future work must not fabricate**: no public testimonials beyond anonymized ones, no usage metrics for BCAS, no accuracy benchmarks for Audit360, no client logos or press.

## Product Principles
- Let the work speak — confidence is shown through craft and restraint, not volume or ornamentation.
- Depth over gloss — case studies should prove process rigor, not just glossy final shots.
- Scannable first, rewarding second — the surface layer must be instantly legible to a skimming recruiter, while rewarding anyone who reads deeper into a case study.
- Practice what you preach — the portfolio itself should demonstrate the same UX judgment claimed in its case studies.
- Frictionless path to contact — a strong impression should always have an easy, obvious on-ramp to reach out.

## Accessibility & Inclusion
No specific accessibility requirement flagged; not a current priority. Apply standard baseline practice (contrast, keyboard navigation, reduced-motion fallback for the heavy animation stack) opportunistically, without treating it as a blocking requirement.
