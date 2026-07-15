import React, { useRef } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string | JSX.Element;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  const backgroundColors = [
    "var(--slate-900)",
    "var(--black)",
    "var(--neutral-900)",
  ];
  const linearGradients = [
    "linear-gradient(to bottom right, var(--cyan-500), var(--emerald-500))",
    "linear-gradient(to bottom right, var(--pink-500), var(--indigo-500))",
    "linear-gradient(to bottom right, var(--orange-500), var(--yellow-500))",
  ];
  return (
    <motion.div
      // animate={{
      //   backgroundColor: backgroundColors[activeCard % backgroundColors.length],
      // }}
      className="h-[26rem] lg:h-[38rem] overflow-y-auto flex justify-center relative gap-x-8 rounded-md py-2 lg:py-8 scrollbar-hide"
      ref={ref}
    >
      <div className="div relative flex items-start px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => {
            const isActive = activeCard === index;
            return (
              <div key={item.title + index} className="my-14 lg:my-16">
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: isActive ? 1 : 0.5,
                    y: isActive ? 0 : 4,
                  }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-x-3 text-[clamp(1.5rem,3.2vw,2.5rem)] font-bold leading-[1.15] tracking-wide text-slate-700 dark:text-slate-100 text-balance"
                >
                  <motion.span
                    aria-hidden
                    animate={{
                      height: isActive ? 28 : 12,
                      opacity: isActive ? 1 : 0.35,
                    }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="hidden lg:block w-[3px] shrink-0 rounded-full bg-gradient-to-b from-slate-400 to-slate-600 dark:from-slate-200 dark:to-slate-500"
                  />
                  {item.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: isActive ? 1 : 0.5,
                    y: isActive ? 0 : 4,
                  }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="text-base lg:text-lg leading-relaxed text-slate-500 dark:text-slate-300 max-w-md mt-4 lg:pl-6"
                >
                  {item.description}
                </motion.p>
              </div>
            );
          })}
          <div className="h-24" />
        </div>
      </div>
      <motion.div
        animate={{
          background: linearGradients[activeCard % linearGradients.length],
        }}
        className={cn(
          "hidden lg:block h-[24rem] w-[20rem] xl:h-[28rem] xl:w-[24rem] shrink-0 rounded-2xl bg-white sticky top-10 overflow-hidden shadow-xl shadow-black/10 dark:shadow-black/40",
          contentClassName
        )}
      >
        {content[activeCard].content ?? null}
      </motion.div>
    </motion.div>
  );
};

