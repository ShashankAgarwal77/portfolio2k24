"use client";
import React from "react";
import {
  GlowingStarsBackgroundCard,
  GlowingStarsDescription,
  GlowingStarsTitle,
} from "../Animations/glowing-stars-animation";

export function GlowingStarsBackgroundCardPreview() {
  return (
    <div className="flex items-center justify-center antialiased">
      <GlowingStarsBackgroundCard />
    </div>
  );
}