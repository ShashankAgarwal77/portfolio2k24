import React from "react";

/* ─────────────────────────────────────────────────────────────────────────
   PipelineDiagram — the Audit360 evidence-routing pipeline, drawn rather
   than screenshotted (see the ShotPlaceholder brief this replaces).

   Built as real HTML/CSS, not a raster image or one big scaled SVG canvas:

     · Theme adaptability is then just the site's existing Tailwind dark:
       classes — no separate light/dark export to keep in sync.
     · Text stays crisp and reflows at any width. A wide fixed-viewBox SVG
       scaled down to the article's ~42rem column would shrink 14px labels
       to single digits on a phone; real text sidesteps that entirely.
     · Layout stacks vertically by default (five steps read fine top to
       bottom at any narrow width) and only goes horizontal at `xl`, which
       is deliberately the same breakpoint as `.bleed-wide` in globals.css
       — the figure only has the ~960px a 5-stage row needs once it has
       actually broken out of the reading column.

   Icons are small inline SVGs in the SheetRow style (stroke=currentColor,
   sized by the parent's text color), never the diagram's own content —
   the labels carry the meaning, so the diagram still reads correctly with
   the icons pruned as decoration.

   Content is drawn straight from the case study's own text: 411 guidelines
   (the post-consolidation count), the four applicability facets from the
   schema table above, the three evidence channels and single-JSON-call
   framing from "The machine that reads it", and the per-rule structured
   verdict that section ends on. Nothing here is invented.
   ───────────────────────────────────────────────────────────────────────── */

function Icon({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className ?? "h-4 w-4"}
    >
      {children}
    </svg>
  );
}

const ICONS = {
  guidelines: (
    <>
      <rect x="3" y="2" width="9" height="11" rx="1.25" />
      <path d="M5.25 5.25h4.5M5.25 7.75h4.5M5.25 10.25h2.75" />
    </>
  ),
  filter: <path d="M2.5 3h11l-4 5.25V13l-3 1.25V8.25z" />,
  dom: <path d="M6 4.5 2.5 8l3.5 3.5M10 4.5 13.5 8 10 11.5" />,
  camera: (
    <>
      <rect x="1.75" y="4.5" width="12.5" height="8.5" rx="1.5" />
      <path d="M5.25 4.5 6.25 2.75h3.5L10.75 4.5" />
      <circle cx="8" cy="8.75" r="2.15" />
    </>
  ),
  lighthouse: (
    <>
      <path d="M6.5 2h3l1 10.5h-5z" />
      <path d="M5.5 12.5h5v1.5h-5z" />
      <path d="M6.75 5.25h2.5" />
      <path d="M4.4 4.6 2.6 3.4M11.6 4.6l1.8-1.2" />
    </>
  ),
  prompt: <path d="M4.5 2.5h-1a1 1 0 0 0-1 1v2.4c0 .55-.2 1-.75 1.35.55.35.75.8.75 1.35V11a1 1 0 0 0 1 1h1M11.5 2.5h1a1 1 0 0 1 1 1v2.4c0 .55.2 1 .75 1.35-.55.35-.75.8-.75 1.35V11a1 1 0 0 1-1 1h-1" />,
  verdict: (
    <>
      <circle cx="8" cy="8" r="6" />
      <path d="M5.25 8.1 7.1 10l3.65-4" />
    </>
  ),
} as const;

type Stage = {
  key: string;
  icon: keyof typeof ICONS;
  title: string;
  subtitle: string;
};

const STAGES: Record<"guidelines" | "filter" | "prompt" | "verdicts", Stage> = {
  guidelines: {
    key: "guidelines",
    icon: "guidelines",
    title: "411 Guidelines",
    subtitle: "UX4G, rewritten",
  },
  filter: {
    key: "filter",
    icon: "filter",
    title: "Applicability Filter",
    subtitle: "declares where a rule fires",
  },
  prompt: {
    key: "prompt",
    icon: "prompt",
    title: "Structured Prompt",
    subtitle: "one JSON call per page",
  },
  verdicts: {
    key: "verdicts",
    icon: "verdict",
    title: "Verdicts",
    subtitle: "structured, per rule",
  },
};

const FACETS = ["Page", "Component", "Context", "Platform"];

const EVIDENCE = [
  { icon: "dom" as const, label: "DOM Query" },
  { icon: "camera" as const, label: "Screenshot — Puppeteer" },
  { icon: "lighthouse" as const, label: "Lighthouse" },
];

