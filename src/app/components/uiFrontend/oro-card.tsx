"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CardBody, CardContainer, CardItem } from "../Animations/3d-card";

import OroThumbnail from '../../Assets/Images/Introduction.png';

export function OroCard() {
  return (
    <div className="sm:mx-10 md:mx-20 lg:mx-10">
      <CardContainer
        className="inter-var"
        containerClassName="w-full max-w-[80rem]"
      >
        <CardBody className="bg-gray-50 px-12 py-10 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl border hover:border-slate-600 mx-auto">
          <CardItem
            translateZ="10"
            className="sm:text-lg md:text-2xl lg:text-4xl font-bold tracking-wide text-slate-600 dark:text-white"
          >
            Orocorp - Digitizes and Maximizes user&apos;s gold potential
          </CardItem>
          <CardItem
            as="p"
            translateZ="10"
            className="text-slate-500 sm:text-sm md:text-lg lg:text-2xl my-4 mb-8 dark:text-slate-500 tracking-wide"
          >
            Redefining the way people get gold loan in India <br />
          </CardItem>
          <CardItem
            as="p"
            translateZ="10"
            className="text-slate-500 sm:text-sm md:text-lg lg:text-xl my-4 mb-8 dark:text-slate-400 tracking-wide"
          >
            Key Takeaways : <br />
            1. Reducing the gold loan booking time from 45 minutes to ~28 minutes <br />
            2. Increasing the user engagement from 13.74% to 23.54% <br />
            3. Achieving higher customer satisfaction and conversion rate <br />
          </CardItem>

          <CardItem translateZ="10" className="w-full mt-4">
            <Image
              src={OroThumbnail}
              className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt="thumbnail"
            />
          </CardItem>
          <Link href="/oro">
          <div className="flex justify-between items-center mt-10">
            <CardItem
              // translateZ={20}
              as="button"
              className="inline-flex h-16 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-8 py-8 text-xl font-bold text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 tracking-wide"
            >
              Read Full Case Study ➜
            </CardItem>
          </div>
          </Link>
          
        </CardBody>
      </CardContainer>
    </div>
  );
}
