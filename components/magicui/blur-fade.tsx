"use client";

import { useRef } from "react";
import { AnimatePresence, motion, useInView, type UseInViewOptions, type Variants } from "motion/react";

/** Magic UI — BlurFade. Sections resolve into focus as they arrive. */
export function BlurFade({
  children,
  className,
  delay = 0,
  yOffset = 10,
  inViewMargin = "-60px",
  blur = "6px",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  inViewMargin?: UseInViewOptions["margin"];
  blur?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: inViewMargin });
  const variants: Variants = {
    hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: 0, opacity: 1, filter: "blur(0px)" },
  };
  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        exit="hidden"
        variants={variants}
        transition={{ delay: 0.04 + delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
