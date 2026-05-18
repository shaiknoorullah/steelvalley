"use client";
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as RG from "@radix-ui/react-radio-group";
import { cn } from "@/lib/cn";

interface RadioCardProps extends ComponentPropsWithoutRef<typeof RG.Item> {
  title: ReactNode;
  description?: ReactNode;
}

export const RadioCard = forwardRef<HTMLButtonElement, RadioCardProps>(
  ({ title, description, className, value, ...props }, ref) => (
    <RG.Item
      ref={ref}
      value={value}
      data-component="radio-card"
      className={cn("text-start", className)}
      {...props}
    >
      <span data-component="radio-card-title">{title}</span>
      {description ? <span data-component="radio-card-description">{description}</span> : null}
      <RG.Indicator data-component="radio-card-indicator" />
    </RG.Item>
  ),
);
RadioCard.displayName = "RadioCard";
