import React from "react";
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/SpotLight";
import Text from "../ui/Text";

export function ProductsHeroSection() {
  return (
    <div className="md:h-screen w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-20 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className=" p-4  flex flex-col items-center base:text-start md:text-center gap-8  relative z-10  w-full pt-20 md:pt-36">
        <Text
          variant="heroTitle"
          className="font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50"
        >
          Market Leaders in Custom Industrial-Grade{" "}
          <br className="base:hidden lg:flex" />
          Commercial Kitchen Equipment
        </Text>
        <Text
          variant="shortHeadings"
          className="mt-4 font-normal  text-neutral-300 base:text-center "
        >
          Market Leaders in Custom Industrial-Grade Commercial Kitchen Equipment
          Market Leaders in Custom Industrial-Grade Commercial Kitchen Equipment
          Market Leaders in Custom Industrial-Grade Commercial Kitchen Equipment
          copy.
        </Text>
      </div>
    </div>
  );
}
