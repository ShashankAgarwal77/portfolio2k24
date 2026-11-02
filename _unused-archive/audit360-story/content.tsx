import Audit360Thumb from "../../../../../public/audit360_thumbnail.png";
import {
  BigNumber,
  Cards,
  Chapter,
  FillText,
  Openable,
  ParallaxShot,
  Shimmer,
  StatBand,
  StickySteps,
  StoryHero,
  StoryProgress,
} from "@/app/components/Story";
import { PipelineDiagram } from "@/app/components/PipelineDiagram";
import { SheetRow } from "@/app/components/SheetRow";
import { TC001_FIELDS } from "@/app/components/SheetRow/tc001";

/* The Audit360 case study as a scroll story (components/Story). The
   long-form article it replaced is kept in
   _unused-archive/audit360-article/content.mdx. Screens are from the v1
   UI file (April 2025) and carry its mock data. */

export default function Audit360Story() {
  return (
    <main className="overflow-x-clip">
      <StoryProgress />

      <StoryHero
        backdrop={Audit360Thumb}
        eyebrow="Audit360 · UX4G · NeGD"
        title={
          <>
            I rewrote a national UX standard so a{" "}
            <Shimmer className="fontGloock font-normal italic">machine could read it</Shimmer>
          </>
        }
        lede="The AI audit platform India's government uses to check its websites against UX4G, GIGW and Lighthouse."
        meta="Product Manager and Product Designer · Team of four · Feb 2025 – Mar 2026, in production"
      />

      <StatBand
        stats={[
          { value: "60,000", label: "government websites" },
          { value: "411", label: "guidelines, from 480" },
          { value: "63", label: "% machine-evaluable, from 21" },
          { value: "5,463", label: "websites audited" },
          { value: "5", label: "minutes an audit, from 7 days" },
          { value: "4", label: "people" },
        ]}
      />

      <FillText
        eyebrow="Where it started"
        text="India runs 60,000 government websites. In 2025, none had been systematically audited for usability."
      />

      <Chapter eyebrow="The arithmetic" title="Audit harder was never the answer.">
        <BigNumber
          value="1,100"
          label="years for one auditor at seven days a site. NeGD's CEO approved a system in that conversation."
        />
      </Chapter>

      <Chapter
        tone="dark"
        eyebrow="The real problem"
        title={
          <>
            Not speed. The standard <span className="text-white/40">couldn&apos;t be measured.</span>
          </>
        }
      >
        <Cards
          tone="dark"
          items={[
            { label: "One request", title: "“Your website is hosted on a secure server.”" },
            { label: "Needs a definition", title: "“Text on the homepage is concise.”" },
            { label: "Pure judgement", title: "“The relationship between controls and actions is clear.”" },
          ]}
        />
        <p className="mt-10 max-w-2xl text-body text-white/60">Nothing in the document told these apart.</p>
      </Chapter>

      <Chapter
        eyebrow="The standard was the product"
        title="480 sentences. One 22-field schema."
        lede="Evidence, evaluator, page, pass and fail examples, who fixes it. Every field answers a question the pipeline would otherwise guess."
      >
        <div className="mx-auto max-w-4xl">
          <SheetRow
            url="docs.google.com/guideline_mastersheet_v3"
            file="guideline_mastersheet_v3"
            meta="411 guidelines · 22 fields"
            rowLabel="TC-001"
            tab="UX4G v3.0.0"
            status="1 guideline shown · all 22 fields"
            fields={TC001_FIELDS}
            caption="One guideline, all 22 fields."
          />
        </div>
        <div className="mt-16">
          <Cards
            items={[
              { label: "Guidelines", title: "480 → 411", body: "Duplicates collapsed." },
              { label: "Machine-evaluable", title: "21% → 63%", body: "100 rules became 260." },
              { label: "From a better model", title: "None of it.", body: "It came from rewriting the input." },
            ]}
          />
        </div>
      </Chapter>

      <FillText tone="dark" text="A guideline stopped being a sentence and became a routable object." />

      <Chapter
        eyebrow="The machine that reads it"
        title="Each rule declares its evidence. The pipeline routes it."
      >
        <PipelineDiagram />
        <div className="mt-16">
          <Cards
            items={[
              { label: "Input", title: "Seven URLs, not a crawler", body: "No naming convention, blocked crawlers, no permission for volume." },
              { label: "Evaluation", title: "One call per page", body: "Every applicable rule, one structured verdict each." },
              { label: "Fallback", title: "Screenshots", body: "When the DOM fails, a rule degrades instead of vanishing." },
            ]}
          />
        </div>
      </Chapter>

      <Chapter
        tone="dark"
        eyebrow="The product"
        title={
          <>
            Five minutes, <Shimmer>designed.</Shimmer>
          </>
        }
      >
        <Openable>
          <StickySteps
            steps={[
              {
                eyebrow: "Enter",
                title: "Seven pages, homepage first.",
                body: "A human picks the pages. Accuracy no classifier would give us.",
                src: "/case-study/audit360/enter-urls.webp",
                alt: "The Enter Page URLs step: fields for About us, Services, Contact us, FAQs, Sign up and other links.",
              },
              {
                eyebrow: "Wait",
                title: "Progress you can read.",
                body: "Each check named as it runs, and a UX fact while you wait.",
                src: "/case-study/audit360/wait.webp",
                alt: "The audit in progress: the site's thumbnail beside four named checks, the first at 40%, and a Did you know card below.",
              },
              {
                eyebrow: "Read",
                title: "Scores by page, not one verdict.",
                body: "UX4G, GIGW, performance, accessibility, SEO, best practices.",
                src: "/case-study/audit360/report.webp",
                alt: "The audit report: the audited site's homepage, an overall score of 93% and six category scores.",
              },
              {
                eyebrow: "Compare",
                title: "Every audit against the last.",
                body: "That comparison turns a report into a loop.",
                src: "/case-study/audit360/report-history.webp",
                alt: "History and comparison: paired bars for the latest and previous audit across seven categories.",
              },
            ]}
          />
        </Openable>
        <p className="mt-12 text-caption text-white/40">v1 designs, with their mock data.</p>
      </Chapter>

      <Chapter
        eyebrow="Scoring inside a government"
        title="Every number is a political decision."
      >
        <Cards
          items={[
            { label: "The split", title: "50 · 25 · 25", body: "UX4G, GIGW, Lighthouse. Our own standard weighted highest." },
            { label: "No site score", title: "Per page, per audit", body: "Four pages and seven aren't the same test." },
            { label: "Leaderboard", title: "Homepages only", body: "The one page every site has." },
          ]}
        />
        <div className="mt-20">
          <Openable>
            <ParallaxShot
              src="/case-study/audit360/dashboard.webp"
              alt="The Automated Audits dashboard: two audited sites, each with an overall score ring and six category scores against the last audit."
              width={2400}
              height={1800}
              caption="Every audited site, with its trend against the last run."
            />
          </Openable>
        </div>
      </Chapter>

      <Chapter
        tone="dark"
        eyebrow="Auditing my own work"
        title={
          <>
            A year in, <Shimmer>my own corpus failed.</Shimmer>
          </>
        }
      >
        <BigNumber
          tone="dark"
          value="156"
          label="distinct values in the page field. The product accepts 7."
        />
        <div className="mt-16">
          <Cards
            tone="dark"
            columns={4}
            items={[
              { label: "Found", title: "Clustered drift", body: "7 of 32 categories, all AI-populated." },
              { label: "Cost", title: "182 rules unreachable", body: "Addressed to pages nobody can submit." },
              { label: "Fixed", title: "405 rows normalised", body: "Severity 5 → 3. AI Support 14 → 5." },
              { label: "Gated", title: "Locked vocabularies", body: "Nobody can invent a sixth severity." },
            ]}
          />
        </div>
      </Chapter>

      <Chapter eyebrow="Outcome" title={<>Shipped August 2025. <span className="text-slate-400 dark:text-slate-500">Still running.</span></>}>
        <BigNumber value="5,463" label="government websites audited in twelve months, by a team of four." />
        <div className="mt-16">
          <Cards
            items={[
              { label: "Throughput", title: "21–26 team-years", body: "Of manual audits, in one year." },
              { label: "Honest", title: "No accuracy baseline", body: "Never measured against a human audit." },
              { label: "Still open", title: "No dispute path", body: "A ministry can't flag a false positive." },
            ]}
          />
        </div>
      </Chapter>

      <section className="pb-24 md:pb-32">
        <p className="mx-auto max-w-2xl px-6 text-center text-body text-slate-700 dark:text-slate-300">
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
