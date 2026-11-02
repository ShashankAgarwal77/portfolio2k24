"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Caveat } from "next/font/google";
import { cn } from "@/app/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────
   WallOfLove — modelled on Le mur des je t'aime in Montmartre: a wall of
   glossy blue tiles, chalk-white handwriting in many languages, red
   fragments scattered across it.

   Here the handwriting says thank you, and the feedback is pinned to the
   wall as photos, each labelled with one scribbled word. Photos can be
   dragged anywhere on the wall (the last one touched comes to the front);
   a tap without a drag opens it full size in an overlay. Keyboard users
   tab to a photo and press Enter to open it.

   Drag is framer's, so a tap and a drag are told apart for us: onTap only
   fires when the pointer did not travel. Positions are percentages of the
   wall, so the starting scatter holds at any width.
   ───────────────────────────────────────────────────────────────────────── */

const scribble = Caveat({ subsets: ["latin"], weight: ["500", "700"], display: "swap", variable: "--font-scribble" });

export type WallItem = {
  src: string;
  alt: string;
  /** The one scribbled word pinned under the photo. */
  word: string;
};

/* Starting scatter: left / top in % of the wall, and a tilt. The band
   across the middle stays clear for the title written on the wall. */
const SPOTS = [
  { x: 5, y: 5, r: -6 },
  { x: 38, y: 3, r: 4 },
  { x: 70, y: 7, r: -3 },
  { x: 14, y: 64, r: 5 },
  { x: 56, y: 62, r: -5 },
  { x: 80, y: 66, r: 3 },
  { x: 2, y: 70, r: -2 },
];

const THANKS = [
  "Thank you", "Merci", "धन्यवाद", "Gracias", "ধন্যবাদ", "Danke", "நன்றி", "Grazie", "ありがとう",
  "Obrigado", "ధన్యవాదాలు", "شكراً", "谢谢", "Shukriya", "감사합니다", "Спасибо", "Asante", "ಧನ್ಯವಾದ",
  "Dank je", "നന്ദി", "Tack", "Kiitos", "ขอบคุณ", "Terima kasih", "Cảm ơn", "Toda", "Mahalo",
  "Dziękuję", "Teşekkürler", "ધન્યવાદ", "Salamat", "Efcharistó", "ਧੰਨਵਾਦ", "Köszönöm", "Takk",
  "Děkuji", "Mulțumesc", "Hvala", "Paldies", "Ačiū", "Rahmat", "Dhanyavaad", "Ngiyabonga", "Kop khun",
];

/* Deterministic pseudo-random, so server and client render the same wall.
   Rounded to two places: the browser shortens long decimals in inline
   styles, and the full-precision server string would fail hydration. */
const rand = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return Math.round((x - Math.floor(x)) * 100) / 100;
};
const fix = (n: number) => n.toFixed(2);

/* Handmade glazed tiles: each one a slightly different blue, a bevel, and
   sometimes a hard specular streak where the uneven glaze catches light.
   Enough tiles to cover the widest wall; the grid clips the rest. */
const TILE_COUNT = 32 * 16;

function Tiles() {
  return (
    <div className="wall-love__tiles" aria-hidden="true">
      {Array.from({ length: TILE_COUNT }, (_, i) => {
        const tone = Math.floor(rand(i + 300) * 5);
        const glint = rand(i + 600);
        return (
          <span
            key={i}
            className={cn(
              "wall-love__tile",
              `wall-love__tile--t${tone}`,
              glint > 0.86 && `wall-love__tile--g${Math.floor(rand(i + 900) * 3)}`
            )}
          />
        );
      })}
      {/* One uneven glaze over the whole wall: turbulence lit as a surface. */}
      <svg className="wall-love__glaze" preserveAspectRatio="none">
        <filter id="wall-love-glaze" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.018" numOctaves="3" seed="7" result="noise" />
          <feSpecularLighting in="noise" surfaceScale="6" specularConstant="0.9" specularExponent="28" lightingColor="#dfe8ff" result="spec">
            <feDistantLight azimuth="235" elevation="48" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceGraphic" operator="in" />
        </filter>
        <rect width="100%" height="100%" filter="url(#wall-love-glaze)" />
      </svg>
    </div>
  );
}

