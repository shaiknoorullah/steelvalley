import { Footer } from "@/components/custom/layout/Footer";
import AboutMarquee from "@/components/custom/aboutus/AboutMarquee";
import ContactUs from "@/components/custom/aboutus/ContactUs";
import AllProducts from "@/components/products/AllProducts";
import { ProductsHeroSection } from "@/components/products/ProductsHeroSection";
import { ProductCard } from "@/components/ui/HeroParallax";
import { ImagesMarquee } from "@/components/ui/ImagesMarquee";
import { SpotLight } from "@react-three/drei";
import React from "react";
import Navbar from "@/components/custom/layout/Navbar";

const Products = () => {
  return (
    <div className="w-full flex justify-center items-center ">
      <div className="max-w-[1920px] overflow-hidden flex flex-col md:gap-20">
        <Navbar />
        <ProductsHeroSection />
        <AboutMarquee />
        <AllProducts />
        <ContactUs />
        <Footer />
      </div>
    </div>
  );
};

export default Products;
