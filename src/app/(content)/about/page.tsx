import React from "react";

import { BentoGridComp } from "@/app/components/uiFrontend/bento-grid";
import { GridBackground } from "@/app/components/uiFrontend/gridBackground";
import { TextGenerateSection } from "@/app/components/uiFrontend/text-generate-section";

import { InfiniteMovingCardsDemo } from "@/app/components/uiFrontend/infinite-moving-card";
import { StickyScrollRevealDemo } from "@/app/components/uiFrontend/sticky-scroll";

const experiences = [
  {
    company: "Netoyed",
    role: "Senior Product Designer",
    period: "02/25 - Present",
    summary: "Working on multiple Indian Government projects.",
    current: true,
  },
  {
    company: "Zemoso Labs",
    role: "UX Designer II",
    period: "05/24 - 01/25",
    summary: "Worked on cybersecurity and ecommerce platforms.",
  },
  {
    company: "Orocorp",
    role: "Product Designer",
    period: "01/22 - 10/23",
    summary: "Redefined the experience of Oro's core products.",
  },
  {
    company: "Cogoport",
    role: "Product Designer",
    period: "10/21 - 01/22",
    summary: "Designed the lead-management system for sales, marketing, and finance teams.",
  },
  {
    company: "Facebook SOI India",
    role: "AR Designer & Developer",
    period: "03/20 - 06/20",
    summary: "Built an AR retail solution with Chumbak as theme partner.",
  },
];

export default function About() {
  return (
    <main className="flex flex-col overflow-hidden">

      <div className="flex flex-col h-screen">
        <GridBackground />
        <div className="absolute h-screen flex flex-col justify-center items-left mx-5 lg:mx-40 z-10" data-aos="fade-up">
          <div className="flex flex-row justify-content items-center gap-x-4">
            <div className="w-3 h-3 rounded-md bg-slate-500 shadow-lg shadow-white"></div>
            <h4 className="uppercase text-md lg:text-xl font-medium tracking-wide leading-6 lg:leading-12 lg:text-xl bg-gradient-to-br from-slate-500 to-slate-700 dark:bg-gradient-to-br dark:from-slate-300 dark:to-slate-500 inline-block text-transparent bg-clip-text">About Me</h4>
          </div>
          <TextGenerateSection />
        </div>
      </div>

      <div className="flex flex-col mx-5 my-10 lg:m-40 lg:gap-y-12" data-aos="fade-up">
        <h2 className="bg-gradient-to-br from-slate-500 to-slate-700 dark:bg-gradient-to-br dark:from-slate-300 dark:to-slate-500 py-2 inline-block text-transparent bg-clip-text text-[clamp(1.75rem,4vw,3rem)] leading-[1.15] tracking-wide text-balance">This is my story — <br /> how an engineer became a designer.</h2>
        <StickyScrollRevealDemo />
      </div>

      <div className="flex flex-col justify-center items-center sm:gap-y-2 md:gap-y-4 lg:gap-y-6 md:mx-10 lg:mx-40 my-20" data-aos="fade-up">
        <div className="flex flex-col items-center gap-y-3">
          <h2 className="text-[clamp(1.875rem,3.5vw,2.75rem)] text-center font-bold leading-[1.15] tracking-wide text-balance bg-gradient-to-br from-slate-500 to-slate-700 dark:bg-gradient-to-br dark:from-slate-300 dark:to-slate-500 inline-block text-transparent bg-clip-text py-2">what makes me <span className="fontGloock italic">tick</span></h2>
          <p className="text-base lg:text-lg text-slate-500 dark:text-slate-400 text-center text-balance">the bits that shape how I think, design, and build.</p>
        </div>
        <div className="mx-4 mb-4 md:mx-auto lg:mx-auto sm:mx-4 sm:mb-4 mt-8"> {/* Added margin-top class for space */}
          <BentoGridComp />
        </div>
      </div>

      <div className="flex flex-col gap-y-8 mx-4 md:mx-40 my-12 lg:my-16" data-aos="fade-up">

        <div className="flex flex-row items-center gap-x-4">
          <div className="w-3 h-3 rounded-md bg-slate-400 shadow-lg shadow-white"></div>
          <h4 className="uppercase text-xl font-bold tracking-wide leading-6 lg:leading-12 lg:text-xl bg-gradient-to-br from-slate-500 to-slate-700 dark:bg-gradient-to-br dark:from-slate-300 dark:to-slate-500 inline-block text-transparent bg-clip-text">Experience</h4>
        </div>

        <ol className="relative ml-1.5 flex flex-col">
          <span
            aria-hidden
            className="absolute left-0 top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-800"
          />
          {experiences.map((exp) => (
            <li key={exp.company} className="relative pl-8 pb-8 last:pb-0">
              <span className="absolute left-0 top-1.5 -translate-x-1/2 flex items-center justify-center">
                {exp.current ? (
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-60 animate-ping" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-slate-500 dark:bg-slate-200" />
                  </span>
                ) : (
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                )}
              </span>

              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h4 className="text-lg lg:text-xl font-bold tracking-wide bg-gradient-to-br from-slate-500 to-slate-700 dark:from-slate-300 dark:to-slate-500 inline-block text-transparent bg-clip-text">
                  {exp.company}
                </h4>
                <p className="text-sm text-slate-400 tabular-nums shrink-0">{exp.period}</p>
              </div>
              <h6 className="text-sm lg:text-base text-slate-500 dark:text-white tracking-wide mt-0.5">{exp.role}</h6>
              <p className="text-sm text-slate-400 tracking-wide mt-1 max-w-xl">{exp.summary}</p>
            </li>
          ))}
        </ol>

      </div>


      <div className="flex flex-col justify-center items-center sm:gap-y-4 md:gap-y-8 lg:gap-y-16 md:mx-10 lg:mx-60 my-20" data-aos="fade-up">
        <div className="flex flex-col gap-y-4 mx-2">
          <h2 className="text-[clamp(1.875rem,3.5vw,2.75rem)] text-center leading-[1.15] tracking-wide bg-gradient-to-br from-slate-500 to-slate-700 dark:bg-gradient-to-br dark:from-slate-300 dark:to-slate-500 inline-block text-transparent bg-clip-text py-2 font-semibold text-balance">Here's what my friends & colleagues say about me</h2>


          <InfiniteMovingCardsDemo />

        </div>


      </div>
    </main>
  );
}
