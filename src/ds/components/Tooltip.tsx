"use client";
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as TP from "@radix-ui/react-tooltip";
import { cn } from "@/lib/cn";

export const TooltipProvider = TP.Provider;

interface TooltipProps {
  label: ReactNode;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

export function Tooltip({ label, children, side = "top" }: TooltipProps) {
  return (
    <TP.Root>
      <TP.Trigger asChild>{children}</TP.Trigger>
      <TP.Portal>
        <TP.Content data-component="tooltip" side={side} sideOffset={4}>
          {label}
          <TP.Arrow aria-hidden="true" />
        </TP.Content>
      </TP.Portal>
    </TP.Root>
  );
}
