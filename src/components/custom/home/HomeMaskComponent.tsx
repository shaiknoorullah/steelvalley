import Text from "@/components/ui/Text";
import { MaskContainer } from "@/components/ui/svg-mask-effect";
import React from "react";
import GradientImage from "../../../../public/home/herogradinet.png";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getTableData } from "../../../../utils/getTableData";

const HomeMaskComponent = () => {
  const { isPending, isError, data, isSuccess, error } = useQuery({
    queryKey: ["airtableData"],
    queryFn: async () => {
      try {
        console.log("hello index page");
        const tableData = await getTableData("tblcyLkr5afueTlXq");

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
  console.log(data?.data?.records[0]?.fields?.MaskTitle);
  return (
    <div className="h-screen overflow-hidden relative ">
      {/* <div className="absolute rotate-180">
        <Image alt="gradinet" src={GradientImage} className="z-20" />
      </div> */}
      <div className="absolute rotate-180 md:flex -z-50 md:top-0 backdrop-brightness-150 opacity-100 brightness-50">
        <Image
          alt="gradinet"
          src={GradientImage}
          className="h-[800px] w-screen lg:h-[1050px] md:h-[700px] base:opacity-60 md:opacity-100"
        />
      </div>
      <div className="max-w-[1920px] z-50">
        <MaskContainer
          revealText={
            <Text
              variant="secondaryTitle"
              className=" text-[#666666] w-[80%] "
              triggerAnimation={isSuccess}
            >
              {data?.data?.records[0]?.fields?.MaskTitle}
            </Text>
          }
          // className="h-[40rem] border rounded-md"
        >
          <Text
            variant="secondaryTitle"
            className="text-[#ECECEC] brightness-200 font-semibold"
          >
            {data?.data?.records[0]?.fields?.MaskTitle}
          </Text>
        </MaskContainer>
      </div>
    </div>
  );
};

export default HomeMaskComponent;
