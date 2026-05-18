"use client";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import * as S from "@radix-ui/react-select";
import { cn } from "@/lib/cn";

export const Select = S.Root;
export const SelectValue = S.Value;

export const SelectTrigger = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof S.Trigger>>(
  ({ className, children, ...props }, ref) => (
    <S.Trigger
      ref={ref}
      data-component="select-trigger"
      className={cn("inline-flex items-center justify-between", className)}
      {...props}
    >
      {children}
      <S.Icon aria-hidden="true" data-component="select-icon">▾</S.Icon>
    </S.Trigger>
  ),
);
SelectTrigger.displayName = "SelectTrigger";

export const SelectContent = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof S.Content>>(
  ({ className, children, ...props }, ref) => (
    <S.Portal>
      <S.Content
        ref={ref}
        data-component="select-content"
        position="popper"
        sideOffset={4}
        className={cn("z-50", className)}
        {...props}
      >
        <S.Viewport>{children}</S.Viewport>
      </S.Content>
    </S.Portal>
  ),
);
SelectContent.displayName = "SelectContent";

export const SelectItem = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof S.Item>>(
  ({ className, children, ...props }, ref) => (
    <S.Item ref={ref} data-component="select-item" className={cn("cursor-pointer", className)} {...props}>
      <S.ItemText>{children}</S.ItemText>
      <S.ItemIndicator data-component="select-item-indicator" aria-hidden="true">✓</S.ItemIndicator>
    </S.Item>
  ),
);
SelectItem.displayName = "SelectItem";