/* Connector — the line between two stages, not a floating arrowhead in a
   gap next to them. Two things make it read as one continuous, moving
   pipeline instead of five separate boxes:

     1. A single static line runs to within a couple of viewBox units of
        each edge, and the outer layout (below) carries no extra gap
        around it — so the line's own ends are what nearly touch the
        neighbouring cards, rather than a short segment sitting in the
        middle of empty space. There is no arrowhead; the line itself is
        the connective tissue, direction is read from the animation.
     2. A second, brighter path sits on top of the static line with a
        long stroke-dasharray gap, so only one short glowing segment is
        ever visible — a soft `drop-shadow` on top of it is what reads as
        "glow" rather than a hard dash. Its offset animates via Tailwind's
        `animate-dash-flow` (registered in tailwind.config.ts), tracing
        left-to-right (top-to-bottom on the stacked layout). All four
        connectors share the exact same keyframe and duration with no
        per-instance delay, so mounting together keeps them in lockstep:
        one visible pulse sweeping through the whole pipeline, not four
        independent flickers.

   Two natively-oriented SVGs (a real horizontal one, a real vertical one),
   toggled by breakpoint visibility, rather than one glyph rotated with a
   CSS transform: a rotated non-square viewBox needs its width/height
   classes swapped to match, which is easy to get subtly wrong and hard to
   verify without a working visual preview. Two small, independently
   correct drawings sidestep that entirely. */
function Connector() {
  return (
    <>
      <svg
        viewBox="0 0 64 20"
        fill="none"
        aria-hidden="true"
        className="hidden self-center xl:block xl:h-5 xl:w-12 xl:shrink-0"
      >
        <path
          d="M2 10h60"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-slate-300 dark:text-white/25"
        />
        <path
          d="M2 10h60"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="14 60"
          className="animate-dash-flow text-slate-500 [filter:drop-shadow(0_0_3px_currentColor)] dark:text-white"
        />
      </svg>
      <svg
        viewBox="0 0 24 56"
        fill="none"
        aria-hidden="true"
        className="block self-center xl:hidden h-12 w-6 shrink-0"
      >
        <path
          d="M12 3v50"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-slate-300 dark:text-white/25"
        />
        <path
          d="M12 3v50"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="12 62"
          className="animate-dash-flow text-slate-500 [filter:drop-shadow(0_0_3px_currentColor)] dark:text-white"
        />
      </svg>
    </>
  );
}

