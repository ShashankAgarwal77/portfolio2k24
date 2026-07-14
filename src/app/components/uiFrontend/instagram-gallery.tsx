"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MdArrowOutward } from "react-icons/md";
import { FaInstagram, FaPlay } from "react-icons/fa";
import { Icon } from "./project-hero-cards";
import type { InstagramMedia } from "@/app/api/instagram/route";

type Feed = {
  items: InstagramMedia[];
  source: "instagram" | "fallback";
};

export function InstagramGallery() {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/instagram")
      .then((res) => res.json())
      .then((data: Feed) => {
        if (active) setFeed(data);
      })
      .catch(() => {
        if (active) setErrored(true);
      });
    return () => {
      active = false;
    };
  }, []);

  if (errored) {
    return (
      <p className="text-center text-slate-500 dark:text-slate-400">
        Couldn&apos;t load the feed right now. Catch it live on{" "}
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4"
        >
          Instagram
        </a>
        .
      </p>
    );
  }

  if (!feed) {
    return <GallerySkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      {feed.source === "fallback" && (
        <p className="mx-auto max-w-xl text-center text-xs tracking-wide text-slate-500 dark:text-slate-500">
          Showing sample frames — add your Instagram access token to go live.
        </p>
      )}
      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [column-fill:_balance]">
        {feed.items.map((item, index) => (
          <GalleryCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}

function GalleryCard({
  item,
  index,
}: {
  item: InstagramMedia;
  index: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.a
      href={item.permalink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={
        item.caption ? item.caption.slice(0, 80) : "View post on Instagram"
      }
      initial={
        prefersReducedMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 28, scale: 0.96, filter: "blur(8px)" }
      }
      whileInView={
        prefersReducedMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
      }
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{
        duration: 0.6,
        // Stagger within a wave, then reset so later rows don't wait forever.
        delay: prefersReducedMotion ? 0 : (index % 8) * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group/card relative mb-4 block break-inside-avoid overflow-hidden rounded-xl border border-black/[0.08] bg-slate-100 shadow-sm shadow-black/5 transition-shadow duration-300 hover:shadow-xl hover:shadow-black/10 dark:border-white/[0.12] dark:bg-slate-900 dark:shadow-black/40 dark:hover:shadow-black/60"
    >
      {/* Signature plus-corners, revealed on hover to match the site's cards */}
      <Icon className="absolute -left-3 -top-3 z-20 h-6 w-6 text-black opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 dark:text-white" />
      <Icon className="absolute -bottom-3 -left-3 z-20 h-6 w-6 text-black opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 dark:text-white" />
      <Icon className="absolute -right-3 -top-3 z-20 h-6 w-6 text-black opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 dark:text-white" />
      <Icon className="absolute -bottom-3 -right-3 z-20 h-6 w-6 text-black opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 dark:text-white" />

      {/* eslint-disable-next-line @next/next/no-img-element -- IG media URLs are
          signed and served from wildcard CDN hosts; plain img avoids next/image
          host config churn and matches the Dribbble gallery pattern. */}
      <img
        src={item.displayUrl}
        alt={item.caption ? item.caption.slice(0, 120) : "Instagram photo"}
        loading="lazy"
        className="w-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.06]"
      />

      {item.mediaType === "VIDEO" && (
        <span className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm">
          <FaPlay className="h-3 w-3 translate-x-[1px]" />
        </span>
      )}

      {/* Caption + CTA overlay that slides up on hover */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end">
        <div className="translate-y-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 transition-all duration-300 ease-out group-hover/card:translate-y-0 group-hover/card:opacity-100">
          {item.caption && (
            <p className="mb-2 line-clamp-2 text-sm font-medium leading-snug text-white/90">
              {item.caption}
            </p>
          )}
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white">
            <FaInstagram className="h-3.5 w-3.5" />
            View on Instagram
            <MdArrowOutward className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </motion.a>
  );
}

// Varying heights so the skeleton previews the masonry rhythm.
const SKELETON_HEIGHTS = [
  260, 200, 320, 240, 300, 220, 280, 340, 210, 290, 250, 310,
];

function GallerySkeleton() {
  return (
    <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
      {SKELETON_HEIGHTS.map((h, i) => (
        <div
          key={i}
          style={{ height: h }}
          className="mb-4 w-full animate-pulse break-inside-avoid rounded-xl bg-slate-200/80 dark:bg-slate-800/60"
        />
      ))}
    </div>
  );
}
