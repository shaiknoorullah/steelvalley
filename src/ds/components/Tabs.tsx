"use client";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import * as T from "@radix-ui/react-tabs";
import { cn } from "@/lib/cn";

export const Tabs = T.Root;

export const TabsList = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof T.List>>(
  ({ className, ...props }, ref) => (
    <T.List ref={ref} data-component="tabs-list" className={cn("flex gap-4", className)} {...props} />
  ),
);
TabsList.displayName = "TabsList";

export const TabsTrigger = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof T.Trigger>>(
  ({ className, ...props }, ref) => (
    <T.Trigger ref={ref} data-component="tabs-trigger" className={cn(className)} {...props} />
  ),
);
TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof T.Content>>(
  ({ className, ...props }, ref) => (
    <T.Content ref={ref} data-component="tabs-content" className={cn(className)} {...props} />
  ),
);
TabsContent.displayName = "TabsContent";
