import type { ReactNode } from "react";
import { Link } from "@/ds/components";

type Locale = "en" | "ar";

const NAV: Record<
  Locale,
  { home: string; products: string; blog: string; contact: string }
> = {
  en: {
    home: "Home",
    products: "Products",
    blog: "Journal",
    contact: "Contact",
  },
  ar: {
    home: "الرئيسية",
    products: "المنتجات",
    blog: "المدوّنة",
    contact: "تواصل",
  },
};

const TAGLINE: Record<Locale, string> = {
  en: "Steel Valley — Stainless steel fabrication, Jeddah.",
  ar: "ستيل فالي — صنعة الإستانلس، جدّة.",
};

const ENQUIRE: Record<Locale, string> = {
  en: "Enquire",
  ar: "اطلب عرض",
};

const RIGHTS: Record<Locale, string> = {
  en: "© Steel Valley. All rights reserved.",
  ar: "© ستيل فالي. كل الحقوق محفوظة.",
};

const LEGAL: Record<Locale, { privacy: string; terms: string }> = {
  en: { privacy: "Privacy", terms: "Terms" },
  ar: { privacy: "الخصوصية", terms: "الشروط" },
};

export function PageShell({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const nav = NAV[locale];
  return (
    <div data-page-shell data-locale={locale}>
      <header data-page-header>
        <Link href="/" variant="nav" data-page-brand>
          STEEL · VALLEY
        </Link>
        <nav data-page-nav aria-label={locale === "ar" ? "روابط الموقع" : "Site"}>
          <Link href="/" variant="nav">{nav.home}</Link>
          <Link href="/products" variant="nav">{nav.products}</Link>
          <Link href="/blog" variant="nav">{nav.blog}</Link>
          <Link href="/#quote" variant="cta">{ENQUIRE[locale]}</Link>
        </nav>
      </header>
      <main data-page-main>{children}</main>
      <footer data-page-footer>
        <p data-footer-tagline>{TAGLINE[locale]}</p>
        <div data-footer-legal>
          <Link href="/legal/privacy" variant="nav">
            {LEGAL[locale].privacy}
          </Link>
          <Link href="/legal/terms" variant="nav">
            {LEGAL[locale].terms}
          </Link>
        </div>
        <p data-footer-rights>{RIGHTS[locale]}</p>
      </footer>
    </div>
  );
}
