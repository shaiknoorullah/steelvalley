import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "neutral" | "info" | "success" | "warn" | "danger";
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ tone = "neutral", className, ...props }, ref) => (
    <span
      ref={ref}
      data-component="tag"
      data-tone={tone}
      className={cn("inline-flex items-center", className)}
      {...props}
    />
  ),
);
Tag.displayName = "Tag";
