import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ invalid, className, ...props }, ref) => (
    <textarea
      ref={ref}
      data-component="textarea"
      aria-invalid={invalid || undefined}
      className={cn("w-full", className)}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
