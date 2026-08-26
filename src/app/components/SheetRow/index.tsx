"use client";

import React, { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   SheetRow — one row of a spreadsheet, read inside a depicted browser window.

   The source artefact is a wide mastersheet: one guideline is a single row
   spread across 22 columns. Shown as a sheet is shown, that's 22 columns of
   clipped text and nothing readable. So the row is transposed — the sheet's
   column letters run down the left gutter, and the sheet's two rows (the
   header row, and the guideline itself) become the two columns.

   The chrome is illustration, not interface. It is hidden from assistive
   tech entirely; the figcaption carries the meaning, and the scroll region
   is the one thing inside that a keyboard needs to reach.
   ───────────────────────────────────────────────────────────────────────── */

/** A cell. Prose is a bare string; the other three shapes render as their kind. */
export type SheetValue =
  | string
  | { bullets: string[] }
  /** Controlled-vocabulary values — the axes that made a rule routable. */
  | { chips: string[] }
  /** Identifiers, weights, versions: things read as tokens, not sentences. */
  | { code: string };

export type SheetField = {
  /** The column heading in the source sheet. */
  field: string;
  value: SheetValue;
};

/* Spreadsheet column letters: A…Z, AA, AB… Only A–V are needed today, but a
   sheet gaining a 27th column shouldn't quietly restart the alphabet. */
function columnLetter(index: number): string {
  let n = index;
  let out = "";
  do {
    out = String.fromCharCode(65 + (n % 26)) + out;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return out;
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function Cell({ value }: { value: SheetValue }) {
  if (typeof value === "string") return <p className="sheet__prose">{value}</p>;

  if ("bullets" in value)
    return (
      <ul className="sheet__bullets">
        {value.bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );

  if ("chips" in value)
    return (
      <span className="sheet__chips">
        {value.chips.map((item) => (
          <span key={item} className="sheet__chip">
            {item}
          </span>
        ))}
      </span>
    );

  return <code className="sheet__code">{value.code}</code>;
}

export function SheetRow({
  url,
  file,
  meta,
  rowLabel,
  fields,
  tab,
  status,
  caption,
}: {
  /** Address-bar text. Illustrative — nothing here is a link. */
  url: string;
  /** File name shown on the sheet's identity strip. */
  file: string;
  /** Right-hand side of that strip — the shape of the whole sheet. */
  meta: string;
  /** What row 2 is. Doubles as the value column's heading. */
  rowLabel: string;
  fields: SheetField[];
  /** Sheet tab label in the status bar. */
  tab: string;
  /** Right-hand side of the status bar. */
  status: string;
  caption: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [atEnd, setAtEnd] = useState(false);

  /* The bottom fade says "there is more below", so it has to switch off when
     there isn't — otherwise it reads as a permanent smudge over the last
     field. Watching a sentinel at the foot of the content rather than
     measuring on scroll: it reports correctly on mount, survives the reflow
     when Satoshi swaps in, re-fires when the box is resized, and costs
     nothing per scrolled frame. */
  useEffect(() => {
    const root = scrollRef.current;
    const sentinel = endRef.current;
    if (!root || !sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setAtEnd(entry.isIntersecting),
      { root }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <figure className="sheet bleed-wide">
      <div className="sheet__window">
        <div className="sheet__chrome" aria-hidden="true">
          <span className="sheet__lights">
            <span className="sheet__light sheet__light--close" />
            <span className="sheet__light sheet__light--min" />
            <span className="sheet__light sheet__light--zoom" />
          </span>

          <span className="sheet__nav">
            <Icon>
              <path d="M10 3 5 8l5 5" />
            </Icon>
            <Icon>
              <path d="M6 3l5 5-5 5" />
            </Icon>
          </span>

          <span className="sheet__url">
            <Icon>
              <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" />
              <path d="M5.75 7V5.25a2.25 2.25 0 0 1 4.5 0V7" />
            </Icon>
            <span>{url}</span>
          </span>

          <span className="sheet__tools">
            <Icon>
              <path d="M8 3.5v9M3.5 8h9" />
            </Icon>
          </span>
        </div>

        <div className="sheet__strip" aria-hidden="true">
          <Icon>
            <rect x="2.5" y="2.5" width="11" height="11" rx="1.5" />
            <path d="M2.5 6.25h11M6.25 6.25v7.25" />
          </Icon>
          <span className="sheet__file">{file}</span>
          <span className="sheet__meta">{meta}</span>
        </div>

        <div className="sheet__viewport" data-at-end={atEnd}>
          <div
            ref={scrollRef}
            className="sheet__scroll"
            role="group"
            aria-label={`${rowLabel}, all ${fields.length} fields`}
            tabIndex={0}
          >
            <div className="sheet__head" aria-hidden="true">
              <span className="sheet__corner" />
              <span className="sheet__head-field">
                <span className="sheet__rownum">1</span>Field
              </span>
              <span className="sheet__head-value">
                <span className="sheet__rownum">2</span>
                {rowLabel}
              </span>
            </div>

            <dl className="sheet__grid">
              {fields.map((entry, i) => (
                <div className="sheet__line" key={entry.field}>
                  <span className="sheet__gutter" aria-hidden="true">
                    {columnLetter(i)}
                  </span>
                  <dt className="sheet__field">{entry.field}</dt>
                  <dd className="sheet__value">
                    <Cell value={entry.value} />
                  </dd>
                </div>
              ))}
            </dl>

            <div ref={endRef} className="sheet__end" aria-hidden="true" />
          </div>

          <div className="sheet__fade" aria-hidden="true" />
        </div>

        <div className="sheet__status" aria-hidden="true">
          <span className="sheet__tab">{tab}</span>
          <span>{status}</span>
        </div>
      </div>

      <figcaption>{caption}</figcaption>
    </figure>
  );
}
