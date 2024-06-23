import { ImagesMarquee } from "@/components/ui/ImagesMarquee";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getTableData } from "../../../../utils/getTableData";

const AboutMarquee = () => {
  const logosAry = [
    {
      logo: "/marquee/ipsum.svg",
    },
    {
      logo: "/marquee/logoipsum.svg",
    },
    {
      logo: "/marquee/ipsum.svg",
    },
    {
      logo: "/marquee/logoipsum.svg",
    },
    {
      logo: "/marquee/ipsum.svg",
    },
  ];
  const { isPending, isError, data, isSuccess, error } = useQuery({
    queryKey: ["airtablemarquee"],
    queryFn: async () => {
      try {
        const tableData = await getTableData("tblpvbRUZpeG7f9ai");
        // const tableData = await getTableData("tbllr4eLGe8WBzmnu");

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
    <div className="my-36 max-w-[1920px] w-screen ">
      <ImagesMarquee
        // items={logosAry}
        logo={data?.data?.records[0]?.fields?.MarqueeImages}
        direction="right"
        speed="fast"
        className="font-bold"
      />
      <ImagesMarquee
        // items={logosAry}
        logo={data?.data?.records[0]?.fields?.MarqueeImages}
        direction="left"
        speed="fast"
        className="font-bold"
      />
    </div>
  );
};

export default AboutMarquee;
