"use client";
import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "../Animations/lampAnimation";

export function Lamp() {
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className=" bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text text-center sm:text-xl font-bold tracking-wide text-transparent md:text-3xl lg:text-5xl"
      >
        Here is my selected work to showcase
      </motion.h1>
    </LampContainer>
  );
}
