"use client";

import { useEffect, useState } from "react";
import { liftVeil, useIsomorphicLayoutEffect, veilUp } from "@/app/lib/useReveal";

/* ─────────────────────────────────────────────────────────────────────────
   SiteLoader — the first-landing veil.

   An inline script in the root layout raises `data-veil` on <html> before
   first paint, only when this is the first landing of the session, motion
   is allowed, and the tab is visible. Everything here keys off that
   attribute:

     · CSS shows the overlay only while the attribute is up, so repeat
       visits never flash it, even before hydration;
     · mount reveals (template.tsx) and the hero heading hold until the
       veil lifts, so the page blurs in as the veil fades rather than
       finishing invisibly underneath it.

   The hold is gated on real readiness (fonts), floored so the wordmark
   gets its beat, and capped so a slow font can never hold the page
   hostage. onVeilLift's own timeout is the second failsafe behind that.
   ───────────────────────────────────────────────────────────────────────── */

const MIN_SHOW_MS = 1600; // the wordmark's beat
const MAX_SHOW_MS = 3200; // slow fonts don't get to keep the page
const FADE_MS = 650; // matches .site-loader--leaving's transition

type Phase = "veiled" | "leaving" | "done";

export function SiteLoader() {
  const [phase, setPhase] = useState<Phase>("veiled");

  useEffect(() => {
    if (!veilUp()) {
      setPhase("done");
      return;
    }

    let cancelled = false;
    const floor = new Promise((r) => setTimeout(r, MIN_SHOW_MS));
    const ceiling = new Promise((r) => setTimeout(r, MAX_SHOW_MS));
    const ready = document.fonts?.ready ?? Promise.resolve();

    Promise.race([Promise.all([floor, ready]), ceiling]).then(() => {
      if (cancelled) return;
      try {
        sessionStorage.setItem("sa:loader-shown", "1");
      } catch {
        /* storage can be unavailable; the loader just shows again next time */
      }
      setPhase("leaving");
      window.setTimeout(() => {
        if (!cancelled) setPhase("done");
      }, FADE_MS);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  /* The veil attribute is removed only after the `--leaving` class is in
     the DOM (layout effect = post-commit, pre-paint). Removing it in the
     same tick as setPhase would leave one recalc where neither rule keeps
     the loader visible, and the fade would jump-cut instead. */
  useIsomorphicLayoutEffect(() => {
    if (phase === "leaving") liftVeil();
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      className={
        phase === "leaving" ? "site-loader site-loader--leaving" : "site-loader"
      }
    >
      <p className="site-loader__word text-title font-semibold text-slate-900 dark:text-slate-100">
        Shashank <span className="fontGloock font-normal">Agarwal</span>
      </p>
    </div>
  );
}
