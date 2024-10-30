"use client";

import React from "react";
import { FloatingDock } from "@/app/components/Animations/floating-dock";
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";

import { 
    Home12Icon,
    Camera01Icon,
    BrushIcon,
    UserIcon,
    Linkedin02Icon,
    LicenseIcon
 } from "hugeicons-react";

import ThemeSwitcher from "./themeToggle"; 

export function FloatingDockUI() {
  const links = [
    {
      title: "Home",
      icon: <Home12Icon className="h-full w-full text-slate-500 dark:text-slate-300" />,
      href: "/",
    },
    {
      title: "Photography",
      icon: <Camera01Icon className="h-full w-full text-slate-500 dark:text-slate-300" />,
      href: "/photography",
    },
    {
      title: "Visual Arts",
      icon: <BrushIcon className="h-full w-full text-slate-500 dark:text-slate-300" />,
      href: "/visualarts",
    },
    {
      title: "About",
      icon: <UserIcon className="h-full w-full text-slate-500 dark:text-slate-300" />,
      href: "/about",
    },
    {
      title: "LinkedIn",
      icon: <Linkedin02Icon className="h-full w-full text-slate-500 dark:text-slate-300" />,
      href: " https://www.linkedin.com/in/shashank-agarwal11/",
    },
    {
      title: "Resume",
      icon: <LicenseIcon className="h-full w-full text-slate-500 dark:text-slate-300" />,
      href: "https://drive.google.com/file/d/1dWgaWeqD8EsBbjOWrhcEDRfzTxshB36I/view?usp=sharing",
    },
    {
        title: "Theme",
        icon: <ThemeSwitcher />,
        href: "#",
    },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 pb-4 flex justify-center z-50">
      <FloatingDock items={links} />
    </div>
  );
}
