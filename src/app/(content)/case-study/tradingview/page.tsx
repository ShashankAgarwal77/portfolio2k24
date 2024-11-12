"use client";

import { useEffect, useRef, useState } from 'react';
import Image from "next/image";

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
