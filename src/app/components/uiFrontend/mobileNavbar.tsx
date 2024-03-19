"use client";

import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "../Animations/floating-navbar";
import { cn } from "@/app/lib/utils";
import Image from 'next/image';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import FaBars and FaTimes icons

import logo from '@/app/Assets/Images/Logo.svg';
import photographyImage from '@/app/Assets/Images/photography.png';
import visualArtsImage from '@/app/Assets/Images/visualarts.png';
import ThemeSwitcher from "./themeToggle";

function MobileNavbar({ className }: { className?: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility
  const [isCloseIcon, setIsCloseIcon] = useState(false); // State to manage close icon visibility
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsCloseIcon(!isCloseIcon);
  };

  return (
    <div className={cn("fixed top-0 left-0 right-0 z-50 dark:bg-black/[0.8] bg-white shadow-input flex flex-col justify-center px-2 py-2 ", className)}>
      <div className="flex items-center justify-between px-4 py-2">
        {/* Hamburger Icon */}
        {isCloseIcon ? ( // Conditionally render close icon
          <FaTimes className="text-3xl cursor-pointer text-slate-200" onClick={handleToggleMenu} />
        ) : (
          <FaBars className="text-3xl cursor-pointer text-slate-200" onClick={handleToggleMenu} />
        )}

        {/* Logo */}
        <Link href="/">
          <Image src={logo} alt="Logo" className="w-32 h-16 invert dark:invert-0" />
        </Link>

        <ThemeSwitcher />
      </div>

      {/* Menu */}
      <div className={cn("transition-all duration-300", { "max-h-0 opacity-0": !isMenuOpen, "max-h-screen opacity-100": isMenuOpen })}>
        <Menu setActive={setActiveItem}>
          {/* Product Item */}
          <div className="flex flex-col text-center text-xl py-4 gap-y-4">
            <MenuItem setActive={setActiveItem} active={activeItem} item="Hobby">
              <div className="sm:text-sm md:text-md lg:text-lg p-6 tracking-wide">
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

            {/* Hovered Links */}
            <HoveredLink href="/about" onClick={() => { setIsMenuOpen(false); setIsCloseIcon(false); }}>About</HoveredLink>
            <HoveredLink href="https://www.linkedin.com/in/shashank-agarwal11/" onClick={() => { setIsMenuOpen(false); setIsCloseIcon(false); }}>LinkedIn</HoveredLink>
            <HoveredLink href="https://drive.google.com/file/d/1dWgaWeqD8EsBbjOWrhcEDRfzTxshB36I/view?usp=sharing" onClick={() => { setIsMenuOpen(false); setIsCloseIcon(false); }}>Resume</HoveredLink>
          </div>
        </Menu>
      </div>
    </div>
  );
}

export default MobileNavbar;

