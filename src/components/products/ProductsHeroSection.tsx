import React from "react";
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/SpotLight";
import Text from "../ui/Text";
import { Button } from "../ui/Button";
import { getTableData } from "../../../utils/getTableData";
import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "../ui/LoadingScreen";

export function ProductsHeroSection() {
  const { isPending, isError, data, isSuccess, error } = useQuery({
    queryKey: ["airtableData"],
    queryFn: async () => {
      try {
        const tableData = await getTableData("tblpvbRUZpeG7f9ai");

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
  // console.log(data?.data?.records[0]?.fields?.HeroTitle);
  return (
    <div>
      <LoadingScreen state={isPending} />
      <div className="lg:h-screen w-full rounded-md flex md:items-center md:justify-center  antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <Spotlight
          className="  left-10 md:left-[30%] md:-top-20 base:absolute -top-28 md:flex"
          fill="white"
        />
        <div className="flex flex-col items-center  text-center base:gap-10 md:gap-20  relative z-10 base:w-[100%]  md:w-[80%] pt-48 md:pt-20">
          <div className="text-center flex flex-col base:gap-5 md:gap-10  items-center">
            <Text
              variant="heroTitle"
              className="leading-none"
              triggerAnimation={isSuccess}
            >
              {data?.data?.records[0]?.fields?.HeroTitle}
              {/* <br className="base:hidden lg:flex" /> */}
              {/* Commercial Kitchen Equipment */}
            </Text>
            <Text
              variant="shortHeadings"
              className=" font-normal  text-neutral-400 base:text-center base:w-[90%] md:w-[80%]"
              triggerAnimation={isSuccess}
            >
              {data?.data?.records[0]?.fields?.HeroDescription}
            </Text>
          </div>
          <Button variant="white" className="mt-12">
            Get a Custom Quote
          </Button>
        </div>
      </div>
    </div>
  );
}
