import coreWebVitals from "eslint-config-next/core-web-vitals";

/* Flat config for ESLint 9 — replaces .eslintrc.json after the Next 16
   upgrade (`next lint` was removed; the lint script now calls eslint
   directly). */
const config = [
  ...coreWebVitals,
  {
    rules: {
      "react/no-unescaped-entities": "off",
      /* eslint-config-next 16 ships the React-Compiler-era hooks rules,
         which flag long-standing patterns in this codebase (latest-ref
         assignment during render, setState-in-effect for client-only
         gates) that build and run correctly. Kept visible as warnings
         rather than errors; new code should still avoid them. */
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/static-components": "warn",
    },
  },
  {
    ignores: [".next/**", "node_modules/**", "out/**"],
  },
];

export default config;
