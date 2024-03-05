// about.tsx
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
        <div className="absolute h-screen flex items-center mx-40 z-10">
          <TextGenerateSection />
        </div>
      </div>

      <div className="flex flex-col h-screen mx-60 gap-y-12 justify-center items-left">
        <div className="">
          <h2 className="text-6xl bg-gradient-to-br from-slate-300 to-slate-500 inline-block text-transparent bg-clip-text">about me in <span className="p-2 rounded-md border-2 border-slate-600">Bento Grid</span></h2>
        </div>
        <BentoGridComp />
      </div>
    </main>
  );
}
