import type { Metadata } from "next";
import { StarryAsciiStudio } from "@/app/components/Playground/StarryAscii";

export const metadata: Metadata = {
  title: "Starry Night, in ASCII · Playground · Shashank Agarwal",
  description: "An interactive ASCII rendering of a Van Gogh–style starry sky, with live controls.",
};

export default function StarryNightPage() {
  return <StarryAsciiStudio />;
}
