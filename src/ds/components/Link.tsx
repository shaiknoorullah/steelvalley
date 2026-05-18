import { forwardRef, type AnchorHTMLAttributes } from "react";
import NextLink from "next/link";
import { Link as IntlLink } from "@/i18n/routing";
import { cn } from "@/lib/cn";

export type LinkVariant = "inline" | "nav" | "cta";

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  variant?: LinkVariant;
  external?: boolean; // bypasses i18n routing
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, variant = "inline", external, className, children, ...props }, ref) => {
    const isExternal =
      external || /^https?:\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");

    if (isExternal) {
      return (
        <NextLink
          ref={ref as never}
          href={href}
          data-component="link"
          data-variant={variant}
          target={props.target ?? "_blank"}
          rel={props.rel ?? "noopener noreferrer"}
          className={cn(className)}
          {...props}
        >
          {children}
        </NextLink>
      );
    }

    return (
      <IntlLink
        ref={ref as never}
        href={href}
        data-component="link"
        data-variant={variant}
        className={cn(className)}
        {...props}
      >
        {children}
      </IntlLink>
    );
  },
);
Link.displayName = "Link";
