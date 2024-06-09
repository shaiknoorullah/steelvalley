// import React, { useEffect, useRef, useState } from "react";
// import gsap from "gsap";

// const LoadingScreen = ({ state }: { state: boolean }) => {
//   const loadingScreenRef = useRef<HTMLDivElement | null>(null);
//   const loadingTextRef = useRef<HTMLDivElement | null>(null);
//   const [visible, setVisible] = useState(true);

//   useEffect(() => {
//     // Set a timeout to keep the loading screen visible for 2 seconds
//     const timer = setTimeout(() => {
//       setVisible(false);
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     if (loadingTextRef.current) {
//       // Animate the text "STEELVALLEY" coming one by one
//       gsap.fromTo(
//         loadingTextRef.current.children,
//         { opacity: 0, y: 20 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 0.5,
//           stagger: 0.1,
//           ease: "power3.out",
//         }
//       );
//     }
//   }, []);

//   useEffect(() => {
//     if (!visible && loadingScreenRef.current) {
//       gsap.to(loadingScreenRef.current, {
//         delay: 0.1,
//         duration: 0.9,
//         y: "-100vh",
//         ease: "power3.in",
//         onComplete: () => {
//           gsap.set(loadingScreenRef.current, { display: "none" });
//         },
//       });
//     }
//   }, [visible]);

//   return (
//     <div
//       ref={loadingScreenRef}
//       className="loading-screen h-screen w-full bg-[#121212] fixed inset-0 z-[10000000000000000] flex items-center justify-center text-[silka]"
//     >
//       <div
//         className={`loading-content flex items-center justify-center text-[#ECECEC] font-semibold text-[30px] lg:text-[100px] ${
//           visible ? "" : "hidden"
//         }`}
//       >
//         <div ref={loadingTextRef} className="loading-text">
//           {[...Array("STEELVALLEY".length)].map((_, index) => (
//             <span key={index} className="inline-block">
//               {"STEELVALLEY".charAt(index)}
//             </span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoadingScreen;

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const LoadingScreen = ({ state }: { state: boolean }) => {
  const loadingScreenRef = useRef<HTMLDivElement | null>(null);
  const loadingTextRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Set a timeout to keep the loading screen visible for 2 seconds
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loadingTextRef.current) {
      // Animate the text "STEELVALLEY" borders first, then the fill color
      const letters = loadingTextRef.current.children;

      // Set initial state for borders only
      gsap.set(letters, { color: "transparent", textShadow: "0 0 0 #ECECEC" });

      // Animate fill color
      gsap.to(letters, {
        color: "#ECECEC",
        textShadow: "none",
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
      });
    }
  }, []);

  useEffect(() => {
    if (!visible && loadingScreenRef.current) {
      gsap.to(loadingScreenRef.current, {
        delay: 0.1,
        duration: 0.9,
        y: "-100vh",
        ease: "power3.in",
        onComplete: () => {
          gsap.set(loadingScreenRef.current, { display: "none" });
        },
      });
    }
  }, [visible]);

  return (
    <div
      ref={loadingScreenRef}
      className="loading-screen h-screen w-full bg-[#121212] fixed inset-0 z-[10000000000000000] flex items-center justify-center"
    >
      <div
        className={`loading-content flex items-center justify-center  font-semibold text-[max(1.2rem,min(4vw,65px))] lg:text-[100px] ${
          visible ? "" : "hidden"
        }`}
      >
        <div ref={loadingTextRef} className="loading-text">
          {[...Array("STEELVALLEY".length)].map((_, index) => (
            <span key={index} className="inline-block">
              {"STEELVALLEY".charAt(index)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
