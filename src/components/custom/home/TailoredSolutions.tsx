import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import Text from "@/components/ui/Text";
import { Icon } from "../aboutus/ThreePillars";
import Image from "next/image";
import CenterGradient from "../../../../public/home/tailoredsection/gradient.png";

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
  const [currentObject, setCurrentObject] = useState(1);
  const loaders = useRef<Array<HTMLDivElement[]>>(tabData.map(() => []));

  useEffect(() => {
    // Animate loader width from 0 to 100% for the current object
    const loader = loaders.current[currentTab - 1][currentObject - 1];
    if (loader) {
      gsap.fromTo(
        loader,
        { width: 0 },
        {
          width: "100%",
          duration: 2,
          ease: "power1.inOut",
          onComplete: () => {
            if (currentObject < tabData[currentTab - 1].length) {
              setCurrentObject(currentObject + 1);
            } else {
              if (currentTab < tabData.length) {
                setCurrentTab(currentTab + 1);
                setCurrentObject(1);
              } else {
                setCurrentTab(1);
                setCurrentObject(1);
              }
            }
          },
        }
      );
    }
  }, [currentObject, currentTab, tabData]);

  useEffect(() => {
    // Reset loaders on tab change
    loaders.current.forEach((tabLoaders) => {
      tabLoaders.forEach((loader) => {
        if (loader) {
          gsap.set(loader, { width: 0, transformOrigin: "left" });
        }
      });
    });
    // Reset current object to 1 when changing tabs
    setCurrentObject(1);
  }, [currentTab]);

  return (
    <div className="md:h-screen  flex justify-center items-center overflow-hidden">
      <div className="max-w-[1440px] w-[80%] flex flex-col gap-10 justify-center border-gradient relative h-fit py-20 px-10">
        <Icon className="absolute h-6 w-6 -top-3 -left-3  z-50 text-white " />
        <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-white" />
        <Icon className="absolute h-6 w-6 -top-3 -right-3 text-white " />
        <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-white " />
        <div className="absolute -z-10 scale-110">
          <Image src={CenterGradient} alt="gradient" />
        </div>

        <div className="flex base:flex-col md:flex-row gap-5 justify-between w-full items-center py-10 ">
          <Text variant="Heading" className="md:w-[50%]">
            Tailored Solution For Every Kitchen Needs: Cooking, Washing, Storage
            and Work Stations.
          </Text>
          <div className="flex gap-7 text-black">
            {tabData.map((tab, tabIndex) => (
              <button
                key={tabIndex}
                onClick={() => setCurrentTab(tabIndex + 1)}
                className={
                  currentTab === tabIndex + 1
                    ? "active-tab base:py-1 base:px-3 md:px-5 md:py-2  rounded-full"
                    : "base:px-3 base:py-1 md:px-5 md:py-2  rounded-full bg-white"
                }
              >
                Tab {tabIndex + 1}
              </button>
            ))}
          </div>
        </div>
        <div>
          {tabData.map((tab, tabIndex) => (
            <div
              key={tabIndex}
              className={currentTab === tabIndex + 1 ? "block" : "hidden"}
            >
              {tab.map((object, objectIndex) => (
                <div
                  key={objectIndex}
                  className={
                    currentObject === objectIndex + 1 ? "block" : "hidden"
                  }
                >
                  <div className="flex md:flex-row base:flex-col base:gap-6  md:justify-between items-center">
                    <div className="md:w-[50%] ">
                      <img
                        src={object.image}
                        alt="Object"
                        className="w-[80%]"
                      />
                    </div>
                    <div className="md:w-[45%] flex flex-col gap-6">
                      <Text variant="secondaryTitle">{object.title}</Text>
                      <Text variant="default">{object.text}</Text>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex w-full gap-3 mt-10">
                {tab.map((_, objectIndex) => (
                  <div
                    key={objectIndex}
                    className={`h-2 bg ${
                      objectIndex < currentObject
                        ? "bg-blue-700"
                        : "bg-gray-300"
                    }`}
                    style={{
                      flex: "1",
                      transformOrigin: "left",
                      transition: "ease-in-out",
                    }}
                    ref={(el) => {
                      if (el) loaders.current[tabIndex][objectIndex] = el;
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabComponent;

// 2232323 scroll

// import React, { useState, useEffect, useRef } from "react";
// import gsap from "gsap";
// // import { ScrollTrigger } from "gsap/ScrollTrigger";
// import Text from "@/components/ui/Text";
// import ScrollTrigger from "gsap/dist/ScrollTrigger";
// import { Icon } from "../aboutus/ThreePillars";
// import Image from "next/image";
// import CenterGradient from "../../../../public/home/tailoredsection/gradient.png";

// gsap.registerPlugin(ScrollTrigger);
// interface ObjectData {
//   image: string;
//   title: string;
//   text: string;
// }

// interface TabData extends Array<ObjectData> {}

// interface Props {
//   tabData: Array<TabData>;
// }

// const TabComponent: React.FC<Props> = ({ tabData }) => {
//   const [currentTab, setCurrentTab] = useState(1);
//   const [currentObject, setCurrentObject] = useState(1);
//   const loaders = useRef<Array<HTMLDivElement[]>>(tabData.map(() => []));
//   const tabRef = useRef<HTMLDivElement>(null);

//   // useEffect(() => {
//   //   // Animate loader width from 0 to 100% for the current object
//   //   const loader = loaders.current[currentTab - 1][currentObject - 1];
//   //   if (loader) {
//   //     gsap.fromTo(
//   //       loader,
//   //       { width: 0 },
//   //       {
//   //         width: "100%",
//   //         duration: 2,
//   //         ease: "power1.inOut",
//   //         onComplete: () => {
//   //           if (currentObject < tabData[currentTab - 1].length) {
//   //             setCurrentObject(currentObject + 1);
//   //           } else {
//   //             if (currentTab < tabData.length) {
//   //               setCurrentTab(currentTab + 1);
//   //               setCurrentObject(1);
//   //             } else {
//   //               setCurrentTab(1);
//   //               setCurrentObject(1);
//   //             }
//   //           }
//   //         },
//   //       }
//   //     );
//   //   }
//   // }, [currentObject, currentTab, tabData]);

//   useEffect(() => {
//     // Reset loaders on tab change
//     loaders.current.forEach((tabLoaders) => {
//       tabLoaders.forEach((loader) => {
//         if (loader) {
//           gsap.set(loader, { width: 0, transformOrigin: "left" });
//         }
//       });
//     });
//     // Reset current object to 1 when changing tabs
//     setCurrentObject(1);
//   }, [currentTab]);

//   useEffect(() => {
//     const element = tabRef.current;

//     if (element) {
//       const sectionHeight = element.getBoundingClientRect().height;
//       const windowHeight = window.innerHeight;
//       ScrollTrigger.create({
//         trigger: element,
//         start: "top top",
//         end: () => `+=${sectionHeight - windowHeight}`,
//         pin: true,
//         scrub: true,
//         markers: true,
//         onUpdate: (self) => {
//           const progress = self.progress.toFixed(2);

//           const totalObjects = tabData.reduce(
//             (acc, tab) => acc + tab.length,
//             0
//           );
//           const currentObjectIndex = Math.round(progress * (totalObjects - 1));

//           let cumulativeLength = 0;
//           for (let i = 0; i < tabData.length; i++) {
//             if (currentObjectIndex < cumulativeLength + tabData[i].length) {
//               setCurrentTab(i + 1);
//               setCurrentObject(currentObjectIndex - cumulativeLength + 1);
//               break;
//             }
//             cumulativeLength += tabData[i].length;
//           }
//         },
//       });
//     }

//     return () => {
//       ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
//     };
//   }, [tabData]);

//   return (
//     <div
//       ref={tabRef}
//       className="md:h-screen flex justify-center items-center overflow-hidden"
//     >
//       <div className="max-w-[1440px] w-[80%] flex flex-col gap-10 justify-center border-gradient relative h-fit py-20 px-10 backdrop-blur-3xl">
//         <Icon className="absolute h-6 w-6 -top-3 -left-3  z-50 text-white " />
//         <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-white" />
//         <Icon className="absolute h-6 w-6 -top-3 -right-3 text-white " />
//         <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-white " />
//         <div className="absolute -z-10 scale-110">
//           <Image src={CenterGradient} alt="gradient" />
//         </div>

//         <div className="flex base:flex-col md:flex-row gap-5 justify-between w-full items-center">
//           <Text variant="Heading" className="md:w-[50%]">
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
//                   key={objectIndex}
//                   className={
//                     currentObject === objectIndex + 1 ? "block" : "hidden"
//                   }
//                 >
//                   <div className="flex md:flex-row base:flex-col base:gap-6  md:justify-between items-center">
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

// askjdnasndsa
