"use client";

import { cn } from "@/app/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
    image: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20  max-w-7xl overflow-hidden  [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          " flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && "animate-scroll ",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            className="w-[300px] max-w-full relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-400 dark:border-slate-700 px-6 py-6 md:w-[380px] bg-gradient-to-b from-slate-200 to-slate-300 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-900"
            key={item.name}
          >
            {/* Add the testimonial user image */}

            <blockquote className="flex h-full flex-col justify-between gap-y-5">
              <div
                aria-hidden="true"
                className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>

              {/* Testimonial quote */}
              <span className="relative z-20 text-base lg:text-lg leading-[1.55] text-slate-700 dark:text-slate-100 font-normal text-balance">
                {item.quote}
              </span>

              {/* Testimonial name and title */}
              <div className="relative z-20 flex flex-row items-center">
                <span className="flex-shrink-0">
                  {/* Testimonial user image */}
                  <img
                    src={item.image} // Assuming item has a property `image` containing the URL of the user image
                    alt={item.name} // Provide appropriate alt text for accessibility
                    className="w-11 h-11 rounded-full object-cover"
                  />
                </span>

                <span className="flex flex-col ml-3">
                  <span className="text-sm lg:text-base leading-snug text-slate-700 dark:text-slate-200 font-semibold">
                    {item.name}
                  </span>
                  <span className="text-xs lg:text-sm leading-snug text-slate-500 dark:text-slate-400 font-normal">
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