function Chalk() {
  return (
    <div className="wall-love__chalk" aria-hidden="true">
      {THANKS.concat(THANKS).map((w, i) => (
        <span
          key={i}
          style={{
            fontSize: `${fix(1.1 + rand(i) * 1.5)}rem`,
            transform: `rotate(${fix((rand(i + 7) - 0.5) * 10)}deg)`,
            opacity: fix(0.18 + rand(i + 3) * 0.17),
          }}
        >
          {w}
        </span>
      ))}
      {Array.from({ length: 14 }, (_, i) => (
        <i
          key={`f${i}`}
          className="wall-love__fragment"
          style={{
            left: `${fix(rand(i + 40) * 96)}%`,
            top: `${fix(rand(i + 80) * 94)}%`,
            transform: `rotate(${fix(rand(i + 120) * 360)}deg)`,
          }}
        />
      ))}
    </div>
  );
}

function Photo({
  item,
  spot,
  z,
  wallRef,
  onFront,
  onOpen,
}: {
  item: WallItem;
  spot: (typeof SPOTS)[number];
  z: number;
  wallRef: React.RefObject<HTMLDivElement | null>;
  onFront: () => void;
  onOpen: () => void;
}) {
  const reduce = useReducedMotion();
  /* framer still reports a tap when the pointer travels with the photo, so
     a drag is remembered here and swallows the tap that ends it. */
  const dragged = useRef(false);
  return (
    <motion.button
      type="button"
      drag
      dragConstraints={wallRef}
      dragElastic={0.12}
      dragMomentum={false}
      onPointerDown={() => {
        dragged.current = false;
        onFront();
      }}
      onDragStart={() => {
        dragged.current = true;
      }}
      onTap={() => {
        if (!dragged.current) onOpen();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      whileHover={reduce ? undefined : { scale: 1.04, rotate: 0 }}
      whileDrag={{ scale: 1.08, rotate: 0, cursor: "grabbing" }}
      initial={false}
      // min(): a photo never starts past the right edge on narrow walls.
      style={{ left: `min(${spot.x}%, calc(100% - var(--wall-photo) - 0.75rem))`, top: `${spot.y}%`, rotate: spot.r, zIndex: z }}
      className="wall-love__photo"
      aria-label={`${item.word}: ${item.alt} Open full size.`}
    >
      <span className="wall-love__pin" aria-hidden="true" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.src} alt="" draggable={false} />
      <span className={cn("wall-love__word", scribble.className)}>{item.word}</span>
    </motion.button>
  );
}

function Overlay({ item, onClose }: { item: WallItem; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      prev?.focus();
    };
  }, [onClose]);

  return (
    <motion.div
      className="wall-love__overlay"
      role="dialog"
      aria-modal="true"
      aria-label={item.word}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.figure
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.92, y: 20, rotate: -2 }}
        animate={{ scale: 1, y: 0, rotate: 0 }}
        exit={{ scale: 0.95, y: 10, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className="wall-love__sheet"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.src} alt={item.alt} />
        <figcaption className={cn("wall-love__word wall-love__word--big", scribble.className)}>{item.word}</figcaption>
      </motion.figure>
      <button ref={closeRef} type="button" onClick={onClose} className="wall-love__close" aria-label="Close">
        ✕
      </button>
    </motion.div>
  );
}

export function WallOfLove({ items, title = "Wall of love" }: { items: WallItem[]; title?: string }) {
  const wallRef = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState(() => items.map((_, i) => i));
  const [open, setOpen] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const front = useCallback((i: number) => setOrder((o) => [...o.filter((n) => n !== i), i]), []);
  const close = useCallback(() => setOpen(null), []);

  return (
    <section className={cn("wall-love", scribble.variable)} aria-label={title}>
      <div ref={wallRef} className="wall-love__wall">
        <Tiles />
        <Chalk />
        {/* Written on the wall itself: above the chalk, under the photos. */}
        <div className="wall-love__heading">
          <h2 className={cn("wall-love__title", scribble.className)}>{title}</h2>
          <p className="wall-love__hint">Drag the notes around. Tap one to read it.</p>
        </div>
        {items.map((item, i) => (
          <Photo
            key={item.src}
            item={item}
            spot={SPOTS[i % SPOTS.length]}
            z={10 + order.indexOf(i)}
            wallRef={wallRef}
            onFront={() => front(i)}
            onOpen={() => setOpen(i)}
          />
        ))}
        <div className="wall-love__gloss" aria-hidden="true" />
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>{open !== null && <Overlay key={open} item={items[open]} onClose={close} />}</AnimatePresence>,
          document.body
        )}
    </section>
  );
}
