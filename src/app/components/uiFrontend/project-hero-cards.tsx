"use client";
import React, { useRef } from "react";
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';

import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from "@/app/components/Animations/canvas-reveal-effect";

import OroThumbnail from '../../Assets/Images/OroThumbnail.png';
import HonestThumbnail from '../../Assets/Images/HonestIntroduction.png';
import { useRouter } from "next/router";


export function ProjectCards() {

    const OroKeypoints = [
        "Key Takeaways",
        "1. Reducing the gold loan booking time from 45 minutes to ~28 minutes",
        "2. Increasing the user engagement from 13.74% to 23.54%",
        "3. Achieving higher customer satisfaction and conversion rate",
    ];

    const Honestkeypoints = [
        "Key Takeaways",
            "1. Hobby Project",
            "2. Solves the trust and authencity problem in food delivery sector",
            "3. Demonstrate the vast variety of UI and UX Practices to achieve the validation of problem and solution hypothesis"
    ]

    return (
        <>
            <div className="flex flex-col justify-center w-full gap-4">
                <Card 
                title="Orocorp - Digitizes and Maximizes user&apos;s gold potential" 
                subtitle="Redefining the way people get gold loan in India" 
                keypoints={OroKeypoints} 
                image={OroThumbnail} 
                buttonlink="/oro">
                    <CanvasRevealEffect
                        animationSpeed={4}
                        containerClassName="bg-amber-400/[0.4]"
                        colors={[
                          [253, 230, 138],
                          [251, 191, 36],
                        ]}
                        dotSize={1}
                    />
                </Card>

                <Card 
                title="Honest Bites - UI/UX Case Study" 
                subtitle="Unveiling a World of Culinary Experience" 
                keypoints={Honestkeypoints} 
                image={HonestThumbnail} 
                buttonlink="/honest">
                    <CanvasRevealEffect
                        animationSpeed={4}
                        containerClassName="bg-emerald-400/[0.4]"
                        colors={[
                          [167, 243, 208],
                          [5, 150, 36],
                        ]}
                        dotSize={1}
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
            className="bg-white dark:bg-black border border-black/[0.2] group/canvas-card flex dark:border-white/[0.2] w-full p-8 relative h-auto relative"
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

            <div className="relative z-20">

                <h2 className="text-xl md:text-2xl lg:text-4xl font-bold tracking-wide text-slate-600 dark:text-white">
                    {title}
                </h2>
                <h2 className="text-slate-500 dark:text-white sm:text-sm md:text-lg lg:text-2xl my-4 tracking-wide">
                    {subtitle}
                </h2>
                <ul className="text-slate-500 sm:text-base md:text-lg lg:text-xl my-4 mb-8 dark:text-slate-400 tracking-wide font-semibold">
                    {keypoints.map((keypoint, index) => (
                        <li key={index}>{keypoint}</li>
                    ))}
                </ul>
                <Image src={image} alt="image alt" />
                
                <button
                ref={buttonRef} // Assign the ref to the button element
                className="inline-flex h-16 w-full mt-8 animate-shimmer items-center justify-center rounded-md border border-slate-400 dark:border-slate-800 bg-[linear-gradient(110deg,#cbd5e1,45%,#f1f5f9,55%,#cbd5e1)] dark:bg-[linear-gradient(110deg,#000103,80%,#1e2631,90%,#000103)] bg-[length:200%_100%] px-8 py-8 text-base md:text-xl font-bold text-slate-800 dark:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 tracking-wide"
                onClick={() => {
                    if (buttonRef.current) {
                        window.location.href = buttonlink; // Navigate to the link when button clicked
                    }
                }}
            >
                Read Full Case Study ➜
            </button>

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

