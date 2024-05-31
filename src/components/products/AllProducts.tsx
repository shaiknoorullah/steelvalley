import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";

const AllProducts = () => {
  return (
    <div className="flex w-full justify-center items-center">
      <Tabs
        defaultValue="storage"
        className="w-[70%] flex flex-col justify-center items-center"
      >
        <TabsList>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="cooking">Cooking</TabsTrigger>
          <TabsTrigger value="workstation">Work Satations</TabsTrigger>

          <TabsTrigger value="washing">Washing</TabsTrigger>
        </TabsList>
        <TabsContent value="storage">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="cooking">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="workstation">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="washing">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default AllProducts;
