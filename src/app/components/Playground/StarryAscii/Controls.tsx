"use client";

import React from "react";
import { cn } from "@/app/lib/utils";
import {
  RAMPS,
  TINTS,
  type RampKey,
  type StarryParams,
  type TintKey,
} from "./engine";

/* The tuning panel. Purely presentational: it reads params and reports
   patches; the studio owns state. Same markup serves the desktop side
   panel and the mobile sheet. */

const RAMP_LABELS: Record<RampKey, string> = {
  classic: "Classic",
  bourke: "Bourke 70",
  blocks: "Blocks",
  dots: "Dots",
  stars: "Stars",
  vincent: "Vincent",
  binary: "Binary",
};

type Patch = (p: Partial<StarryParams>) => void;

export function Controls({
  params,
  set,
  onReset,
}: {
  params: StarryParams;
  set: Patch;
  onReset: () => void;
}) {
  const preset = (Object.keys(RAMPS) as RampKey[]).find((k) => RAMPS[k] === params.ramp);

  return (
    <div className="flex flex-col gap-7">
      <Section title="Glyphs">
        <div className="grid grid-cols-2 gap-1.5">
          {(Object.keys(RAMPS) as RampKey[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => set({ ramp: RAMPS[k] })}
              aria-pressed={preset === k}
              className={cn(
                "group flex flex-col items-start gap-0.5 rounded-lg border px-2.5 py-2 text-left transition-colors",
                preset === k
                  ? "border-amber-500/60 bg-amber-50 dark:border-amber-200/40 dark:bg-amber-200/10"
                  : "border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
              )}
            >
              <span className="text-caption font-medium text-slate-700 dark:text-slate-200">
                {RAMP_LABELS[k]}
              </span>
              <span className="w-full truncate font-mono text-[11px] leading-4 text-slate-500 dark:text-slate-400">
                {RAMPS[k].trim().slice(0, 14)}
              </span>
            </button>
          ))}
        </div>
        <label className="mt-1 block">
          <span className="text-caption text-slate-500 dark:text-slate-400">
            Custom ramp, dim → dense
          </span>
          <input
            type="text"
            value={preset ? "" : params.ramp}
            placeholder={" .:-=+*#%@"}
            spellCheck={false}
            maxLength={96}
            onChange={(e) => set({ ramp: e.target.value || RAMPS.classic })}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-transparent px-2.5 py-1.5 font-mono text-caption text-slate-800 outline-none placeholder:text-slate-400 focus:border-amber-500/60 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-600 dark:focus:border-amber-200/40"
          />
        </label>
        <Slider
          label="Cell size"
          value={params.cellSize}
          min={7}
          max={28}
          step={1}
          format={(v) => `${v}px`}
          onChange={(v) => set({ cellSize: v })}
        />
        <Slider
          label="Density"
          value={params.exposure}
          min={0.4}
          max={2}
          step={0.05}
          format={(v) => `${v.toFixed(2)}×`}
          onChange={(v) => set({ exposure: v })}
        />
        <Slider
          label="Contrast"
          value={params.contrast}
          min={0.5}
          max={2.5}
          step={0.05}
          format={(v) => v.toFixed(2)}
          onChange={(v) => set({ contrast: v })}
        />
      </Section>

      <Section title="Currents">
        <Slider
          label="Swirl"
          value={params.swirl}
          min={0}
          max={2.5}
          step={0.05}
          format={(v) => v.toFixed(2)}
          onChange={(v) => set({ swirl: v })}
        />
        <Slider
          label="Speed"
          value={params.speed}
          min={0}
          max={3}
          step={0.05}
          format={(v) => `${v.toFixed(2)}×`}
          onChange={(v) => set({ speed: v })}
        />
        <Slider
          label="Brushstroke"
          value={params.strokeScale}
          min={0.4}
          max={2.2}
          step={0.05}
          format={(v) => v.toFixed(2)}
          onChange={(v) => set({ strokeScale: v })}
        />
      </Section>

      <Section title="Stars">
        <Slider
          label="Count"
          value={params.stars}
          min={0}
          max={48}
          step={1}
          format={(v) => `${v}`}
          onChange={(v) => set({ stars: v })}
        />
        <Slider
          label="Twinkle"
          value={params.twinkle}
          min={0}
          max={1}
          step={0.05}
          format={(v) => `${Math.round(v * 100)}%`}
          onChange={(v) => set({ twinkle: v })}
        />
        <Slider
          label="Halo"
          value={params.halo}
          min={0}
          max={2}
          step={0.05}
          format={(v) => v.toFixed(2)}
          onChange={(v) => set({ halo: v })}
        />
      </Section>

      <Section title="Colour">
        <Segmented
          value={params.colorMode}
          options={[
            { value: "mono", label: "Mono" },
            { value: "tint", label: "Tint" },
            { value: "full", label: "Full" },
          ]}
          onChange={(v) => set({ colorMode: v })}
        />
        {params.colorMode === "tint" && (
          <div className="flex gap-2" role="radiogroup" aria-label="Tint">
            {(Object.keys(TINTS) as TintKey[]).map((k) => (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={params.tint === k}
                aria-label={TINTS[k].label}
                title={TINTS[k].label}
                onClick={() => set({ tint: k })}
                className={cn(
                  "h-7 w-7 rounded-full ring-offset-2 ring-offset-white transition-shadow dark:ring-offset-slate-950",
                  params.tint === k ? "ring-2 ring-slate-500 dark:ring-slate-300" : ""
                )}
                style={{
                  background: `linear-gradient(135deg, ${TINTS[k].dark}, ${TINTS[k].light})`,
                }}
              />
            ))}
          </div>
        )}
      </Section>

      <Section title="Pointer">
        <Segmented
          value={params.pointerMode}
          options={[
            { value: "swirl", label: "Stir" },
            { value: "lantern", label: "Lantern" },
          ]}
          onChange={(v) => set({ pointerMode: v })}
        />
        <Slider
          label="Strength"
          value={params.pointerStrength}
          min={0}
          max={2}
          step={0.05}
          format={(v) => v.toFixed(2)}
          onChange={(v) => set({ pointerStrength: v })}
        />
        <Slider
          label="Radius"
          value={params.pointerRadius}
          min={0.05}
          max={0.45}
          step={0.01}
          format={(v) => v.toFixed(2)}
          onChange={(v) => set({ pointerRadius: v })}
        />
      </Section>

      <Section title="Scene">
        <Toggle label="Crescent moon" checked={params.moon} onChange={(v) => set({ moon: v })} />
        <Toggle label="Cypress" checked={params.cypress} onChange={(v) => set({ cypress: v })} />
        <Toggle label="Village" checked={params.village} onChange={(v) => set({ village: v })} />
      </Section>

      <button
        type="button"
        onClick={onReset}
        className="self-start rounded-full border border-slate-200 px-4 py-1.5 text-caption text-slate-600 transition-colors hover:border-slate-400 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white"
      >
        Reset to defaults
      </button>
    </div>
  );
}

