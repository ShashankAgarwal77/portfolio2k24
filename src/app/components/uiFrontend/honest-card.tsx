"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CardBody, CardContainer, CardItem } from "../Animations/3d-card";

import HonestThumbnail from '../../Assets/Images/HonestIntroduction.png';

export function HonestCard() {
  return (
    <div className="">
      <CardContainer
        className="inter-var"
        containerClassName="w-full"
      >
        <CardBody className="bg-gray-50 px-12 py-10 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl border hover:border-slate-400 dark:hover:border-slate-600 mx-auto">
          <CardItem
            translateZ="10"
            className="text-2xl lg:text-4xl font-bold tracking-wide text-slate-600 dark:text-white"
          >
            Honest Bites - UI/UX Case Study
          </CardItem>
          <CardItem
            as="p"
            translateZ="10"
            className="text-slate-500 sm:text-sm md:text-lg lg:text-2xl my-4 dark:text-slate-500 tracking-wide"
          >
            Unveiling a World of Culinary Experience <br />
          </CardItem>
          <CardItem
            as="p"
            translateZ="10"
            className="text-slate-500 sm:text-sm md:text-lg lg:text-xl my-4 mb-8 dark:text-slate-400 tracking-wide"
          >
            Key Takeaways : <br />
            1. Hobby Project <br />
            2. Solves the trust and authencity problem in food delivery sector <br />
            3. Demonstrate the vast variety of UI and UX Practices to achieve the validation of problem and solution hypothesis <br />
          </CardItem>

          <CardItem translateZ="10" className="w-full mt-4">
            <Image
              src={HonestThumbnail}
              className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt="thumbnail"
            />
          </CardItem>
          <Link href="/honest">
          <div className="flex justify-between items-center mt-10">
            <CardItem
              // translateZ={20}
              as="button"
              className="inline-flex h-16 animate-shimmer items-center justify-center rounded-md border border-slate-400 dark:border-slate-800 bg-[linear-gradient(110deg,#cbd5e1,45%,#f1f5f9,55%,#cbd5e1)] dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-8 py-8 text-xl font-bold text-slate-800 dark:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 tracking-wide"
              
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
