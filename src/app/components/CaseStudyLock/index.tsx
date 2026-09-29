"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react";
import { useIsomorphicLayoutEffect } from "@/app/lib/useReveal";

const LINKEDIN_URL = "https://www.linkedin.com/in/shashank-agarwal11/";

/* Seven stars that read as a loose, irregular cluster while you type. Only
   on unlock do the lines draw in and show what they always were: a tick —
   the audit passed. */
const STARS = [
  { x: 36, y: 80, r: 2.2 },
  { x: 60, y: 97, r: 1.8 },
  { x: 86, y: 121, r: 2.8 },
  { x: 111, y: 97, r: 2 },
  { x: 143, y: 72, r: 2.4 },
  { x: 168, y: 47, r: 1.9 },
  { x: 205, y: 28, r: 3 },
];
const TICK_PATH = "M" + STARS.map((s) => `${s.x} ${s.y}`).join(" L");

/* Fixed seed, so the server and client draw the same sky. */
const DUST = (() => {
  let seed = 11;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  return Array.from({ length: 26 }, () => ({
    x: Math.round(rand() * 240),
    y: Math.round(rand() * 150),
    r: 0.5 + rand() * 0.6,
    delay: -rand() * 5,
  }));
})();

/* Survives router.refresh() (same JS runtime), so the unlocked page knows to
   blur in rather than pop. */
let justUnlocked = false;

type Status = "idle" | "checking" | "wrong" | "offline" | "success";

const MESSAGES: Record<Status, string> = {
  idle: "",
  checking: "Checking…",
  wrong: "That's not the password. Try again.",
  offline: "Couldn't reach the site. Check your connection and try again.",
  success: "Unlocked. Opening the case study…",
};

export function CaseStudyLock() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [leaving, setLeaving] = useState(false);
  const [shakes, setShakes] = useState(0);

  const busy = status === "checking" || status === "success";
  const failed = status === "wrong" || status === "offline";
  const lit = status === "success" ? STARS.length : Math.min(password.length, STARS.length);

  async function unlock(event: React.FormEvent) {
    event.preventDefault();
    if (!password || busy) return;
    setStatus("checking");

    let result: Status;
    try {
      const res = await fetch("/api/audit360-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      result = res.ok ? "success" : res.status === 401 ? "wrong" : "offline";
    } catch {
      result = "offline";
    }

    setStatus(result);
    if (result !== "success") {
      if (result === "wrong") setPassword("");
      setShakes((n) => n + 1);
      inputRef.current?.focus();
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      router.refresh();
      return;
    }
    window.setTimeout(() => setLeaving(true), 1350);
    window.setTimeout(() => {
      justUnlocked = true;
      router.refresh();
    }, 1850);
  }

  return (
    <section
      className="case-lock"
      data-status={status}
      data-leaving={leaving || undefined}
      aria-labelledby="audit360-lock-title"
    >
      <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
        <svg viewBox="0 0 240 150" className="case-lock__sky" aria-hidden="true">
          {DUST.map((d, i) => (
            <circle
              key={i}
              className="case-lock__dust"
              cx={d.x}
              cy={d.y}
              r={d.r}
              style={{ animationDelay: `${d.delay}s` }}
            />
          ))}
          <path className="case-lock__line" d={TICK_PATH} pathLength={1} />
          {STARS.map((s, i) => (
            <circle
              key={i}
              className="case-lock__star"
              data-lit={i < lit}
              cx={s.x}
              cy={s.y}
              r={s.r}
              style={{ "--i": i } as React.CSSProperties}
            />
          ))}
        </svg>

        <h1
          id="audit360-lock-title"
          className="mt-10 text-title font-semibold text-balance text-slate-900 dark:text-slate-100"
        >
          Audit360 is <span className="fontGloock italic font-normal">password&#8209;protected</span>
        </h1>
        <p className="mt-3 text-body font-normal text-balance text-slate-600 dark:text-slate-400">
          It&apos;s how I rewrote a national UX standard so a machine could read it,
          then built the platform that runs on it.
        </p>

        <form
          onSubmit={unlock}
          className="case-lock__form mt-10 w-full"
          data-shake={shakes === 0 ? undefined : (shakes % 2) + 1}
        >
          <label htmlFor="audit360-password" className="sr-only">
            Password
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              id="audit360-password"
              type="password"
              autoComplete="off"
              autoFocus
              spellCheck={false}
              placeholder="Password"
              value={password}
              disabled={status === "success"}
              aria-invalid={failed || undefined}
              aria-describedby="audit360-lock-status"
              onChange={(e) => {
                setPassword(e.target.value);
                if (failed) setStatus("idle");
              }}
              className="case-lock__input text-body w-full rounded-full border py-3.5 pl-6 pr-16 outline-none transition-[border-color,box-shadow] duration-300"
            />
            <button
              type="submit"
              aria-label="Unlock case study"
              aria-busy={status === "checking" || undefined}
              disabled={!password || busy}
              className="absolute right-1.5 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-slate-900 text-slate-50 transition-[opacity,transform] duration-300 enabled:hover:translate-x-0.5 disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:bg-slate-100 dark:text-slate-900 dark:focus-visible:ring-violet-300 dark:focus-visible:ring-offset-slate-950"
            >
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </button>
          </div>
        </form>

        <p
          id="audit360-lock-status"
          role="status"
          className={`mt-4 min-h-[1.5em] text-caption ${
            failed ? "text-rose-600 dark:text-rose-300" : "text-slate-500 dark:text-slate-400"
          }`}
        >
          {MESSAGES[status]}
        </p>

        <p className="mt-6 text-caption text-slate-500 dark:text-slate-400">
          No password?{" "}
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-slate-800 underline decoration-slate-400/60 underline-offset-4 transition-colors hover:decoration-violet-600 dark:text-slate-200 dark:hover:decoration-violet-300"
          >
            Ask me on LinkedIn
          </a>
        </p>
      </div>
    </section>
  );
}

export function UnlockReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || !justUnlocked) return;
    justUnlocked = false;

    el.style.filter = "blur(8px)";
    el.style.opacity = "0";
    void el.offsetHeight;
    el.style.transition =
      "filter 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1)";
    el.style.filter = "blur(0px)";
    el.style.opacity = "1";

    // Clear the filter afterwards: a lingering one breaks sticky/fixed children.
    // Not cancelled on cleanup, or a Strict Mode re-run would leave it stuck.
    window.setTimeout(() => {
      el.style.filter = "";
      el.style.opacity = "";
      el.style.transition = "";
    }, 800);
  }, []);

  return <div ref={ref}>{children}</div>;
}
