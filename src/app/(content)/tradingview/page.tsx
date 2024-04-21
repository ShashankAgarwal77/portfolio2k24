"use client";

import { useEffect, useRef, useState } from 'react';
import Image from "next/image";
import { TracingBeam } from "@/app/components/Animations/tracing-beam-animation";
import { AnimatedTooltipCard } from "@/app/components/uiFrontend/animated-tooltip";
import { SpotlightPreview } from "@/app/components/uiFrontend/spotlight";

import Introduction from "@/app/Assets/Images/TradingView/Introduction.png";
import WorkInProgess from "@/app/Assets/Images/TradingView/Work in Progress.png";

export default function TracingBeamDemo() {
    const sidebarRef = useRef<HTMLDivElement | null>(null);
    const [activeSection, setActiveSection] = useState<number | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const sections = document.querySelectorAll("[id^='content-']");

            sections.forEach((section, index) => {
                const { top, bottom } = section.getBoundingClientRect();

                // Check if the section is at least 50% visible in the viewport
                if (top < windowHeight * 0.5 && bottom > windowHeight * 0.5) {
                    setActiveSection(index);
                }
            });
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="flex flex-col justify-between">

            <SpotlightPreview />

            {/* Main Content Reference */}
            <TracingBeam className="px-6 xl:max-w-5xl mx-auto my-40 overflow-y-clip">
                <div className="mx-auto antialiased pt-8 relative">
                    {dummyContent.map((item, index) => (
                        <div key={`content-${index}`} id={`content-${index}`} className="mb-10">
                            <p className="bg-black/[0.1] dark:bg-white/[0.1] text-gray-800 dark:text-gray-400 rounded-full sm:text-sm md:text-md lg:text-xl w-fit px-4 py-1 mb-4 font-bold">
                                {item.badge}
                            </p>
                            <h2 className="sm:leading-loose tracking-wide sm:text-xl md:leading-loose md:text-xl lg:leading-normal lg:text-4xl text-black dark:text-white sm:mb-4 md:mb-6 lg:mb-8 font-semibold">
                                {item.title}
                            </h2>
                            <div className="md:leading-normal md:text-sm lg:leading-loose lg:text-lg tracking-wide text-slate-700 dark:text-slate-300 prose prose-sm dark:prose-invert">
                                {item.images && item.images.map((image, imgIndex) => (
                                    <Image
                                        key={`image-${imgIndex}`}
                                        src={image as any} // Type assertion
                                        alt={`blog thumbnail ${imgIndex}`}
                                        height="2000"
                                        width="2000"
                                        className="rounded-lg object-cover"
                                    />
                                ))}
                                {item.description}
                            </div>
                        </div>
                    ))}
                </div>
            </TracingBeam>
                
            {/* Sidebar Reference */}
            <div className="hidden lg:flex fixed mx-10 my-40">
                <div ref={sidebarRef} className="flex flex-col relative items-start">
                    <h2 className="text-slate-200 dark:text-slate-600 text-md uppercase font-bold mb-4">Content</h2>
                    <ul className="space-y-4 w-48">
                        {dummyContent.map((item, index) => (
                            <li key={`sidebar-item-${index}`}>
                                <a
                                    href={`#content-${index}`}
                                    className={`text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-white ${activeSection === index ? "text-slate-900 dark:text-white" : ""}`}
                                >
                                    {item.badge}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}


const dummyContent = [
    {
        title: "Scale-In : Building Design Harmony for Trading View’s Future",
        description: (
            <>

            </>
        ),
        badge: "Introduction",
        images: [Introduction],
    },

    {
        // title: "Scale-In : Building Design Harmony for Trading View’s Future",
        description: (
            <>
            
            </>
        ),
        badge: "Work In Progress",
        images: [WorkInProgess],
    },
];
