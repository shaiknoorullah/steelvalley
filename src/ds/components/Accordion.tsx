"use client";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import * as A from "@radix-ui/react-accordion";
import { cn } from "@/lib/cn";

export const Accordion = A.Root;

export const AccordionItem = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof A.Item>>(
  ({ className, ...props }, ref) => (
    <A.Item ref={ref} data-component="accordion-item" className={cn(className)} {...props} />
  ),
);
AccordionItem.displayName = "AccordionItem";

export const AccordionTrigger = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof A.Trigger>>(
  ({ className, children, ...props }, ref) => (
    <A.Header data-component="accordion-header">
      <A.Trigger
        ref={ref}
        data-component="accordion-trigger"
        className={cn("flex w-full items-center justify-between", className)}
        {...props}
      >
        {children}
      </A.Trigger>
    </A.Header>
  ),
);
AccordionTrigger.displayName = "AccordionTrigger";

export const AccordionContent = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof A.Content>>(
  ({ className, ...props }, ref) => (
    <A.Content ref={ref} data-component="accordion-content" className={cn(className)} {...props} />
  ),
);
AccordionContent.displayName = "AccordionContent";
