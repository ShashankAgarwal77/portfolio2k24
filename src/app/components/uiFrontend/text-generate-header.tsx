"use client";
import { TextGenerateEffect } from "../Animations/text-generate-effect";

const words = `I design experiences, weaving narratives.
`;

export function TextGenerateHeading() {
  return <TextGenerateEffect words={words} />;
}
