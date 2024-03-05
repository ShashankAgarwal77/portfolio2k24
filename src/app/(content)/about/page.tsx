import React from "react";
import Image from "next/image";

import { BentoGridComp } from "@/app/components/uiFrontend/bento-grid";
import { GridBackground } from "@/app/components/uiFrontend/gridBackground";
import { TextGenerateSection } from "@/app/components/uiFrontend/text-generate-section";

import ProfileImage from '@/app/Assets/Images/photography.png';

export default function About() {
  return (
    <main className="flex flex-col overflow-hidden">

      <div className="flex flex-col h-screen">
        <GridBackground />
        <div className="absolute h-screen flex items-center justify-center md:mx-10 lg:mx-40 z-10">
          <TextGenerateSection />
        </div>
      </div>

      <div className="flex flex-col justify-center items-center sm:gap-y-4 md:gap-y-8 lg:gap-y-16 md:mx-10 lg:mx-40 my-20">
        <div className="flex flex-col gap-y-4">
          <h2 className="text-2xl text-center tracking-wide uppercase leading-6 lg:leading-12 lg:text-4xl bg-gradient-to-br from-slate-300 to-slate-500 inline-block text-transparent bg-clip-text">About me in</h2>
          <h2 className="text-4xl text-center tracking-wide uppercase leading-6 lg:leading-12 lg:text-6xl bg-gradient-to-br from-slate-300 to-slate-500 inline-block text-transparent rounded-md bg-clip-text p-4 border-2 border-slate-600">Bento Grid</h2>
        </div>
        <div className="mx-4 mb-4 md:mx-auto lg:mx-auto sm:mx-4 sm:mb-4 mt-8"> {/* Added margin-top class for space */}
          <BentoGridComp />
        </div>
      </div>
    </main>
  );
}
