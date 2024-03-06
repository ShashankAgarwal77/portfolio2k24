"use client";
import React from "react";
import { StickyScroll } from "../Animations/sticky-scroll-animation";
import Image from "next/image";

import Profile01 from '@/app/Assets/Images/aboutMe/Profile_01.jpg';
import Profile02 from '@/app/Assets/Images/aboutMe/Profile_02.jpg';
import Landscape01 from '@/app/Assets/Images/aboutMe/Landscape_01.jpg';
import Landscape02 from '@/app/Assets/Images/aboutMe/Landscape_02.jpg';
import Landscape03 from '@/app/Assets/Images/aboutMe/Landscape_03.jpg';

const content = [
  {
    title: "My background in Engineering",
    description:
      <>
        In March of 2022, I graduated from computer science school at the Galgotias University. There, I became obsessed with frontend code visualization. <br />
        <br />
        I was deeply fascinated in the concepts of modularity and adaptability — how written code renders on the screens gives me dopamine.
      </>,

    content: (
      <Image
        src={Profile01}
        width={1080}
        height={1080}
        className="h-full w-full object-cover"
        alt="linear board demo"
      />
    ),
  },
  {
    title: "But I wanted more",
    description:
      <>
        Though I loved the freedom of academic practice, I was greatly dissatisfied with just how slow the industry actually moved. <br />
        <br />
        I wanted to push my design craft at a faster pace and have a positive impact on vastly more people.
      </>,
    content: (
      <div className="h-full w-full  flex items-center justify-center text-white">
        <Image
          src={Landscape01}
          width={1080}
          height={1080}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "This thing called UX?",
    description:
      <>
        When the pandemic struck, I took it as an opportunity to explore new things. I came across creative competitions such as Augumented Reality Design and Development, and thought it might be fun to just give it a go. <br />
        <br />
        Long story short, my failures eventually turned into successes, and the rest was history.
      </>,
    content: (
      <Image
        src={Landscape02}
        width={1080}
        height={1080}
        className="h-full w-full object-cover"
        alt="linear board demo"
      />
    ),
  },
  {
    title: "Making it all happen.",
    description:
      <>
        To my advantage, I was able leverage a lot of the technical skills and I had picked up during computer science school to greatly expedite my journey of self-learning UX Design. <br />
        <br />
        I loved solving problems by making stuff, and really valued visual storytelling and paying meticulous attention to precision and craftsmanship.
      </>,
    content: (
      <Image
        src={Landscape03}
        width={300}
        height={300}
        className="h-full w-full object-cover"
        alt="linear board demo"
      />
    ),
  },
  {
    title: "In my spare time,",
    description:
      <>
        I'm probably making tweaks to my portfolio or hanging out with my buddies in design or tech. <br />
        <br />
        Other than that, you'll find me hitting the gym, gaming, and trying to get my hands on the latest tech.
      </>,
    content: (
      <Image
        src={Profile02}
        width={300}
        height={300}
        className="h-full w-full object-cover"
        alt="linear board demo"
      />
    ),
  },
];
export function StickyScrollRevealDemo() {
  return (
    <div className="">
      <StickyScroll content={content} />
    </div>
  );
}
