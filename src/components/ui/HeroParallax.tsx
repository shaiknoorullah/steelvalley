"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Link from "next/link";
import Text from "./Text";
import { Button } from "./Button";

export const HeroParallax = ({
  // products,
  heroTitle,
  title,
  link,
  thumbnail,
  animateon,
}: {
  // products: {
  heroTitle: string;
  title: any;
  link: string;
  thumbnail: any;
  animateon: boolean;
  // }[];
}) => {
  const firstRow = title?.slice(0, 5);
  console.log(firstRow);
  const secondRow = title?.slice(5, 10);
  console.log(secondRow);
  const thirdRow = title?.slice(10, 15);
  console.log(thirdRow);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="w-screen base:h-[200vh] md:h-[240vh] lg:h-[300vh]  md:py-[min(3.5vw,64px)] max-w-[1920px]  antialiased relative flex flex-col  [perspective:1000px] [transform-style:preserve-3d]"
    >
      <div className="mb-10 pointer-events-none">
        <Header heroTitle={heroTitle} animateon={animateon} />
      </div>

      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className="py-80 md:py-1"
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow?.map((product: string, index: number) => (
            <ProductCard
              // product={product}
              title={title[index]}
              link={link[index]}
              thumbnail={thumbnail[index]?.url}
              translate={translateX}
              key={title[index]}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row  mb-20 space-x-20 ">
          {secondRow?.map((product: string, index: number) => (
            <ProductCard
              // product={product}
              title={title[index + 5]}
              link={link[index + 5]}
              thumbnail={thumbnail[index + 5]?.url}
              translate={translateXReverse}
              key={title[index]}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow?.map((product: string, index: number) => (
            <ProductCard
              // product={product}
              title={title[index + 10]}
              link={link[index + 10]}
              thumbnail={thumbnail[index + 10]?.url}
              translate={translateXReverse}
              key={title[index]}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = ({ heroTitle, animateon }: any) => {
  return (
    <div className="flex flex-col gap-10  justify-center px-[8%]">
      <Text
        variant="heroTitle"
        triggerAnimation={animateon}
        className="leading-none md:w-[21ch] pointer-events-none"
      >
        {/* Market Leaders in <br /> Custom Industrial-Grade <br /> Commercial
        Kitchen <br /> Equipment */}
        {heroTitle}
      </Text>

      <div className="flex gap-10 md:mt-10">
        <Button variant="white">Get A Custom Quote</Button>
        <Link href={"#contact"}>
          <Button variant="black">Learn More</Button>
        </Link>
      </div>
    </div>
  );
};

export const ProductCard = ({
  // product,
  title,
  link,
  thumbnail,
  translate,
}: {
  // product: {
  title: string;
  link: string;
  thumbnail: string;
  // };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={title}
      className="group/product base:h-48 lg:h-96 base:w-[90%] lg:w-[30rem] relative flex-shrink-0 grayscale brightness-50 "
    >
      <Link href={link} className="block group-hover/product:shadow-2xl">
        <img
          src={thumbnail}
          height="600"
          width="800"
          className="object-cover object-left-top absolute h-full w-full inset-0"
          alt={title}
        />
      </Link>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {title}
      </h2>
    </motion.div>
  );
};
