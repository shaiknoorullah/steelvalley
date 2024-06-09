// import ContactUs from "@/components/custom/aboutus/ContactUs";
// import { Footer } from "@/components/custom/layout/Footer";
// import Navbar from "@/components/custom/layout/Navbar";
// import { Button } from "@/components/ui/Button";
// import Text from "@/components/ui/Text";
// import axios from "axios";
// import { useRouter } from "next/router";
// import React, { useEffect, useState } from "react";

// const SingleProduct = () => {
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState(null);
//   const [images, setImages] = useState([]);
//   const [currentImage, setCurrentImage] = useState("");
//   const router = useRouter();
//   const { name } = router.query;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`/api/product/${name}`); // Call your API route
//         const fetchedData = response.data.records[0].fields;
//         setData(fetchedData);
//         const fetchedImages = fetchedData.Images.map(
//           (image) => image.thumbnails.large.url
//         );
//         setImages(fetchedImages);
//         setCurrentImage(fetchedImages[0] || "");
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     if (name) {
//       fetchData();
//     }
//   }, [name]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="w-full flex flex-col items-center overflow-hidden">
//       <div className="max-w-[1920px] flex flex-col gap-20">
//         <Navbar />
//         <div className="flex justify-center items-center h-screen">
//           <div className="w-[85%] flex base:flex-col md:flex-row gap-32">
//             <div className="w-1/2 flex flex-col gap-6">
//               <img
//                 src={currentImage}
//                 alt="img"
//                 className="w-[700px] h-[500px] mb-4 rounded-xl"
//               />
//               <div className="flex w-full justify-between">
//                 {images.map((image, index) => (
//                   <img
//                     key={index}
//                     src={image}
//                     alt={`img-${index + 1}`}
//                     className={`w-[135px] h-[105px] cursor-pointer object-cover rounded-md ${
//                       currentImage === image ? "border-2 border-blue-500" : ""
//                     }`}
//                     onClick={() => setCurrentImage(image)}
//                   />
//                 ))}
//               </div>
//             </div>
//             <div className="flex flex-col justify-between w-[50%] z-10">
//               <div>
//                 <Text variant="secondaryTitle">{data.Title}</Text>
//                 <div className="flex gap-1 items-center mt-2">
//                   {[...Array(data.Stars)].map((_, index) => (
//                     <img
//                       key={index}
//                       src="/products/star.png"
//                       alt="star"
//                       className="w-5 h-5"
//                     />
//                   ))}
//                   <Text variant="review">{data.TotalReviews}</Text>
//                 </div>
//               </div>
//               <Text variant="productdesc" className="text">
//                 {data.Description}
//               </Text>
//               <div className="flex flex-col gap-4">
//                 <Text variant="shortHeadings">Size:</Text>
//                 <div className="flex gap-14">
//                   {[1, 2, 3, 4].map((_, index) => (
//                     <Button key={index} variant="productSize" className="">
//                       Learn More
//                     </Button>
//                   ))}
//                 </div>
//               </div>
//               <div className="flex gap-5">
//                 <Button variant="white" className="">
//                   Enquire Now
//                 </Button>
//                 <Button variant="black" className="">
//                   Get A Custom Quote
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//         <ContactUs />
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default SingleProduct;

// 22
import ContactUs from "@/components/custom/aboutus/ContactUs";
import { Footer } from "@/components/custom/layout/Footer";
import Navbar from "@/components/custom/layout/Navbar";
import { Button } from "@/components/ui/Button";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Text from "@/components/ui/Text";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface ProductData {
  Title: string;
  Stars: number;
  TotalReviews: number;
  Description: string;
  Images: { thumbnails: { large: { url: string } } }[];
}

const SingleProduct: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProductData | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState<string>("");
  const router = useRouter();
  const { name } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/product/${name}`); // Call your API route
        const fetchedData = response.data.records[0].fields as ProductData;
        setData(fetchedData);
        const fetchedImages = fetchedData.Images.map(
          (image) => image.thumbnails.large.url
        );
        setImages(fetchedImages);
        setCurrentImage(fetchedImages[0] || "");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    if (name) {
      fetchData();
    }
  }, [name]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  if (!data) {
    return (
      <div>
        <LoadingScreen state={loading} />
      </div>
    );
  }

  return (
    <div>
      <LoadingScreen state={loading} />

      <div className="w-full flex flex-col items-center overflow-hidden">
        <div className="max-w-[1920px] flex flex-col gap-20">
          <Navbar />
          <div className="flex justify-center items-center h-screen base:mt-48 md:mt-10">
            <div className="w-[85%] h-fit flex base:flex-col md:flex-row base:gap-10 md:gap-20">
              <div className="md:w-1/2  flex flex-col gap-2 md:gap-6">
                <img
                  src={currentImage}
                  alt="img"
                  className="w-full h-[250px] md:h-[min(25vw,500px)] mb-4 rounded-xl object-cover"
                />
                <div className="flex w-full justify-between">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`img-${index + 1}`}
                      className={`base:w-12 md:w-[min(5vw,135px)] md:h-[min(4.5vw,105px)] cursor-pointer object-cover rounded-md ${
                        currentImage === image ? "border-2 border-blue-500" : ""
                      }`}
                      onClick={() => setCurrentImage(image)}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-5 md:justify-between md:w-[50%] z-10">
                <div>
                  <Text variant="secondaryTitle">{data.Title}</Text>
                  <div className="flex gap-1 items-center mt-2">
                    {[...Array(data.Stars)].map((_, index) => (
                      <img
                        key={index}
                        src="/products/star.png"
                        alt="star"
                        className="w-4 h-4 md:w-5 md:h-5"
                      />
                    ))}
                    <Text variant="review">{data.TotalReviews}</Text>
                  </div>
                </div>
                <Text variant="productdesc" className="text">
                  {data.Description}
                </Text>
                <div className="flex flex-col gap-4">
                  <Text variant="shortHeadings">Size:</Text>
                  <div className="flex flex-wrap gap-[min(2vw,56px)]">
                    {[1, 2, 3, 4].map((_, index) => (
                      <Button key={index} variant="productSize" className="">
                        Learn More
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-5 mt-2">
                  <Button variant="white" className="">
                    Enquire Now
                  </Button>
                  <Button variant="black" className="">
                    Get A Custom Quote
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <ContactUs />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
