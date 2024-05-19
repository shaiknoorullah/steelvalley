import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import React from "react";
import { SignupForm } from "../SignupForm";
import Text from "@/components/ui/Text";

const ContactUs = () => {
  const testimonials = [
    {
      quote:
        "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief.",
      name: "Charles Dickens",
      title: "A Tale of Two Cities",
    },
    {
      quote:
        "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief.",
      name: "William Shakespeare",
      title: "Hamlet",
    },
  ];
  return (
    <div className="flex w-full justify-center  lg:h-screen items-center  py-10">
      <div className="base:w-[80%] sm:w-[70%] md:w-[80%]  max-w-[1920px] flex justify-center items-center">
        <div className="w-full flex lg:flex-row base:flex-col base:gap-20      md:justify-between">
          <div className="flex w-full    lg:w-[65%] flex-col base:gap-9 md:justify-between ">
            <div className="flex flex-col gap-6 lg:w-[65%]">
              <Text className="text-[max(1rem,min(1.5vw,30px))] ">
                Join Us and let’s make the future of industrial kitchens more
                stronger and brighter.
              </Text>
              <Text className="text-[#ECECEC] font-medium">
                Experience the seamless transition as our precision-engineered
                storage solutions meticulously organize your space, facilitating
                effortless accessibility to every tool and ingredient. Our
                commitment to durability ensures a lasting foundation,
                empowering your kitchen to foster unparalleled efficiency and
                productivity.
              </Text>
            </div>
            <ContactCrads
              testimonials={testimonials}
              // direction="right"
              // speed="fast"

              // className="font-bold"
            />
          </div>
          <div className=" lg:w-[35%] flex items-center justify-center ">
            <div className="w-full  ">
              <SignupForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

type ContactCardItem = {
  quote: string;
  name: string;
  title: string;
};

const ContactCrads = ({
  testimonials,
}: {
  testimonials: ContactCardItem[];
}) => {
  return (
    <div className="flex base:flex-col md:flex-row  gap-5 justify-between">
      {testimonials.map((item, index) => (
        <blockquote
          key={index}
          className="flex flex-col bg-white justify-between  px-5 base:py-5 md:py-9 rounded-md"
        >
          <Text className="z-20 text-marqueetext leading-[1.6] text-black  font-semibold">
            {item.quote}
          </Text>
          <div className="relative z-20 mt-6 flex flex-row items-center">
            <span className="flex flex-col gap-1">
              <span className="text-[max(0.5rem,max(0.7vw,12px))] leading-[1.6] text-gray-400 font-normal">
                {item.name}
              </span>
              <span className="text-[max(0.5rem,max(0.7vw,12px))] leading-[1.6] text-gray-400 font-normal">
                {item.title}
              </span>
            </span>
          </div>
        </blockquote>
      ))}
    </div>
  );
};
