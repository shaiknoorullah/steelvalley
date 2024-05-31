import Text from "@/components/ui/Text";
import { MaskContainer } from "@/components/ui/svg-mask-effect";
import React from "react";
import GradientImage from "../../../../public/home/herogradinet.png";
import Image from "next/image";

const HomeMaskComponent = () => {
  return (
    <div className="h-screen overflow-hidden relative ">
      {/* <div className="absolute rotate-180">
        <Image alt="gradinet" src={GradientImage} className="z-20" />
      </div> */}
      <div className="absolute rotate-180 md:flex -z-50 md:top-0 backdrop-brightness-150 opacity-100 brightness-50">
        <Image
          alt="gradinet"
          src={GradientImage}
          className="h-[800px] w-screen lg:h-[1050px] md:h-[700px] base:opacity-60 md:opacity-100"
        />
      </div>
      <div className="max-w-[1920px] z-50">
        <MaskContainer
          revealText={
            <Text variant="secondaryTitle" className=" text-[#666666] w-[80%]">
              From Blueprint to Reality. Precision-crafted steel products
              tailored to your kitchen's needs, ensuring efficiency and
              elegance.
            </Text>
          }
          // className="h-[40rem] border rounded-md"
        >
          <Text variant="secondaryTitle" className="text-[#ECECEC]">
            From Blueprint to Reality. Precision-crafted steel products tailored
            to your kitchen's needs, ensuring efficiency and elegance.
          </Text>
        </MaskContainer>
      </div>
    </div>
  );
};

export default HomeMaskComponent;
