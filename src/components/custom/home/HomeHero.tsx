import { FlashSvg } from "@/components/svgs";
import { Button } from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import Image from "next/image";
import React from "react";
import GradientImage from "../../../../public/home/herogradinet.png";
import { useQuery } from "@tanstack/react-query";
import { getTableData } from "../../../../utils/getTableData";
import LoadingScreen from "@/components/ui/LoadingScreen";
import HeroBgSvg from "@/components/svgs/HeroBg";
import Link from "next/link";

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

  const { isPending, isError, data, isSuccess, error } = useQuery({
    queryKey: ["airtableData"],
    queryFn: async () => {
      try {
        console.log("hello index page");
        const tableData = await getTableData("tblcyLkr5afueTlXq");

        console.log(tableData);
        if (!tableData) {
          return Promise.reject("Could not get the table data from API");
        }
        return Promise.resolve(tableData);
      } catch (error) {
        throw new Error(
          `There was an unexpected error while trying to get the table data, ${error}`
        );
      }
    },
  });
  console.log(data?.data?.records[0]?.fields?.HeroTitle);

  // if (isPending) {
  //   return  <div className="w-full flex flex-col items-center md:min-h-screen h-screen overflow-hidden base:gap-14 md:gap-20 relative">Steelvalley</div>;
  // }
  return (
    <div className="">
      <LoadingScreen state={isPending} />

      <div className="w-full flex flex-col items-center min-h-[100vh]    overflow-hidden base:gap-14 md:gap-[min(5vw,112px)] relative">
        <div className="absolute md:flex -z-50 md:top-0 blur-3xl opacity-90">
          {/* <Image
            alt="gradinet"
            src={GradientImage}
            className="h-[800px] w-screen lg:h-[1050px] md:h-[700px] base:opacity-60 md:opacity-100"
          /> */}
          <HeroBgSvg />
        </div>
        {/* bar */}
        <div className="flex   herobar lg:h-[50px] base:justify-center md:gap-10 items-center rounded-full base:py-2 base:px-5 md:p-4 base:mt-[min(65vw,208px)] lg:mt-[min(15vw,200px)] z-20 border-gradient">
          <FlashSvg />
          <div className="flex base:flex-col md:flex-row md:gap-14 base:gap-2 ml-2">
            <Text variant="barText">
              We've successfully completed 100 projects
            </Text>
            <Text
              variant="barText"
              className="flex text-white items-center gap-4"
            >
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
        <div className="md:w-[75%] md:flex flex-col base:hidden ">
          <Text
            className="items-center leading-none text-center text-[#ECECEC]"
            variant="heroTitle"
            triggerAnimation={isSuccess}
          >
            {data?.data?.records[0]?.fields?.HeroTitle}
          </Text>
        </div>
        <Text
          className="base:flex flex-wrap justify-center md:hidden w-[90%] text-center text-[#ECECEC]"
          variant="heroTitle"
          triggerAnimation={isSuccess}
        >
          {/* Market Leaders in Custom Industrial-Grade Commercial Kitchen Equipment */}
          {data?.data?.records[0]?.fields?.HeroTitle}
        </Text>
        <div className="flex gap-10 z-10">
          <Button variant="white" className="">
            Get A Custom Quote
          </Button>
          <Link href={"#contact"}>
            <Button variant="black">Learn More</Button>
          </Link>
        </div>
        <div className="absolute base:-bottom-3 md:-bottom-5 max-w-[1920px] w-screen">
          <InfiniteMovingCards
            // items={testimonials}
            text={data?.data?.records[0]?.fields?.MovingCardText}
            name={data?.data?.records[0]?.fields?.MovingCardName}
            bgcolor={true}
            direction="right"
            speed="slow"
            className="overflow-hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
