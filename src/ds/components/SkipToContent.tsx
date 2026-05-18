import { cn } from "@/lib/cn";

interface SkipToContentProps {
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

export function SkipToContent({ href = "#main-content", children = "Skip to content", className }: SkipToContentProps) {
  return (
    <a
      href={href}
      data-component="skip-to-content"
      className={cn(
        "sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:start-2 focus-visible:top-2 focus-visible:z-50",
        className,
      )}
    >
      {children}
    </a>
  );
}
