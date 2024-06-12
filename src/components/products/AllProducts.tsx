import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import SingleProduct from "./SingleProduct";
import { useQuery } from "@tanstack/react-query";
import { getFilterData } from "../../../utils/getFilterData";
import { Skeleton } from "../ui/Skeleton";

interface Product {
  href: string;
  imageSrc: string;
  title: string;
  description: string;
  buttonText: string;
}

const AllProducts = () => {
  const [selectedTab, setSelectedTab] = useState("storage");
  const [productsData, setProductsData] = useState<Product[]>([]);

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["airtablefilterproducts", selectedTab],
    queryFn: async () => {
      const formattedTab = selectedTab.toLowerCase().replace(/\s+/g, "");
      const tableData = await getFilterData("tblBrcdtbPFeiEoRO", formattedTab);

      if (!tableData) {
        throw new Error("Could not get the table data from API");
      }

      return tableData.data.records.map((record: any) => ({
        href: `/product/${record.fields.productlink[0]}`,
        imageSrc: record.fields.PtoductImage[0].url, // Assuming 'ProductImage' is an array of objects containing 'url' field
        title: record.fields.ProductTitle,
        description: record.fields.ProductDescription,
        buttonText: "Learn More",
      }));
    },
    refetchOnWindowFocus: false,
    enabled: false, // disable automatic execution
  });

  useEffect(() => {
    refetch(); // manually trigger query when selectedTab changes
  }, [selectedTab, refetch]);

  useEffect(() => {
    if (data) {
      setProductsData(data);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div>
        <div className="flex w-full justify-center items-center">
          <Tabs
            defaultValue={selectedTab}
            className="w-[70%] flex flex-col justify-center items-center gap-20"
            onValueChange={setSelectedTab}
          >
            <TabsList className="flex base:flex-col md:flex-row">
              <TabsTrigger value="storage">Storage</TabsTrigger>
              <TabsTrigger value="cooking">Cooking</TabsTrigger>
              <TabsTrigger value="workstations">Work Stations</TabsTrigger>
              <TabsTrigger value="washing">Washing</TabsTrigger>
            </TabsList>
            <TabsContent
              value={selectedTab}
              className="grid md:grid-cols-3 base:gap-10 md:gap-28"
            >
              <div className="flex flex-col space-y-5">
                <Skeleton className="h-[225px] w-[300px] rounded-xl" />
                <div className="space-y-5">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
              <div className="flex flex-col space-y-5">
                <Skeleton className="h-[225px] w-[300px] rounded-xl" />
                <div className="space-y-5">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
              <div className="flex flex-col space-y-5">
                <Skeleton className="h-[225px] w-[300px] rounded-xl" />
                <div className="space-y-5">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            </TabsContent>
            {/* Add TabsContent for other tabs similarly */}
          </Tabs>
        </div>
      </div>
    );
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex w-full justify-center items-center">
      <Tabs
        defaultValue={selectedTab}
        className="w-[70%] flex flex-col justify-center items-center gap-20"
        onValueChange={setSelectedTab}
      >
        <TabsList className="flex base:flex-row md:flex-row">
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="cooking">Cooking</TabsTrigger>
          <TabsTrigger value="workstations">Work Stations</TabsTrigger>
          <TabsTrigger value="washing">Washing</TabsTrigger>
        </TabsList>
        <TabsContent
          value={selectedTab}
          className="grid  md:grid-cols-3 base:gap-10 md:gap-28"
        >
          {productsData.map((product, index) => (
            <SingleProduct
              key={index}
              href={product.href}
              imageSrc={product.imageSrc}
              title={product.title}
              description={product.description}
              buttonText={product.buttonText}
            />
          ))}
        </TabsContent>
        {/* Add TabsContent for other tabs similarly */}
      </Tabs>
    </div>
  );
};

export default AllProducts;
