"use client";
/**
 * SiteHeader — top navbar on every locale-prefixed page (excluded for
 * /admin which has its own chrome). Transparent over the hero, fades
 * to opaque void on scroll. Mobile collapses to a hamburger that
 * reveals a full-screen menu.
 */
import { useEffect, useState } from "react";
import { Link } from "@/ds/components/Link";
import { LocaleToggle } from "@/components/i18n/LocaleToggle";

interface Props {
  locale: string;
}

const NAV: Record<"ar" | "en", { label: string; href: string }[]> = {
  en: [
    { label: "work", href: "/work" },
    { label: "services", href: "/services" },
    { label: "products", href: "/products" },
    { label: "about", href: "/about" },
    { label: "journal", href: "/blog" },
  ],
  ar: [
    { label: "أعمالنا", href: "/work" },
    { label: "الخدمات", href: "/services" },
    { label: "المنتجات", href: "/products" },
    { label: "عن المصنع", href: "/about" },
    { label: "المدوّنة", href: "/blog" },
  ],
};

const CTA = { en: "get a quote", ar: "اطلب عرض" } as const;
const MENU = { en: "menu", ar: "القائمة" } as const;
const CLOSE = { en: "close", ar: "إغلاق" } as const;

export function SiteHeader({ locale }: Props) {
  const isAr = locale === "ar";
  const safe = (isAr ? "ar" : "en") as "ar" | "en";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className="sv-header"
        data-scrolled={scrolled || undefined}
        data-open={open || undefined}
        dir={isAr ? "rtl" : "ltr"}
      >
        <div className="sv-header__inner">
          <Link href="/" className="sv-header__brand" aria-label="Steel Valley — home">
            <span className="sv-header__brand-mark">SV</span>
            <span className="sv-header__brand-word">STEEL · VALLEY</span>
          </Link>

          <nav className="sv-header__nav" aria-label={isAr ? "روابط الموقع" : "Site"}>
            {NAV[safe].map((l) => (
              <Link key={l.href} href={l.href} className="sv-header__link">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="sv-header__actions">
            <LocaleToggle />
            <Link href="/contact" className="sv-header__cta">
              {CTA[safe]} <span aria-hidden="true">{isAr ? "←" : "→"}</span>
            </Link>
          </div>

          <button
            type="button"
            className="sv-header__burger"
            aria-label={open ? CLOSE[safe] : MENU[safe]}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </header>

      {open && (
        <div className="sv-header__sheet" role="dialog" aria-modal="true" dir={isAr ? "rtl" : "ltr"}>
          <nav className="sv-header__sheet-nav" aria-label={isAr ? "القائمة" : "Menu"}>
            {NAV[safe].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="sv-header__sheet-link"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="sv-header__sheet-cta"
              onClick={() => setOpen(false)}
            >
              {CTA[safe]} <span aria-hidden="true">{isAr ? "←" : "→"}</span>
            </Link>
            <div className="sv-header__sheet-locale">
              <LocaleToggle />
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
