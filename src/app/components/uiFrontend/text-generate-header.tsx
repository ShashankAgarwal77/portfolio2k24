"use client";
import { TextGenerateEffect } from "../Animations/text-generate-effect";

const words = `i simplify user challenges.`;

export function TextGenerateHeading() {
  return <TextGenerateEffect words={words} />;
}
