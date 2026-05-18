"use client";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import * as RC from "@radix-ui/react-checkbox";
import { cn } from "@/lib/cn";

export interface CheckboxProps extends ComponentPropsWithoutRef<typeof RC.Root> {}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, children, ...props }, ref) => (
    <RC.Root
      ref={ref}
      data-component="checkbox"
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      <RC.Indicator data-component="checkbox-indicator">
        {children ?? <span aria-hidden="true">✓</span>}
      </RC.Indicator>
    </RC.Root>
  ),
);
Checkbox.displayName = "Checkbox";
