import type { Metadata } from "next";
import BCASThumb from "../../../../../public/bcas_thumbnail.png";
import {
  BigNumber,
  Cards,
  Chapter,
  DetailZoom,
  FillText,
  Openable,
  ParallaxShot,
  RankLadder,
  Shimmer,
  Split,
  StatBand,
  StickySteps,
  StoryHero,
  StoryProgress,
} from "@/app/components/Story";
import { WallOfLove } from "@/app/components/WallOfLove";
import { SectionIndex } from "@/app/components/SectionIndex";

/* The BCAS case study as a scroll story (components/Story). The long-form
   article it replaced is kept in _unused-archive/bcas-article/page.mdx. */

export const metadata: Metadata = {
  title: "India's aviation security compliance, on one traceable platform",
  description:
    "eBCAS 2.0: one platform where a national aviation security regulator and the airlines, airports and ground handlers it oversees review compliance together, with every action traced.",
};

const INDEX = [
  { id: "problem", label: "The problem" },
  { id: "research", label: "Research" },
  { id: "brief", label: "The brief" },
  { id: "variants", label: "Variants" },
  { id: "review", label: "The review" },
  { id: "ladder", label: "The ladder" },
  { id: "traceability", label: "Traceability" },
  { id: "amendments", label: "Amendments" },
  { id: "system", label: "The system" },
  { id: "wrong-call", label: "Wrong call" },
  { id: "outcome", label: "Outcome" },
];

const WALL_OF_LOVE = [
  { src: "/case-study/bcas/wall-of-love/01-ba-kudos.png", alt: "Written appreciation from the business analyst on the eBCAS 2.0 team.", word: "Kudos" },
  { src: "/case-study/bcas/wall-of-love/02-workshop-presenting.png", alt: "Presenting the AI-assisted design workflow to the wider design team in a training workshop.", word: "Teaching" },
  { src: "/case-study/bcas/wall-of-love/03-workshop-group.png", alt: "The design team during the workshop on building production-ready prototypes.", word: "Together" },
  { src: "/case-study/bcas/wall-of-love/04-pm-appreciation.png", alt: "Written appreciation from the product manager on the eBCAS 2.0 team.", word: "Gratitude" },
  { src: "/case-study/bcas/wall-of-love/05-field-research-lucknow.png", alt: "Field research conducted in Lucknow as part of the eBCAS 2.0 initiative.", word: "Fieldwork" },
];

