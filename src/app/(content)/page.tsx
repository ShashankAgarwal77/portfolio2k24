import React from "react";
import { CardComp } from "../components/uiFrontend/card";
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