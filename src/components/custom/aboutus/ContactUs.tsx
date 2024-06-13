import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import React, { useEffect, useState } from "react";
import Text from "@/components/ui/Text";
// import { SignupForm } from "@/components/ui/SignupForm";
import { useQuery } from "@tanstack/react-query";
import { getTableData } from "../../../../utils/getTableData";
import { SignupForm } from "@/components/ui/SignupForm";

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

  const { isPending, isError, data, isSuccess, error } = useQuery({
    queryKey: ["airtableContactData"],
    queryFn: async () => {
      try {
        const tableData = await getTableData("tblcyLkr5afueTlXq");

        if (!tableData) {
          return Promise.reject("Could not get the table data from API");
        }
        return Promise.resolve(tableData);
      } catch (error) {
        throw new Error(
          `There was an unexpected error while trying to get the table data, ${error}`
        );
      }
    },
  });

  return (
    <div
      id="contact"
      className="flex w-full justify-center lg:min-h-full z-[100]  items-cente base:my-[min(20vw,160px)] md:mt-1 md:py-[min(5vw,80px)]"
    >
      <div className="w-[80%] max-w-[1920px] flex justify-center items-center ">
        <div className=" lg:flex base:flex-col lg:flex-row  gap-20">
          <div className="flex w-full lg:w-[50%]  flex-col base:gap-9 md:gap-20 lg:gap-">
            <div className="flex flex-col gap-10 md:w-[75%]">
              <Text variant="shortHeadings">
                {data?.data?.records[0]?.fields?.ContactTitle}
              </Text>
              <Text variant="default" className="text-[#ECECEC] font-medium">
                {data?.data?.records[0]?.fields?.ContactDesc}
              </Text>
            </div>
            <ContactCrads
              quote={data?.data?.records[0]?.fields?.TitleContactCard}
              name={data?.data?.records[0]?.fields?.NameContactCard}
              title={data?.data?.records[0]?.fields?.DescriptionContactCard}

              // testimonials={data?.data?.records[0]?.fields?.TitleContactCard}
            />
            {/* hello */}
            {/* <div className="flex base:flex-col md:flex-row  gap-5 justify-between">
              {testimonials?.map((item, index) => (
                <blockquote
                  key={index}
                  className="flex flex-col bg-white justify-between  px-5 base:py-5 md:py-9 rounded-md"
                >
                  <Text className="z-20 text-marqueetext leading-[1.6] text-[#2F2F2F]  font-semibold">
                    {item.quote}
                  </Text>
                  <div className="relative z-20 mt-6 flex flex-row items-center">
                    <span className="flex flex-col gap-1">
                      <span className="md:text-[12px] base:text-[9px] leading-[1.6] text-gray-400 font-normal">
                        {item.name}
                      </span>
                      <span className="md:text-[12px] base:text-[9px] leading-[1.6] text-gray-400 font-normal">
                        {item.title}
                      </span>
                    </span>
                  </div>
                </blockquote>
              ))}
            </div> */}
            {/* hello */}
          </div>
          <div className="lg:w-[50%] mt-20 lg:mt-0 flex base:justify-center lg:justify-end">
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

const ContactCrads = ({ quote, name, title }: any) => {
  return (
    <div className="flex base:flex-col md:flex-row  gap-5 justify-between">
      {quote?.map((item: any, index: any) => (
        <blockquote
          key={index}
          className="flex flex-col bg-[#ECECEC] justify-between  px-5 base:py-5 md:py-9 rounded-md"
        >
          <Text className="z-20 text-marqueetext leading-[1.6] text-[#2F2F2F]  font-semibold">
            {quote[index]}
          </Text>
          <div className="relative z-20 mt-6 flex flex-row items-center">
            <span className="flex flex-col gap-1">
              <span className="md:text-[12px] base:text-[9px] leading-[1.6] text-gray-400 font-normal">
                {name[index]}
              </span>
              <span className="md:text-[12px] base:text-[9px] leading-[1.6] text-gray-400 font-normal">
                {title[index]}
              </span>
            </span>
          </div>
        </blockquote>
      ))}
    </div>
  );
};
