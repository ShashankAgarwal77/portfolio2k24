"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "../Animations/infinite-moving-cards-animation";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-full rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
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
      "Shashank is a talented and creative product designer. They deliver high-quality work on time and collaborate well with others.",
    name: "Pragadeesh K.",
    title: "Product Designer",
    image: "https://media.licdn.com/dms/image/D5603AQGAXOjS62kNog/profile-displayphoto-shrink_800_800/0/1643819376224?e=2147483647&v=beta&t=3oop97geEr-xB0BMbw4_Px0Osmk9WvMV9O1q7k_s1PQ",
  },

  {
    quote:
      "Shashank is a passionate and innovative product designer. They create beautiful and functional digital products and learn new skills and technologies.",
    name: "Manikandan L.",
    title: "Product Designer",
    image: "https://media.licdn.com/dms/image/C5603AQEwaeObOoEwtg/profile-displayphoto-shrink_200_200/0/1642662557097?e=1714608000&v=beta&t=cF3JQC1BiMahsZR7qHNpAlw6qYOuVujhJKU2sqeH59o",
  },

  {
    quote:
      "Shashank is an amazing product designer with a great sense of style and flair. They design stunning and user-friendly digital products and are kind and generous",
    name: "Harsh Gupta",
    title: "Frontend Developer",
    image: "https://media.licdn.com/dms/image/C5603AQHrFC8KXcV8Pg/profile-displayphoto-shrink_200_200/0/1648401026640?e=1715212800&v=beta&t=XhTdn3kqzAI2o_Qv6obmXevPoBSOj9Kdmcg0L70FZnY",
  },

  {
    quote:
      "Shashank is a brilliant and expert product designer. They understand the product design process and find elegant and effective solutions. They communicate clearly and concisely",
    name: "Devesh Kumar Singh",
    title: "Backend Developer",
    image: "https://media.licdn.com/dms/image/C4E03AQFfy6T2UWMQwg/profile-displayphoto-shrink_800_800/0/1606845882302?e=1715212800&v=beta&t=X6j5KDed6Gq9MS6HFdsuk6dDe71ZQLGpnIRutNNN_dE",
  },

  {
    quote:
      "Shashank is a fantastic and original product designer. They have a unique vision for creating digital products and master the latest design trends and tools. They are fun and friendly",
    name: "Nithesh Kamatchi",
    title: "Mobile Developer",
    image: "https://media.licdn.com/dms/image/D5603AQHdzu5_AeHJqg/profile-displayphoto-shrink_800_800/0/1701429974032?e=1715212800&v=beta&t=3wP1-s-ryxQuIOAvc4_6PcrzVncqRkgReNunPAIYz7E",
  },
];
