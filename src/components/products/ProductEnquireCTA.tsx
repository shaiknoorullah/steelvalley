"use client";
import { Link } from "@/ds/components/Link";
import { useLocale, useTranslations } from "next-intl";

interface Props {
  productSlug: string;
  productName: string;
}

export function ProductEnquireCTA({ productSlug, productName }: Props) {
  const t = useTranslations("Common");
  const locale = useLocale();
  const base = locale === "ar" ? "/contact" : "/en/contact";
  const href = `${base}?product=${encodeURIComponent(productSlug)}#step-1`;

  const handleClick = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("sv:product-enquired", {
          detail: { product: productSlug },
        }),
      );
    }
  };

  return (
    <Link
      href={href}
      variant="cta"
      aria-label={`${t("enquire")} — ${productName}`}
      onClick={handleClick}
    >
      {t("enquire")}
    </Link>
  );
}
