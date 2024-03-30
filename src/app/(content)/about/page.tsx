import React from "react";
import Image from "next/image";

import { BentoGridComp } from "@/app/components/uiFrontend/bento-grid";
import { GridBackground } from "@/app/components/uiFrontend/gridBackground";
import { TextGenerateSection } from "@/app/components/uiFrontend/text-generate-section";

import ProfileImage from '@/app/Assets/Images/photography.png';
import { InfiniteMovingCardsDemo } from "@/app/components/uiFrontend/infinite-moving-card";
import { StickyScrollRevealDemo } from "@/app/components/uiFrontend/sticky-scroll";
import { IconItalic } from "@tabler/icons-react";

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
        <h2 className="bg-gradient-to-br from-slate-500 to-slate-700 dark:bg-gradient-to-br dark:from-slate-300 dark:to-slate-500 py-2 inline-block text-transparent bg-clip-text text-3xl lg:text-6xl tracking-wide">This is my story — <br /> alongside some flicks from my recent trip to Himachal Pradesh.</h2>
        <StickyScrollRevealDemo />
      </div>

      <div className="flex flex-col justify-center items-center sm:gap-y-2 md:gap-y-4 lg:gap-y-6 md:mx-10 lg:mx-40 my-20" data-aos="fade-up">
        <div className="flex flex-col gap-y-4">
          <h2 className="text-2xl text-center tracking-wide leading-6 lg:leading-12 lg:text-4xl bg-gradient-to-br from-slate-500 to-slate-700 dark:bg-gradient-to-br dark:from-slate-300 dark:to-slate-500 inline-block text-transparent bg-clip-text px-4">This is About me <span className="italic fontGloock lowercase font-bold pr-2">formally</span> in </h2>
          <h2 className="text-4xl text-center tracking-wide uppercase leading-6 lg:leading-12 lg:text-6xl bg-gradient-to-br from-slate-500 to-slate-700 dark:bg-gradient-to-br dark:from-slate-300 dark:to-slate-500 to-slate-500 inline-block text-transparent rounded-md bg-clip-text p-4 border-2 border-slate-400 dark:border-slate-600">Bento Grid</h2>
        </div>
        <div className="mx-4 mb-4 md:mx-auto lg:mx-auto sm:mx-4 sm:mb-4 mt-8"> {/* Added margin-top class for space */}
          <BentoGridComp />
        </div>
      </div>

      <div className="py-6 mx-4 md:mx-40" data-aos="fade-up">
        <br />
        <hr className="h-px bg-slate-300 border-0 dark:bg-slate-700" />
        <br />
      </div>

      <div className="flex flex-col gap-y-8 mx-4 md:mx-40" data-aos="fade-up">

        <div className="flex flex-row items-center gap-x-4">
          <div className="w-3 h-3 rounded-md bg-slate-400 shadow-lg shadow-white"></div>
          <h4 className="uppercase text-xl font-bold tracking-wide leading-6 lg:leading-12 lg:text-xl bg-gradient-to-br from-slate-500 to-slate-700 dark:bg-gradient-to-br dark:from-slate-300 dark:to-slate-500 inline-block text-transparent bg-clip-text">Experience</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8">
          <div className="flex flex-col gap-y-4">
            <h4 className="text-2xl font-bold tracking-wide leading-6 lg:leading-12 lg:text-4xl bg-gradient-to-br from-slate-500 to-slate-700 dark:bg-gradient-to-br dark:from-slate-300 dark:to-slate-500 inline-block text-transparent bg-clip-text py-2">Orocorp</h4>
            <div className="gap-y-2">
              <h6 className="md:text-xl lg:text-2xl text-slate-500 dark:text-white font-regular tracking-wide">Product Designer</h6>
              <p className="text-xl text-slate-400">01/22 - 10/23</p>
            </div>
            <p className="text-xl text-slate-400 tracking-wide">I've redefined the experience of Oro's core products.</p>
          </div>

          <div className="flex flex-col gap-y-4">
            <h4 className="text-2xl py-2 font-bold tracking-wide leading-6 lg:leading-12 lg:text-4xl bg-gradient-to-br from-slate-500 to-slate-700 dark:bg-gradient-to-br dark:from-slate-300 dark:to-slate-500 inline-block text-transparent bg-clip-text">Cogoport</h4>
            <div className="gap-y-2">
              <h6 className="md:text-xl lg:text-2xl text-slate-500 dark:text-white font-regular tracking-wide">Product Designer</h6>
              <p className="text-xl text-slate-400">10/21 - 01/22</p>
            </div>
            <p className="text-xl text-slate-400 tracking-wide">I've designed the main lead management system for sales, marketing, and finance people.</p>
          </div>

          <div className="flex flex-col gap-y-4">
            <h4 className="text-2xl font-bold tracking-wide leading-6 lg:leading-12 lg:text-4xl bg-gradient-to-br from-slate-500 to-slate-700 dark:bg-gradient-to-br dark:from-slate-300 dark:to-slate-500 inline-block text-transparent bg-clip-text py-2">Facebook SOI India</h4>
            <div className="gap-y-2">
              <h6 className="md:text-xl lg:text-2xl text-slate-500 dark:text-white font-regular tracking-wide">AR Designer & Developer</h6>
              <p className="text-xl text-slate-400">03/20 - 06/20</p>
            </div>
            <p className="text-xl text-slate-400 tracking-wide">Worked on building AR Solution for Retail theme with Chumbak as Theme Partner</p>
          </div>
        </div>

      </div>


      <div className="py-6 mx-4 md:mx-40" data-aos="fade-up">
        <br />
        <hr className="h-px bg-slate-300 border-0 dark:bg-slate-700" />
        <br />
      </div>



      <div className="flex flex-col justify-center items-center sm:gap-y-4 md:gap-y-8 lg:gap-y-16 md:mx-10 lg:mx-60 my-20" data-aos="fade-up">
        <div className="flex flex-col gap-y-4 mx-2">
          <h2 className="text-3xl text-center tracking-wide lg:text-5xl bg-gradient-to-br from-slate-500 to-slate-700 dark:bg-gradient-to-br dark:from-slate-300 dark:to-slate-500 inline-block text-transparent bg-clip-text md:text-4xl py-2 font-semibold">Here's what my friends & colleagues say about me</h2>


          <InfiniteMovingCardsDemo />

        </div>


      </div>
    </main>
  );
}
