"use client";
import React from "react";

import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from "@/components/ui/CanvasRevealEffect";
import Text from "@/components/ui/Text";

export function ThreePillars() {
  return (
    <div className=" base:w-[90%] lg:w-[70%] h- flex flex-col base:gap-20 lg:gap-40">
      <Text variant="shortHeadings" className="text-center z-50 mt-10">
        The Three Pillars
        <br /> of Belief
      </Text>
      <div className="pb-20 flex flex-col lg:flex-row items-center justify-center  w-full gap-4 px-8">
        <Card title="StellValley" icon={"steelvalley"}>
          <CanvasRevealEffect
            animationSpeed={5.1}
            containerClassName="bg-emerald-900"
          />
        </Card>
        <Card title="StellValley" icon={"steelvalley"}>
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-black"
            colors={[
              [236, 72, 153],
              [232, 121, 249],
            ]}
            dotSize={2}
          />
          {/* Radial gradient for the cute fade */}
          <div className="absolute inset-0 [mask-image:radial-gradient(400px_at_center,white,transparent)] bg-black/50 dark:bg-black/90" />
        </Card>
        <Card title="StellValley" icon={"steelvalley"}>
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-sky-600"
            colors={[[125, 211, 252]]}
          />
        </Card>
      </div>
    </div>
  );
}

// const Card = ({
//   title,
//   icon,
//   children,
// }: {
//   title: string;
//   icon: React.ReactNode;
//   children?: React.ReactNode;
// }) => {
//   const [hovered, setHovered] = React.useState(false);
//   return (
//     <div
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       className="relative max-w-sm w-full mx-auto p-4 h-[30rem] overflow-hidden"
//     >
//       {/* Gradient border */}
//       <div className="absolute inset-0 flex">
//         <div className="border-gradient"></div>
//       </div>

//       {/* Content */}
//       <div className="relative z-10 flex flex-col items-center justify-center h-full">
//         <div className="text-center">
//           {icon}
//           <h2 className="text-white text-xl font-bold mt-4">{title}</h2>
//           <h4 className="text-white text-xl font-light mt-4">
//             Hover to reveal
//           </h4>
//         </div>
//       </div>

//       {/* Content on hover */}
//       <AnimatePresence>
//         {hovered && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 text-white text-center"
//           >
//             {children}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

const Card = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border-gradient border-black/[0.2] group/canvas-card flex items-center justify-center dark:border-gray/[0.2]  max-w-xs w-full mx-auto   h-[30rem] relative"
    >
      <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
      {/* <Icon className="absolute h-6 w-6 -bottom-3 -right-3  text-white " /> */}

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full absolute inset-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20">
        <div className="text-center group-hover/canvas-card:-translate-y-4 group-hover/canvas-card:opacity-0 transition duration-200 w-full  mx-auto flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-white text-xl opacity-0 group-hover/canvas-card:opacity-100 relative z-10  mt-4  font-bold group-hover/canvas-card:text-white group-hover/canvas-card:-translate-y-2 transition duration-200">
          {title}
        </h2>
        <h4 className="text-white text-xl opacity-0 group-hover/canvas-card:opacity-100 relative z-10  mt-4  font-light text-center group-hover/canvas-card:text-white group-hover/canvas-card:-translate-y-2 transition duration-200">
          Hover to reveal
        </h4>
      </div>
    </div>
  );
};

const AceternityIcon = () => {
  return (
    <svg
      width="66"
      height="65"
      viewBox="0 0 66 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 text-white group-hover/canvas-card:text-white "
    >
      <path
        d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
        stroke="currentColor"
        strokeWidth="15"
        strokeMiterlimit="3.86874"
        strokeLinecap="round"
        style={{ mixBlendMode: "darken" }}
      />
    </svg>
  );
};

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      className={className}
      width="62"
      height="62"
      viewBox="0 0 62 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M30.5 30.5V0H31.5V31.5H0V30.5H30.5Z"
        fill="url(#paint0_radial_103_439)"
        fill-opacity="100"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M31 31L31 61.5L30 61.5L30 30L61.5 30L61.5 31L31 31Z"
        fill="url(#paint1_radial_103_439)"
        fill-opacity="100"
      />
      <defs>
        <radialGradient
          id="paint0_radial_103_439"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(-3 -2) rotate(43.9391) scale(76.3806 99.8242)"
        >
          <stop stop-opacity="100" />
          <stop offset="100" stop-color="white" />
        </radialGradient>
        <radialGradient
          id="paint1_radial_103_439"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(64.5 63.5) rotate(-136.061) scale(76.3806 99.8242)"
        >
          <stop stop-opacity="100" />
          <stop offset="100" stop-color="white" />
        </radialGradient>
      </defs>
    </svg>
  );
};