export default function BCASCaseStudy() {
  return (
    <main className="overflow-x-clip">
      <StoryProgress />
      <SectionIndex items={INDEX} variant="story" />

      <StoryHero
        backdrop={BCASThumb}
        eyebrow="eBCAS 2.0 · National civil aviation security"
        title={
          <>
            India&apos;s aviation security compliance, on one{" "}
            <Shimmer className="fontGloock font-normal italic">traceable</Shimmer> platform
          </>
        }
        lede="The regulator and every airline, airport and ground handler it oversees, working on the same record."
        meta="Senior Designer · Design lead, team of four · 2026, ongoing"
      />

      <StatBand
        stats={[
          { value: "164", label: "airports" },
          { value: "18", label: "entity categories" },
          { value: "5", label: "modules" },
          { value: "487", label: "screens" },
          { value: "6", label: "weeks to pitch" },
          { value: "0", label: "engineers" },
        ]}
      />

      <FillText id="problem" eyebrow="The problem" text="Nobody could trace who did what, on either side." />

      <Chapter id="research" eyebrow="Field research · Lucknow airport" title="Every friction had one shape: a loop.">
        <Split
          visual={
            <DetailZoom
              src="/case-study/bcas/wall-of-love/05-field-research-lucknow.png"
              alt="Field research at Lucknow airport with regulator staff."
              aspect="aspect-[3/2]"
              position="object-left"
            />
          }
        >
          <Cards
            columns={2}
            items={[
              { label: "Assessment", title: "106 questions" },
              { label: "Turnaround", title: "None defined" },
              { label: "Rounds", title: "No limit" },
              { label: "History", title: "Rebuilt by hand" },
            ]}
          />
        </Split>
      </Chapter>

      <FillText id="brief" tone="dark" eyebrow="The brief" text="One shared workspace. Every action leaves a trace." />

      <Chapter id="variants" eyebrow="Explored with AI, chosen by hand" title="Three variants. One shipped first.">
        <Cards
          items={[
            { label: "Variant A", title: "Notes on each clause", body: "Open points scatter." },
            { label: "Variant B", title: "Side by side", body: "Too wide for laptops." },
            { label: "Variant C", title: "A docked workspace", body: "Everything open, in one place.", highlight: "Shipped first" },
          ]}
        />
        <div className="mt-20">
          <Openable>
            <ParallaxShot
              src="/case-study/bcas/observations-stage.webp"
              alt="The shipped Observations stage of eBCAS 2.0, with observations listed on the left, one expanded to show its finding, directed action, declared value and regulatory provision, and the conversation on the right."
              width={1854}
              height={1035}
              caption="Variant C, as shipped."
            />
          </Openable>
        </div>
      </Chapter>

      <Chapter
        id="review"
        tone="dark"
        eyebrow="Then the comment moved onto the field"
        title={
          <>
            The form became <Shimmer>the review.</Shimmer>
          </>
        }
      >
        <Openable>
          <StickySteps
            steps={[
              {
                eyebrow: "Pin",
                title: "Comment on the value itself.",
                body: "Any field or file takes a pin, like Figma.",
                src: "/case-study/bcas/jd-comment-review.webp",
                alt: "The Joint Director's comment review, with pins on two fields and the comment panel listing both comments as approved.",
              },
              {
                eyebrow: "Correct",
                title: "The entity fixes only what was pinned.",
                body: "Signed once per round with Aadhaar.",
                src: "/case-study/bcas/entity-correction.webp",
                alt: "The entity's correction view, with the two pinned fields editable and comments from BCAS HQ marked Open.",
              },
              {
                eyebrow: "Accept",
                title: "Old to new, beside the reply.",
                body: "Accept it, or re-raise it.",
                src: "/case-study/bcas/jd-rereview.webp",
                alt: "The re-review screen, with the corrected value tagged Amended and the entity's reply under the original comment.",
              },
            ]}
          />
        </Openable>
      </Chapter>

      <Chapter
        id="ladder"
        eyebrow="The ladder"
        title="Up one level. Down to any."
        lede="The client's chain of command, built into the review. Two buttons per comment, never more."
      >
        <RankLadder ranks={["DG", "JDG", "DDG", "JD", "DD", "AD", "SASO · ASO · DASO"]} />
        <div className="mt-12">
          <Cards
            columns={4}
            items={[
              { label: "Yours, unsent", title: "Edit · Remove" },
              { label: "Someone else's", title: "Approve · Return" },
              { label: "Returned to you", title: "Approve · Replace" },
              { label: "After dispatch", title: "Accept · Re-raise" },
            ]}
          />
        </div>
      </Chapter>

      <Chapter id="traceability" tone="dark" eyebrow="Traceability" title={<>Every move <Shimmer>leaves a trace.</Shimmer></>}>
        <Split
          visual={
            <Openable>
              <DetailZoom
                tone="dark"
                aspect="aspect-[3/5]"
                src="/case-study/bcas/detail-log.webp"
                alt="The programme log: every approval, re-raise, reply and dispatch with its date, actor and note."
              />
            </Openable>
          }
        >
          <Cards
            tone="dark"
            columns={2}
            items={[
              { title: "Named", body: "Every status names its rank." },
              { title: "Permanent", body: "Nothing sent is deleted." },
              { title: "Logged", body: "Every move, with its note." },
              { title: "Signed", body: "Entity replies are attested." },
            ]}
          />
        </Split>
      </Chapter>

      <Chapter
        id="amendments"
        eyebrow="Amendments"
        title="No new screen. Same review."
        lede="An approved programme is amended on its own record, through the same comment review."
      >
        <Cards
          items={[
            { label: "01", title: "Pick the reasons", body: "They decide what opens." },
            { label: "02", title: "Edit only that", body: "Values, tables, annexures." },
            { label: "03", title: "The DDG decides", body: "Approve, or send back." },
          ]}
        />
      </Chapter>

      <Chapter id="system" eyebrow="How four designers held one system" title="One system. Four designers.">
        <Cards
          items={[
            { label: "/ai", title: "The context", body: "Users, flows, domain." },
            { label: "DESIGN.md", title: "The system", body: "Tokens and components." },
            { label: "AGENTS.md", title: "The rules", body: "What every session checks." },
          ]}
        />
      </Chapter>

      <Chapter id="wrong-call" eyebrow="The call I got wrong" title="Right tool for one module. Not for five.">
        <BigNumber value="14,500" label="AI credits on module one in Figma Make. We moved to Claude Code mid-flight." />
      </Chapter>

      <Chapter id="outcome" tone="dark" eyebrow="Outcome" title={<>We <Shimmer>won the pitch.</Shimmer></>}>
        <Cards
          tone="dark"
          items={[
            { label: "Handover", title: "Engineers inherited the frontend." },
            { label: "Honest", title: "No usage data yet." },
            { label: "Still open", title: "No way to contest a comment." },
          ]}
        />
      </Chapter>

      <section className="pb-24 md:pb-32">
        <WallOfLove items={WALL_OF_LOVE} />
        <p className="mx-auto mt-24 max-w-2xl px-6 text-center text-body text-slate-700 dark:text-slate-300">
          <a
            href="https://www.linkedin.com/in/shashank-agarwal11/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-900 underline decoration-slate-400/60 underline-offset-4 hover:decoration-slate-900 dark:text-slate-100 dark:hover:decoration-slate-100"
          >
            Talk to me on LinkedIn
          </a>
        </p>
      </section>
    </main>
  );
}
