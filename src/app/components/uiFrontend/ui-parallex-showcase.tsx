"use client";
import { motion } from "framer-motion";
import React from "react";
import { ImagesSlider } from "../Animations/images-slider";

export function ImagesSliderDemo() {
  const images = [
    "https://cdn.dribbble.com/userupload/13618645/file/original-40d2e2209c93ab03006ef5bec987e1ec.png?resize=1024x665",
    "https://cdn.dribbble.com/userupload/13618646/file/original-ba4b15e4f0d5d60a3832a74d248b964d.png?resize=1024x1024&vertical=center",
    "https://cdn.dribbble.com/userupload/13618647/file/original-576b3cf9d10bae47013e9a794f544376.png?resize=1024x1024&vertical=center",
    "https://cdn.dribbble.com/userupload/13245350/file/original-f00effe6d8c656f3071388038918277f.png?resize=1024x768",
    "https://cdn.dribbble.com/userupload/13245352/file/original-332890b74ba0d35833be46751bddc1ed.png?resize=1024x768&vertical=center",
    "https://cdn.dribbble.com/userupload/13245351/file/original-bd4ba4e67030eb40867206c0d0585eef.png?resize=1024x768&vertical=center",
    "https://cdn.dribbble.com/userupload/13245353/file/original-da1729c2e8ef8fe9f96c5a4d7ca21a54.png?resize=1024x768&vertical=center",
    "https://cdn.dribbble.com/userupload/13245349/file/original-348bb8b8402c1bf48903831133acc31b.png?resize=1024x768&vertical=center",
  ];
  return (
    <ImagesSlider className="h-full border border-slate-800 w-full rounded-xl" images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        {/* <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
          The hero section slideshow <br /> nobody asked for
        </motion.p>
        <button className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4">
          <span>Join now →</span>
          <div className="absolute inset-x-0  h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
        </button> */}
      </motion.div>
    </ImagesSlider>
  );
}
