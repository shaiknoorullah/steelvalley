import { ImagesMarquee } from "@/components/ui/ImagesMarquee";
import React from "react";

const AboutMarquee = () => {
  const logosAry = [
    {
      logo: "/marquee/ipsum.svg",
    },
    {
      logo: "/marquee/logoipsum.svg",
    },
    {
      logo: "/marquee/ipsum.svg",
    },
    {
      logo: "/marquee/logoipsum.svg",
    },
    {
      logo: "/marquee/ipsum.svg",
    },
  ];
  return (
    <div className="mb-36 max-w-[1920px] w-screen">
      <ImagesMarquee
        items={logosAry}
        direction="right"
        speed="fast"
        className="font-bold"
      />
      <ImagesMarquee
        items={logosAry}
        direction="left"
        speed="fast"
        className="font-bold"
      />
    </div>
  );
};

export default AboutMarquee;
