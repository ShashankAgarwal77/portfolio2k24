import React from "react";
import { cn } from "@/app/lib/utils";
import { Spotlight } from "../Animations/spotlight-animation";

export function SpotlightPreview() {
  return (
    <div className="w-full rounded-md ">
      <Spotlight
        className="-top-10 left-0 md:left-40 md:-top-40"
        fill="white"
      />
      
    </div>
  );
}
