import { Footer } from "@/components/custom/layout/Footer";
import { AboutHeroParallax } from "@/components/custom/aboutus/AboutHero";
import AboutMarquee from "@/components/custom/aboutus/AboutMarquee";
import { TracingBeamDemo } from "@/components/custom/aboutus/BeamAndStickyScroll";
import ContactUs from "@/components/custom/aboutus/ContactUs";
import { ThreePillars } from "@/components/custom/aboutus/ThreePillars";
import React from "react";
import Navbar from "@/components/custom/layout/Navbar";

const Aboutus = () => {
  return (
    <div className="w-full flex flex-col items-center overflow-hidden">
      <div className="max-w-[1920px] flex flex-col base:gap-28 md:gap-32 justify-center items-center overflow-hidden">
        <Navbar />
        <AboutHeroParallax />
        <AboutMarquee />
        <TracingBeamDemo />
        <ThreePillars />
        <ContactUs />
        <Footer />
      </div>
    </div>
  );
};

export default Aboutus;
