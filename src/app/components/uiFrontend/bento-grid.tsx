"use client";
import { cn } from "@/app/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { BentoGrid, BentoGridItem } from "../Animations/bento-grids";
import {
  IconBoxAlignRightFilled,
  IconClipboardCopy,
  IconFileBroken,
  IconSparkles,
  IconTableColumn,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { TextRevealCardPreview } from "./text-reveal-card";
import { GlowingStarsBackgroundCardPreview } from './glowing-stars';

export function BentoGridComp() {
  return (
    <BentoGrid className="max-w-8xl mx-auto md:auto-rows-[20rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={cn("[&>p:text-lg]", item.className)}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}
const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black"></div>
);

const SkeletonOne = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
    >
      <TextRevealCardPreview />
    </motion.div>
  );
};
const SkeletonTwo = () => {
  const variants = {
    initial: {
      width: 0,
    },
    animate: {
      width: "100%",
      transition: {
        duration: 0.2,
      },
    },
    hover: {
      width: ["0%", "100%"],
      transition: {
        duration: 2,
      },
    },
  };
  const arr = new Array(6).fill(0);
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
    >
      {arr.map((_, i) => (
        <motion.div
          key={"skelenton-two" + i}
          variants={variants}
          style={{
            maxWidth: Math.random() * (100 - 40) + 40 + "%",
          }}
          className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2  items-center space-x-2 bg-neutral-100 dark:bg-black w-full h-4"
        ></motion.div>
      ))}
    </motion.div>
  );
};
// AI-in-the-loop: a polished Matrix-style digital rain on a dark "terminal" tile.
//
// How it works:
//  - A <canvas> (DPR-scaled for retina, resized via ResizeObserver) fills the tile.
//  - Each column has a "drop" (row index of its leading glyph). Every capped
//    frame (~26fps) drops advance; glyphs flicker as they fall. The head glyph is
//    drawn brightest, with a trailing gradient fading up the column.
//  - Rest vs. hover is NOT a hard swap: render params (color, opacity, speed,
//    glow) are lerped toward per-state targets every frame, so it eases smoothly
//    (~300-500ms) from muted slate-green at rest into saturated Matrix green on hover.
//  - prefers-reduced-motion: no rAF loop — one static faint frame; hover just
//    repaints a brighter static frame (no falling motion).
const MATRIX_GLYPHS =
  "アカサタナハマヤラワイキシチニヒミリヰウクスツヌフムユルグゲゴ0123456789#$%&*<>/=+".split("");

