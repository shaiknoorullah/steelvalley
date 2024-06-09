"use client";
import React, { useRef } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  title,
  description,
  contentClassName,
}: {
  // content: {
  title: any;
  description: string;
  content?: React.ReactNode | any;
  // }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    // uncomment line 22 and comment line 23 if you DONT want the overflow container and want to have it change on the entire page scroll
    // target: ref
    container: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = title?.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map(
      (_: any, index: number) => index / cardLength
    );
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc: any, breakpoint: any, index: number) => {
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
      className="w-full h-[30rem]  scrllcomp flex  lg:flex-row-reverse justify-between relative space-x-10 rounded-md "
      ref={ref}
    >
      <div className="div relative flex   items-start  px-4 md:ml-14">
        <div className="lg:max-w-2xl ">
          {title?.map((item: any, index: number) => (
            <div key={item.title + index} className="my-20 ">
              <motion.h2
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-[max(0.7rem,min(1.3vw,28px))] font-bold text-slate-100 text-left"
              >
                {title[index]}
              </motion.h2>
              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-[max(0.7rem,min(1.3vw,15px))] text-slate-300 mt-10 text-left md:pr-24"
              >
                {description[index]}
              </motion.p>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>
      <motion.div
        animate={{
          background: linearGradients[activeCard % linearGradients.length],
        }}
        className={cn(
          "hidden lg:block h-60 w-[581px] rounded-md bg-white sticky top-10 overflow-hidden",
          contentClassName
        )}
      >
        <img
          // src={content[activeCard]?.url ?? null}
          alt="img"
          className="w-full object-cover"
        />
      </motion.div>
    </motion.div>
  );
};
