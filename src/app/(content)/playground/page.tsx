import type { Metadata } from "next";
import { Reveal } from "@/app/components/Reveal";
import { ExplorationCard, ComingSoonCard } from "@/app/components/Playground/ExplorationCard";
import { explorations } from "./explorations";

export const metadata: Metadata = {
  title: "Playground · Shashank Agarwal",
  description: "Vibe-coded design explorations: sketches in code, built to be poked at.",
};

export default function PlaygroundPage() {
  return (
    <Reveal
      as="main"
      className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pb-32 pt-16 md:px-8 md:pt-24"
    >
      <header className="flex flex-col gap-4">
        <div className="flex flex-row items-center gap-x-4">
          <div className="h-3 w-3 rounded-md bg-slate-500 shadow-lg shadow-white"></div>
          <h4 className="inline-block bg-gradient-to-br from-slate-500 to-slate-700 bg-clip-text text-label font-semibold uppercase text-transparent dark:from-slate-300 dark:to-slate-500">
            Playground
          </h4>
        </div>
        <h1 className="inline-block bg-gradient-to-br from-slate-500 to-slate-700 bg-clip-text py-2 text-headline font-semibold text-transparent text-balance dark:from-slate-300 dark:to-slate-500">
          sketches in code, <br className="hidden md:block" />
          built to be <span className="fontGloock italic">poked</span> at.
        </h1>
        <p className="max-w-xl text-body text-slate-500 dark:text-slate-400">
          Vibe-coded design explorations: small worlds I build to learn how something moves,
          renders or feels. Every one is live, so play with it.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {explorations.map((e) => (
          <ExplorationCard key={e.slug} exploration={e} />
        ))}
        <ComingSoonCard />
      </section>
    </Reveal>
  );
}
