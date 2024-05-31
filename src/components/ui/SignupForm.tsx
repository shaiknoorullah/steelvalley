"use client";
import React from "react";
import { Label } from "./Label";
import { Input } from "./Input";
import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";

export function SignupForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };
  return (
    <div
      className=" max-w-[480px]  w-full rounded-md p-3 md:p-6 lg:p-6 2xl:p-8 shadow-input border-[1px] border-gray-900"
      style={{
        background:
          "linear-gradient(157.27deg, rgba(65, 65, 65, 0.3) -39.05%, rgba(36, 36, 36, 0) 135.1%)",
        border: "",
        borderColor:
          "radial-gradient(174.8% 174.8% at 135.3% 155.27%, rgba(0, 0, 0, 0.6) 0%, rgba(83, 83, 83, 0.6) 100%)",
      }}
    >
      <form className="py-14" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">Full Name</Label>
            <Input id="firstname" type="text" />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="Number">Phone Number</Label>
          <Input id="Number" type="number" />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="Number">Message</Label>
          <Input
            type="text"
            placeholder=""
            className="base:h-[100px] md:h-[125px]"
          />
        </LabelInputContainer>
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-800 block dark:bg-zinc-800 w-full text-white rounded-sm h-10 font-medium "
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>

        {/* <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" /> */}
      </form>
    </div>
  );
}

export const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
