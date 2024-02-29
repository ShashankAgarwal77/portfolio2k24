"use client";
import React from "react";
import Image from "next/image";


import { AnimatedTooltip } from "../Animations/animated-tooltip-animation";
const people = [
  {
    id: 1,
    name: "Sreekesh Krishnan",
    designation: "Co-founder, CTO",
    image:
      "https://media.licdn.com/dms/image/C5603AQEH89D2VFbOug/profile-displayphoto-shrink_800_800/0/1604412632340?e=2147483647&v=beta&t=ESGUVMLX-ABSKmB6iUBOPJvIjEsiyatH2mG0qnPLtbk",
  },
  {
    id: 2,
    name: "Pragadeesh Kannan",
    designation: "Product Designer",
    image:
      "https://media.licdn.com/dms/image/D5603AQGAXOjS62kNog/profile-displayphoto-shrink_800_800/0/1643819376224?e=2147483647&v=beta&t=3oop97geEr-xB0BMbw4_Px0Osmk9WvMV9O1q7k_s1PQ",
  },
  {
    id: 3,
    name: "Manikandan Loganadin",
    designation: "Product Designer",
    image:
      "https://media.licdn.com/dms/image/C5603AQEwaeObOoEwtg/profile-displayphoto-shrink_200_200/0/1642662557097?e=1714608000&v=beta&t=cF3JQC1BiMahsZR7qHNpAlw6qYOuVujhJKU2sqeH59o",
  },
  {
    id: 4,
    name: "Dhruv Bhatnagar",
    designation: "SWE",
    image:
      "https://media.licdn.com/dms/image/C4E03AQGA9Cp4nLU2fg/profile-displayphoto-shrink_800_800/0/1638794682452?e=2147483647&v=beta&t=qrldPZVwMZBQkq3D79ijmz9TkemNEWkJX7e-nHKLG9Q",
  },
  {
    id: 5,
    name: "Soundarya Ramesh",
    designation: "Visual Designer",
    image:
      "https://mir-s3-cdn-cf.behance.net/user/276/2ec456193112179.5b72cf801d171.jpg",
  },
  {
    id: 6,
    name: "Yash Satechi",
    designation: "Product Manager",
    image:
      "https://media.licdn.com/dms/image/C4E03AQEx3ZdROdGKbw/profile-displayphoto-shrink_800_800/0/1583702518673?e=1714608000&v=beta&t=558AgC479w6_5RHnMpuZjsGSngIojyV-N1dlvdh28S8",
  },
];

export function AnimatedTooltipCard() {
  return (
    <div className="flex flex-row items-center mb-10 w-80">
      <AnimatedTooltip items={people} />
    </div>
  );
}
