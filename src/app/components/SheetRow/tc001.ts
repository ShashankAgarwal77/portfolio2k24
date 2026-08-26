import type { SheetField } from "./index";

/* ─────────────────────────────────────────────────────────────────────────
   TC-001 — the SSL/TLS rule, as it exists in the UX4G guideline mastersheet
   after the schema rewrite. Verbatim, all 22 fields.

   The four applicability axes, Evidence Type, AI Support and Enforcement
   Level are the fields that turned a sentence into something the pipeline
   could route. They render as chips for exactly that reason: they are
   controlled vocabularies, not prose, and the difference should be visible
   at a glance rather than explained underneath.
   ───────────────────────────────────────────────────────────────────────── */

export const TC001_FIELDS: SheetField[] = [
  { field: "Stable ID", value: { code: "TC-001" } },
  { field: "Category", value: { chips: ["Trust & Credibility"] } },
  {
    field: "Title",
    value:
      "Ensure SSL/TLS encryption is implemented and HTTPS is enforced on the website",
  },
  {
    field: "Issue",
    value: {
      bullets: [
        "Absence of HTTPS exposes data transmitted between users and government servers.",
        "Users observe “Not Secure” warnings or missing padlock icons in the browser.",
        "This increases risk of data interception, erodes public trust, and violates mandated government security norms.",
      ],
    },
  },
  {
    field: "Advice",
    value: {
      bullets: [
        "Implement valid SSL/TLS certificates across all URLs.",
        "Enforce HTTPS for both desktop and mobile web.",
        "Redirect all HTTP traffic to HTTPS automatically.",
      ],
    },
  },
  {
    field: "Examples – Pass",
    value: {
      bullets: [
        "URL starts with https:// and shows a secure padlock icon.",
        "No mixed-content warnings across pages.",
      ],
    },
  },
  {
    field: "Examples – Fail",
    value: {
      bullets: [
        "Website loads over http://.",
        "Browser displays “Not Secure” warnings.",
        "Mixed HTTP/HTTPS assets present.",
      ],
    },
  },
  {
    field: "Accessibility Consideration",
    value: {
      bullets: [
        "Secure connections ensure assistive-technology users can safely submit personal data without security interruptions.",
        "Reduces anxiety and abandonment caused by browser security alerts.",
      ],
    },
  },
  {
    field: "References",
    value: "GIGW 3.0 – Section 5.3.2 (Security Guidelines)",
  },
  {
    field: "Rationale",
    value:
      "SSL/TLS encryption is a foundational security requirement for government digital services to protect data integrity and confidentiality. Enforcing HTTPS prevents man-in-the-middle attacks, reassures citizens through visible security indicators, and ensures compliance with nationally mandated standards such as GIGW. Failure to implement HTTPS undermines trust, exposes sensitive data, and creates systemic security risk across the platform.",
  },
  { field: "Enforcement Level", value: { chips: ["Foundational"] } },
  { field: "Roles", value: { chips: ["Developer"] } },
  { field: "Severity", value: { chips: ["Big Issue"] } },
  {
    field: "Metrics Affected",
    value: { chips: ["User trust", "Drop-offs"] },
  },
  {
    field: "Platform-wise Applicability",
    value: {
      chips: ["🌐 Website (Desktop)", "📱 Website (Mobile View)"],
    },
  },
  {
    field: "Page-wise Applicability",
    value: { chips: ["Common (All pages)"] },
  },
  {
    field: "Component-wise Applicability",
    value: { chips: ["Not component-specific"] },
  },
  {
    field: "Context-wise Applicability",
    value: {
      chips: ["Public-facing access", "Secure data transmission"],
    },
  },
  { field: "Evidence Type", value: { chips: ["DOM"] } },
  { field: "AI Support", value: { chips: ["Deterministic"] } },
  { field: "Confidence Weight", value: { code: "0.95" } },
  { field: "Version", value: { code: "v3.0.0" } },
];
