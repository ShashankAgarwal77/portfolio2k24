"use client";
import { MaskContainer } from "../Animations/svg-mask-effect";

export function SVGMaskEffectDemo() {
  return (
    <div className="h-screen w-full flex items-center justify-center overflow-hidden">
      <MaskContainer
        revealText={
          <p className="max-w-4xl mx-auto text-slate-800 text-center  text-8xl font-bold">
            Welcome to my world of photography 📸
          </p>
        }
        className="h-screen w-full border rounded-md"
      >
        🚧 Work in Progress 🚧

      </MaskContainer>
    </div>
  );
}
