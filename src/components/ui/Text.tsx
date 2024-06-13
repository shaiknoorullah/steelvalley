import React, { HTMLAttributes, useEffect, useRef, useState } from "react";
import { type VariantProps, tv } from "tailwind-variants";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";

const TextVariants = tv({
  base: "font-[silka]",
  variants: {
    variant: {
      default: "text-[max(0.7rem,min(1.3vw,14px))] text-[#]",
      marqueetext: "text-[max(0.7rem,min(0.6vw,12px))]",
      marqueedesc: "text-[max(0.7rem,min(1vw,15px))]",
      barText: "text-[0.45rem] lg:text-[max(0.5rem,min(1vw,15px))] text-[#ADADAD]",
      heading:
        "font-bold tracking-wide text-[max(0.95rem,min(1.2vw,22px))] text-[SFPro]",
      description: "text-md",
      smallHeading: "text-md",
      inputDescription: "text-sm text-light-doccolor",
      theme: "",
      heroTitle: "font-normal text-[#ECECEC] text-[1.3rem] lg:text-[min(3.5vw,65px)]",
      secondaryTitle:
        "text-[max(1rem,min(2.1vw,45px))] lg:leading-[50px] text-[#ECECEC]",
      shortHeadings: "text-[max(0.8rem,min(1.3vw,28px))] text-[#ECECEC]",
      navbarText: "text-[max(1rem,min(1.3vw,28px))] font-[600] text-[#ECECEC]",
      review: "text-[max(0.8rem,min(1vw,19px))] font-[400] text-[#ECECEC]",
      productdesc:
        "font-[400] text-[max(0.6rem,min(1.1vw,22px))] text-[#777777]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface TextProps
  extends HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof TextVariants> {
  children: React.ReactNode;
  triggerAnimation?: boolean;
}

const Text = ({
  children,
  className,
  variant = "default",
  triggerAnimation = false,
  ...props
}: TextProps) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!textRef.current || hasAnimated || !triggerAnimation) return;

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const commonAnimationSettings = {
            delay: variant === "heroTitle" ? 0 : 0.01,
            duration: 0.2,
            ease: "power3.out",
          };

          if (variant === "heroTitle") {
            const splitText = entry.target.textContent
              ?.split(" ")
              .map(
                (char) =>
                  `<span class="char" style="display:inline-block ">${char}</span>`
              );
            if (splitText) {
              entry.target.innerHTML = splitText.join(" ");
              gsap.fromTo(
                entry.target.querySelectorAll(".char"),
                { opacity: 0, y: 30 },
                {
                  delay: 1.4,
                  opacity: 1,
                  y: 0,
                  stagger: 0.1,
                  duration: 0.8,
                  ease: "power3.out",
                }
              );
            }
          } else {
            const animations: Record<string, () => gsap.core.Tween> = {
              default: () =>
                gsap.fromTo(
                  entry.target,
                  { opacity: 0 },
                  { opacity: 1, ...commonAnimationSettings }
                ),
              marqueetext: () =>
                gsap.fromTo(
                  entry.target,
                  { x: -100 },
                  { x: 0, ...commonAnimationSettings }
                ),
              marqueedesc: () =>
                gsap.fromTo(
                  entry.target,
                  { y: 50 },
                  { y: 0, ...commonAnimationSettings }
                ),
              barText: () =>
                gsap.fromTo(
                  entry.target,
                  { opacity: 0.4, x: -30 },
                  { opacity: 1, x: 0, ...commonAnimationSettings }
                ),
              heading: () =>
                gsap.fromTo(
                  entry.target,
                  { opacity: 0 },
                  { opacity: 1, ...commonAnimationSettings }
                ),
              description: () =>
                gsap.fromTo(
                  entry.target,
                  { opacity: 0 },
                  { opacity: 1, ...commonAnimationSettings }
                ),
              smallHeading: () =>
                gsap.fromTo(
                  entry.target,
                  { opacity: 0 },
                  { opacity: 1, ...commonAnimationSettings }
                ),
              inputDescription: () =>
                gsap.fromTo(
                  entry.target,
                  { opacity: 0 },
                  { opacity: 1, ...commonAnimationSettings }
                ),
              theme: () =>
                gsap.fromTo(
                  entry.target,
                  { opacity: 0 },
                  { opacity: 1, ...commonAnimationSettings }
                ),
              heroTitle: () =>
                gsap.fromTo(
                  entry.target,
                  { y: -50 },
                  { y: 0, duration: 1.2, ease: "power3.out" }
                ), // No delay for heroTitle
              secondaryTitle: () =>
                gsap.fromTo(
                  entry.target,
                  { opacity: 0.5 },
                  { opacity: 1, duration: 0.8, ease: "power3.out" }
                ),
              shortHeadings: () =>
                gsap.fromTo(
                  entry.target,
                  { opacity: 0 },
                  { opacity: 1, ...commonAnimationSettings }
                ),
              navbarText: () =>
                gsap.fromTo(entry.target, { scaleX: 1.05 }, { scaleX: 1 }),
            };

            const animate = animations[variant];
            animate();
          }

          setHasAnimated(true);
          observer.disconnect();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.1,
    });
    observer.observe(textRef.current);

    return () => observer.disconnect();
  }, [variant, hasAnimated, triggerAnimation]);

  return (
    <p
      ref={textRef}
      className={cn(TextVariants({ variant }), className)}
      {...props}
    >
      {children}
    </p>
  );
};

export default Text;
