import React from "react";

/* ─────────────────────────────────────────────────────────────────────────
   ShotPlaceholder — a visible, self-documenting slot for an image that has
   not been captured yet.

   A missing <img> renders as a broken icon and reads as a bug. This renders
   as an intentional gap that states what belongs there and where to save it,
   so an unfinished article still reads cleanly in review. Swap the whole
   block for <Annotated> or a markdown image once the asset exists.
   ───────────────────────────────────────────────────────────────────────── */

export function ShotPlaceholder({
  title,
  detail,
  path,
  ratio = "16 / 9",
}: {
  /** What the shot is, in a few words. */
  title: string;
  /** What it must show for the surrounding claim to land. */
  detail: string;
  /** Where the captured asset should be saved. */
  path: string;
  /** CSS aspect-ratio for the box, e.g. "16 / 9" or "4 / 3". */
  ratio?: string;
}) {
  return (
    <figure className="my-10">
      <div
        style={{ aspectRatio: ratio }}
        className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-10 text-center dark:border-white/[0.14] dark:bg-white/[0.02]"
      >
        <span className="rounded-full border border-slate-300 px-2.5 py-0.5 text-[0.7rem] uppercase tracking-[0.12em] text-slate-500 dark:border-white/[0.14] dark:text-slate-400">
          Image needed
        </span>
        <p className="max-w-md text-base font-semibold text-slate-800 dark:text-slate-200">{title}</p>
        <p className="max-w-lg text-sm leading-[1.6] text-slate-500 dark:text-slate-400">{detail}</p>
        <code className="mt-1 rounded bg-slate-200/70 px-2 py-1 text-[0.72rem] text-slate-600 dark:bg-white/[0.06] dark:text-slate-400">
          {path}
        </code>
      </div>
    </figure>
  );
}
