"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import Text from "./Text";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
  bgcolor = true,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
  bgcolor?: boolean;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  // const [bgcolor, setBgcolor] = useState(false)

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
  // mask
  // [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20  max-w-[1920px] overflow-hidden",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          " flex  shrink-0 gap-4 py-4 w-max flex-nowrap overflow-hidden ",
          start && "animate-scroll ",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            className={`w-[350px] max-w-full  relative rounded-3xl  flex-shrink-0  p-5 lg:px-8 lg:py-6 md:w-[450px] ${
              bgcolor ? "bg-black text-white" : "bg-white text-black"
            }`}
            // style={{
            //   background:
            //     "linear-gradient(180deg, var(--slate-800), var(--slate-900)",
            // }}
            key={item.name}
          >
            <blockquote className="flex flex-col justify-between">
              <div
                aria-hidden="true"
                className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>
              <Text className="z-20 text-marqueetext leading-[1.6] text-white  font-semibold">
                {item.quote}
              </Text>
              <div className="relative z-20 mt-6 flex flex-row  items-center">
                <span className="flex flex-col gap-1">
                  <span className="text-[max(0.5rem,max(0.7vw,12px))] leading-[1.6] text-gray-400 font-normal">
                    {item.name}
                  </span>
                  {/* <span className=" text-sm leading-[1.6] text-gray-400 font-normal">
                    {item.title}
                  </span> */}
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
