// import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
// import gsap from "gsap";
// import Text from "@/components/ui/Text";
// import { Icon } from "../aboutus/ThreePillars";
// import ScrollTrigger from "gsap/dist/ScrollTrigger";
// import Image from "next/image";
// import CenterGradient from "../../../../public/home/tailoredsection/gradient.png";

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
//   const [currentObject, setCurrentObject] = useState(1);
//   const loaders = useRef<Array<HTMLDivElement[]>>(tabData.map(() => []));

//   const sectionref1 = useRef(null);
//   const triggerref1 = useRef(null);

//   useEffect(() => {
//     const pin = gsap.fromTo(
//       sectionref1.current,
//       {
//         x: 0,
//       },
//       {
//         x: "-280vw",

//         ease: "none",
//         duration: 1,
//         scrollTrigger: {
//           trigger: triggerref1.current,
//           start: "top top",
//           end: "2000 top",
//           scrub: 0.1,
//           pin: true,
//         },
//       }
//     );

//     return () => {
//       pin.kill();
//     };
//   }, []);
//   const text = [
//     {
//       text: "one",
//     },
//     {
//       text: "two",
//     },
//     {
//       text: "three",
//     },
//   ];

//   return (
//     <div
//       ref={triggerref1}
//       className="md:h-screen  flex justify-center items-center overflow-hidden"
//     >
//       <div className="max-w-[1440px] w-[80%] flex flex-col gap-10 justify-center border-gradient relative h-fit py-20 px-10">
//         <Icon className="absolute h-6 w-6 -top-3 -left-3  z-50 text-white " />
//         <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-white" />
//         <Icon className="absolute h-6 w-6 -top-3 -right-3 text-white " />
//         <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-white " />
//         <div className="absolute -z-10 scale-110">
//           <Image src={CenterGradient} alt="gradient" />
//         </div>

//         <div className="flex base:flex-col md:flex-row gap-5 justify-between w-full items-center py-10 ">
//           <Text variant="heading" className="md:w-[50%]">
//             Tailored Solution For Every Kitchen Needs: Cooking, Washing, Storage
//             and Work Stations.
//           </Text>
//           <div className="flex gap-7 text-black">
//             {tabData.map((tab, tabIndex) => (
//               <button
//                 key={tabIndex}
//                 onClick={() => setCurrentTab(tabIndex + 1)}
//                 className={
//                   currentTab === tabIndex + 1
//                     ? "active-tab base:py-1 base:px-3 md:px-5 md:py-2  rounded-full"
//                     : "base:px-3 base:py-1 md:px-5 md:py-2  rounded-full bg-white"
//                 }
//               >
//                 Tab {tabIndex + 1}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div>
//           {tabData.map((tab, tabIndex) => (
//             <div
//               key={tabIndex}
//               className={currentTab === tabIndex + 1 ? "block" : "hidden"}
//             >
//               {tab.map((object, objectIndex) => (
//                 <div
//                   ref={sectionref1}
//                   key={objectIndex}
//                   className={
//                     currentObject === objectIndex + 1 ? "block " : "hidden"
//                   }
//                 >
//                   <div className="flex md:flex-row base:flex-col base:gap-6  md:justify-between items-center panel w-[]">
//                     <div className="md:w-[50%] ">
//                       <img
//                         src={object.image}
//                         alt="Object"
//                         className="w-[80%]"
//                       />
//                     </div>
//                     <div className="md:w-[45%] flex flex-col gap-6">
//                       <Text variant="secondaryTitle">{object.title}</Text>
//                       <Text variant="default">{object.text}</Text>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               <div className="flex w-full gap-3 mt-10">
//                 {tab.map((_, objectIndex) => (
//                   <div
//                     key={objectIndex}
//                     className={`h-2 bg ${
//                       objectIndex < currentObject
//                         ? "bg-blue-700"
//                         : "bg-gray-300"
//                     }`}
//                     style={{
//                       flex: "1",
//                       transformOrigin: "left",
//                       transition: "ease-in-out",
//                     }}
//                     ref={(el) => {
//                       if (el) loaders.current[tabIndex][objectIndex] = el;
//                     }}
//                   />
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TabComponent;

// 2 main working

// import React, { useState, useEffect, useRef } from "react";
// import gsap from "gsap";
// import Text from "@/components/ui/Text";
// import { Icon } from "../aboutus/ThreePillars";
// import ScrollTrigger from "gsap/dist/ScrollTrigger";
// import Image from "next/image";
// import CenterGradient from "../../../../public/home/tailoredsection/gradient.png";

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
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const triggerRef = useRef<HTMLDivElement>(null);

//   const flattenedData = tabData.flat();

//   useEffect(() => {
//     let panels = gsap.utils.toArray<HTMLElement>(".panel");
//     let totalPanels = panels.length;

//     // Determine the range of panels each tab covers
//     const tabRanges = tabData.map((tab, index) => {
//       const start = tabData
//         .slice(0, index)
//         .reduce((acc, tab) => acc + tab.length, 0);
//       const end = start + tab.length - 1;
//       return { start, end, index: index + 1 };
//     });

//     gsap.to(panels, {
//       xPercent: -100 * (totalPanels - 1),
//       ease: "none",
//       scrollTrigger: {
//         trigger: triggerRef.current,
//         pin: true,
//         scrub: 1,
//         snap: 1 / (totalPanels - 1),
//         end: () => `200vw`,
//         onUpdate: (self) => {
//           const currentIndex = Math.round(self.progress * (totalPanels - 1));
//           const currentRange = tabRanges.find(
//             (range) => currentIndex >= range.start && currentIndex <= range.end
//           );
//           if (currentRange && currentTab !== currentRange.index) {
//             setCurrentTab(currentRange.index);
//           }
//         },
//       },
//     });

