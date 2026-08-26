"use client";

import React from "react";
import { FloatingDock } from "@/app/components/Animations/floating-dock";

/* Phosphor at weight="light": one consistent 1.5-unit outline across the
   whole dock, airy enough to sit on the moonlit glass without reading as
   ink blots. Solid/fill weights fight the frosted-glass chrome; heavier
   outlines fight the hairline borders and star trails. */
import {
  House,
  User,
  LinkedinLogo,
  ReadCvLogo,
} from "@phosphor-icons/react";

import ThemeSwitcher from "./themeToggle";

const iconClass = "h-full w-full text-slate-600 dark:text-slate-200";

export function FloatingDockUI() {
  const links = [
    {
      title: "Home",
      icon: <House weight="light" className={iconClass} />,
      href: "/",
    },
    {
      title: "About",
      icon: <User weight="light" className={iconClass} />,
      href: "/about",
    },
    {
      title: "LinkedIn",
      icon: <LinkedinLogo weight="light" className={iconClass} />,
      href: " https://www.linkedin.com/in/shashank-agarwal11/",
    },
    {
      title: "Resume",
      icon: <ReadCvLogo weight="light" className={iconClass} />,
      href: "/Shashank-Agarwal-Resume.pdf",
      target: "_blank",
    },
    {
        title: "Theme",
        icon: <ThemeSwitcher />,
        href: "#",
    },
  ];

  return (
    /* The positioning wrapper spans the full viewport width but only the
       centred dock is ever drawn, so left to itself it becomes an invisible
       band across the bottom of every page that swallows clicks on whatever
       sits underneath it — the case-study switcher rail, most visibly.
       pointer-events-none makes the empty space transparent to the pointer;
       the dock itself takes them back. */
    <div className="pointer-events-none fixed bottom-0 inset-x-0 pb-4 flex justify-center z-50">
      <div className="pointer-events-auto">
        <FloatingDock items={links} />
      </div>
    </div>
  );
}
