"use client";
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as D from "@radix-ui/react-dialog";
import { cn } from "@/lib/cn";

export const Dialog = D.Root;
export const DialogTrigger = D.Trigger;
export const DialogPortal = D.Portal;
export const DialogClose = D.Close;

export const DialogOverlay = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof D.Overlay>>(
  ({ className, ...props }, ref) => (
    <D.Overlay
      ref={ref}
      data-component="dialog-overlay"
      className={cn("fixed inset-0 z-40", className)}
      {...props}
    />
  ),
);
DialogOverlay.displayName = "DialogOverlay";

interface DialogContentProps extends ComponentPropsWithoutRef<typeof D.Content> {
  title: string; // required for accessible name
  description?: string;
  hideTitle?: boolean;
  children: ReactNode;
}

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, title, description, hideTitle, children, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay />
      <D.Content
        ref={ref}
        data-component="dialog-content"
        className={cn("fixed inset-0 z-50 flex items-center justify-center p-4", className)}
        {...props}
      >
        <div data-component="dialog-panel">
          {hideTitle ? (
            <D.Title asChild>
              <span className="sr-only">{title}</span>
            </D.Title>
          ) : (
            <D.Title data-component="dialog-title">{title}</D.Title>
          )}
          {description ? (
            <D.Description data-component="dialog-description">{description}</D.Description>
          ) : null}
          {children}
        </div>
      </D.Content>
    </DialogPortal>
  ),
);
DialogContent.displayName = "DialogContent";
