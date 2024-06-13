import React, { useState, useEffect, useRef } from "react";
import Text from "@/components/ui/Text";
import { Icon } from "../aboutus/ThreePillars";
import Image from "next/image";
import CenterGradient from "../../../../public/home/tailoredsection/gradient.png";
import { Button } from "@/components/ui/Button";

interface ObjectData {
  image: string;
  text: string;
  title: string;
}

interface TabData extends Array<ObjectData> {}

interface Props {
  tabData: Array<TabData>;
}

const TabComponent: React.FC<Props> = ({ tabData }) => {
  const [currentTab, setCurrentTab] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const flattenedData = tabData.flat();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % flattenedData.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [flattenedData.length]);

  useEffect(() => {
    const findCurrentTab = () => {
      let start = 0;
      for (let i = 0; i < tabData.length; i++) {
        const end = start + tabData[i].length;
        if (currentIndex >= start && currentIndex < end) {
          return i + 1;
        }
        start = end;
      }
      return 1;
    };

    const newTab = findCurrentTab();
    if (currentTab !== newTab) {
      setCurrentTab(newTab);
    }
  }, [currentIndex, tabData, currentTab]);

  const startIndexForCurrentTab = tabData
    .slice(0, currentTab - 1)
    .reduce((acc, tab) => acc + tab.length, 0);

  return (
    <div className="flex items-center justify-center h-screen w-screen my-10">
      <div className="w-full h-screen flex flex-col justify-center items-center ">
        <div className="max-w-[1440px] base:w-[90%] md:w-[90%] flex flex-col gap-10 justify-center border-gradient relative h-fit base:py-8 base:px-5 md:py-8 md:px-10 glass-background">
          <Icon className="absolute h-9 w-9 -top-[18px] -left-[18px] z-50 text-white" />
          <Icon className="absolute h-9 w-9 -bottom-[19px] -left-[18px] z-50 text-white" />
          <Icon className="absolute h-9 w-9 -top-[19px] -right-[19px] text-white z-50" />
          <Icon className="absolute h-9 w-9 -bottom-[19px] -right-[19px] text-white z-50" />
          <div className="absolute">
            <Image
              src={CenterGradient}
              alt="gradient"
              className="base:scale-y-150 md:scale-y-100 blur-3xl scale-x-150 "
            />
          </div>

          <div className="flex base:flex-col md:flex-row gap-10 md:justify-between w-full items-center py-5 z-[10000000000]">
            <Text variant="heading" className="md:w-[40ch] font-normal text-[#ECECEC]">
              Tailored Solution For Every Kitchen Needs: Cooking, Washing,
              Storage and Work Stations.
            </Text>
            <div className="flex base:flex md:flex-row base:gap-4 md:gap-7 text-black font-normal">
              {tabData.map((tab, tabIndex) => (
                <button
                  key={tabIndex}
                  onClick={() => {
                    setCurrentTab(tabIndex + 1);
                    setCurrentIndex(
                      tabData
                        .slice(0, tabIndex)
                        .reduce((acc, tab) => acc + tab.length, 0)
                    );
                  }}
                  className={
                    currentTab === tabIndex + 1
                      ? "base:py-1 base:px-3 md:px-5 md:py-2 rounded-full text-[max(0.6rem,min(0.6vw,14px))] bg-white text-[#1B1B1B] font-normal"
                      : "text-white font-normal text-[max(0.5rem,min(0.6vw,14px))]"
                  }
                >
                  {["Cooking", "Storage", "Work Station", "Washing"][tabIndex]}
                </button>
              ))}
            </div>
          </div>

          <div
            ref={sectionRef}
            className="base:w-[80vw] md:w-full flex gap-20 md:gap-1 overflow-hidden z-[100000000000]"
          >
            {flattenedData.map((object, objectIndex) => (
              <div
                key={objectIndex}
                className={`panel flex-shrink-0 base:w-[100%] lg:w-full flex base:flex-col md:flex-row base:gap-5 md:justify-around items-center ${
                  objectIndex === currentIndex ? "" : "hidden"
                }`}
              >
                <div className="base:w-[80vw] md:w-[50%]">
                  <img
                    src={object.image}
                    alt="Object"
                    className="base:w-[100vw] lg:w-[80%]"
                  />
                </div>
                <div className="base:w-[80vw] md:w-[40%] flex flex-col base:gap-6 md:justify-between md:h-full text-[#ECECEC] base:h-[rem]">
                  <div className="flex flex-col base:gap-3 md:gap-5">
                    <Text variant="shortHeadings" className="font-semibold">
                      {object.title}
                    </Text>
                    <Text variant="default">{object.text}</Text>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="white">
                      Experience Seamless Organization
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className=" flex gap-4 justify-center  md:mb-6">
            {tabData[currentTab - 1]?.map((_, index) => {
              const globalIndex = startIndexForCurrentTab + index;
              const isActive = globalIndex === currentIndex;
              const isFilled = globalIndex <= currentIndex;
              return (
                <div
                  key={index}
                  className="w-full base:h-[5px] md:h-[8px] bg-gray-500 relative"
                >
                  <div
                    className={`h-full absolute bottom-0 ${
                      isActive
                        ? "bg-[#F2F2F2] loader"
                        : isFilled
                        ? "bg-[#F2F2F2]"
                        : "bg-transparent"
                    }`}
                    style={{
                      width: "100%",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabComponent;
