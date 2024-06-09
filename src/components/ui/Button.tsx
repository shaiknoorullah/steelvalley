// import { cn } from "@/lib/utils";
// import React from "react";
// import { tv, type VariantProps } from "tailwind-variants";
// const ButtonVariants = tv({
//   base: "bg-black text-white  text-[max(0.6rem,min(0.8vw,14px))]  rounded-md",
//   variants: {
//     variant: {
//       default: "bg-primary text-primary-foreground hover:bg-primary/90 ",
//       destructive:
//         "bg-destructive text-destructive-foreground hover:bg-destructive/90",
//       outline:
//         "border border-input bg-background hover:bg-accent hover:text-accent-foreground ",
//       secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
//       ghost: "hover:bg-accent hover:text-accent-foreground",
//       link: "text-primary underline-offset-4 hover:underline",
//       signin: "bg-[#0000ff] text-white w-full px-[152px] py-2 z-50",
//       addcandidate:
//         "bg-[#0000ff] text-[13px]  text-white w-fit px-4  py-2 z-50",
//       white:
//         "bg-white rounded-full lg:px-5 lg:py-3 base:px-3 base:py-2 text-black font-semibold border border-black border-[1px]",
//       black:
//         "bg-transparent rounded-full lg:px-5 lg:py-3 base:px-3 base:py-2 text-white font-semibold border border-white border-[1px]",

//       custombutton:
//         "border-[1px] border-light-gradient border-opacity-20 dark:bg-light-gradient bg-dark-gradient stext-black dark:text-white curser-pointer hover:bg-light-gradient/25",
//     },
//     size: {
//       signinsize: "w-full py-3 px-[9.5rem] ",
//       default: "h-12 px-4",
//       sm: "h-9 rounded-md px-3",
//       lg: "h-11 rounded-md px-8",
//       icon: "h-10 w-10",
//     },
//   },
//   defaultVariants: {
//     variant: "default",
//   },
// });
// export interface ButtonProps
//   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
//     VariantProps<typeof ButtonVariants> {
//   asChild?: boolean;
// }
// const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
//   ({ className, variant, size, asChild = false, ...props }, ref) => {
//     // const Comp = asChild ? Slot : "button"
//     return (
//       <button
//         className={cn(ButtonVariants({ variant, size }), className)}
//         ref={ref}
//         {...props}
//       />
//     );
//   }
// );
// Button.displayName = "Button";
// export { Button, ButtonVariants };

// 2222222222222222222222222
import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { tv, type VariantProps } from "tailwind-variants";
import { gsap } from "gsap";

const ButtonVariants = tv({
  base: "bg-black text-white text-[max(0.5rem,min(0.7vw,14px))] rounded-md z-50",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline:
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
      signin: "bg-[#0000ff] text-white w-full px-[152px] py-2 z-50",
      addcandidate: "bg-[#0000ff] text-[13px] text-white w-fit px-4 py-2 z-50",
      white:
        "bg-[#E9E9E9] rounded-full lg:px-5 lg:py-3 base:px-3 base:py-2 text-[#1B1B1B] font-semibold border border-black border-[1px] text-[max(0.6rem,min(1vw,21px))]",
      productbtn:
        "bg-[#E9E9E9] rounded-full lg:px-5 lg:py-3 base:px-3 base:py-2 text-[#1B1B1B] font-semibold border border-black border-[1px] text-[max(0.5rem,min(0.7vw,14px))]",
      black:
        "bg-transparent rounded-full lg:px-5 lg:py-3 base:px-3 base:py-2 border-[#F2F2F2] font-semibold border text-[#ECECEC] border-[1px] text-[max(0.6rem,min(1vw,21px))]",
      custombutton:
        "border-[1px] border-light-gradient border-opacity-20 dark:bg-light-gradient bg-dark-gradient text-black dark:text-white cursor-pointer hover:bg-light-gradient/25",
      productSize:
        "bg-transparent rounded-full lg:px-5 lg:py-3 base:px-3 base:py-2 text-white font-semibold border border-white border-[1px] text-[max(0.6rem,min(0.7vw,14px))]",
    },
    size: {
      signinsize: "w-full py-3 px-[9.5rem]",
      default: "h-12 px-4",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ButtonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
      if (!buttonRef.current) return;

      const handleHover = () => {
        gsap.to(buttonRef.current, {
          scale: 1.05,
          duration: 0.3,
          ease: "power3.out",
        });
      };

      const handleHoverOut = () => {
        gsap.to(buttonRef.current, {
          scale: 1,
          duration: 0.3,
          ease: "power3.out",
        });
      };

      const handleClick = () => {
        gsap.to(buttonRef.current, {
          scale: 0.95,
          duration: 0.1,
          ease: "power3.out",
        });
        gsap.to(buttonRef.current, {
          scale: 1,
          duration: 0.1,
          delay: 0.1,
          ease: "power3.out",
        });
      };

      const buttonElement = buttonRef.current;
      buttonElement.addEventListener("mouseover", handleHover);
      buttonElement.addEventListener("mouseout", handleHoverOut);
      buttonElement.addEventListener("mousedown", handleClick);

      return () => {
        buttonElement.removeEventListener("mouseover", handleHover);
        buttonElement.removeEventListener("mouseout", handleHoverOut);
        buttonElement.removeEventListener("mousedown", handleClick);
      };
    }, []);

    return (
      <button
        className={cn(ButtonVariants({ variant, size }), className)}
        ref={(node) => {
          buttonRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLButtonElement | null>).current =
              node;
          }
        }}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button, ButtonVariants };
