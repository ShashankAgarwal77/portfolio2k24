import type { Metadata } from "next";
import { SolaceStudio } from "@/app/components/Playground/SolaceWalk";

export const metadata: Metadata = {
  title: "Solace, in chaos · Playground · Shashank Agarwal",
  description: "A walkable isometric ASCII city at dusk. The noise is everywhere; the headphones carry the calm.",
};

export default function SolaceInChaosPage() {
  return <SolaceStudio />;
}
