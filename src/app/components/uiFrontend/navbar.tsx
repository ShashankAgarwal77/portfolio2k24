"use client";
import React, { useState, useEffect } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "../Animations/floating-navbar";
import { cn } from "@/app/lib/utils";
import Image from 'next/image'; // Import next/image component
import Link from 'next/link';
import ThemeSwitcher from "./themeToggle";

import logo from '@/app/Assets/Images/Logo.svg';

import photographyImage from '@/app/Assets/Images/photography.png';
import visualArtsImage from '@/app/Assets/Images/visualarts.png';

export function NavbarComp({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, visible]);

  return (
    <div
      className={cn("navbar_comp flex flex-col justify-between center fixed top-10 inset-x-0 mx-auto z-50 text-xl transition-all tracking-wide", className, {
        "opacity-0": !visible,
        "pointer-events-none": !visible,
      })}
      style={{ justifyContent: "center" }}
    >
      <div className="flex justify-between items-center px-12 font-medium">
        <div />
        <Menu setActive={setActive}>
          <div className="flex items-center justify-around px-10 space-x-16">
            <MenuItem setActive={setActive} active={active} item="Hobby">
              <div className="sm:text-sm md:text-md lg:text-lg grid grid-cols-2 space-x-6 gap-y-12 p-6 tracking-wide">
                <ProductItem
                  title="Photography"
                  href="/photography"
                  src={photographyImage}
                  description="I like to click photos whenever I am traveling or seeing something unique."
                />
                <ProductItem
                  title="Visual Arts"
                  href="/visualarts"
                  src={visualArtsImage}
                  description="I like to create visual arts such as posters whenever I am free at my home."
                />
                {/* Other ProductItems */}
              </div>
            </MenuItem>

            <HoveredLink href="/about">About</HoveredLink>

            <Link href="/">
              <Image src={logo} alt="Logo" className="w-40 h-16 invert dark:invert-0" />
            </Link>

            <HoveredLink href="https://www.linkedin.com/in/shashank-agarwal11/">LinkedIn</HoveredLink>
            <HoveredLink href="https://drive.google.com/file/d/1dWgaWeqD8EsBbjOWrhcEDRfzTxshB36I/view?usp=sharing">Resume</HoveredLink>
          </div>
        </Menu>
      <ThemeSwitcher />


      </div>
    </div>
  );
}
