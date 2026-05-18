"use client";
import { Link } from "@/ds/components/Link";
import { useLocale } from "next-intl";

export function MidScrollCTA() {
  const locale = useLocale() as "ar" | "en";
  const href = locale === "ar" ? "/contact" : "/en/contact";
  return (
    <aside data-component="mid-scroll-cta">
      <p className="sv-mid-eyebrow">
        {locale === "ar" ? "نردّ خلال 30 دقيقة عادةً" : "usually replies in 30 min"}
      </p>
      <p className="sv-mid-title">
        {locale === "ar" ? "تكلّم مع المصنّع." : "Talk to a fabricator."}
      </p>
      <Link href={href} variant="cta">
        {locale === "ar" ? "اطلب عرض سعر" : "Get a Quote"}
      </Link>
    </aside>
  );
}
