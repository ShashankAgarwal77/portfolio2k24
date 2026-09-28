import type { Config } from "tailwindcss";

const svgToDataUri = require("mini-svg-data-uri");

const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // Root-level file: every class the MDX typography uses lives here, and
    // without this glob Tailwind never generates them.
    "./mdx-components.tsx",
  ],
  darkMode: 'class',
  theme: {
    extend: {

      // The six-role type scale (DESIGN.md §3). Every text element on the
      // site maps to exactly one of these — no arbitrary text-[...] values.
      fontSize: {
        headline: ['clamp(2.25rem, 5vw, 4rem)', { lineHeight: '1.05', letterSpacing: 'normal' }],
        title: ['clamp(1.5rem, 2.5vw, 1.875rem)', { lineHeight: '1.25', letterSpacing: 'normal' }],
        body: ['1.125rem', { lineHeight: '1.65', letterSpacing: 'normal' }],
        caption: ['0.875rem', { lineHeight: '1.5', letterSpacing: 'normal' }],
        label: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.14em' }],
      },

      // Only the animations with live call sites survive here — the old
      // aurora/shimmer/spotlight/meteor set belonged to aceternity
      // components that were removed from the codebase.
      animation: {
        'scroll' : "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
        // PipelineDiagram's connector lines: a single glowing pulse
        // traces each static line left-to-right (top-to-bottom on the
        // stacked mobile layout), standing in for data moving through the
        // pipeline. `*` under prefers-reduced-motion in globals.css
        // already collapses this to a single near-instant frame, so no
        // separate motion-safe handling is needed here.
        'dash-flow': 'dash-flow 1.8s linear infinite',
      },
      keyframes: {
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
        // One full lap of a 74-unit dash+gap cycle (dash 12-16, gap
        // 58-62 depending on orientation) — an exact multiple of the
        // pattern keeps the loop seamless, no visible jump at wrap.
        "dash-flow": {
          from: { strokeDashoffset: "0" },
          to: { strokeDashoffset: "-74" },
        },
      },
    },
  },
  plugins: [
    addVariablesForColors,
    function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          "bg-grid": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          "bg-dot": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
            )}")`,
          }),
        },
        { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
      );
    },
],
};

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

export default config;
