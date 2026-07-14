"use client";
import React, { useRef } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import {
    AnimatePresence,
    motion,
    MotionValue,
    useReducedMotion,
    useScroll,
    useTransform,
} from "framer-motion";
import { CanvasRevealEffect } from "@/app/components/Animations/canvas-reveal-effect";
import { Icon } from "./project-hero-cards";

import OroThumbnail from "../../../../public/OroThumbnail.png";
import HaulkarThumbnail from "../../../../public/haulkarThumbnail.png";
import BCASThumb from "../../../../public/BCASThumb.png";
import SecureHubGif from "../../../../public/SecureHub.gif";

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
        label: "BCAS · Government of India",
        title: "Winning a national aviation-security pitch with zero engineers",
        outcome:
            "An AI-first workflow turned a forked prototype into a production-ready government platform.",
        keypoints: ["Government Security Platform", "AI-Powered Design Workflow", "4 Designers, 0 Engineers"],
        image: BCASThumb,
        imageAlt: "BCAS aviation security platform dashboard",
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
        image: SecureHubGif,
        imageAlt: "Secure Hub employee monitoring dashboard",
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
        imageAlt: "Oro gold loan mobile app screens",
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
        imageAlt: "Haulkar gig logistics mobile app screens",
        href: "/case-study/haulkar",
        revealClassName: "bg-blue-400/[0.4]",
        revealColors: [
            [59, 130, 246],
            [147, 197, 253],
        ],
    },
];

export function WorkStack() {
    const total = PROJECTS.length;

    // A single scroll timeline that spans the whole stack. Each card reads its
    // slice of this progress to scale down as the cards above it settle on top.
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    return (
        <div ref={containerRef} className="relative">
            {PROJECTS.map((project, index) => (
                <StackCard
                    key={project.href}
                    project={project}
                    index={index}
                    total={total}
                    progress={scrollYProgress}
                />
            ))}
        </div>
    );
}

// Where the stack pins from the top of the viewport, plus how far each card
// peeks below the one above it so the pile stays legible while stacked.
const STACK_TOP_OFFSET_PX = 96;
const PEEK_PX = 24;

const StackCard = ({
    project,
    index,
    total,
    progress,
}: {
    project: Project;
    index: number;
    total: number;
    progress: MotionValue<number>;
}) => {
    const [hovered, setHovered] = React.useState(false);
    const prefersReducedMotion = useReducedMotion();

    // Every card container is h-screen and sticky at the same top, so as you
    // scroll each new card slides up and covers the previous one — that overlap
    // is what produces the stack. The final card never gets covered, so it
    // settles at full scale; earlier cards shrink a little for a subtle depth.
    const targetScale = 1 - (total - 1 - index) * 0.04;
    const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
    const peek = STACK_TOP_OFFSET_PX + index * PEEK_PX;

    return (
        <div
            className="sticky top-0 flex min-h-screen justify-center"
            style={{ zIndex: index + 1 }}
        >
            <div className="w-full" style={{ marginTop: peek }}>
                <motion.article
                    style={{
                        scale: prefersReducedMotion ? 1 : scale,
                        transformOrigin: "top center",
                    }}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    className="group/canvas-card relative w-full border border-black/[0.2] dark:border-white/[0.2] bg-slate-100 dark:bg-slate-900 p-6 md:p-8 shadow-xl shadow-black/10 dark:shadow-black/40 will-change-transform"
                >
                <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
                <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
                <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
                <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

                <AnimatePresence>
                    {hovered && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 h-full w-full"
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

                <div className="relative grid gap-6 md:grid-cols-[1.15fr_1fr] md:items-center">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-baseline justify-between gap-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                                {project.label}
                            </p>
                            <p className="shrink-0 text-xs tracking-[0.2em] text-slate-500 dark:text-slate-400">
                                {index + 1} / {total}
                            </p>
                        </div>

                        <h3 className="text-xl md:text-2xl font-bold tracking-wide text-slate-700 dark:text-white text-balance">
                            {project.title}
                        </h3>

                        <p className="text-base md:text-lg leading-relaxed tracking-wide text-slate-600 dark:text-slate-400">
                            {project.outcome}
                        </p>

                        <ul className="flex flex-wrap gap-2">
                            {project.keypoints.map((keypoint) => (
                                <li
                                    key={keypoint}
                                    className="rounded-md bg-slate-300/[0.6] dark:bg-slate-800/[0.8] px-3 py-1.5 text-sm tracking-wide text-slate-600 dark:text-slate-300"
                                >
                                    {keypoint}
                                </li>
                            ))}
                        </ul>

                        <Link
                            href={project.href}
                            className="mt-2 inline-flex w-fit items-center justify-center rounded-md border border-slate-400 dark:border-slate-800
                bg-[linear-gradient(110deg,#cbd5e1,45%,#f1f5f9,55%,#cbd5e1)] dark:bg-[linear-gradient(110deg,#000103,80%,#1e2631,90%,#000103)]
                bg-[length:200%_100%] animate-shimmer px-5 py-3 text-base font-bold tracking-wide text-slate-800 dark:text-slate-300
                focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                        >
                            Read Full Case Study ➜
                        </Link>
                    </div>

                    <Link href={project.href} aria-label={`Open the ${project.label} case study`}>
                        <Image
                            src={project.image}
                            alt={project.imageAlt}
                            className="w-full h-auto rounded-md border border-black/10 dark:border-white/10 object-cover"
                        />
                    </Link>
                </div>
                </motion.article>
            </div>
        </div>
    );
};