/* ── primitives ──────────────────────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-3.5">
      <legend className="mb-3.5 text-label uppercase text-slate-400 dark:text-slate-500">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <label className="block">
      <span className="flex items-baseline justify-between">
        <span className="text-caption text-slate-600 dark:text-slate-300">{label}</span>
        <span className="font-mono text-[11px] tabular-nums text-slate-400 dark:text-slate-500">
          {format(value)}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="pg-range mt-1.5 w-full"
        style={{ "--pg-fill": `${fill}%` } as React.CSSProperties}
      />
    </label>
  );
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div
      role="radiogroup"
      className="grid rounded-full border border-slate-200 p-0.5 dark:border-slate-800"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-full py-1 text-caption transition-colors",
            value === o.value
              ? "bg-slate-900 text-white dark:bg-amber-100 dark:text-slate-900"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between text-left"
    >
      <span className="text-caption text-slate-600 dark:text-slate-300">{label}</span>
      <span
        className={cn(
          "relative h-5 w-9 rounded-full transition-colors",
          checked ? "bg-slate-900 dark:bg-amber-100" : "bg-slate-200 dark:bg-slate-800"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform dark:bg-slate-950",
            checked ? "translate-x-[18px]" : "translate-x-0.5",
            !checked && "dark:bg-slate-400"
          )}
        />
      </span>
    </button>
  );
}
