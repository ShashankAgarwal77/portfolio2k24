import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
}: {
  words: string;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inViewport, setInViewport] = useState(false);
  let wordsArray = words.split(" ");

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const { top } = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Check if the container is in the viewport
      if (top < windowHeight && !inViewport) {
        setInViewport(true);
      }
    };

    // Attach scroll event listener
    window.addEventListener("scroll", handleScroll);
    // Call the handleScroll initially to check if the element is already in view on page load
    handleScroll();

    return () => {
      // Clean up by removing the scroll event listener
      window.removeEventListener("scroll", handleScroll);
    };
  }, [inViewport]);

  const renderWords = () => {
    return (
      <div ref={containerRef}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: inViewport ? 1 : 0 }} // Animate opacity based on inViewport state
              transition={{ duration: 1, delay: inViewport ? idx * 0.2 : 0 }} // Transition duration and delay based on inViewport state
              className="dark:text-white text-black"
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </div>
    );
  };

  return (
    <div className={cn("font-medium", className)}>
      <div className="mt-4">
        <div className="dark:text-white text-black text-6xl leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};