"use client";
import React, { useRef } from "react";
import Image, { StaticImageData } from 'next/image';

import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from "@/app/components/Animations/canvas-reveal-effect";

import OroThumbnail from '../../../../public/OroThumbnail.png';
import HonestThumbnail from '../../Assets/Images/HonestIntroduction.png';
import HaulkarThumbnail from '../../../../public/haulkarThumbnail.png';
import TVThumbnail from '../../../../public/thumbnail-tradingview.png';

export function ProjectCards() {

    const TVKeypoints = [
        "Key Takeaways",
        "1. Hobby Project",
        "2. Sharpen design system skills",
        "3. Created component library",
    ];

    const OroKeypoints = [
        "Key Takeaways",
        "1. Improved gold loan efficiency",
        "2. Increase user engagement",
        "3. Achieve higher conversion and satisfaction",
    ];

    const HaulkarKeypoints = [
        "Key Takeaways",
        "1. Hobby Project",
        "2. Aims to simplify job discovery",
        "3. Aims to decrease attrition rate",
    ];

    const Honestkeypoints = [
        "Key Takeaways",
        "1. Hobby Project",
        "2. Increased trust and authencity",
        "3. Approached under Google UX Bootcamp"
    ]

    return (
        <>
            <div className="grid lg:grid-flow-row lg:auto-rows-max md:grid-col-1 justify-center w-full gap-4" data-aos="fade-up">

                <Card
                    title="Digitizes and Maximizes user's gold potential"
                    subtitle="Redefining the way people get gold loan in India"
                    keypoints={OroKeypoints}
                    image={OroThumbnail}
                    buttonlink="/case-study/oro">
                    <CanvasRevealEffect
                        animationSpeed={4}
                        containerClassName="bg-amber-400/[0.4]"
                        colors={[
                            [253, 230, 138],
                            [251, 191, 36],
                        ]}
                        dotSize={2}
                    />
                </Card>

                <Card
                    title="Simplifying gig jobs in logistics"
                    subtitle="A mobile platform for temporary delivery jobs"
                    keypoints={HaulkarKeypoints}
                    image={HaulkarThumbnail}
                    buttonlink="/case-study/haulkar">
                    <CanvasRevealEffect
                        animationSpeed={4}
                        containerClassName="bg-blue-400/[0.4]"
                        colors={[
                            [59, 130, 246],
                            [147, 197, 253],
                        ]}
                        dotSize={2}
                    />
                </Card>
            </div>
        </>
    );
}

const Card = ({
    title,
    subtitle,
    keypoints,
    image,
    buttonlink,
    children,
}: {
    title: string;
    subtitle: string;
    keypoints: string[];
    image: StaticImageData;
    buttonlink: string;
    children?: React.ReactNode;
}) => {
    const [hovered, setHovered] = React.useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="border border-black/[0.2] group/canvas-card flex dark:border-white/[0.2] w-full p-8 relative h-auto relative"
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
                        className="h-full w-full absolute inset-0"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col lg:flex-row justify-between items-stretch gap-6 w-full relative">
                {/* Text Content Wrapper (75% width on desktop) */}
                <div className="flex flex-col lg:w-3/4">
                    <h2 className="text-xl md:text-2xl lg:text-4xl font-bold tracking-wide text-slate-600 dark:text-white">
                        {title}
                    </h2>
                    <h3 className="text-slate-500 font-semibold text-sm md:text-lg lg:text-2xl my-4 tracking-wide">
                        {subtitle}
                    </h3>
                    <ol className="text-slate-500 text-sm md:text-lg lg:text-xl dark:text-slate-200 tracking-wide list-decimal pl-5">
                        {keypoints.map((keypoint, index) => (
                            <li key={index} className="mb-1">
                                {keypoint}
                            </li>
                        ))}
                    </ol>
                </div>

                {/* Image and CTA Wrapper (25% width on desktop) */}
                <div className="flex flex-col items-center lg:w-1/4">
                    {/* Responsive Image that scales with parent */}
                    <Image
                        src={image}
                        alt="Thumbnail"
                        className="w-full h-auto object-cover rounded-md mb-4"
                    />

                    {/* CTA Button */}
                    <button
                        ref={buttonRef}
                        className="w-full inline-flex items-center justify-center rounded-md border border-slate-400 dark:border-slate-800 
                 bg-[linear-gradient(110deg,#cbd5e1,45%,#f1f5f9,55%,#cbd5e1)] dark:bg-[linear-gradient(110deg,#000103,80%,#1e2631,90%,#000103)]
                 bg-[length:200%_100%] animate-shimmer py-4 text-base md:text-lg font-bold text-slate-800 dark:text-slate-300 transition-colors 
                 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 tracking-wide"
                        onClick={() => {
                            if (buttonRef.current) {
                                window.location.href = buttonlink;
                            }
                        }}
                    >
                        Read Full Case Study ➜
                    </button>
                </div>
            </div>

        </div>
    );
};

export const Icon = ({ className, ...rest }: any) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={className}
            {...rest}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
        </svg>
    );
};

