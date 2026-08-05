"use client";

import { useRevealOnMount } from "@/app/lib/useReveal";

/* template.tsx re-mounts on every navigation (unlike layout.tsx, which
   persists), so this is where the page-transition reveal belongs. The
   floating dock and footer live in layout.tsx and stay put while the page
   content blurs in underneath them.

   The wrapper's inline filter is removed once the transition finishes, so it
   never becomes a permanent containing block for the sticky and fixed
   elements inside the page. */
export default function ContentTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRevealOnMount<HTMLDivElement>();
  return <div ref={ref}>{children}</div>;
}
