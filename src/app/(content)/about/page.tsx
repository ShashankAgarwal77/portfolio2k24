import React from "react";
import Image from "next/image";

import { BentoGridComp } from "@/app/components/uiFrontend/bento-grid";
import { GridBackground } from "@/app/components/uiFrontend/gridBackground";
import { TextGenerateSection } from "@/app/components/uiFrontend/text-generate-section";

import ProfileImage from '@/app/Assets/Images/photography.png';
import { InfiniteMovingCardsDemo } from "@/app/components/uiFrontend/infinite-moving-card";

export default function About() {
  return (
    <main className="flex flex-col overflow-hidden">

      <div className="flex flex-col h-screen">
        <GridBackground />
        <div className="absolute h-screen flex items-center justify-center md:mx-10 lg:mx-40 z-10">
          <TextGenerateSection />
        </div>
      </div>

      <div className="flex flex-col justify-center items-center sm:gap-y-2 md:gap-y-4 lg:gap-y-6 md:mx-10 lg:mx-40 my-20">
        <div className="flex flex-col gap-y-4">
          <h2 className="text-2xl text-center tracking-wide uppercase leading-6 lg:leading-12 lg:text-4xl bg-gradient-to-br from-slate-300 to-slate-500 inline-block text-transparent bg-clip-text">About me in</h2>
          <h2 className="text-4xl text-center tracking-wide uppercase leading-6 lg:leading-12 lg:text-6xl bg-gradient-to-br from-slate-300 to-slate-500 inline-block text-transparent rounded-md bg-clip-text p-4 border-2 border-slate-600">Bento Grid</h2>
        </div>
        <div className="mx-4 mb-4 md:mx-auto lg:mx-auto sm:mx-4 sm:mb-4 mt-8"> {/* Added margin-top class for space */}
          <BentoGridComp />
        </div>
      </div>

      <div className="py-6 mx-40">
        <br />
        <hr className="h-px bg-slate-200 border-0 dark:bg-slate-700" />
        <br />
      </div>

      <div className="flex flex-col gap-y-12 mx-40">

        <div className="flex flex-row justify-content items-center gap-x-4">
          <div className="w-3 h-3 rounded-md bg-white shadow-lg shadow-white invert dark:invert-0"></div>
          <h4 className="uppercase text-xl font-bold tracking-wide leading-6 lg:leading-12 lg:text-xl bg-gradient-to-br from-slate-300 to-slate-500 inline-block text-transparent bg-clip-text">Experience</h4>
        </div>

        <div className="grid grid-cols-2 gap-y-12">
          <h4 className="text-2xl font-bold tracking-wide leading-6 lg:leading-12 lg:text-4xl bg-gradient-to-br from-slate-300 to-slate-500 inline-block text-transparent bg-clip-text">Orocorp</h4>
          <div className="flex flex-col gap-y-4">
            <div className="gap-y-2">
              <h6 className="md:text-xl lg:text-2xl text-white font-regular tracking-wide ">Product Designer</h6>
              <p className="text-xl text-slate-600"> 01/22 - 10/23</p>
            </div>
            <p className="text-xl text-slate-400 tracking-wide"> I've redefined the experience of Oro's core products.</p>
          </div>

          <h4 className="text-2xl font-bold tracking-wide leading-6 lg:leading-12 lg:text-4xl bg-gradient-to-br from-slate-300 to-slate-500 inline-block text-transparent bg-clip-text">Cogoport</h4>
          <div className="flex flex-col gap-y-4">
            <div className="gap-y-2">
              <h6 className="md:text-xl lg:text-2xl text-white font-regular tracking-wide ">Product Designer</h6>
              <p className="text-xl text-slate-600"> 10/21 - 01/22</p>
            </div>
            <p className="text-xl text-slate-400 tracking-wide"> I've designed the main lead management system for sales, marketing and finance people.</p>
          </div>

          <h4 className="text-2xl font-bold tracking-wide leading-6 lg:leading-12 lg:text-4xl bg-gradient-to-br from-slate-300 to-slate-500 inline-block text-transparent bg-clip-text">Facebook SOI India</h4>
          <div className="flex flex-col gap-y-4">
            <div className="gap-y-2">
              <h6 className="md:text-xl lg:text-2xl text-white font-regular tracking-wide ">AR Designer & Developer</h6>
              <p className="text-xl text-slate-600"> 03/20 - 06/20</p>
            </div>
            <p className="text-xl text-slate-400 tracking-wide"> Worked on building AR Solution for Retail theme with Chumbak as Theme Partner</p>
          </div>


        </div>


      </div>

      <div className="py-6 mx-40">
        <br />
        <hr className="h-px bg-slate-200 border-0 dark:bg-slate-700" />
        <br />
      </div>



      <div className="flex flex-col justify-center items-center sm:gap-y-4 md:gap-y-8 lg:gap-y-16 md:mx-10 lg:mx-60 my-20">
        <div className="flex flex-col gap-y-4">
          <h2 className="text-3xl text-center tracking-wide leading-6 lg:leading-12 lg:text-5xl bg-gradient-to-br from-slate-300 to-slate-500 inline-block text-transparent bg-clip-text">Here's what my friends & colleagues say about me</h2>

          <InfiniteMovingCardsDemo />

        </div>


      </div>
    </main>
  );
}
