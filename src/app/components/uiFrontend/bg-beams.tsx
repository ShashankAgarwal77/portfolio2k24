"use client";
import React from "react";
import { BackgroundBeams } from "../Animations/bg-beams-source-code";

export function BackgroundBeamsAnimation() {
  return (
    <div className="h-[40rem] w-full rounded-md absolute flex flex-col items-center justify-center antialiased">
        
      <BackgroundBeams />
    </div>
  );
}
