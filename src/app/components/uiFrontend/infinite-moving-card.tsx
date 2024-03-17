"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "../Animations/infinite-moving-cards-animation";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-full rounded-md flex flex-col antialiased dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

const testimonials = [
  {
    quote:
      "As a fellow product designer, I've seen his talent firsthand. With two years of experience, he's achieved notable success.",
    name: "Pragadeesh K.",
    title: "Product Designer",
    image: "https://media.licdn.com/dms/image/D5603AQGAXOjS62kNog/profile-displayphoto-shrink_800_800/0/1643819376224?e=2147483647&v=beta&t=3oop97geEr-xB0BMbw4_Px0Osmk9WvMV9O1q7k_s1PQ",
  },

  {
    quote:
      "Working with him is a pleasure! His creativity and attention to detail in digital product design are impressive. Every collaboration results in high-quality outcomes. He brings joy and innovation to every project, making it enjoyable to work with him.",
    name: "Manikandan L.",
    title: "Product Designer",
    image: "https://media.licdn.com/dms/image/C5603AQEwaeObOoEwtg/profile-displayphoto-shrink_200_200/0/1642662557097?e=1714608000&v=beta&t=cF3JQC1BiMahsZR7qHNpAlw6qYOuVujhJKU2sqeH59o",
  },

  {
    quote: 
      "Shashank is skilled at transforming ideas into visually captivating digital products. With two years of experience, he's making a mark in the industry, and I'm interested to see his future growth",
    name: "Harsh Gupta",
    title: "Frontend Developer",
    image: "https://media.licdn.com/dms/image/C5603AQHrFC8KXcV8Pg/profile-displayphoto-shrink_200_200/0/1648401026640?e=1715212800&v=beta&t=XhTdn3kqzAI2o_Qv6obmXevPoBSOj9Kdmcg0L70FZnY",
  },

  {
    quote:
      "He's dedicated and passionate about design. With two years of experience, he's already established himself in digital product design.",
    name: "Devesh Kumar Singh",
    title: "Backend Developer",
    image: "https://media.licdn.com/dms/image/C4E03AQFfy6T2UWMQwg/profile-displayphoto-shrink_800_800/0/1606845882302?e=1715212800&v=beta&t=X6j5KDed6Gq9MS6HFdsuk6dDe71ZQLGpnIRutNNN_dE",
  },

  {
    quote:
      "Shashank is a positive presence in the design community! Collaborating with him is always enjoyable. With just two years of experience, he consistently delivers impressive designs.",
    name: "Nithesh Kamatchi",
    title: "Mobile Developer",
    image: "https://media.licdn.com/dms/image/D5603AQHdzu5_AeHJqg/profile-displayphoto-shrink_800_800/0/1701429974032?e=1715212800&v=beta&t=3wP1-s-ryxQuIOAvc4_6PcrzVncqRkgReNunPAIYz7E",
  },
];
