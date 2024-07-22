"use client";
import { TextGenerateEffect } from "../Animations/text-generate-effect";

const words = `I craft solutions for users.`;

export function TextGenerateHeading() {
  return <TextGenerateEffect words={words} />;
}
