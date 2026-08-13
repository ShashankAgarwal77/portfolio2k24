"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { CanvasRevealEffect } from "@/app/components/Animations/canvas-reveal-effect";

import Audit360Thumb from "../../../../public/audit360_thumbnail.png";
import BCASThumb from "../../../../public/bcas_thumbnail.png";
import SecureHubThumb from "../../../../public/securehub_thumbnail.png";
import OroThumbnail from "../../../../public/oro_thumbnail.png";
import HaulkarThumbnail from "../../../../public/haulkar_thumbnail.png";

type Project = {
    label: string;
    title: string;
    outcome: string;
    keypoints: string[];
    image: StaticImageData;
    imageAlt: string;
    href: string;
    revealClassName: string;
    revealColors: number[][];
};

const PROJECTS: Project[] = [
    {
        label: "Audit360 · Government of India",
        title: "Rewriting a national UX standard so a machine could read it",
        outcome:
            "A 480-guideline government standard couldn't be measured by anything. I rebuilt it as a 22-field schema, then shipped the platform that runs on it.",
        keypoints: ["Government Compliance Platform", "480-Rule Standard Rewritten", "Team of Four, In Production"],
        image: Audit360Thumb,
        imageAlt: "Audit360 UX compliance dashboard, shown on a laptop at a desk lit by purple ambient light",
        href: "/case-study/audit360",
        revealClassName: "bg-violet-400/[0.4]",
        revealColors: [
            [109, 40, 217],
            [237, 233, 254],
        ],
    },
    {
        label: "BCAS · Government of India",
        title: "Winning a national aviation-security pitch with zero engineers",
        outcome:
            "An AI-first workflow turned a forked prototype into a production-ready government platform.",
        keypoints: ["Government Security Platform", "AI-Powered Design Workflow", "4 Designers, 0 Engineers"],
        image: BCASThumb,
        imageAlt: "BCAS aviation security platform dashboard, shown on a monitor overlooking an Indian monument at sunset",
        href: "/case-study/bcas",
        revealClassName: "bg-[#005197]/[0.4]",
        revealColors: [
            [0, 81, 151],
            [224, 237, 250],
        ],
    },
    {
        label: "Secure Hub · Cybersecurity",
        title: "Designing the way companies manage & monitor employees",
        outcome:
            "A first-principles take on employee monitoring for a cybersecurity web platform.",
        keypoints: ["Web Application Design", "Cyber Security Domain", "First Principles Thinking"],
        image: SecureHubThumb,
        imageAlt: "Secure Hub employee monitoring dashboard, shown on a monitor at a lakeside desk",
        href: "/case-study/securehub",
        revealClassName: "bg-teal-400/[0.4]",
        revealColors: [
            [19, 78, 74],
            [204, 251, 241],
        ],
    },
    {
        label: "Oro · Fintech",
        title: "Digitizing and maximizing India's gold-loan potential",
        outcome:
            "Redefined how people get gold loans in India — and lifted conversion along the way.",
        keypoints: ["Mobile Application Design", "Finance Tech Domain", "Achieved Higher Conversion"],
        image: OroThumbnail,
        imageAlt: "Oro gold loan mobile app screens, held in hand against a Hyderabad sunset skyline",
        href: "/case-study/oro",
        revealClassName: "bg-amber-400/[0.4]",
        revealColors: [
            [253, 230, 138],
            [251, 191, 36],
        ],
    },
    {
        label: "Haulkar · Gig Logistics",
        title: "Simplifying gig jobs in logistics",
        outcome:
            "A mobile platform for temporary delivery jobs that eases discovery and cuts attrition.",
        keypoints: ["Mobile Application Design", "Simplify Job Discovery", "Decrease Attrition Rate"],
        image: HaulkarThumbnail,
        imageAlt: "Haulkar gig logistics app screens, held in hand by a delivery rider",
        href: "/case-study/haulkar",
        revealClassName: "bg-blue-400/[0.4]",
        revealColors: [
            [59, 130, 246],
            [147, 197, 253],
        ],
    },
];

export function WorkStack() {
    return (
        <div className="relative w-screen ml-[calc(50%-50vw)]">
            {PROJECTS.map((project, index) => (
                <StackCard key={project.href} project={project} index={index} />
            ))}
        </div>
    );
}

