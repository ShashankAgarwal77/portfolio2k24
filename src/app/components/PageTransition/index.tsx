"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { liftVeil, raiseVeil } from "@/app/lib/useReveal";

/* ─────────────────────────────────────────────────────────────────────────
   Case-study expand transition.

   Clicking a work card hands its on-screen rect and content here. A clone
   of the card is drawn at exactly that rect in a fixed overlay, expanded
   to fill the viewport, and only then does the route change — underneath
   the overlay, so the swap is never visible. Once the new pathname lands,
   the overlay fades out while the case study blur-reveals under it (the
   veil holds template.tsx's reveal until that moment).

   This provider lives in the (content) layout, which persists across
   navigations — the overlay must outlive the page that spawned it.

   Stages:  idle → expanding → waiting (route change) → lifting → idle
   Failsafe: a route that never resolves force-lifts after a timeout; the
   veil's own timeout in useReveal backs that up. The user can never be
   trapped behind the overlay.
   ───────────────────────────────────────────────────────────────────────── */

export type ExpandRequest = {
  href: string;
  image: StaticImageData;
  label: string;
  title: string;
  outcome: string;
  keypoints: string[];
  /** Whether the card's hover scrim was up at click time, so the clone's
      first frame matches what the user was looking at. */
  hovered: boolean;
  rect: { top: number; left: number; width: number; height: number };
};

const ExpandContext = React.createContext<((req: ExpandRequest) => void) | null>(
  null
);

/** Null outside the provider — callers fall back to a plain navigation. */
export function useCaseStudyExpand() {
  return React.useContext(ExpandContext);
}

const EXPAND_EASE = [0.16, 1, 0.3, 1] as const; // ease-out-expo
const EXPAND_S = 0.55;
const LIFT_DELAY_MS = 180; // lets the destination paint before the fade
const STUCK_ROUTE_MS = 6000;

type Stage = "expanding" | "waiting" | "lifting";

export function CaseStudyTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [req, setReq] = React.useState<ExpandRequest | null>(null);
  const [stage, setStage] = React.useState<Stage>("expanding");
  const fromPath = React.useRef(pathname);
  const stageRef = React.useRef(stage);
  stageRef.current = stage;

  const begin = React.useCallback(
    (r: ExpandRequest) => {
      fromPath.current = pathname;
      /* Up before the route changes, so the destination's mount reveal is
         guaranteed to see it and wait. */
      raiseVeil();
      setStage("expanding");
      setReq(r);
    },
    [pathname]
  );

  /* Any completed navigation counts as arrival — normally req.href, but if
     something else (back button) wins the race, the overlay still yields. */
  React.useEffect(() => {
    if (!req || stage !== "waiting" || pathname === fromPath.current) return;
    const t = window.setTimeout(() => {
      setStage("lifting");
      liftVeil();
    }, LIFT_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [pathname, req, stage]);

  /* Belt-and-braces cleanup once the fade starts: onAnimationComplete is
     rAF-driven and never fires in a hidden tab, so a plain timer removes
     the overlay regardless (setReq(null) is idempotent with it). */
  React.useEffect(() => {
    if (!req || stage !== "lifting") return;
    const t = window.setTimeout(() => setReq(null), 700);
    return () => window.clearTimeout(t);
  }, [req, stage]);

  /* Hard deadline from the moment of the click: animations are rAF-driven
     and freeze when the tab is hidden, so if the user clicks and switches
     away — or a push never lands — force the navigation and tear the
     overlay down. The user must never come back to a stuck screen. */
  React.useEffect(() => {
    if (!req) return;
    const t = window.setTimeout(() => {
      if (stageRef.current === "expanding") router.push(req.href);
      liftVeil();
      setReq(null);
    }, STUCK_ROUTE_MS);
    return () => window.clearTimeout(t);
  }, [req, router]);

  return (
    <ExpandContext.Provider value={begin}>
      {children}
      {req && (
        <motion.div
          className="fixed inset-0 z-[60]"
          initial={false}
          animate={{ opacity: stage === "lifting" ? 0 : 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onAnimationComplete={() => {
            if (stage === "lifting") setReq(null);
          }}
        >
          <motion.div
            className="absolute overflow-hidden bg-slate-950"
            initial={{
              top: req.rect.top,
              left: req.rect.left,
              width: req.rect.width,
              height: req.rect.height,
            }}
            animate={{
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight,
            }}
            transition={{ duration: EXPAND_S, ease: EXPAND_EASE }}
            onAnimationComplete={() => {
              if (stage !== "expanding") return;
              setStage("waiting");
              router.push(req.href);
            }}
          >
            {/* sizes matches the card's, so this resolves to the already-
                cached srcset candidate and paints on the first frame. */}
            <Image
              src={req.image}
              alt=""
              fill
              priority
              sizes="75vw"
              className="object-cover"
            />

            {/* Same scrim stack as the card, so frame one is identical. */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10 md:from-black/85 md:via-black/45 md:to-transparent" />
            <motion.div
              className="absolute inset-0 bg-black/55"
              initial={{ opacity: req.hovered ? 1 : 0 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />

            {/* The card's text rides the expansion briefly, then dissolves —
                the case study's own headline takes over from here. */}
            <motion.div
              className="relative z-10 flex h-full max-w-xl flex-col justify-start gap-4 p-6 md:p-10 lg:p-14"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <p className="text-label font-semibold uppercase text-white/70">
                {req.label}
              </p>
              <h3 className="text-title font-semibold text-white text-balance">
                {req.title}
              </h3>
              <p className="text-body font-normal text-white/75">
                {req.outcome}
              </p>
              <ul className="flex flex-wrap gap-2">
                {req.keypoints.map((keypoint) => (
                  <li
                    key={keypoint}
                    className="text-label font-semibold uppercase rounded-md border border-white/20 bg-black/40 px-3 py-1.5 text-white/85"
                  >
                    {keypoint}
                  </li>
                ))}
              </ul>
              <span className="text-caption font-semibold mt-2 inline-flex w-fit items-center justify-center gap-2 rounded-full bg-slate-100 px-5 py-3 text-slate-900 shadow-xl">
                Read Full Case Study ➜
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </ExpandContext.Provider>
  );
}
