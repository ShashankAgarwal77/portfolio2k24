import React from "react";
import { FaInstagram } from "react-icons/fa";
import { MdArrowOutward } from "react-icons/md";
import { InstagramGallery } from "@/app/components/uiFrontend/instagram-gallery";

// Update this to your handle — it also drives the "Follow" link below.
const INSTAGRAM_HANDLE = "shashank";

export default function PhotographyPage() {
  return (
    <main className="flex flex-col overflow-hidden">
      <section className="mx-auto w-full max-w-7xl px-4 pb-24 pt-28 sm:px-6 md:pt-36 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-14 flex max-w-3xl flex-col items-center text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-slate-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:border-white/[0.12] dark:bg-slate-900 dark:text-slate-400">
            <FaInstagram className="h-3.5 w-3.5" />
            Through my lens
          </span>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-800 dark:text-white sm:text-5xl md:text-6xl">
            Moments I&apos;ve been framing 📸
          </h1>

          <p className="mt-5 max-w-xl text-balance text-base leading-relaxed text-slate-600 dark:text-slate-400 md:text-lg">
            A living gallery pulled straight from my Instagram — light, streets,
            and the quiet in-between. Fresh frames land here as I post them.
          </p>

          <a
            href={`https://www.instagram.com/${INSTAGRAM_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex items-center gap-2 rounded-md border border-slate-400 bg-[linear-gradient(110deg,#cbd5e1,45%,#f1f5f9,55%,#cbd5e1)] bg-[length:200%_100%] px-5 py-3 text-sm font-bold tracking-wide text-slate-800 animate-shimmer focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 dark:border-slate-800 dark:bg-[linear-gradient(110deg,#000103,80%,#1e2631,90%,#000103)] dark:text-slate-300 dark:focus:ring-offset-slate-900"
          >
            <FaInstagram className="h-4 w-4" />
            Follow @{INSTAGRAM_HANDLE}
            <MdArrowOutward className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Masonry feed */}
        <InstagramGallery />
      </section>
    </main>
  );
}
