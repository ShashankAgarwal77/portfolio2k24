"use client";

import React from "react";
import { useRevealChildren } from "@/app/lib/useReveal";

/* Reveal — wraps a run of sections and blurs each one in as it scrolls up.
   Its own direct children are the animation unit, so wrap the group, not
   each section individually.

   Opt a child out with data-reveal="off". */
export function Reveal({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "main" | "section";
}) {
  const ref = useRevealChildren<HTMLDivElement>();
  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
