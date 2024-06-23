"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import Gradient from "../../../../public/footer/footergradient.svg";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import Text from "../../ui/Text";
import { BottomGradient } from "../../ui/SignupForm";
import { shaderMaterial } from "@react-three/drei";
import Link from "next/link";

const World = dynamic(
  () => import("../../ui/globe/Globe").then((m) => m.World),
  {
    ssr: false,
  }
);

export function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  const globeConfig = useMemo(
    () => ({
      pointSize: 4,
      globeColor: "#062056",
      showAtmosphere: true,
      atmosphereColor: "#FFFFFF",
      atmosphereAltitude: 0.1,
      emissive: "#062056",
      emissiveIntensity: 0.1,
      shininess: 0.9,
      polygonColor: "rgba(255,255,255,0.7)",
      ambientLight: "#38bdf8",
      directionalLeftLight: "#ffffff",
      directionalTopLight: "#ffffff",
      pointLight: "#ffffff",
      arcTime: 1000,
      arcLength: 0.9,
      rings: 1,
      maxRings: 3,
      initialPosition: { lat: 22.3193, lng: 114.1694 },
      autoRotate: true,
      autoRotateSpeed: 0.5,
    }),
    []
  );

  const colors = ["#06b6d4", "#3b82f6", "#6366f1"];
  const sampleArcs = useMemo(
    () => [
      {
        order: 1,
        startLat: -19.885592,
        startLng: -43.951191,
        endLat: -22.9068,
        endLng: -43.1729,
        arcAlt: 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      {
        order: 1,
        startLat: 28.6139,
        startLng: 77.209,
        endLat: 3.139,
        endLng: 101.6869,
        arcAlt: 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      {
        order: 1,
        startLat: -19.885592,
        startLng: -43.951191,
        endLat: -1.303396,
        endLng: 36.852443,
        arcAlt: 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      {
        order: 2,
        startLat: 1.3521,
        startLng: 103.8198,
        endLat: 35.6762,
        endLng: 139.6503,
        arcAlt: 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      {
        order: 2,
        startLat: 51.5072,
        startLng: -0.1276,
        endLat: 3.139,
        endLng: 101.6869,
        arcAlt: 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      {
        order: 2,
        startLat: -15.785493,
        startLng: -47.909029,
        endLat: 36.162809,
        endLng: -115.119411,
        arcAlt: 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      {
        order: 3,
        startLat: -33.8688,
        startLng: 151.2093,
        endLat: 22.3193,
        endLng: 114.1694,
        arcAlt: 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      {
        order: 3,
        startLat: 21.3099,
        startLng: -157.8581,
        endLat: 40.7128,
        endLng: -74.006,
        arcAlt: 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      {
        order: 3,
        startLat: -6.2088,
        startLng: 106.8456,
        endLat: 51.5072,
        endLng: -0.1276,
        arcAlt: 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      {
        order: 4,
        startLat: 11.986597,
        startLng: 8.571831,
        endLat: -15.595412,
        endLng: -56.05918,
        arcAlt: 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      {
        order: 4,
        startLat: -34.6037,
        startLng: -58.3816,
        endLat: 22.3193,
        endLng: 114.1694,
        arcAlt: 0.7,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      {
        order: 4,
        startLat: 51.5072,
        startLng: -0.1276,
        endLat: 48.8566,
        endLng: -2.3522,
        arcAlt: 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      {
        order: 5,
        startLat: 14.5995,
        startLng: 120.9842,
        endLat: 51.5072,
        endLng: -0.1276,
        arcAlt: 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      {
        order: 5,
        startLat: 1.3521,
        startLng: 103.8198,
        endLat: -33.8688,
        endLng: 151.2093,
        arcAlt: 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      {
        order: 5,
        startLat: 34.0522,
        startLng: -118.2437,
        endLat: 48.8566,
        endLng: -2.3522,
        arcAlt: 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      {
        order: 6,
        startLat: -15.432563,
        startLng: 28.315853,
        endLat: 1.094136,
        endLng: -63.34546,
        arcAlt: 0.7,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      {
        order: 6,
        startLat: 37.5665,
        startLng: 126.978,
        endLat: 35.6762,
        endLng: 139.6503,
        arcAlt: 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      {
        order: 6,
        startLat: 22.3193,
        startLng: 114.1694,
        endLat: 51.5072,
        endLng: -0.1276,
        arcAlt: 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      {
        order: 7,
        startLat: -19.885592,
        startLng: -43.951191,
        endLat: -15.595412,
        endLng: -56.05918,
        arcAlt: 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      {
        order: 7,
        startLat: 48.8566,
        startLng: -2.3522,
        endLat: 52.52,
        endLng: 13.405,
        arcAlt: 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      {
        order: 7,
        startLat: 52.52,
        startLng: 13.405,
        endLat: 34.0522,
        endLng: -118.2437,
        arcAlt: 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      {
        order: 8,
        startLat: -8.833221,
        startLng: 13.264837,
        endLat: -33.936138,
        endLng: 18.456387,
        arcAlt: 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      {
        order: 8,
        startLat: -26.089586,
        startLng: 27.796294,
        endLat: 30.5595,
        endLng: 22.9375,
        arcAlt: 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      {
        order: 8,
        startLat: 30.033333,
        startLng: 31.233334,
        endLat: -26.2041,
        endLng: 28.0473,
        arcAlt: 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      {
        order: 9,
        startLat: 18.5204,
        startLng: 73.8567,
        endLat: 19.076,
        endLng: 72.8777,
        arcAlt: 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      {
        order: 9,
        startLat: -22.9068,
        startLng: -43.1729,
        endLat: 22.9068,
        endLng: 43.1729,
        arcAlt: 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      {
        order: 9,
        startLat: 22.3193,
        startLng: 114.1694,
        endLat: 22.3964,
        endLng: 114.1095,
        arcAlt: 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
    ],
    []
  );

  const WorldComponent = useMemo(
    () => (
      <div className="absolute w-[100%] base:-left-36 base:-bottom-28 md:-left-[300px] lg:-left-[500px] md:-bottom-[400px] lg:-bottom-[400px] h-[400px] md:h-[800px] lg:h-[1100px] z-20 backdrop-blur-sm bg-transparent">
        <World data={sampleArcs} globeConfig={globeConfig} />
      </div>
    ),
    [globeConfig, sampleArcs]
  );

  return (
    <div className="flex lg:flex-row  base:flex-col items-center lg:justify-center pt-2 md:h-[50vh] bg-transparent relative base:w-[100%] md:w-full max-w-[1920px] lg:mt-6 ">
      <div
        ref={footerRef}
        className="base:h-[130vh] lg:w-full md:h-[40rem] lg:h-[50rem] px-4 overflow-hidden"
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
          }}
          className="div"
        >
          <div className="z-50 w-full flex justify-center its">
            <FooterGrid />
          </div>
        </motion.div>
        <div className="absolute w-full bottom-0 inset-x-0 h-40 bg-gradient-to-b pointer-events-none select-none from-transparent  z-40" />
        {isVisible && WorldComponent}
        <Image
          src={Gradient}
          alt="gradient"
          className="absolute base:-right-20 md:-right-10 base:-bottom-10 md:-top-64 lg:-right-10 lg:-top-[400px] z-10 h-[350px] md:h-[1000px] lg:h-[1150px] brightness-150 blur-lg scale-x-150 scale-y-150"
        />
      </div>
    </div>
  );
}

const FooterGrid = () => {
  // Define an array of data for the first three columns
  const columnData = [
    {
      title: "Learn",
      children: [
        { text: "Home", href: "/" },
        { text: "Contact", href: "#contact" },
        { text: "About Us", href: "/aboutus" },
        { text: "Products", href: "/products" },
      ],
    },
    // {
    //   title: "Enquire",
    //   children: [
    //     { text: "Methodology", href: "/methodology" },
    //     { text: "What We Do?", href: "/what-we-do" },
    //     { text: "How We Work?", href: "/how-we-work" },
    //     { text: "Get In Touch", href: "/get-in-touch" },
    //   ],
    // },
    {
      title: "Leap",
      children: [
        { text: "Privacy Policy", href: "/privacypolicy" },
        { text: "Terms And Service", href: "/termsofservice" }
      ],
    },
  ];

  return (
    <div className="flex base:flex-col w-[80%] max-w-[1440px] bg-transparent md:flex-row md:justify-between gap-10 absolute z-50">
      {/* Map over columnData to render the first three columns */}
      {columnData.map((column, index) => (
        <div key={index}>
          {/* Title */}
          <h4 className="font-bold text-[max(0.8rem,min(0.8vw,18px))] text-[#ECECEC]">
            {column.title}
          </h4>
          {/* Child elements */}
          <div className="flex flex-col gap-3 mt-7">
            {column.children.map((child, idx) => (
              <Link href={child.href} key={idx}>
                <Text variant="default" className="text-description">
                  {child.text}
                </Text>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* Fourth column */}
      <div className="flex flex-col justify-between">
        {/* Title */}
        <div className="lg:w-[400px] flex flex-col gap-10">
          <h4 className="font-bold text-[max(0.8rem,min(0.8vw,18px))] text-[#ECECEC]">
            Tailored Solution For Every Kitchen Needs: Cooking, Washing, Storage
            and Work Stations.
          </h4>
          {/* Input */}
          <Input type="text" placeholder="Enter something" />
          {/* Button */}
          <Button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Sign up &rarr;
            <BottomGradient />
          </Button>
          <div>
            <Text className="text-description mb-2 tracking-wider">
              ©SteelValley 2023 All Rights Reserved
            </Text>
            {/* Text */}
            <Text className="text-description">Brought By @Websleak</Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterGrid;
