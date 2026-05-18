"use client";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import * as RT from "@radix-ui/react-toast";
import { cn } from "@/lib/cn";

export const ToastProvider = RT.Provider;
export const ToastViewport = forwardRef<HTMLOListElement, ComponentPropsWithoutRef<typeof RT.Viewport>>(
  ({ className, ...props }, ref) => (
    <RT.Viewport
      ref={ref}
      data-component="toast-viewport"
      className={cn("fixed bottom-4 end-4 z-50 flex flex-col gap-2", className)}
      {...props}
    />
  ),
);
ToastViewport.displayName = "ToastViewport";

export const Toast = forwardRef<HTMLLIElement, ComponentPropsWithoutRef<typeof RT.Root>>(
  ({ className, ...props }, ref) => (
    <RT.Root ref={ref} data-component="toast" className={cn(className)} {...props} />
  ),
);
Toast.displayName = "Toast";

export const ToastTitle = RT.Title;
export const ToastDescription = RT.Description;
export const ToastAction = RT.Action;
export const ToastClose = RT.Close;
