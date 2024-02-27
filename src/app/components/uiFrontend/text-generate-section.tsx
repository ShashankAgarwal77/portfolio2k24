"use client";
import { TextGenerateEffect } from "../Animations/text-generate-effect";

const words = `Computer science grad turned into Product Designer with over 2 years of experience designing 6 highly cross-functional (0 to 1) products.
`;

export function TextGenerateSection() {
  return <TextGenerateEffect words={words} />;
}
