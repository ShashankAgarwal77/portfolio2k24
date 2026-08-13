# Audit360 — Case Study Knowledge Base

Source: interview transcript + `Guidelines Mastersheet v.3.0.0.xlsx` (412 rows analysed) + Figma file `yk6nNwNGkwLZGUf2SS1j94` (v2 page `1592:6875`, v3 page `6219:51911`, prototype page `4100:109130`).

Confidence markers used throughout:
**[V]** verified against a primary artifact (sheet or Figma) · **[S]** stated by Shashank, unverified · **[I]** my inference, must be confirmed · **[?]** unknown / open

---

## 1. Structured knowledge base

### 1.1 Origin and mandate

- India has **60,000+ government websites**, none systematically evaluated for UX, UI, usability, or accessibility. **[S]**
- The project began in an **informal conversation with NeGD's President & CEO at a party (~May 2025)**. He asked what should be done. Shashank's response was an arithmetic argument: a manual audit averages **7 days per platform**; at that rate 60,000 sites is **over 1,000 years** of work. **[S]**
- Shashank proposed a UX audit automation tool assessing sites against team heuristics, **GIGW, WCAG, DBIM, BIS** and UX4G's own guidelines. **[S]**
- The P&CEO approved; the **NeGD CEO directed** it be built and rolled out **under the UX4G project**. **[S]**
- **Stated justification:** make the Indian government digital ecosystem accessible and intuitive for citizens.
- **Actual pressures** (the real reasons, in Shashank's words): 480+ existing UX4G guidelines with no structure or management; no method to determine which guidelines a system or AI could evaluate; no multi-page audit; no changelog; no system; **no data tracking how many websites had ever been audited**. **[S]**

### 1.2 The manual process being replaced

- Run by the **UX4G design team, 4–5 designers**. **[S]**
- **One designer per platform audit, ~7 days**, performed *in parallel* with their main project work. **[S]**
- Day breakdown: Day 1 — product overview, target audience, IA. Days 2–3 — heuristic evaluation + GIGW + DBIM. Days 4–6 — UX4G guideline audit. Day 7 — documentation. **[S]**
- Scope was typically marketing pages: landing, about us, services, contact us, login. **[S]**
- Deliverable: a **PDF** sent to the requesting ministry POC (central or state). If they understood it they acted; if not they called for clarification. **Re-audits typically after 6 months.** **[S]**
- **No scoring mechanism existed.** Shashank believes inter-rater variance existed but it was never tested. **[S]**
- **No tracking existed** — the organisation could not state how many audits it had ever completed. **[S]**
- Why 7 days: guideline **volume**, guideline **ambiguity**, and **no tooling** for evaluation or report generation. **[S]**

### 1.3 The guideline corpus — the core intellectual work

**Before:** ~480 guidelines, authored by a previous designer and a project manager, living in an Excel file and on the UX4G website, **unversioned**. Derived from the team's government experience plus GIGW, WCAG, DBIM and BIS. Representative examples: *"Your website is hosted on a secure server"*, *"Text on the homepage is concise and to the point to accommodate smaller screens."* **[S]**

**What Shashank did:** went **rule by rule** through the entire corpus, derived a **canonical 22-field schema**, re-evaluated every guideline, and merged rules that expressed the same intent in different tones. **480 → 411** (the shipped sheet has **412 rows**). **[S/V]**

**The schema (22 columns):** `Stable ID` · `Category` · `Title` · `Issue` · `Advice` · `Examples – Pass` · `Examples – Fail` · `Accessibility Consideration` · `References` · `Rationale` · `Enforcement Level` · `Roles` · `Severity` · `Metrics Affected` · `Platform-wise Applicability` · `Page-wise Applicability` · `Component-wise Applicability` · `Context-wise Applicability` · `Evidence Type` · `AI Support` · `Confidence Weight` · `Version` **[V]**

**What the schema made possible:** a guideline becomes a *routable object* — this rule needs this evidence, on this page type, for this component, in this context, judged by this evaluator. Before the axes existed, guidelines lacking evidence/page/section/context parameters produced **uncertain and inconsistent AI output across repeated audits of the same page**. **[S]**

**Field semantics:**

| Field | Values | Notes |
|---|---|---|
| `Enforcement Level` | Foundational (202) · Optimizing (200) · Advanced (10) **[V]** | Signals how strongly a system must comply. **Assigned by intuition — no written rule.** Needs revision. **[S]** |
| `Severity` | Big / Medium / Small Issue **[V]** | Not surfaced anywhere in the product UI. **[V]** |
| `AI Support` | Automated · Deterministic · Evaluative · Assisted · Manual **[S]** | Declares *what kind of evaluator* judges the rule. |
| `Evidence Type` | DOM · Visual · Behavioral · Content · Manual · Interaction · Policy · Semantic (+ Structural, System, Functional, Documentary, Temporal in practice) **[S/V]** | Each type triggers a different capture/analysis activity. |
| `Confidence Weight` | 0.55–0.98, one value per guideline **[V]** | **Placeholder values.** Never validated, does not gate anything, does not affect scoring. **[S]** |
| `Version` | `v3.0.0` on all 412 rows **[V]** | Sheet-level, not per-guideline. v1/v2 history was never tracked. **[S]** |

**Automation coverage:** ~**100 of 480** guidelines were automatable when Shashank joined; ~**260 of 411** are now partially or fully automated (~21% → ~63%). **[S]** — *note: the sheet's enum tallies to 269 across Automated + Deterministic + Evaluative + Assisted; "Assisted" implies a human remains in the loop, so the 260 figure needs a stated definition.* **[V]**

**Data-hygiene finding (verified):** the schema built to eliminate inconsistency had **significant vocabulary drift** — 5 Severity values (`Medium Issue` 193 vs `Medium` 62), 14 `AI Support` values mixing a *type* enum with a *level* scale (`High` 41, `Medium` 32, `Partial` 16, `Low` 5) plus free text, 30+ `Evidence Type` values including `UX review`, `Data logic`, `Logic review`, three spellings of "applies everywhere" (`Common` / `All pages` / `All`), and two incompatible `Platform` formats (emoji + comma vs plain + semicolon). **[V]**

The drift was **clustered, not random**: all 94 level-vocabulary rows and nearly all short-form severity rows fall inside **7 of 32 categories** — Performance Optimization, Analytics, Side/Profile/Avatar Menu, Accessibility, Offline Functionality, Data Visualisations, Government Service Integration (104 rows). Cause: **the guidelines are human-authored, but metadata columns were AI-populated in a separate pass with uneven human review.** **[V/S]**

**Remediation (done during this interview):** `Guidelines Mastersheet v.3.1.0 (normalized).xlsx` — 405 of 412 rows touched; Severity 5→3, AI Support 14→5, Platform 2 formats→4 clean values, Evidence Type→14 canonical tokens; new **`Automation Level`** column separating the *type* from the *degree* axis; new **`Normalization Note`** column preserving every original value; **Excel dropdown validation** on the four controlled-vocabulary fields as a governance gate; changed rows bumped to `v3.1.0`.

### 1.4 The routing problem (the strongest unreported finding)

- Users **manually tag pages** by pasting URLs — the product accepts up to **7 URLs** (Homepage mandatory; About Us, Contact Us, Login/Sign Up, plus 3 free links optional). **[S/V]**
- **Why not crawl:** government sites have no path-naming standard (`aboutus` / `about-us` / anything), many block crawling, and NeGD cannot hit ministry servers without permission. **[S]**
- Missing page types are not penalised in the maths; only the homepage is mandatory. **[S]**
- **Verified consequence:** `Page-wise Applicability` contains **156 distinct values**, 104 of which appear once, and many are not page types at all but contexts (`Pre-SSO`, `Deep hierarchies`, `Repeating content types`, `Core journeys`) — despite a separate `Context-wise Applicability` column existing. **[V]**
- **Product split (by design, not a defect):** the **Automated Audit shows only guidelines the product can audit**; the **76 `Manual` guidelines route to the Comprehensive Audit** instead. **[S]**
- **The real gap, correctly scoped:** of the **336 machine-auditable** guidelines, **182 (54%)** carry no page value matching any page type a user can submit. Worst hit: Lists/Filters/Sorting **22**, Task Orientation **18**, Navigation & IA **16**, Banners & Graphics **16**, Side/Profile Menu **13**, Walkthrough Screens **12**, Forms & Data Entry **10**. These are rules the machine *can* judge, addressed to pages the URL form cannot supply. **[V]**
- Root cause is independent of pipeline behaviour: **156 distinct page values against 7 submittable page types**, with the Page axis carrying context values despite a Context axis existing. **[V]**
- **Confirmed:** the 182 are **not considered part of the automation audit** — excluded, not evaluated everywhere. **[S]**
- **Effective automated corpus ≈ 154 guidelines (~37% of the 412-rule standard)**: 412 − 76 Manual − 182 unaddressable. Estimate only — the page matcher used here is exact-match and the 3 free-URL slots may widen it. **Replace with the real "X of 411" from a production audit.** **[I]**
- **The honest framing for the case study:** this is a *scope boundary*, not a bug — the automated audit evaluates only what it can address and reports the count. The design gap is disclosure: the report shows "X of 411" without naming *which* guidelines fell outside scope, so a ministry cannot tell that Forms, Lists/Filters and Navigation were never in the automated corpus. Cheap fix: name the excluded set and route it visibly to the Comprehensive Audit — which also gives Comprehensive mode a clear purpose as the deliberate other half of the standard, rather than a legacy leftover.

### 1.5 Scoring

- Score is a **percentage, 0–100**, produced **per page** and **per audit**. **[S/V]**
- **Weights: UX4G 50% · GIGW UI/UX 25% · Lighthouse 25%** (Performance, Accessibility, SEO, Best Practices). Decided by the **Project Head and Shashank**. Rationale: UX4G contributes ~411 guidelines against GIGW's 20 parameters. Shashank also concedes "UX4G is our project so it should dominate." **No one challenged it.** **[S]**
- Defence offered against the self-weighting critique: UX4G designers have long experience with the government sector and are qualified to set the bar. **[S]**
- **SEO carries equal weight to Accessibility** inside the Lighthouse block; down-weighting was never considered. **[S]**
- Denominator: compliant vs non-compliant across **evaluable guidelines only** (Deterministic, Evaluative, Assisted); Manual guidelines are excluded. The report shows **"X of 411 guidelines evaluated."** **[S]**
- **AI confidence does not affect the score.** The only mitigation is a disclaimer: *"AI can make mistakes, check important information carefully."* **[S]**
- Bands: **Excellent / Average / Poor**, colour-coded green/amber/red. **[V]**
- Design decision to record: **no single site-level number** — page score and audit score only, because cross-site benchmarking must be page-specific. **[S]**

### 1.6 Politics and access

- Access is restricted to **government officials and invited members**. **[S/V]**
- **Rank Tracker** (leaderboard) ranks ministry and state websites by **homepage score**; visible to all logged-in users, so departments can see each other. Shipped in **v3**. **[S/V]** The report also surfaces **National Rank** and **Ministry Rank**. **[V]**
- Intent: gamify and motivate improvement, with careful UX writing to avoid discouragement. **[S]** No evidence yet that it changes behaviour. **[?]**
- **No mechanism to dispute a finding, flag a false positive, or annotate intentional deviations.** Planned, not built. **[S]**
- **Lost argument:** Shashank proposed opening the platform beyond government — including a **G2B revenue channel** for businesses wanting to improve UX health. Rejected because a government organisation cannot generate revenue that way. Outcome: government + invited members only. **[S]**

### 1.7 Technical architecture

- **Puppeteer full-page screenshots.** **[S]**
- Evidence routing: **DOM-first with screenshot fallback**, *plus* a first-class `Visual` evidence type for guidelines declared visual by their metadata. Screenshots carry visual hierarchy, contrast and rendered state that the DOM cannot. **[S]**
- **One JSON prompt per page; one API call per page** carrying all applicable guidelines for that page. **[S]**
- **OpenAI**, directed by the **CTO** at project initiation. **No alternatives evaluated. No cost-per-audit data. No recorded data-governance discussion** about sending government-site screenshots to a US commercial API. **[S]**
- **Typical audit ≈ 5 minutes**, varying with page length and content. If it runs longer, the report is **emailed to the user's registered address**. **[S]**
- Determinism: Shashank reports the UX4G score is stable on re-run of the same page after the schema work. Method of verification unknown; temperature/caching unknown. **[S/?]**

### 1.8 Team, role, timeline

- **Team of 4:** Shashank (functioning as Product Manager *and* Product Designer), 1 frontend dev, 1 backend dev, 1 QA. **[S]**
- **Title: UX Engineer.** Actual work: BRDs, product management, research, design. Reported to Reporting Manager, CTO and CEO of NeGD. Sign-off required from the Reporting Manager. **[S]**
- Ran **in parallel with other projects and consultancy work**. **[S]**
- Owned: schema, high-fidelity design, design system. Did **not** own the JSON contract with engineering or execution; brainstormed with engineers but did not own delivery. **[S]**
- **Critique came from Reporting Manager, CTO and CEO — no design peers.** **[S]**
- Timeline: joined UX4G **Feb 2025** → CEO conversation **May 2025** → **v1 Aug 2025** → **v2 Dec 2025** → **v3 Mar 2026** → in production. **[S]**

### 1.9 Adoption

- **5,463 websites** audited since v1 (Aug 2025), automated audits only. Unit confirmed by Shashank. **[S]**
- **Effort equivalence (assumptions shown):** 5,463 × 7 days = **38,241 audit-days**. The 7 days was *elapsed* time, worked in parallel with each designer's main project — so it is duration, not full-time effort, and must not be converted to person-years. Divided across a team of 4–5 auditing concurrently: **≈ 21 years (5 designers) to 26 years (4 designers) of continuous team throughput**, delivered in ~12 months. Conservative, because an automated audit covers up to 7 pages where a manual audit covered ~5.
- *Sanity check on the origin claim:* 60,000 × 7 days ÷ 365 ≈ **1,150 years for a single auditor** — which is where "more than 1,000 years" comes from. State the single-auditor assumption when quoting it, or it looks inflated. **[I]**
- Everything else — audits per month, unique domains, distinct ministries, completion vs abandonment, re-audit score deltas — is **unknown**. **[?]**

### 1.10 The product surfaces (verified in Figma)

**Navigation (v3):** Automated Reports · Comprehensive Reports · Rank Tracker · User Management · UX4G Tools · UX4G Support. v2 had no Rank Tracker or UX4G Tools. **[V]**

**Dashboard:** per-site cards with an overall-score donut (Excellent/Average/Poor) plus six tiles — UX4G Compliance, GIGW UI/UX Parameters, Performance, Accessibility, SEO, Best Practices. Filter presets `Score > 90%` and `Score < 75%`. Re-audit and View details per site. Persistent left-rail promo for the UX4G Design System. **[V]**

**Report:** site hero with screenshot → Overall Results (donut + 6 tiles) → **Page Analysis** table (page, score, non-compliant count, status) → **History and Comparison** bar chart (latest vs previous audit, per page). Export control present. **[V]**

**Finding list:** grouped by category, expandable rows, binary **Compliant / Not Compliant** with a red or green bar. Filter chips: All / Marked as Compliant / Marked as Not Compliant / **Marked as Not Applicable**. The GIGW block states a full denominator — *All 20 · Compliant 12 · Not Compliant 4 · Not Applicable 4*; the UX4G block does not. **[V]**

**Content design:** guideline titles are rewritten into second person for the report — *"You have obtained the necessary security certifications"* — but only partially; the same list also carries imperative mastersheet titles (*"Ensure SSL/TLS encryption is implemented"*). **[V]**

**Async job design (added in v2):** `Loading` → `Loading – Wait Option` → `Loading – Enter Email` → `Audit Report Shared on Email`, with an `[After 5 mins] Audit in Progress` frame. The wait screen shows live per-check progress ("Auditing with UX4G Compliance"), a thumbnail of the site being audited, and a **UX education card** — *"Users form an opinion about a website's credibility in just 50 milliseconds."* **[V]**

**Failure and edge states:** `Loading Screen / API failure`, `API Fails – General`, `Audit in Progress – Second Attempt` (retry), `Comprehensive Report – Failure`, `Audit Restricted`, `Homepage / Empty`, `Re-audit`, per-page progress (`2 / 6 Webpages Audited`), Grid View / List View. **[V]**

**Access control:** Add New User → Filled → Invite Sent → Revoke Invited User → Active/Inactive User, plus external non-government user password setup. User Management iterated through v1, v2 and v3. **[V]**

**Comprehensive (manual) audit mode:** a full parallel product for users who want a deep audit — Start New (from Automated or Manual), Continue, Audit Dashboard, Generate Score, Complete Report (View Only). **[V]**

**Exploratory, not shipped:** UX Pragya, Heatmaps. **[S]**

**v4 direction:** agentic / RAG approaches to compliance automation. **[S]**

---

## 2. Missing information — must verify before publishing

**Blocking (the case study is weaker or wrong without these):**

1. ~~5,463 = websites or page URLs?~~ **Resolved: websites.**
2. **Number of audits (sessions)** and **average pages per audit** — sharpens the comparison, no longer blocking.
3. **Unique domains** and **distinct ministries/departments/states** — the reach number.
4. **Re-audit score deltas.** The History & Comparison chart exists, so the data almost certainly exists. *N sites re-audited, average score moved from X to Y* is the single most valuable sentence available.
5. **Does the pipeline actually silently drop unroutable guidelines?** Verify against the filtering code. The 246/412 figure is derived from the sheet, not from the code.
6. **Score formula** — confirm the denominator is evaluated-guidelines, and check whether submitting fewer pages yields a higher score.

**Important:**

7. Typical `X` in "X of 411 guidelines evaluated" for a real audit.
8. Audit completion vs abandonment rate (answers the URL-form drop-off question).
9. Cost per audit, and which OpenAI model.
10. Whether any data-governance review covered sending government screenshots to a US API.
11. Baseline: how many manual audits the team completed pre-Audit360 (may be unrecoverable — say so).
12. Determinism test method: how many pages, how many runs, temperature, caching.
13. v1 → v2 and v2 → v3 triggers, in Shashank's words (currently inferred).
14. Whether AI-populated metadata was reviewed, and whether any AI-generated `References` cite GIGW sections that don't exist.

---

## 3. Weak spots in the story

1. **The headline number is unstable.** Fix before anything else.
2. **No measured accuracy.** No ground-truth set, no comparison against human audits, no false-positive rate. "It improved accuracy after the schema" is currently unevidenced.
3. **No confidence calibration.** `Confidence Weight` is decorative, runtime confidence is self-reported and never checked, and neither affects the score. A disclaimer transfers risk to the user rather than handling it.
4. **The self-weighted standard.** NeGD's own guidelines are weighted 50% in the score used to grade other ministries, and nobody challenged it. Expect this question.
5. **SEO weighted equal to Accessibility** in a government accessibility-compliance product, with no stated rationale.
6. **The leaderboard has no evidence base.** "Gamification motivates departments" is asserted, not demonstrated, and the plausible failure mode — bottom-quartile departments stop auditing — was not designed against.
7. **No dispute or false-positive path.** A serious gap for an enterprise compliance product.
8. **Version comparability is unsolved.** If a guideline's text changes after thousands of audits, prior scores become non-comparable. Openly unaddressed.
9. **Enforcement Level was assigned by intuition**, and splits ~50/50 across 412 rules, so it does little discriminating work.
10. **The schema dies at the last mile.** `Severity`, `Enforcement Level` and `Roles` — three of the most decision-relevant fields — appear nowhere in the report, which renders a flat binary checklist. The routing metadata exists to make findings actionable; the UI flattens it back.
11. **No killed ideas, no failed concepts.** A three-version, year-long product with zero abandoned directions reads as incomplete recall. Dig through old Figma pages before writing.
12. **No design peer review.** Critique came only from Reporting Manager, CTO and CEO — all management, none design. Worth naming as a constraint rather than hiding.
13. **Mock-data inconsistencies visible in the shared file** (fix before screenshots ship): identical sub-scores across three sites with different overall scores; Page Analysis lists 5 pages while the History chart plots 7; Sign Up shows 0%/unavailable in the table yet a healthy bar in the chart; GIGW shows 63% against 12 of 20 compliant; audit date reads March 2024, predating v1.
14. **The `Signup — 0%` row renders in red** even though missing pages are excluded from the maths. The interface communicates a penalty the model doesn't apply.
15. **The dashboard greeting claims "No manual intervention required!"** while a whole manual audit mode and 76 Manual-support guidelines exist.

---

## 4. Opportunities to strengthen the narrative

1. **Reframe the whole case study.** This is not "I built an AI audit tool." It is **"I made a national standard machine-readable, then built the system that runs it."** The schema is the differentiator; the dashboard is table stakes.
2. **Use the self-audit as the centrepiece.** Turning Audit360's own rigour on its own corpus — finding clustered vocabulary drift, tracing it to AI-populated metadata, then normalising and adding a governance gate — is the most senior-reading sequence available, and it's fully evidenced.
3. **Publish the routing gap as the roadmap.** *"The product measures what it can address. 246 of 412 guidelines have no addressable page. Here's the fix: separate page from context, add an `unknown` state, and never silently pass."* Self-diagnosis is a strength signal, not a weakness.
4. **Elevate the async job design.** Long-running job UX, email hand-off, retry, API-failure states, per-page progress, and using dead wait time to teach UX — this is enterprise-UX evidence most portfolios lack entirely.
5. **Own the political design decisions.** Refusing a single site-level score; a leaderboard scoped to homepages so the denominator stays constant; band language chosen to motivate rather than shame; the G2B proposal that was rejected. This is the "designing inside government" chapter.
6. **Show the schema as an artifact** — a real table with a real row (TC-001 is a good one). Reviewers remember artifacts, not prose.
7. **Correct the arithmetic honestly and show your working.** Once the unit is settled, state the manual-effort equivalent with the assumption visible. A shown assumption beats an impressive unsourced number.
8. **Make the confidence story a decision, not an omission.** "I shipped a confidence field I couldn't yet earn" plus the calibration plan is a strong, honest beat.
9. **Add the v4 concept for severity/role-aware reporting** — clearly labelled as a proposal, never as shipped work.

---

## 5. Proposed MDX case study outline

Target: ~2,500–3,500 words. Sits alongside `src/app/(content)/case-study/bcas/page.mdx` at `src/app/(content)/case-study/audit360/page.mdx`.

**Hero** — Audit360. One line: *an AI audit platform for 60,000 government websites, and the standard rewrite that made it possible.* Role, team size, timeline (Feb 2025 – Mar 2026, live), and 3–4 verified metrics.

**1. The conversation that started it** — the CEO exchange, the 7-days-per-site arithmetic, the 1,000-year number. Short. No scene-setting beyond what carries the argument.

**2. What was actually broken** — the manual audit anatomy (7-day breakdown, PDF to POC, 6-month re-audit), and the deeper problem: 480 unstructured guidelines, no versioning, no scoring, no tracking. Land the irony that an audit programme could not audit itself.

**3. The real problem was the standard, not the tool** *(the centrepiece)* — why a guideline like *"Text on the homepage is concise"* cannot be evaluated by anything; the 22-field schema; rule-by-rule review; 480 → 411; automation coverage 21% → 63%. Show a real row. Explain the routable-object idea in one paragraph.

**4. Designing the machine that reads the standard** — evidence-type routing, DOM-first with visual fallback, one prompt per page, human page-tagging and why crawling was rejected. Include the constraint honestly: OpenAI was directed, not chosen.

**5. Scoring in a political organisation** — the 50/25/25 split and its self-weighting tension; refusing a single site-level number; leaderboard scoped to homepages; band language. State the tradeoffs you accepted, not just the choices.

**6. The product** — IA, dashboard, report structure, finding list, progressive disclosure. Then the section most portfolios don't have: **the five-minute wait** — async hand-off to email, per-page progress, retry, API failure, restricted and empty states, and using the wait to teach UX.

**7. What I found when I audited my own work** *(the differentiator)* — vocabulary drift clustered in 7 categories; tracing it to AI-populated metadata; the 246-of-412 routing gap; the normalisation pass and the governance gate that prevents recurrence. Include the before/after distributions.

**8. Outcomes** — verified adoption numbers, effort equivalence with the assumption shown, and re-audit score movement if obtainable. If it isn't obtainable, say so plainly.

**9. What I'd do differently** — calibrate confidence or remove the field; split page from context and add an explicit `unknown` state; build the dispute path; solve version comparability; surface severity, enforcement level and roles in the report. Present each as a decision with a reason, not an apology.

**10. Closing** — what designing a national standard taught about designing with AI: the model was never the hard part; making the *input* machine-readable was.

**Components to build:** score-band callout, schema table (horizontally scrollable), before/after distribution chart, annotated screenshot with callouts, verified-metric stat row, and a "decision / tradeoff / outcome" block used consistently across sections 5, 7 and 9.

**Writing rules for this piece:** no invented artifacts; label every proposal as a proposal; lead each section with the decision, then the evidence; cut any sentence that exists only for rhythm; keep numbers sourced or marked as estimates.
