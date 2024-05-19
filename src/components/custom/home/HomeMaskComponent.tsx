import Text from "@/components/ui/Text";
import { MaskContainer } from "@/components/ui/svg-mask-effect";
import React from "react";
import GradientImage from "../../../../public/home/herogradinet.png";
import Image from "next/image";

const HomeMaskComponent = () => {
  return (
    <div className="h-screen overflow-hidden relative">
      <div className="absolute rotate-180 bottom-8">
        <Image alt="gradinet" src={GradientImage} />
      </div>
      <div className="opacity-60">
        <MaskContainer
          className=""
          revealText={
            <Text
              variant="secondaryTitle"
              className="max-w-[1440px]  text-[#666666] text-center   font-bold"
            >
              From Blueprint to Reality. Precision-crafted steel products
              tailored to your kitchen's needs, ensuring efficiency and
              elegance.
            </Text>
          }
          // className="h-[40rem] border rounded-md"
        >
          <Text variant="secondaryTitle" className="max-w-[1440px]">
            From Blueprint to Reality. Precision-crafted steel products tailored
            to your kitchen's needs, ensuring efficiency and elegance.
          </Text>
        </MaskContainer>
      </div>
    </div>
  );
};

export default HomeMaskComponent;
