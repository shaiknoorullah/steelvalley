import type { ReactNode } from "react";
import { Link } from "@/ds/components";

type Locale = "en" | "ar";

const TAGLINE: Record<Locale, string> = {
  en: "Steel Valley — Stainless steel fabrication, Jeddah.",
  ar: "ستيل فالي — صنعة الإستانلس، جدّة.",
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
  // The global SiteHeader (mounted in app/[locale]/layout.tsx) is the
  // canonical chrome — PageShell used to render its own header but
  // that stacked a duplicate on every blog/product/legal page. Now
  // PageShell only wraps content + a minimal footer.
  return (
    <div data-page-shell data-locale={locale}>
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
