import React from "react";
import Image from "next/image";
import { MacbookScroll } from "../Animations/macbook-scroll-animation";
import Link from "next/link";

import OroThumbnail from '../../Assets/Images/oro-macbook.png';

export function MacbookScrollComp() {
  return (
    <div className="overflow-hidden dark:bg-[#020617] bg-white w-full">
      <MacbookScroll
        title={
          <span className="text-6xl ">
            Redefining the way people get gold loan in india.
          </span>
        }
        src={OroThumbnail.src}
        showGradient={false}
      />
    </div>
  );
}
