"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative ">
      <motion.p
        transition={{ duration: 0.3 }}
        className="group relative cursor-pointer text-black hover:text-gray-400 dark:text-white overflow-hidden"
      >
        <span className="inline-block transition duration-500 ease-out group-hover:-translate-y-[120%]">{item}</span>
        <span className="absolute left-0 translate-y-[120%] rotate-12 inline-block transition duration-500 ease-out group-hover:translate-y-0 group-hover:rotate-0">{item}</span>
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.7rem)] left-1/2 transform -translate-x-1/2">
              <motion.div
                transition={transition}
                layoutId="active" // layoutId ensures smooth animation
                className="bg-white dark:bg-black/[0.8] backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl"
              >
                <motion.div
                  layout // layout ensures smooth animation
                  className="w-max h-full p-4"
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)} // resets the state
      className="relative rounded-full border border-slate-200 dark:bg-black/[0.8] dark:border-white/[0.2] bg-white shadow-input flex justify-center px-6 py-2"
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: StaticImageData;
}) => {
  return (
    <Link href={href} className="flex space-x-4">
      <Image
        src={src}
        width={140}
        height={70}
        alt={title}
        className="flex-shrink-0 rounded-md shadow-2xl"
      />
      <div>
        <h4 className="md:text-lg lg:text-xl font-bold mb-1 text-black dark:text-white tracking-wide">
          {title}
        </h4>
        <p className="font-normal text-neutral-700 md:text-md lg:leading-relaxed lg:text-lg tracking-wide max-w-[16rem] dark:text-neutral-300">
          {description}
        </p>
      </div>
    </Link>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <Link
      {...rest}
      className="group relative cursor-pointer text-black hover:text-gray-400 dark:text-white overflow-hidden"
    >
      <span className="inline-block transition duration-500 ease-out group-hover:-translate-y-[120%]"> {children} </span>
      <span className="absolute left-0 translate-y-[120%] rotate-12 inline-block transition duration-500 ease-out group-hover:translate-y-0 group-hover:rotate-0"> {children} </span>
    </Link>
  );
};