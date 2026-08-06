"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   MediaLightbox — click any image or video inside `containerRef` to open it
   over the page at up to 80% of the viewport.

   Built on the native <dialog> with showModal() rather than a positioned
   overlay, for a specific reason: this article puts a `filter` on ancestors
   during the page transition and the section reveals, and a filtered
   ancestor becomes the containing block for `position: fixed` children. A
   fixed overlay would be thrown out of place for the length of those
   transitions. Modal dialogs render in the top layer, which escapes ancestor
   containing blocks, transforms and filters entirely. It also gives us Esc,
   focus trapping and inerting the page underneath for free.

   Media is wired up after mount rather than at authoring time so the article
   body can stay plain markdown. Opt an asset out with data-lightbox="off".
   ───────────────────────────────────────────────────────────────────────── */

type MediaItem = {
  kind: "image" | "video";
  src: string;
  alt: string;
};

/* next/image rewrites src to /_next/image?url=…&w=…, which is a resized
   variant. The lightbox should show the original, not the thumbnail. */
function resolveFullSource(el: HTMLImageElement): string {
  const raw = el.getAttribute("src") ?? "";
  if (raw.includes("/_next/image")) {
    try {
      const url = new URL(raw, window.location.origin);
      const original = url.searchParams.get("url");
      if (original) return original;
    } catch {
      /* fall through to the rendered source */
    }
  }
  return el.currentSrc || raw;
}

export function MediaLightbox({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [item, setItem] = useState<MediaItem | null>(null);

  const open = useCallback((el: HTMLElement) => {
    if (el instanceof HTMLVideoElement) {
      setItem({
        kind: "video",
        src: el.currentSrc || el.src,
        alt: el.getAttribute("aria-label") ?? "",
      });
    } else if (el instanceof HTMLImageElement) {
      setItem({ kind: "image", src: resolveFullSource(el), alt: el.alt });
    }
  }, []);

  const close = useCallback(() => setItem(null), []);

  /* Make every asset in the container operable by pointer and by keyboard.
     Images are not focusable by default, so they are given button semantics
     rather than left as a mouse-only affordance. */
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    /* data-lightbox="off"   never opens.
       data-lightbox="clone" opens on click but takes no tab stop. Marquee
       duplicates use it: they sit in an aria-hidden subtree, which must not
       contain focusable elements, but a visible thumbnail still has to be
       clickable or half the strip would look broken. */
    const media = Array.from(
      root.querySelectorAll<HTMLElement>("img, video")
    ).filter(
      (el) => el.dataset.lightbox !== "off" && el.dataset.lightbox !== "clone"
    );

    media.forEach((el) => {
      el.dataset.lightboxBound = "true";
      el.tabIndex = 0;
      el.setAttribute("role", "button");
      const label =
        el instanceof HTMLImageElement && el.alt
          ? `Open full size: ${el.alt}`
          : "Open full size";
      el.setAttribute("aria-label", label);
    });

    const onClick = (event: MouseEvent) => {
      const el = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        "img, video"
      );
      if (!el || !root.contains(el) || el.dataset.lightbox === "off") return;
      event.preventDefault();
      open(el);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const el = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        "img, video"
      );
      if (
        !el ||
        !root.contains(el) ||
        el.dataset.lightbox === "off" ||
        el.dataset.lightbox === "clone"
      ) {
        return;
      }
      event.preventDefault();
      open(el);
    };

    root.addEventListener("click", onClick);
    root.addEventListener("keydown", onKeyDown);

    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKeyDown);
      media.forEach((el) => {
        delete el.dataset.lightboxBound;
        el.removeAttribute("tabindex");
        el.removeAttribute("role");
        el.removeAttribute("aria-label");
      });
    };
  }, [containerRef, open]);

  /* Drive the dialog from state, and lock the page behind it. The scrollbar
     width is added back as padding so the page does not jump sideways when
     it disappears. */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (item && !dialog.open) {
      const scrollbar = window.innerWidth - document.documentElement.clientWidth;
      const { overflow, paddingRight } = document.body.style;
      document.body.dataset.prevOverflow = overflow;
      document.body.dataset.prevPaddingRight = paddingRight;
      document.body.style.overflow = "hidden";
      if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
      dialog.showModal();
    }

    if (!item && dialog.open) dialog.close();

    if (!item) {
      document.body.style.overflow = document.body.dataset.prevOverflow ?? "";
      document.body.style.paddingRight =
        document.body.dataset.prevPaddingRight ?? "";
      delete document.body.dataset.prevOverflow;
      delete document.body.dataset.prevPaddingRight;
    }
  }, [item]);

  /* Esc closes the dialog natively; keep React state in step. */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => setItem(null);
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="media-lightbox"
      aria-label={item?.alt || "Media viewer"}
      /* A click landing on the dialog itself is a click on the backdrop:
         anything on the media or the button targets a child. */
      onClick={(event) => {
        if (event.target === dialogRef.current) close();
      }}
    >
      <div className="media-lightbox__inner">
        {item?.kind === "image" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.src} alt={item.alt} />
        )}
        {item?.kind === "video" && (
          <video src={item.src} controls autoPlay playsInline />
        )}

        <button
          type="button"
          onClick={close}
          className="media-lightbox__close"
          aria-label="Close"
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </dialog>
  );
}
