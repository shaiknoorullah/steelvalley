"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import KitchenImg from "../../../public/kitchens/kitchendemo.jpg";

export const MaskContainer = ({
  children,
  revealText,
  size = 10,
  revealSize = 600,
  className,
}: {
  children?: string | React.ReactNode;
  revealText?: string | React.ReactNode;
  size?: number;
  revealSize?: number;
  className?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState<any>({ x: null, y: null });
  const containerRef = useRef<any>(null);
  const updateMousePosition = (e: any) => {
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  useEffect(() => {
    containerRef.current.addEventListener("mousemove", updateMousePosition);
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener(
          "mousemove",
          updateMousePosition
        );
      }
    };
  }, []);
  let maskSize = isHovered ? revealSize : size;

  return (
    <motion.div
      ref={containerRef}
      className={cn("h-screen relative ", className)}
      // animate={{
      //   // backgroundColor: isHovered ? "var(--slate-900)" : "var(--white)",
      // }}
      animate={{
        // Other animation properties...
        backgroundColor: isHovered ? "var(--slate-900)" : "var(--white)",
        backgroundImage: isHovered
          ? "url(/kitchens/kitchendemo.jpg)"
          : "url(/kitchens/kitchendemo.jpg)",
        opacity: isHovered ? "30%" : "30%",
      }}
    >
      <motion.div
        className="w-full h-full bg-no-repeat  flex items-center justify-center text absolute bg-white/25  bg-grid-white/[0.2] text-[#ECECEC]  [mask-image:url(/svgmaskeffect.svg)] [mask-size:100px] [mask-repeat:no-repeat]"
        animate={{
          WebkitMaskPosition: `${mousePosition.x - maskSize / 2}px ${
            mousePosition.y - maskSize / 2
          }px`,
          WebkitMaskSize: `${maskSize}px`,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
      >
        <div className="absolute inset-0  h-full w-full z-0 opacity-100" />
        <div
          onMouseEnter={() => {
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
          }}
          className="w-[80%] text-center text-white p-2 leading-6   font-bold relative z-20 select-none"
        >
          {children}
        </div>
      </motion.div>

      <div className="w-[100%] h-full flex items-center justify-center font-bold text-center text-white">
        {revealText}
      </div>
    </motion.div>
  );
};
