"use client";
import React from "react";
import {
  TextRevealCard,
  TextRevealCardDescription,
  TextRevealCardTitle,
} from "../Animations/text-reveal-card-animation";

export function TextRevealCardPreview() {
  return (
    <div className="flex  items-center justify-center rounded-2xl w-full">
      <TextRevealCard
        text="CS Engineer "
        revealText="Product Designer⚡ "
      >
        <TextRevealCardTitle>
          my story in simple hover
        </TextRevealCardTitle>
        <TextRevealCardDescription>
          I turned from Computer Science Engineer to self-taught Product designer to solve design related problems in this world.
        </TextRevealCardDescription>
      </TextRevealCard>
    </div>
  );
}
