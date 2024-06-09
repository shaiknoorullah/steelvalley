// import React, { useState, useEffect, useRef } from "react";
// import gsap from "gsap";
// import Text from "@/components/ui/Text";
// import { Icon } from "../aboutus/ThreePillars";
// import ScrollTrigger from "gsap/dist/ScrollTrigger";
// import Image from "next/image";
// import CenterGradient from "../../../../public/home/tailoredsection/gradient.png";
// import { Button } from "@/components/ui/Button";

// interface ObjectData {
//   image: string;
//   text: string;
//   title: string;
// }

// interface TabData extends Array<ObjectData> {}

// interface Props {
//   tabData: Array<TabData>;
// }

// gsap.registerPlugin(ScrollTrigger);

// const TabComponent: React.FC<Props> = ({ tabData }) => {
//   const [currentTab, setCurrentTab] = useState(1);
//   const [loaders, setLoaders] = useState<number[]>([]);
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const triggerRef = useRef<HTMLDivElement>(null);

//   const flattenedData = tabData.flat();

//   useEffect(() => {
//     let panels = gsap.utils.toArray<HTMLElement>(".panel");
//     let totalPanels = panels.length;

//     const tabRanges = tabData.map((tab, index) => {
//       const start = tabData
//         .slice(0, index)
//         .reduce((acc, tab) => acc + tab.length, 0);
//       const end = start + tab.length - 1;
//       return { start, end, index: index + 1, length: tab.length };
//     });

//     gsap.to(panels, {
//       xPercent: -100 * (totalPanels - 1),
//       ease: "none",
//       scrollTrigger: {
//         trigger: triggerRef.current,
//         pin: true,
//         scrub: 1,
//         snap: {
//           snapTo: 1 / (totalPanels - 1),
//           duration: { min: 0.2, max: 0.5 },
//         },
//         end: () => "+=300vw",
//         onUpdate: (self) => {
//           const currentIndex = Math.round(self.progress * (totalPanels - 1));
//           const currentRange = tabRanges.find(
//             (range) => currentIndex >= range.start && currentIndex <= range.end
//           );

//           if (currentRange && currentTab !== currentRange.index) {
//             setCurrentTab(currentRange.index);
//             setLoaders(Array(currentRange.length).fill(0));
//           }

//           if (currentRange) {
//             const tabProgress =
//               (self.progress * (totalPanels - 1) - currentRange.start) /
//               currentRange.length;
//             setLoaders(
//               Array(currentRange.length)
//                 .fill(0)
//                 .map((_, idx) =>
//                   idx < tabProgress * currentRange.length ? 1 : 0
//                 )
//             );
//           }
//         },
//       },
//     });

//     return () => {
//       ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
//     };
//   }, [tabData]);

//   return (
//     <div className="flex items-center justify-center h-screen w-screen">
//       <div
//         ref={triggerRef}
//         className="w-[80%] h-screen flex flex-col justify-center items-center"
//       >
//         <div className="max-w-[1440px] w-full flex flex-col gap-10 justify-center border-gradient relative h-fit base:py-8 base:px-5 md:py-8 md:px-10">
//           <Icon className="absolute h-9 w-9 -top-[18px] -left-[18px] z-50 text-white" />
//           <Icon className="absolute h-9 w-9 -bottom-[19px] -left-[18px] z-50 text-white" />
//           <Icon className="absolute h-9 w-9 -top-[19px] -right-[19px] text-white z-50" />
//           <Icon className="absolute h-9 w-9 -bottom-[19px] -right-[19px] text-white z-50" />
//           <div className="absolute">
//             <Image
//               src={CenterGradient}
//               alt="gradient"
//               className="base:scale-y-150 md:scale-y-100 blur-3xl scale-x-150 "
//             />
//           </div>

//           <div className="flex base:flex-col md:flex-row gap-10  md:justify-between w-full items-center py-5 z-50 ">
//             <Text variant="heading" className="md:w-[40ch] font-normal">
//               Tailored Solution For Every Kitchen Needs: Cooking, Washing,
//               Storage and Work Stations.
//             </Text>
//             <div className="flex base:flex  md:flex-row gap-7 text-black font-normal">
//               {tabData.map((tab, tabIndex) => (
//                 <button
//                   key={tabIndex}
//                   onClick={() => setCurrentTab(tabIndex + 1)}
//                   className={
//                     currentTab === tabIndex + 1
//                       ? "base:py-1 base:px-3 md:px-5 md:py-2 rounded-full text-[max(0.6rem,min(0.6vw,14px))] bg-white text-[#1B1B1B] font-normal"
//                       : "text-white font-normal  text-[max(0.6rem,min(0.6vw,14px))]"
//                   }
//                 >
//                   {["Cooking", "Storage", "Work Station", "Washing"][tabIndex]}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div
//             ref={sectionRef}
//             className="base:w-[70vw] md:w-full flex gap-56 md:gap-1 overflow-hidden"
//           >
//             {flattenedData.map((object, objectIndex) => (
//               <div
//                 key={objectIndex}
//                 className="panel flex-shrink-0 base:w-[100%] lg:w-full flex base:flex-col  md:flex-row base:gap-5 md:justify-around items-center"
//               >
//                 <div className="base:w-[100vw] md:w-[50%]">
//                   <img
//                     src={object.image}
//                     alt="Object"
//                     className="base:w-[100vw] lg:w-[80%]"
//                   />
//                 </div>
//                 <div className="base:w-[100vw] md:w-[40%] flex flex-col gap-6 text-[#ECECEC]">
//                   <Text variant="shortHeadings" className="font-semibold">
//                     {object.title}
//                   </Text>
//                   <Text variant="default">{object.text}</Text>
//                   <div className="flex justify-between">
//                     <Button variant="white">
//                       Experience Seamless Organization
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="base:hidden md:flex gap-4 justify-center base:mb-52 md:mb-6">
//             {loaders.map((loader, index) => (
//               <div key={index} className="w-full h-[8px]  bg-gray-500 relative">
//                 <div
//                   className="h-full bg-[#F2F2F2]  absolute bottom-0"
//                   style={{ width: `${loader * 100}%` }}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TabComponent;

