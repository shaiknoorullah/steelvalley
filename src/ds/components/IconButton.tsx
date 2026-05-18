import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string; // accessible name — required, never decorative-only
  icon: ReactNode;
  size?: "sm" | "md" | "lg";
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, icon, size = "md", className, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      data-component="icon-button"
      data-size={size}
      className={cn(
        "inline-flex items-center justify-center",
        "transition-colors disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  ),
);
IconButton.displayName = "IconButton";
