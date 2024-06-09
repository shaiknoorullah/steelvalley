import Image from "next/image";
import { Inter } from "next/font/google";
import { Footer } from "@/components/custom/layout/Footer";
import HomeHero from "@/components/custom/home/HomeHero";
import HomeMaskComponent from "@/components/custom/home/HomeMaskComponent";
import TabComponent from "@/components/custom/home/TailoredSolutions";
import ContactUs from "@/components/custom/aboutus/ContactUs";
import Navbar from "@/components/custom/layout/Navbar";
import { useQuery } from "@tanstack/react-query";
import { getTableData } from "../../utils/getTableData";

export default function Home() {
  // const { isPending, isError, data, isSuccess, error } = useQuery({
  //   queryKey: ["airtableData"],
  //   queryFn: async () => {
  //     try {
  //       console.log("hello index page");
  //       const tableData = await getTableData("tblcyLkr5afueTlXq");

  //       console.log(tableData);
  //       if (!tableData) {
  //         return Promise.reject("Could not get the table data from API");
  //       }
  //       return Promise.resolve(tableData);
  //     } catch (error) {
  //       throw new Error(
  //         `There was an unexpected error while trying to get the table data, ${error}`
  //       );
  //     }
  //   },
  // });
  const tabData = [
    [
      {
        title:
          "1 Discover the Evolution: Experience The Journey from Chaos to Harmony",
        text: "Experience the seamless transition as our precision-engineered storage solutions meticulously organize your space, facilitating effortless accessibility to every tool and ingredient. Our commitment to durability ensures a lasting foundation, empowering your kitchen to foster unparalleled efficiency and productivity.",
        image: "/home/tailoredsection/tailoredimg.png",
      },
      {
        title:
          "1 Revolutionize Your Kitchen: Embrace the Power of Organization",
        text: "Transform your kitchen into a masterpiece of organization with our innovative storage solutions. Enjoy the ease of accessing every tool and ingredient effortlessly, while our durable designs ensure lasting functionality and style.",
        image: "/home/tailoredsection/tailoredimg.png",
      },
      // {
      //   title: "1 Optimize Your Space: From Clutter to Clarity",
      //   text: "Say goodbye to clutter and hello to clarity with our state-of-the-art storage systems. Our solutions provide an organized and efficient kitchen environment, enhancing your cooking experience with easy accessibility and robust durability.",
      //   image: "/home/tailoredsection/tailoredimg.png",
      // },
    ],
    [
      {
        title: "2 Elevate Your Kitchen: Precision Storage for Modern Living",
        text: "Our precision-engineered storage solutions are designed to elevate your kitchen, providing seamless organization and effortless accessibility. Built to last, our products ensure your kitchen remains efficient and productive for years to come.",
        image: "/home/tailoredsection/tailoredimg.png",
      },
      {
        title:
          "2 Discover the Evolution: Experience The Journey from Chaos to Harmony",
        text: "Experience the seamless transition as our precision-engineered storage solutions meticulously organize your space, facilitating effortless accessibility to every tool and ingredient. Our commitment to durability ensures a lasting foundation, empowering your kitchen to foster unparalleled efficiency and productivity.",
        image: "/home/tailoredsection/tailoredimg.png",
      },
      {
        title: "2 Transform Your Kitchen: Innovative Storage Solutions",
        text: "Transform your kitchen with our cutting-edge storage solutions that provide maximum organization and efficiency. Enjoy the convenience of easily accessible tools and ingredients, supported by our durable and stylish designs.",
        image: "/home/tailoredsection/tailoredimg.png",
      },
    ],
    [
      {
        title: "3 Master Your Kitchen: Superior Storage Solutions",
        text: "Master the art of kitchen organization with our superior storage solutions. Our designs ensure that every tool and ingredient is within easy reach, promoting a seamless and efficient cooking experience.",
        image: "/home/tailoredsection/tailoredimg.png",
      },
      {
        title: "3 Unleash the Potential: Advanced Kitchen Organization",
        text: "Unleash the full potential of your kitchen with our advanced storage systems. Experience the benefits of a well-organized space, where accessibility and durability come together to create a highly productive cooking environment.",
        image: "/home/tailoredsection/tailoredimg.png",
      },
      {
        title: "3 Experience Efficiency: Streamlined Kitchen Storage",
        text: "Experience the ultimate in kitchen efficiency with our streamlined storage solutions. Our precision-engineered designs ensure that every tool and ingredient is easily accessible, while our commitment to durability guarantees lasting performance.",
        image: "/home/tailoredsection/tailoredimg.png",
      },
    ],
    [
      {
        title: "3 Master Your Kitchen: Superior Storage Solutions",
        text: "Master the art of kitchen organization with our superior storage solutions. Our designs ensure that every tool and ingredient is within easy reach, promoting a seamless and efficient cooking experience.",
        image: "/home/tailoredsection/tailoredimg.png",
      },
      {
        title: "3 Unleash the Potential: Advanced Kitchen Organization",
        text: "Unleash the full potential of your kitchen with our advanced storage systems. Experience the benefits of a well-organized space, where accessibility and durability come together to create a highly productive cooking environment.",
        image: "/home/tailoredsection/tailoredimg.png",
      },
      {
        title: "3 Experience Efficiency: Streamlined Kitchen Storage",
        text: "Experience the ultimate in kitchen efficiency with our streamlined storage solutions. Our precision-engineered designs ensure that every tool and ingredient is easily accessible, while our commitment to durability guarantees lasting performance.",
        image: "/home/tailoredsection/tailoredimg.png",
      },
    ],
  ];

  return (
    <div className="w-full flex flex-col items-center overflow-hidden ">
      <div className=" max-w-[1920px] flex flex-col ">
        <Navbar />
        <HomeHero />
        <HomeMaskComponent />
        <TabComponent tabData={tabData} />
        <ContactUs />
        {/* <div className="flex flex-col gap-6 pt-20 "> */}
        <Footer />
        {/* </div> */}
      </div>
    </div>
  );
}

const testimonials = [
  {
    quote:
      "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
    name: "Charles Dickens",
    title: "A Tale of Two Cities",
  },
  {
    quote:
      "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
    name: "William Shakespeare",
    title: "Hamlet",
  },
  {
    quote: "All that we see or seem is but a dream within a dream.",
    name: "Edgar Allan Poe",
    title: "A Dream Within a Dream",
  },
  {
    quote:
      "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
    name: "Jane Austen",
    title: "Pride and Prejudice",
  },
  {
    quote:
      "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
    name: "Herman Melville",
    title: "Moby-Dick",
  },
];
