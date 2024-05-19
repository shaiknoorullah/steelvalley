import React, { HTMLAttributes } from "react";
import { type VariantProps, tv } from "tailwind-variants";
import { cn } from "@/lib/utils";

const TextVariants = tv({
  base: "",
  variants: {
    variant: {
      default: "text-[max(0.7rem,min(1.3vw,15px))] ",
      marqueetext: "text-[max(0.7rem,min(0.6vw,12px))]",
      marqueedesc: "text-[max(0.7rem,min(1vw,15px))]",

      barText: "text-[max(0.75rem,min(1.3vw,20px))] text-[#ADADAD]",
      Heading: "font-bold tracking-wide text-lg text-[SFPro] ", // Hero section center text
      Description: "text-md ", // Footer variants
      smallHeading: "text-md text-",
      // profile:
      //   " text-sm py-[6px] px-1 rounded-md bgguidegridclass border-[1px] border-gray-700 border-opacity-80",
      inputDescription: "text-sm text-light-doccolor ",
      theme: "",
      heroTitle: "font-medium text-[max(1.2rem,min(4vw,65px))]  ",
      secondaryTitle: "text-[max(1rem,min(2.1vw,45px))] lg:leading-[50px]",
      shortHeadings: "text-[max(0.7rem,min(1.3vw,28px))]",
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
}
const Text = ({ children, className, variant, ...props }: TextProps) => {
  return (
    <p className={cn(TextVariants({ variant }), className)} {...props}>
      {children}
    </p>
  );
};
export default Text;
