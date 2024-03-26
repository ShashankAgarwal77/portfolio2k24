import React from "react";
import { BackgroundGradientAnimation } from "../Animations/bg-gradient-animation";
import { ImagesSliderDemo } from "./ui-parallex-showcase";
import { DribbbleShots } from "./dribbble-posts";

export function BackgroundGradientAnimationDemo() {
  return (
    <BackgroundGradientAnimation>
      <div className="absolute z-50 inset-0 flex flex-col gap-y-8 items-center justify-center text-white font-bold px-4 pointer-events-none text-xl text-center md:text-2xl lg:text-5xl">
        <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
        Some of my UI work I do in my free time
        </p>
        <DribbbleShots />
      </div>
    </BackgroundGradientAnimation>
  );
}