function StageCard({
  stage,
  chips,
}: {
  stage: Stage;
  /** Attributes of the stage, not actions — rendered as the site's
      documented keypoint-chip style (DESIGN.md §5), never a bordered
      "sub-card" (nested cards are always wrong). */
  chips?: string[];
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-md border border-black/20 bg-slate-50/80 px-4 py-3.5 text-center dark:border-white/20 dark:bg-white/[0.03] xl:justify-center">
      <span className="text-slate-500 dark:text-slate-400">
        <Icon className="h-4 w-4">{ICONS[stage.icon]}</Icon>
      </span>
      <p className="text-caption text-balance font-semibold text-slate-800 dark:text-slate-200">
        {stage.title}
      </p>
      <p className="text-caption text-balance text-slate-500 dark:text-slate-400">
        {stage.subtitle}
      </p>
      {chips && (
        <ul className="mt-1 flex flex-wrap justify-center gap-1">
          {chips.map((chip) => (
            <li
              key={chip}
              className="text-label rounded-md bg-slate-300/60 px-1.5 py-0.5 font-semibold uppercase text-slate-700 dark:bg-slate-900/60 dark:text-slate-300"
            >
              {chip}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EvidenceCard() {
  return (
    /* flex-[1.6], not flex-1: this card carries three labelled rows where
       its siblings carry one short title each. An equal flex-1 share
       (measured at ~112px content width in the xl row layout) forced
       "Screenshot — Puppeteer" onto three wrapped lines and even wrapped
       "DOM Query" onto two — which was what actually knocked the rail
       (below) out of alignment with its branches, not the rail's own
       inset math. Giving this card more room fixes the cause, not the
       symptom. */
    <div className="flex min-w-0 flex-[1.6] flex-col items-center gap-1.5 rounded-md border border-black/20 bg-slate-50/80 px-4 py-3.5 text-center dark:border-white/20 dark:bg-white/[0.03]">
      <span className="text-slate-500 dark:text-slate-400">
        <Icon className="h-4 w-4">
          <path d="M2.5 8h2.5M11 8h2.5M5 8l2-4.5M5 8l2 4.5M11 8l-2-4.5M11 8l-2 4.5" />
        </Icon>
      </span>
      <p className="text-caption text-balance font-semibold text-slate-800 dark:text-slate-200">
        Evidence Capture
      </p>
      <p className="text-caption text-balance text-slate-500 dark:text-slate-400">
        matched to what each rule needs
      </p>

      {/* One rule tag routes to one lane; the rail is the fan-out itself,
          not decoration around it.

          flex + gap-2, not space-y-2: space-y's margin-based spacing
          counts the rail span as a "preceding sibling" for every row that
          follows it, even though the span is position:absolute and out of
          flow — that phantom margin was quietly pushing every row 8px
          lower than the rail's own top-anchored inset expected, which is
          what actually threw the rail out of line with its branches (the
          card-width fix above removed the wrapping that made the symptom
          large enough to notice). A flex gap correctly ignores
          out-of-flow children, so the two numbers below now hold at any
          width: top-3.5 lands on the first row's vertical centre, bottom-2
          on the last row's, both driven only by text-caption's fixed
          line-height rather than by content that can reflow. */}
      <div className="relative mt-1 flex w-full max-w-[15rem] flex-col gap-2 pt-1">
        <span
          aria-hidden="true"
          className="absolute left-[7px] top-3.5 bottom-2 w-px bg-slate-300 dark:bg-white/15"
        />
        {EVIDENCE.map((item) => (
          <div key={item.label} className="relative flex min-w-0 items-center gap-2 pl-4">
            <span
              aria-hidden="true"
              className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-slate-300 dark:bg-white/15"
            />
            <span className="shrink-0 text-slate-500 dark:text-slate-400">
              <Icon className="h-3.5 w-3.5">{ICONS[item.icon]}</Icon>
            </span>
            {/* No whitespace-nowrap: a label that can't wrap can only ever
                overflow past the card's edge if it's ever rendered
                narrower than expected (a stray CSS change, a browser
                zoom level, an even-narrower phone than tested). Letting it
                wrap means the worst case is two lines and a slightly
                looser rail alignment below, not text spilling outside the
                card's own border — containment beats a perfectly centred
                connector line every time. */}
            <span className="text-caption text-balance text-left text-slate-600 dark:text-slate-300">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PipelineDiagram() {
  return (
    <figure className="pipeline-diagram bleed-wide my-10">
      <div className="rounded-md border border-black/20 bg-white px-4 py-6 dark:border-white/20 dark:bg-slate-950/40 sm:px-8 sm:py-8">
        {/* One-sentence summary read before the detailed boxes below — an
            orientation cue, not a replacement for them. The stage titles,
            facet chips and evidence labels that follow are real content,
            not decoration, so they stay in the accessibility tree; only
            the connecting arrows and rail lines (each already marked
            individually) are hidden from it. */}
        <p className="sr-only">
          Diagram: guidelines pass through an applicability filter, into
          evidence capture split three ways across a DOM query, a Puppeteer
          screenshot and Lighthouse, converge into one structured prompt per
          page, and return a structured verdict per rule.
        </p>

        <div
          role="group"
          aria-label="Evidence-routing pipeline, five stages"
          /* gap-1, not the cards' old gap-3: the connector's own line now
             does the job that empty flex gap used to, reaching to within a
             couple of pixels of each card. A small gap still keeps card
             borders from touching the connector's bounding box directly,
             but nothing here is dead space anymore. */
          className="flex flex-col items-stretch gap-1 xl:flex-row xl:items-stretch xl:gap-1"
        >
          <StageCard stage={STAGES.guidelines} />
          <Connector />
          {/* The filter's four facets — the same "Page / Component /
              Context / Platform" row from the schema table above, as the
              site's documented keypoint-chip style rather than a second
              bordered box. */}
          <StageCard stage={STAGES.filter} chips={FACETS} />
          <Connector />
          <EvidenceCard />
          <Connector />
          <StageCard stage={STAGES.prompt} />
          <Connector />
          <StageCard stage={STAGES.verdicts} />
        </div>
      </div>
      <figcaption className="text-caption mt-3 text-center text-slate-500 dark:text-slate-400">
        The route from a raw guideline to a structured verdict — nothing
        here is a guess once a rule declares its own evidence.
      </figcaption>
    </figure>
  );
}