//     return () => {
//       ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
//     };
//   }, [tabData, currentTab]);

//   return (
//     <div
//       ref={triggerRef}
//       className="md:h-screen flex justify-center items-center overflow-hidden"
//     >
//       <div className="max-w-[1440px] w-[80%] flex flex-col gap-10 justify-center border-gradient relative h-fit py-20 px-10">
//         <Icon className="absolute h-6 w-6 -top-3 -left-3  z-50 text-white " />
//         <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-white" />
//         <Icon className="absolute h-6 w-6 -top-3 -right-3 text-white " />
//         <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-white " />
//         <div className="absolute -z-10 scale-110">
//           <Image src={CenterGradient} alt="gradient" />
//         </div>

//         <div className="flex base:flex-col md:flex-row gap-5 justify-between w-full items-center py-10">
//           <Text variant="heading" className="md:w-[50%]">
//             Tailored Solution For Every Kitchen Needs: Cooking, Washing, Storage
//             and Work Stations.
//           </Text>
//           <div className="flex gap-7 text-black">
//             {tabData.map((tab, tabIndex) => (
//               <button
//                 key={tabIndex}
//                 onClick={() => setCurrentTab(tabIndex + 1)}
//                 className={
//                   currentTab === tabIndex + 1
//                     ? "active-tab base:py-1 base:px-3 md:px-5 md:py-2  rounded-full"
//                     : "base:px-3 base:py-1 md:px-5 md:py-2  rounded-full bg-white"
//                 }
//               >
//                 Tab {tabIndex + 1}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div ref={sectionRef} className="w-full flex overflow-hidden">
//           {flattenedData.map((object, objectIndex) => (
//             <div
//               key={objectIndex}
//               className="panel flex-shrink-0 w-full flex justify-between items-center"
//             >
//               <div className="md:w-[50%]">
//                 <img src={object.image} alt="Object" className="w-[80%]" />
//               </div>
//               <div className="md:w-[45%] flex flex-col gap-6">
//                 <Text variant="secondaryTitle">{object.title}</Text>
//                 <Text variant="default">{object.text}</Text>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TabComponent;

// 333
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

    // Determine the range of panels each tab covers
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
          // ease: "power2.inOut",
        },
        end: () => "+=200vw",
        onUpdate: (self) => {
          const currentIndex = Math.round(self.progress * (totalPanels - 1));
          const currentRange = tabRanges.find(
            (range) => currentIndex >= range.start && currentIndex <= range.end
          );

          if (currentRange && currentTab !== currentRange.index) {
            setCurrentTab(currentRange.index);
            // Initialize loaders for the current tab
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
    <div
      ref={triggerRef}
      className="md:h-screen flex flex-col justify-center items-center overflow-hidden"
    >
      <div className="max-w-[1440px] w-[80%] flex flex-col gap-10 justify-center border-gradient relative h-fit base:py-8 base:px-5 md:py-8 md:px-10">
        <Icon className="absolute h-9 w-9 -top-[18px] -left-[18px] z-50 text-white" />
        <Icon className="absolute h-9 w-9 -bottom-[19px] -left-[18px] z-50 text-white" />
        <Icon className="absolute h-9 w-9 -top-[19px] -right-[19px] text-white z-50" />
        <Icon className="absolute h-9 w-9 -bottom-[19px] -right-[19px] text-white z-50" />
        <div className="absolute">
          <Image
            src={CenterGradient}
            alt="gradient"
            className="scale-y-125 blur-3xl scale-x-150 "
          />
        </div>

        <div className="flex base:flex-col md:flex-row gap-10  md:justify-between w-full items-center py-5 z-50 ">
          <Text variant="heading" className="md:w-[40ch] font-normal">
            Tailored Solution For Every Kitchen Needs: Cooking, Washing, Storage
            and Work Stations.
          </Text>
          <div className="flex base:flex-col  md:flex-row gap-7 text-black font-normal">
            {tabData.map((tab, tabIndex) => (
              <button
                key={tabIndex}
                onClick={() => setCurrentTab(tabIndex + 1)}
                className={
                  currentTab === tabIndex + 1
                    ? "base:py-1 base:px-3 md:px-5 md:py-2 rounded-full text-[max(0.6rem,min(0.6vw,14px))] bg-white text-[#1B1B1B] font-normal"
                    : "text-white font-normal  text-[max(0.6rem,min(0.6vw,14px))]"
                }
              >
                {["Cooking", "Storage", "Work Station", "Washing"][tabIndex]}
              </button>
            ))}
          </div>
        </div>

        <div ref={sectionRef} className="w-full flex overflow-hidden">
          {flattenedData.map((object, objectIndex) => (
            <div
              key={objectIndex}
              className="panel flex-shrink-0 w-full flex base:flex-col md:flex-row justify-around items-center"
            >
              <div className="md:w-[50%]">
                <img src={object.image} alt="Object" className="w-[80%]" />
              </div>
              <div className="md:w-[40%] flex flex-col gap-6 text-[#ECECEC]">
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
            <div key={index} className="w-full h-3  bg-gray-300 relative">
              <div
                className="h-full bg-blue-500 rounded-sm absolute bottom-0"
                style={{ width: `${loader * 100}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabComponent;
