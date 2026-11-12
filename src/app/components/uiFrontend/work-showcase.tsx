"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight, LockSimple } from "@phosphor-icons/react";
import { useCaseStudyExpand } from "@/app/components/PageTransition";
import { useRevealChildren } from "@/app/lib/useReveal";

import Audit360Thumb from "../../../../public/audit360_thumbnail.png";
import BCASThumb from "../../../../public/bcas_thumbnail.png";
import SecureHubThumb from "../../../../public/securehub_thumbnail.png";
import OroThumbnail from "../../../../public/oro_thumbnail.png";
import HaulkarThumbnail from "../../../../public/haulkar_thumbnail.png";

/* ─────────────────────────────────────────────────────────────────────────
   WorkShowcase — the home page's case studies as one composed grid.

   Priority is the layout: the two national platforms (BCAS, Audit360) are
   the proof of the positioning, so they lead as a pair of large cards; the
   three earlier products follow as a row of smaller ones. Six columns on
   desktop (3+3 / 2+2+2), two on tablet (Haulkar spans the row and turns
   horizontal), one on phones.

   Everything a skimming reader needs is visible at rest — no hover-only
   content. Hover (and keyboard focus) is the one authored moment,
   "lamplight": the card's own accent glows up from under the pointer, the
   corner brackets spread, the image drifts closer, and an accent hairline
   draws under the title. All of it is transform / opacity / background —
   no filter — and collapses under reduced motion.

   Clicking a card opens the case study through the card-expand veil
   transition, seeded from the card's image rect.
   ───────────────────────────────────────────────────────────────────────── */

type Project = {
    name: string;
    title: string;
    /** One sentence of proof — what changed, not what it was. */
    proof: string;
    /** Where / what / when, in that order. */
    meta: string[];
    /** Behind the password gate — said on the card so the lock isn't a surprise. */
    locked?: boolean;
    featured?: boolean;
    image: StaticImageData;
    imageAlt: string;
    href: string;
    /** The project's accent pair from DESIGN.md — deep on light, pale on dark. */
    accentLight: string;
    accentDark: string;
    /** Fed to the page-transition clone, which still renders the old card. */
    transition: { label: string; outcome: string; keypoints: string[] };
};

const PROJECTS: Project[] = [
    {
        name: "BCAS",
        title: "India's aviation security compliance, on one traceable platform",
        proof:
            "487 production-ready screens in six weeks, by four designers and no engineers: one shared record for the regulator and every airline and airport it oversees.",
        meta: ["Government of India", "Design lead", "2026, ongoing"],
        locked: true,
        featured: true,
        image: BCASThumb,
        imageAlt: "BCAS aviation security platform dashboard, shown on a monitor overlooking an Indian monument at sunset",
        href: "/case-study/bcas",
        accentLight: "#005197",
        accentDark: "#e0edfa",
        transition: {
            label: "BCAS · Government of India",
            outcome: "One traceable compliance platform for a national aviation-security regulator.",
            keypoints: ["Government Security Platform", "487 Screens in 6 Weeks", "4 Designers, 0 Engineers"],
        },
    },
    {
        name: "Audit360",
        title: "I rewrote a national UX standard so a machine could read it",
        proof:
            "480 guidelines rebuilt as a 22-field schema, then the audit platform that runs on them. Built by a team of four, now in production.",
        meta: ["Government of India", "Product designer", "In production"],
        locked: true,
        featured: true,
        image: Audit360Thumb,
        imageAlt: "Audit360 UX compliance dashboard, shown on a laptop at a desk lit by purple ambient light",
        href: "/case-study/audit360",
        accentLight: "#6d28d9",
        accentDark: "#ede9fe",
        transition: {
            label: "Audit360 · Government of India",
            outcome: "A 480-guideline standard rebuilt as a 22-field schema, and the platform that runs on it.",
            keypoints: ["Government Compliance Platform", "480-Rule Standard Rewritten", "Team of Four, In Production"],
        },
    },
    {
        name: "Oro",
        title: "Rethinking how India takes out a gold loan",
        proof: "A mobile-first loan journey that redefined the experience, and lifted conversion along the way.",
        meta: ["Fintech", "Mobile app"],
        image: OroThumbnail,
        imageAlt: "Oro gold loan mobile app screens, held in hand against a Hyderabad sunset skyline",
        href: "/case-study/oro",
        accentLight: "#b45309",
        accentDark: "#fde68a",
        transition: {
            label: "Oro · Fintech",
            outcome: "Redefined how people get gold loans in India, and lifted conversion along the way.",
            keypoints: ["Mobile Application Design", "Finance Tech Domain", "Achieved Higher Conversion"],
        },
    },
    {
        name: "Secure Hub",
        title: "Employee monitoring, designed from first principles",
        proof: "How companies manage and monitor their people, rebuilt from the ground up for a cybersecurity web platform.",
        meta: ["Cybersecurity", "Web app"],
        image: SecureHubThumb,
        imageAlt: "Secure Hub employee monitoring dashboard, shown on a monitor at a lakeside desk",
        href: "/case-study/securehub",
        accentLight: "#134e4a",
        accentDark: "#ccfbf1",
        transition: {
            label: "Secure Hub · Cybersecurity",
            outcome: "A first-principles take on employee monitoring for a cybersecurity web platform.",
            keypoints: ["Web Application Design", "Cyber Security Domain", "First Principles Thinking"],
        },
    },
    {
        name: "Haulkar",
        title: "Making gig delivery work easier to find, and to keep",
        proof: "A mobile platform for temporary logistics jobs that eases discovery and cuts attrition.",
        meta: ["Gig logistics", "Mobile app"],
        image: HaulkarThumbnail,
        imageAlt: "Haulkar gig logistics app screens, held in hand by a delivery rider",
        href: "/case-study/haulkar",
        accentLight: "#1d4ed8",
        accentDark: "#93c5fd",
        transition: {
            label: "Haulkar · Gig Logistics",
            outcome: "A mobile platform for temporary delivery jobs that eases discovery and cuts attrition.",
            keypoints: ["Mobile Application Design", "Simplify Job Discovery", "Decrease Attrition Rate"],
        },
    },
];

