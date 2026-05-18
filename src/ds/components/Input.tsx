import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ invalid, className, ...props }, ref) => (
    <input
      ref={ref}
      data-component="input"
      aria-invalid={invalid || undefined}
      className={cn("w-full", className)}
      {...props}
    />
  ),
);
Input.displayName = "Input";
