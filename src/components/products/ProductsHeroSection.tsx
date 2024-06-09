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
        console.log("hello index page");
        const tableData = await getTableData("tblpvbRUZpeG7f9ai");

        console.log(tableData);
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
  console.log(data?.data?.records[0]?.fields?.HeroTitle);
  return (
    <div>
      <LoadingScreen state={isPending} />
      <div className="md:h-screen w-full rounded-md flex md:items-center md:justify-center  antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <Spotlight
          className="-top-20 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        <div className="flex flex-col items-center text-center gap-8  relative z-10 base:w-[100%]  md:w-[80%] pt-32 md:pt-2">
          <Text variant="heroTitle" triggerAnimation={isSuccess}>
            {data?.data?.records[0]?.fields?.HeroTitle}
            {/* <br className="base:hidden lg:flex" /> */}
            {/* Commercial Kitchen Equipment */}
          </Text>
          <Text
            variant="shortHeadings"
            className=" font-normal  text-neutral-300 base:text-center base:w-[90%] md:w-[80%]"
            triggerAnimation={isSuccess}
          >
            {data?.data?.records[0]?.fields?.HeroDescription}
          </Text>
          <Button variant="white" className="mt-12">
            Get a Custom Quote
          </Button>
        </div>
      </div>
    </div>
  );
}