const SkeletonThree = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  // Keep latest hover state readable inside the rAF loop without re-subscribing.
  const hoveredRef = useRef(false);
  hoveredRef.current = isHovered;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const fontSize = 14;
    let columns = 0;
    let drops: number[] = [];
    let cssWidth = 0;
    let cssHeight = 0;

    // Animated params that lerp toward hover/rest targets each frame.
    const params = { intensity: 0, hue: 0 }; // 0 = rest (muted), 1 = hover (green)

    const setupSize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      cssWidth = rect.width || canvas.clientWidth || 1;
      cssHeight = rect.height || canvas.clientHeight || 1;
      canvas.width = Math.floor(cssWidth * dpr);
      canvas.height = Math.floor(cssHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${fontSize}px monospace`;
      ctx.textBaseline = "top";
      columns = Math.max(1, Math.ceil(cssWidth / fontSize));
      drops = new Array(columns)
        .fill(0)
        .map(() => Math.floor((Math.random() * cssHeight) / fontSize));
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // Mix muted slate-green (rest) -> vivid matrix green (hover) by intensity.
    const trailColor = (t: number, alpha: number) => {
      const r = Math.round(lerp(90, 34, t));
      const g = Math.round(lerp(120, 197, t));
      const b = Math.round(lerp(100, 94, t));
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    const headColor = (t: number, alpha: number) => {
      const r = Math.round(lerp(150, 190, t));
      const g = Math.round(lerp(180, 255, t));
      const b = Math.round(lerp(160, 190, t));
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const drawFrame = () => {
      const t = params.intensity;
      // Fade the previous frame to build the trailing tails.
      ctx.fillStyle = "rgba(10, 10, 15, 0.10)";
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      const restAlpha = 0.18;
      const hoverAlpha = 0.85;
      const trailAlpha = lerp(restAlpha, hoverAlpha, t);

      for (let i = 0; i < columns; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        const glyph =
          MATRIX_GLYPHS[Math.floor(Math.random() * MATRIX_GLYPHS.length)];

        // Bright leading character, with a soft glow that grows on hover.
        ctx.shadowBlur = lerp(0, 8, t);
        ctx.shadowColor = headColor(t, 0.9);
        ctx.fillStyle = headColor(t, lerp(0.5, 1, t));
        ctx.fillText(glyph, x, y);
        ctx.shadowBlur = 0;

        // A dimmer glyph just above the head to suggest a falling trail.
        if (drops[i] > 0) {
          ctx.fillStyle = trailColor(t, trailAlpha);
          const prevGlyph =
            MATRIX_GLYPHS[Math.floor(Math.random() * MATRIX_GLYPHS.length)];
          ctx.fillText(prevGlyph, x, y - fontSize);
        }
      }
    };

    const advanceDrops = () => {
      for (let i = 0; i < columns; i++) {
        const y = drops[i] * fontSize;
        // Reset column to top randomly once it falls past the bottom.
        if (y > cssHeight && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i] += 1;
        }
      }
    };

    setupSize();

    // Reduced motion: paint a single static frame; repaint on hover changes only.
    if (reduceMotion) {
      const paintStatic = () => {
        params.intensity = hoveredRef.current ? 1 : 0;
        ctx.fillStyle = "#0a0a0f";
        ctx.fillRect(0, 0, cssWidth, cssHeight);
        drawFrame();
      };
      paintStatic();
      const ro = new ResizeObserver(() => {
        setupSize();
        paintStatic();
      });
      ro.observe(canvas);
      // Repaint when hover toggles (cheap polling, no animation).
      const poll = window.setInterval(() => {
        if ((hoveredRef.current ? 1 : 0) !== params.intensity) paintStatic();
      }, 120);
      return () => {
        ro.disconnect();
        window.clearInterval(poll);
      };
    }

    // Animated path: cap the rain cadence to ~26fps for a smooth, calm feel.
    let rafId = 0;
    let last = 0;
    const frameInterval = 1000 / 26;

    const loop = (now: number) => {
      rafId = requestAnimationFrame(loop);
      // Ease intensity toward the hover/rest target every rAF tick (~300-500ms).
      const target = hoveredRef.current ? 1 : 0;
      params.intensity = lerp(params.intensity, target, 0.08);

      if (now - last < frameInterval) return;
      last = now;
      drawFrame();
      advanceDrops();
    };

    // Solid dark backdrop before the first fade builds up.
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, cssWidth, cssHeight);
    rafId = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => {
      setupSize();
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, cssWidth, cssHeight);
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex flex-1 w-full h-full min-h-[6rem] rounded-lg overflow-hidden bg-[#0a0a0f] border border-transparent dark:border-white/[0.1]"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
};
const SkeletonFour = () => {
  const first = {
    initial: {
      x: 20,
      rotate: -5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  const second = {
    initial: {
      x: -20,
      rotate: 5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-row space-x-2"
    >
      <motion.div
        variants={first}
        className="h-full w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center "
      >
        <p className="text-4xl">💪</p>
        <p className="lg:text-base text-center border border-yellow-500 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 text-xs rounded-full px-2 py-0.5 mt-4">
        Build strong conviction
        </p>
        <p className="sm:text-sm text-xs lg:text-md text-center font-medium  text-neutral-600 dark:text-neutral-200 mt-4 tracking-wide ">
        Iterating and testing improves my decisions and work quality.
        </p>
        
      </motion.div>
      <motion.div className="h-full relative z-20 w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center">
        <p className="text-4xl">🧠</p>
        <p className="text-center border border-pink-500 bg-pink-100 dark:bg-pink-900/20 text-pink-600 text-xs lg:text-base rounded-full px-2 py-0.5 mt-4">
        Thoughtful complexity
        </p>
        <p className="sm:text-sm text-xs lg:text-md text-center font-medium  text-neutral-600 dark:text-neutral-200 mt-4 tracking-wide ">
        I enjoy solving hard problems with product thinking and teamwork.
        </p>
        
      </motion.div>
      <motion.div
        variants={second}
        className="h-full w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center "
      >
        <p className="text-4xl">🧘‍♂️</p>
        <p className="text-center border border-green-500 bg-green-100 dark:bg-green-900/20 text-green-600 text-xs lg:text-base rounded-full px-2 py-0.5 mt-4">
        Process oriented
        </p>
        <p className="sm:text-sm text-xs lg:text-md text-center font-medium  text-neutral-600 dark:text-neutral-200 mt-4 tracking-wide ">
        I collaborate to create a flexible and adaptable process.
        </p>
        
      </motion.div>
    </motion.div>
  );
};
const SkeletonFive = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] flex-col space-y-2"
    >
      <GlowingStarsBackgroundCardPreview />
    </motion.div>
  );
};
const items = [
  {
    title: "my career shift in hover",
    description: (
      <span className="text-sm">
        CS undergrad turned self-taught product designer.
      </span>
    ),
    header: <SkeletonOne />,
    className: "md:col-span-1",
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "design backed with strategy",
    description: (
      <span className="text-sm">
        Beauty is function, usability, and access — not just aesthetics.
      </span>
    ),
    header: <SkeletonTwo />,
    className: "md:col-span-1",
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "designing with AI in the loop",
    description: (
      <span className="text-sm">
        I ship production-ready frontends with Claude Code — problem to prod, faster.
      </span>
    ),
    header: <SkeletonThree />,
    className: "md:col-span-1",
    icon: <IconSparkles className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "my principles",
    description: (
      <span className="text-sm">
        The convictions I design and build by.
      </span>
    ),
    header: <SkeletonFour />,
    className: "md:col-span-2",
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },

  {
    title: "elevating experiences",
    description: (
      <span className="text-sm">
        Crafting interactions that genuinely resonate with people.
      </span>
    ),
    header: <SkeletonFive />,
    className: "md:col-span-1",
    icon: <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
  },

];


