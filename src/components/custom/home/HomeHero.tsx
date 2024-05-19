import { FlashSvg } from "@/components/svgs";
import { Button } from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import Image from "next/image";
import React from "react";
import GradientImage from "../../../../public/home/herogradinet.png";

const HomeHero = () => {
  const testimonials = [
    {
      quote:
        "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
      name: "Charles Dickens",
      title: "A Tale of Two Cities",
    },
    {
      quote:
        "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
      name: "William Shakespeare",
      title: "Hamlet",
    },
    {
      quote:
        "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
      name: "William Shakespeare",
      title: "Hamlet",
    },
    {
      quote:
        "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
      name: "William Shakespeare",
      title: "Hamlet",
    },
    {
      quote:
        "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
      name: "Herman Melville",
      title: "Moby-Dick",
    },
  ];
  return (
    <div className="w-full flex flex-col items-center md:h-screen overflow-hidden base:gap-14 md:justify-between relative">
      <div className="absolute md:flex -z-50 md:top-20">
        <Image
          alt="gradinet"
          src={GradientImage}
          className="h-[800px] w-screen lg:h-[950px] md:h-[700px] base:opacity-60 md:opacity-100"
        />
      </div>
      {/* bar */}
      <div className="flex herobar base:justify-center md:justify-between items-center rounded-full base:py-2 base:px-3 md:p-4 mt-44 z-20">
        <FlashSvg />
        <div className="flex base:flex-col md:flex-row md:gap-7 base:gap-2">
          <Text variant="barText">
            We've successfully completed 100 projects
          </Text>
          <Text className="flex items-center gap-4">
            Read full casestudy
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </span>
          </Text>
        </div>
      </div>
      {/* title */}
      <div className="w-[70%] md:w-[80%] md:flex flex-col base:hidden ">
        <Text
          className="flex justify-center items-center align-middle text-center"
          variant="heroTitle"
        >
          Market Leaders in Custom Industrial-Grade
        </Text>
        <Text
          className="flex justify-center items-center align-middle text-center"
          variant="heroTitle"
        >
          {" "}
          Commercial Kitchen Equipment
        </Text>
      </div>
      <Text
        className="base:flex md:hidden w-[min(100vw,800px)] text-center"
        variant="heroTitle"
      >
        Market Leaders in Custom Industrial-Grade Commercial Kitchen Equipment
      </Text>
      <div className="flex gap-10 ">
        <Button variant="white">Get A Custom Quote</Button>
        <Button variant="black">Learn More</Button>
      </div>
      <div className="max-w-[1920px] w-screen">
        <InfiniteMovingCards
          items={testimonials}
          bgcolor={true}
          direction="right"
          speed="slow"
          className="overflow-hidden"
        />
      </div>
    </div>
  );
};

export default HomeHero;
