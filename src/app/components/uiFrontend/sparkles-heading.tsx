"use client";
import React from "react";
import { SparklesCore } from "../Animations/sparkles";

export function SparklesPreview() {
  /* The tsparticles engine is real main-thread work; this section lives
     well below the fold, so don't pay for it at page load. The static
     gradient hairlines render immediately — only the particle field
     itself waits until the section is a viewport away. */
  const hostRef = React.useRef<HTMLDivElement>(null);
  const [near, setNear] = React.useState(false);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" }
    );
    io.observe(host);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={hostRef} className="lg:mt-[-2em] w-full flex flex-col items-center justify-center overflow-hidden rounded-md">
      <div className="lg:w-[40rem] h-40 relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

        {/* Core component — mounted on approach only. */}
        {near && (
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="#94a3b8"
          />
        )}

        {/* Radial gradient to soften the sparkle field's edges — painted in
            the PAGE's own background colors, or it prints as a visible
            block against them (dark:bg-black on #020617 did exactly that). */}
        <div className="absolute inset-0 w-full h-full bg-[#e6ecf2] dark:bg-[#020617] [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>
    </div>
  );
}
