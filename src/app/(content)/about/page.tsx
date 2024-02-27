// page.tsx

import { BackgroundBeamsDemo } from "@/app/components/Animations/background-beamsAnimation";
import { GridBackground } from "@/app/components/uiFrontend/gridBackground";
import { QuickKnowMe } from "@/app/components/uiFrontend/quick-about-me";
import { TextGenerateSection } from "@/app/components/uiFrontend/text-generate-section";
import React from "react";
// import { CardComp } from "../components/uiFrontend/card";

export default function About() {
  return (
    <main className="relative flex flex-col justify-center overflow-hidden">
      <GridBackground /> {/* Render GridBackground component here */}
      <div className="z-10 sm:mx-16 md:mx-20 lg:mx-60 absolute"> {/* Make sure the parent container has position relative */}
        <div style={{ zIndex: 10 }}> {/* Apply inline styles */}
          <TextGenerateSection />
        </div>
      </div>

      {/* Other content */}
    </main>
  );
}
