"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useRouter } from "@/i18n/routing";

/*
  Structure-only LocaleToggle.

  Switches between the two configured locales (ar / en). Visual design,
  motion, and placement are intentionally left to the design pass — this
  is a primitive other agents (navbar, hero, footer) can mount and style.
*/
export function LocaleToggle() {
  const t = useTranslations("Common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const nextLocale = locale === "ar" ? "en" : "ar";

  const onClick = () => {
    // Strip the current locale prefix if present so the router can
    // re-attach the right one for the target locale.
    const stripped = pathname.replace(/^\/(ar|en)(?=\/|$)/, "") || "/";
    router.push(stripped, { locale: nextLocale });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Switch to ${nextLocale === "ar" ? "Arabic" : "English"}`}
      data-component="locale-toggle"
    >
      {t("languageSwitch")}
    </button>
  );
}