// Where the stack pins from the top of the viewport, plus how far each card
// peeks below the one above it — in vh so the peek band is a real, readable
// strip (label + index row) at any viewport height.
const STACK_TOP_OFFSET_VH = 6;
const PEEK_VH = 12;

const StackCard = ({
    project,
    index,
}: {
    project: Project;
    index: number;
}) => {
    const [hovered, setHovered] = React.useState(false);
    const prefersReducedMotion = useReducedMotion();
    const peek = `${STACK_TOP_OFFSET_VH + index * PEEK_VH}vh`;

    // Same fade-in language as the hero heading's word-by-word reveal
    // (TextGenerateEffect: opacity 0→1), but tied directly to this card's own
    // scroll position rather than fired as a fixed-duration animation once a
    // threshold is crossed — the fade opens at exactly the pace of the
    // scroll, same reasoning as the earlier scroll-linked clip-path. No box-
    // shadow/glow: opacity only.
    const cardRef = React.useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "start center"],
    });
    const scrollLinkedOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

    // Every card's slot is a full viewport height and sticks at the same top,
    // so as you scroll each new card slides up from below and pins beneath
    // the last one — the growing top offset (peek) keeps every earlier
    // card's header visible above the card that covers it.
    return (
        <div className="sticky top-0 flex min-h-screen w-full items-start justify-center" style={{ zIndex: index + 1 }}>
            <div style={{ marginTop: peek }}>
                <Link
                    href={project.href}
                    aria-label={`Open the ${project.label} case study`}
                    className="block"
                >
                    {/* bg-slate-950 is a solid fallback behind the image — without it, a
                        missing or slow-to-load thumbnail leaves the card transparent,
                        letting the stacked card behind it show through. */}
                    <motion.article
                        ref={cardRef}
                        style={{ opacity: prefersReducedMotion ? 1 : scrollLinkedOpacity }}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        className="group/canvas-card relative h-[75vh] w-[75vw] overflow-hidden border border-white/15 bg-slate-950 will-change-[opacity]"
                    >
                        <Image
                            src={project.image}
                            alt={project.imageAlt}
                            fill
                            priority={index === 0}
                            sizes="75vw"
                            className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover/canvas-card:scale-105"
                        />

                        {/* Scrim: legible text on the left, the product screenshot stays visible on the right. */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10 md:from-black/85 md:via-black/45 md:to-transparent" />

                        <AnimatePresence>
                            {hovered && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.55 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-y-0 left-0 w-full md:w-2/3 [mask-image:linear-gradient(to_right,black,transparent)]"
                                >
                                    <CanvasRevealEffect
                                        animationSpeed={4}
                                        containerClassName={project.revealClassName}
                                        colors={project.revealColors}
                                        dotSize={2}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Extra dark scrim on hover only — the colored dot-matrix accent above
                            washes contrast down, so this brings the text back to fully legible
                            while hovered without darkening the resting state. */}
                        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover/canvas-card:bg-black/55" />

                        <div className="relative z-10 flex h-full max-w-xl flex-col justify-start gap-4 p-6 md:p-10 lg:p-14">
                            <p className="text-label font-semibold uppercase text-white/70">
                                {project.label}
                            </p>

                            <h3 className="text-title font-semibold text-white text-balance">
                                {project.title}
                            </h3>

                            <p className="text-body font-normal text-white/75">
                                {project.outcome}
                            </p>

                            <ul className="flex flex-wrap gap-2">
                                {project.keypoints.map((keypoint) => (
                                    <li
                                        key={keypoint}
                                        className="text-label font-semibold uppercase rounded-md border border-white/20 bg-black/40 px-3 py-1.5 text-white/85"
                                    >
                                        {keypoint}
                                    </li>
                                ))}
                            </ul>

                            <span className="text-caption font-semibold mt-2 inline-flex w-fit items-center justify-center gap-2 rounded-full bg-slate-100 px-5 py-3 text-slate-900 shadow-xl motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover/canvas-card:translate-x-1">
                                Read Full Case Study ➜
                            </span>
                        </div>
                    </motion.article>
                </Link>
            </div>
        </div>
    );
};
