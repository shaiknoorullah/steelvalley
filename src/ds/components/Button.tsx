import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  // Base — unstyled-by-design except for focus + disabled. Visual layer comes from Claude Design.
  [
    "inline-flex items-center justify-center gap-2",
    "select-none cursor-pointer",
    "transition-colors",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        primary: "data-[variant=primary]",
        secondary: "data-[variant=secondary]",
        ghost: "data-[variant=ghost]",
      },
      size: {
        sm: "data-[size=sm]",
        md: "data-[size=md]",
        lg: "data-[size=lg]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      data-component="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      disabled={props.disabled || loading}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  ),
);
Button.displayName = "Button";
