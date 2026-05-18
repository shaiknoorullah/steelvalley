"use client";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import * as RG from "@radix-ui/react-radio-group";
import { cn } from "@/lib/cn";

export const RadioGroup = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof RG.Root>>(
  ({ className, ...props }, ref) => (
    <RG.Root ref={ref} data-component="radio-group" className={cn("flex flex-col gap-2", className)} {...props} />
  ),
);
RadioGroup.displayName = "RadioGroup";

export const RadioGroupItem = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof RG.Item>>(
  ({ className, ...props }, ref) => (
    <RG.Item ref={ref} data-component="radio-item" className={cn("inline-flex items-center", className)} {...props}>
      <RG.Indicator data-component="radio-indicator" />
    </RG.Item>
  ),
);
RadioGroupItem.displayName = "RadioGroupItem";
