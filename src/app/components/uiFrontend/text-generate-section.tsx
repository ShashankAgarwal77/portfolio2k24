"use client";
import { TextGenerateEffect } from "../Animations/text-generate-effect";

const words = `I'm passionate about creating beautiful products that empower people.
`;

export function TextGenerateSection() {
  return <TextGenerateEffect words={words} />;
}
