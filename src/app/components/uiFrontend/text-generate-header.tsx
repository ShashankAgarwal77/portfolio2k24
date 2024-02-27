"use client";
import { TextGenerateEffect } from "../Animations/text-generate-effect";

const words = `i craft products, interactions & stories
`;

export function TextGenerateHeading() {
  return <TextGenerateEffect words={words} />;
}
