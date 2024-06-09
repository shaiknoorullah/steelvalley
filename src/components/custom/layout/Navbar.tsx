import React, { useState, useRef, useEffect } from "react";
import { NavbarSvg } from "@/components/svgs";
import { gsap } from "gsap";
import Text from "@/components/ui/Text";
import Link from "next/link";

const Navbar = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const overlayElements = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (isOverlayOpen) {
      document.body.style.overflow = "hidden";
      gsap.to(overlayRef.current, {
        duration: 0.5,
        height: "100%",
        opacity: 1,
        display: "block",
      });

      overlayElements.current.forEach((el, index) => {
        if (el) {
          gsap.fromTo(
            el,
            { y: -50, opacity: 0 },
            {
              duration: 0.9,
              y: 0,
              stagger: 0.5,
              opacity: 1,
              delay: 0.2 * index,
              ease: "power2.out",
            }
          );
        }
      });
    } else {
      document.body.style.overflow = "";
      gsap.to(overlayRef.current, {
        duration: 1.3,
        height: "0%",
        opacity: 0,
        display: "none",
      });

      overlayElements.current.forEach((el, index) => {
        if (el) {
          gsap.to(el, {
            duration: 0.3,
            y: -50,
            opacity: 0,
            stagger: 0.4,
            delay: 0.05 * index,
            ease: "power2.in",
          });
        }
      });
    }
  }, [isOverlayOpen]);

  const handleToggleOverlay = () => {
    setIsOverlayOpen(!isOverlayOpen);
  };

  const overlayContent = [
    { text: "Home", href: "/" },
    { text: "About Us", href: "/aboutus" },
    { text: "Products", href: "/products" },
    { text: "Contact Us", href: "/#contactus" },
  ];

  return (
    <div className="w-full flex justify-center items-center fixed top-7 bg-blur z-50 max-w-[1920px]">
      <div className="w-full md:w-[80%] max-w-[1920px] flex justify-between px-6 mx-auto">
        <Link href={"/"}>
          <Text variant="navbarText">steelvalley</Text>
        </Link>
        <div className="flex items-center gap-5">
          <Text>AR</Text>
          <div onClick={handleToggleOverlay} className="cursor-pointer">
            <NavbarSvg />
          </div>
        </div>
      </div>
      <div
        ref={overlayRef}
        className="fixed inset-0 w-full h-full bg-black bg-opacity-75 backdrop-blur-md flex justify-center items-center opacity-0 display-none z-[10000000]"
      >
        <div className="w-[80%] max-w-[1920px] mx-auto px-4 pt-8 text-[#ADADAD] flex flex-col space-y-4">
          <div className="flex justify-between">
            <Text variant="navbarText" className="font-bold">
              steelvalley
            </Text>
            <button onClick={handleToggleOverlay} ref={closeBtnRef}>
              Close
            </button>
          </div>
          <div className="flex flex-col gap-3 h-full pt-32">
            {overlayContent.map((item, index) => (
              <div
                key={index}
                ref={(el) => {
                  overlayElements.current[index] = el;
                }}
              >
                <Link
                  href={item.href}
                  className="text-[max(0.8rem,min(2vw,30px))] font-medium font-[Silka] cursor-pointer hover:brightness-200 hover:transition-all hover:duration-150"
                >
                  {item.text}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
