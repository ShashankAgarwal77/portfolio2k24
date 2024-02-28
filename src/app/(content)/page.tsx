import React from "react";
import { CardComp } from "../components/uiFrontend/oro-card";
import HeroSection from "../components/uiFrontend/hero";

export default function Home() {
    return (
      <main className="flex flex-col items-center justify-between">
        
        <div>
            <HeroSection />
        </div>
      </main>
    );
  }