/* Grid placement per card: flagships take half the row; the rest a third.
   On tablet the last card spans the row and lies down. */
const SPAN = ["lg:col-span-3", "lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "md:col-span-2 lg:col-span-2"];

export function WorkShowcase() {
    const prefersReducedMotion = useReducedMotion();
    const expand = useCaseStudyExpand();
    const gridRef = useRevealChildren<HTMLUListElement>();

    const handleOpen = (p: Project) => (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!expand || prefersReducedMotion) return;
        if (e.defaultPrevented || e.button !== 0) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const source = e.currentTarget.querySelector<HTMLElement>("[data-media]");
        if (!source) return;
        e.preventDefault();
        const r = source.getBoundingClientRect();
        expand({
            href: p.href,
            image: p.image,
            label: p.transition.label,
            title: p.title,
            outcome: p.transition.outcome,
            keypoints: p.transition.keypoints,
            hovered: true,
            rect: { top: r.top, left: r.left, width: r.width, height: r.height },
        });
    };

    /* Lamplight follows the pointer: two custom properties, no re-render. */
    const track = (e: React.PointerEvent<HTMLAnchorElement>) => {
        if (e.pointerType !== "mouse") return;
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };

    return (
        <section aria-label="Selected case studies" className="w-full px-4 sm:px-0">
            <ul ref={gridRef} className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-6 lg:gap-8">
                {PROJECTS.map((p, i) => {
                    const wide = i === PROJECTS.length - 1;
                    return (
                        <li key={p.href} className={`list-none ${SPAN[i]}`}>
                            <Link
                                href={p.href}
                                onClick={handleOpen(p)}
                                onPointerMove={track}
                                className={`work-card group relative flex h-full flex-col border border-black/15 bg-white/60 outline-none dark:border-white/15 dark:bg-slate-950/55 ${
                                    wide ? "md:max-lg:grid md:max-lg:grid-cols-2" : ""
                                }`}
                                style={{ "--al": p.accentLight, "--ad": p.accentDark } as React.CSSProperties}
                            >
                                {/* The drawn frame: four brackets that spread on hover. */}
                                <span aria-hidden="true" className="work-card__corner work-card__corner--tl" />
                                <span aria-hidden="true" className="work-card__corner work-card__corner--tr" />
                                <span aria-hidden="true" className="work-card__corner work-card__corner--bl" />
                                <span aria-hidden="true" className="work-card__corner work-card__corner--br" />
                                <span aria-hidden="true" className="work-card__lamp" />

                                <div
                                    data-media
                                    className={`relative overflow-hidden bg-slate-950 ${
                                        p.featured ? "aspect-[16/10]" : "aspect-[16/10] lg:aspect-[4/3]"
                                    } ${wide ? "md:max-lg:aspect-auto md:max-lg:min-h-full" : ""}`}
                                >
                                    <Image
                                        src={p.image}
                                        alt={p.imageAlt}
                                        fill
                                        priority={i < 2}
                                        sizes={p.featured ? "(min-width: 1024px) 40vw, (min-width: 768px) 45vw, 92vw" : "(min-width: 1024px) 26vw, (min-width: 768px) 45vw, 92vw"}
                                        className="work-card__image object-cover"
                                    />
                                    {p.locked && (
                                        <span className="text-caption absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-slate-950/75 px-3 py-1 text-white">
                                            <LockSimple size={13} weight="bold" aria-hidden="true" />
                                            Password on request
                                        </span>
                                    )}
                                </div>

                                <div className={`relative flex flex-1 flex-col ${p.featured ? "p-6 md:p-8" : "p-6"}`}>
                                    <h3 className="text-title font-semibold text-balance text-slate-900 dark:text-white">
                                        <span className="work-card__title">{p.title}</span>
                                    </h3>
                                    <p className={`mt-3 font-normal text-slate-600 dark:text-white/70 ${p.featured ? "text-body" : "text-caption"}`}>
                                        {p.proof}
                                    </p>
                                    <div className="mt-auto flex flex-wrap items-end justify-between gap-x-6 gap-y-3 pt-6">
                                        <p className="text-caption text-slate-500 dark:text-white/55">
                                            <span className="text-slate-800 dark:text-white/85">{p.name}</span>
                                            {p.meta.map((m) => (
                                                <React.Fragment key={m}>
                                                    <span aria-hidden="true" className="px-1.5 text-slate-400 dark:text-white/30">·</span>
                                                    {m}
                                                </React.Fragment>
                                            ))}
                                        </p>
                                        <span className="work-card__cta text-caption inline-flex shrink-0 items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                                            Read the case study
                                            <ArrowUpRight size={16} weight="bold" aria-hidden="true" className="work-card__arrow" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
