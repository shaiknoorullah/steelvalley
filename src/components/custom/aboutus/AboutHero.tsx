"use client";
import React from "react";
import { HeroParallax } from "@/components/ui/HeroParallax";
import { useQuery } from "@tanstack/react-query";
import { getTableData } from "../../../../utils/getTableData";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Text from "@/components/ui/Text";

export function AboutHeroParallax() {
  const { isPending, isError, data, isSuccess, error } = useQuery({
    queryKey: ["airtableData"],
    queryFn: async () => {
      try {
        const tableData = await getTableData("tbllr4eLGe8WBzmnu");

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
    <div>
      <LoadingScreen state={isPending} />
      <div className="mt-52 flex flex-col min-">
        <HeroParallax
          animateon={isSuccess}
          heroTitle={data?.data?.records[0]?.fields?.AboutHero}
          title={data?.data?.records[0]?.fields?.AboutCardTitle}
          link={data?.data?.records[0]?.fields?.AboutCardLink}
          thumbnail={data?.data?.records[0]?.fields?.AboutCardThumbnail}
        />
        <div className="flex justify-center items-center ">
          <Text
            variant="secondaryTitle"
            className="w-[85%] base:pt-[10rem] lg:pt-96 mt-52 mi  text-[#777777]"
          >
            <span className="text-primary">Market Leaders </span> in Custom
            Industrial-Grade Commercial Kitchen Equipment Market Leaders in
            Equipment Market Leaders in{" "}
            <span className="text-primary">Custom Industrial-Grade</span>{" "}
            Commercial Kitchen Equipment Market Leaders in Custom
            Industrial-Grade{" "}
            <span className="text-primary">Commercial Kitchen Equipment</span>
            Commercial Kitchen Equipment
          </Text>
        </div>
      </div>
    </div>
  );
}
// export const products = [
//   {
//     title: "Moonbeam",
//     link: "https://gomoonbeam.com",
//     thumbnail:
//       "https://aceternity.com/images/products/thumbnails/new/moonbeam.png",
//   },
//   {
//     title: "Cursor",
//     link: "https://cursor.so",
//     thumbnail:
//       "https://aceternity.com/images/products/thumbnails/new/cursor.png",
//   },
//   {
//     title: "Rogue",
//     link: "https://userogue.com",
//     thumbnail:
//       "https://aceternity.com/images/products/thumbnails/new/rogue.png",
//   },

//   {
//     title: "Editorially",
//     link: "https://editorially.org",
//     thumbnail:
//       "https://aceternity.com/images/products/thumbnails/new/editorially.png",
//   },
//   {
//     title: "Editrix AI",
//     link: "https://editrix.ai",
//     thumbnail:
//       "https://aceternity.com/images/products/thumbnails/new/editrix.png",
//   },
//   {
//     title: "Pixel Perfect",
//     link: "https://app.pixelperfect.quest",
//     thumbnail:
//       "https://aceternity.com/images/products/thumbnails/new/pixelperfect.png",
//   },

//   {
//     title: "Algochurn",
//     link: "https://algochurn.com",
//     thumbnail:
//       "https://aceternity.com/images/products/thumbnails/new/algochurn.png",
//   },
//   {
//     title: "Aceternity UI",
//     link: "https://ui.aceternity.com",
//     thumbnail:
//       "https://aceternity.com/images/products/thumbnails/new/aceternityui.png",
//   },
//   {
//     title: "Tailwind Master Kit",
//     link: "https://tailwindmasterkit.com",
//     thumbnail:
//       "https://aceternity.com/images/products/thumbnails/new/tailwindmasterkit.png",
//   },
//   {
//     title: "SmartBridge",
//     link: "https://smartbridgetech.com",
//     thumbnail:
//       "https://aceternity.com/images/products/thumbnails/new/smartbridge.png",
//   },
//   {
//     title: "Renderwork Studio",
//     link: "https://renderwork.studio",
//     thumbnail:
//       "https://aceternity.com/images/products/thumbnails/new/renderwork.png",
//   },

//   {
//     title: "Creme Digital",
//     link: "https://cremedigital.com",
//     thumbnail:
//       "https://aceternity.com/images/products/thumbnails/new/cremedigital.png",
//   },
//   {
//     title: "Golden Bells Academy",
//     link: "https://goldenbellsacademy.com",
//     thumbnail:
//       "https://aceternity.com/images/products/thumbnails/new/goldenbellsacademy.png",
//   },
//   {
//     title: "Invoker Labs",
//     link: "https://invoker.lol",
//     thumbnail:
//       "https://aceternity.com/images/products/thumbnails/new/invoker.png",
//   },
//   {
//     title: "E Free Invoice",
//     link: "https://efreeinvoice.com",
//     thumbnail:
//       "https://aceternity.com/images/products/thumbnails/new/efreeinvoice.png",
//   },
// ];