// 3
import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import Text from "@/components/ui/Text";
import { Icon } from "../aboutus/ThreePillars";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
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

gsap.registerPlugin(ScrollTrigger);

const TabComponent: React.FC<Props> = ({ tabData }) => {
  const [currentTab, setCurrentTab] = useState(1);
  const [loaders, setLoaders] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const flattenedData = tabData.flat();

  useEffect(() => {
    let panels = gsap.utils.toArray<HTMLElement>(".panel");
    let totalPanels = panels.length;

    const tabRanges = tabData.map((tab, index) => {
      const start = tabData
        .slice(0, index)
        .reduce((acc, tab) => acc + tab.length, 0);
      const end = start + tab.length - 1;
      return { start, end, index: index + 1, length: tab.length };
    });

    gsap.to(panels, {
      xPercent: -100 * (totalPanels - 1),
      ease: "none",
      scrollTrigger: {
        trigger: triggerRef.current,
        pin: true,
        scrub: 1,
        snap: {
          snapTo: 1 / (totalPanels - 1),
          duration: { min: 0.2, max: 0.5 },
        },
        end: () => "100vh",
        onUpdate: (self) => {
          const currentIndex = Math.round(self.progress * (totalPanels - 1));
          const currentRange = tabRanges.find(
            (range) => currentIndex >= range.start && currentIndex <= range.end
          );

          if (currentRange && currentTab !== currentRange.index) {
            setCurrentTab(currentRange.index);
            setLoaders(Array(currentRange.length).fill(0));
          }

          if (currentRange) {
            const tabProgress =
              (self.progress * (totalPanels - 1) - currentRange.start) /
              currentRange.length;
            setLoaders(
              Array(currentRange.length)
                .fill(0)
                .map((_, idx) =>
                  idx < tabProgress * currentRange.length ? 1 : 0
                )
            );
          }
        },
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [tabData]);

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div
        ref={triggerRef}
        className="w-full h-screen flex flex-col justify-center items-center"
      >
        <div className="max-w-[1440px] base:w-[90%] md:w-full flex flex-col gap-10 justify-center border-gradient relative h-fit base:py-8 base:px-5 md:py-8 md:px-10">
          <Icon className="absolute h-9 w-9 -top-[18px] -left-[18px] z-50 text-white" />
          <Icon className="absolute h-9 w-9 -bottom-[19px] -left-[18px] z-50 text-white" />
          <Icon className="absolute h-9 w-9 -top-[19px] -right-[19px] text-white z-50" />
          <Icon className="absolute h-9 w-9 -bottom-[19px] -right-[19px] text-white z-50" />
          <div className="absolute">
            <Image
              src={CenterGradient}
              alt="gradient"
              className="base:scale-y-150 md:scale-y-100 blur-3xl scale-x-150"
            />
          </div>

          <div className="flex base:flex-col md:flex-row gap-10 md:justify-between w-full items-center py-5 z-50">
            <Text variant="heading" className="md:w-[40ch] font-normal">
              Tailored Solution For Every Kitchen Needs: Cooking, Washing,
              Storage and Work Stations.
            </Text>
            <div className="flex base:flex md:flex-row gap-7 text-black font-normal">
              {tabData.map((tab, tabIndex) => (
                <button
                  key={tabIndex}
                  onClick={() => setCurrentTab(tabIndex + 1)}
                  className={
                    currentTab === tabIndex + 1
                      ? "base:py-1 base:px-3 md:px-5 md:py-2 rounded-full text-[max(0.6rem,min(0.6vw,14px))] bg-white text-[#1B1B1B] font-normal"
                      : "text-white font-normal text-[max(0.6rem,min(0.6vw,14px))]"
                  }
                >
                  {["Cooking", "Storage", "Work Station", "Washing"][tabIndex]}
                </button>
              ))}
            </div>
          </div>

          <div
            ref={sectionRef}
            className="base:w-[80vw] md:w-full flex gap-20 md:gap-1 overflow-hidden"
          >
            {flattenedData.map((object, objectIndex) => (
              <div
                key={objectIndex}
                className="panel flex-shrink-0 base:w-[100%] lg:w-full flex base:flex-col md:flex-row base:gap-5 md:justify-around items-center"
              >
                <div className="base:w-[80vw] md:w-[50%]">
                  <img
                    src={object.image}
                    alt="Object"
                    className="base:w-[100vw] lg:w-[80%]"
                  />
                </div>
                <div className="base:w-[80vw] md:w-[40%] flex flex-col gap-6 text-[#ECECEC]">
                  <Text variant="shortHeadings" className="font-semibold">
                    {object.title}
                  </Text>
                  <Text variant="default">{object.text}</Text>
                  <div className="flex justify-between">
                    <Button variant="white">
                      Experience Seamless Organization
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="base:hidden md:flex gap-4 justify-center base:mb-52 md:mb-6">
            {loaders.map((loader, index) => (
              <div key={index} className="w-full h-[8px] bg-gray-500 relative">
                <div
                  className="h-full bg-[#F2F2F2] absolute bottom-0"
                  style={{ width: `${loader * 100}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabComponent;
