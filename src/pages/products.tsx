import { Footer } from '@/components/custom/Footer'
import AboutMarquee from '@/components/custom/aboutus/AboutMarquee'
import ContactUs from '@/components/custom/aboutus/ContactUs'
import { ProductsHeroSection } from '@/components/products/ProductsHeroSection'
import { ProductCard } from '@/components/ui/HeroParallax'
import { ImagesMarquee } from '@/components/ui/ImagesMarquee'
import { SpotLight } from '@react-three/drei'
import React from 'react'

const Products = () => {
  return (
    <div className='w-full flex justify-center items-center '>
      <div className='max-w-[1920px] overflow-hidden flex flex-col gap-36'>

        <ProductsHeroSection/>
        <AboutMarquee/>
        <ContactUs/>
        <Footer/>
      </div>
    </div>
  )
}

export default Products