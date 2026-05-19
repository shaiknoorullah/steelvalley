"use client";
/**
 * Hero2D — 2D bilingual hero that replaces the 3D scroll arc.
 *
 * Refined Industrial: CAD-grid backdrop, monoline measurement marks, the
 * brand anthem set in Tajawal display weight, English secondary line set
 * in Saira Condensed, a 3-stat trust strip, two CTAs, and a slowly
 * scrolling capability marquee at the foot.
 *
 * No R3F, no Three.js. One GSAP fade-up on mount; a faint scroll-driven
 * parallax on the headline; respects prefers-reduced-motion.
 *
 * Locale: AR is default at `/`, EN at `/en`. Reads from next-intl's
 * useLocale(). Copy comes from HeroCopy.ts (HERO_STATIC_HEADLINE +
 * brand anthem from HomeCopy).
 */
import { useEffect, useRef } from "react";
import { Link } from "@/ds/components/Link";
import gsap from "gsap";
import { IndustrialDrawingBg } from "./IndustrialDrawingBg";

interface Props {
  /** "ar" or "en" — passed from the server HomePage so we don't depend
   *  on next-intl's client-side locale resolution. */
  locale: string;
}

interface Stat {
  value: string;
  labelAr: string;
  labelEn: string;
}

const STATS: readonly Stat[] = [
  { value: "20+", labelAr: "سنة في الورشة", labelEn: "years on the floor" },
  { value: "600+", labelAr: "مطبخ سُلّم", labelEn: "kitchens delivered" },
  { value: "98%", labelAr: "تسليم في موعده", labelEn: "on-time delivery" },
] as const;

const CAPS_AR = [
  "درابزينات",
  "تكسية أعمدة",
  "تجهيزات مطابخ",
  "ديكورات",
  "حواف بانماري",
  "أحواض غسيل",
  "خزائن ساخنة",
  "مداخن",
];

const CAPS_EN = [
  "hand railing",
  "column cladding",
  "kitchen equipment",
  "decorative steel",
  "bain marie edges",
  "wash sinks",
  "hot cabinets",
  "extraction hoods",
];

export function Hero2D({ locale }: Props) {
  const isAr = locale === "ar";
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-hero-fadeup]", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const anthem = isAr ? "حديد جدّة، يُطعم المملكة." : "Steel of Jeddah. Feeding the Kingdom.";
  const eyebrow = isAr ? "مصنعٌ في جدّة · منذ ٢٠٠٥" : "fabricators · jeddah · since 2005";
  // Primary headline is in the active locale; secondary is the other locale
  // shown smaller as a translation echo (cultural bridge, not a duplicate).
  const headlinePrimary = isAr ? "صنعةٌ تليق بالمكان." : "stainless steel, built to last.";
  const headlineSecondary = isAr ? "stainless steel, built to last." : "صنعةٌ تليق بالمكان.";
  const sub = isAr
    ? "محطّات تحضير، أحواض، مداخن، درابزينات، تكسية أعمدة. مقاسٌ على القطعة، وملحوم بالتيج، ومسلَّمٌ في موعده."
    : "Prep stations, sinks, hoods, railings, column cladding. Cut to your spec, TIG-welded, delivered on time.";

  const primaryCta = isAr ? "اطلب عرض سعرك" : "get a quote";
  const secondaryCta = isAr ? "شاهد أعمالنا" : "see our work";
  const mono = "304 · 1.2mm · TIG";

  // IntlLink auto-prefixes the active locale; pass bare path.
  const contactHref = "/contact";
  // /work doesn't have a page yet — for the secondary CTA, link to
  // the home page's featured-case anchor for now.
  const workHref = "/#featured-case";

  const caps = isAr ? CAPS_AR : CAPS_EN;

  return (
    <section
      ref={rootRef}
      id="hero"
      aria-label={isAr ? "صدر الصفحة" : "Hero"}
      className="sv-hero2d"
      dir={isAr ? "rtl" : "ltr"}
    >
      <IndustrialDrawingBg />
      <div className="sv-hero2d__grid" aria-hidden="true" />
      <div className="sv-hero2d__vignette" aria-hidden="true" />
      <div className="sv-hero2d__corner sv-hero2d__corner--tl" aria-hidden="true">
        <span className="sv-mono">N 21°32′ · E 39°10′</span>
      </div>
      <div className="sv-hero2d__corner sv-hero2d__corner--tr" aria-hidden="true">
        <span className="sv-mono">{mono}</span>
      </div>

      <div className="sv-hero2d__inner">
        <p className="sv-hero2d__anthem sv-mono" data-hero-fadeup>
          {anthem}
        </p>

        <p className="sv-hero2d__eyebrow sv-mono" data-hero-fadeup>
          {eyebrow}
        </p>

        <h1 className="sv-hero2d__h1" data-hero-fadeup>
          <span
            className="sv-hero2d__h1-primary"
            lang={isAr ? "ar" : "en"}
            dir={isAr ? "rtl" : "ltr"}
          >
            {headlinePrimary}
          </span>
          <span
            className="sv-hero2d__h1-secondary"
            lang={isAr ? "en" : "ar"}
            dir={isAr ? "ltr" : "rtl"}
            aria-hidden="true"
          >
            {headlineSecondary}
          </span>
        </h1>

        <p className="sv-hero2d__sub" data-hero-fadeup>
          {sub}
        </p>

        <div className="sv-hero2d__ctas" data-hero-fadeup>
          <Link href={contactHref} className="sv-hero2d__cta sv-hero2d__cta--primary">
            {primaryCta} <span aria-hidden="true">{isAr ? "←" : "→"}</span>
          </Link>
          <Link href={workHref} className="sv-hero2d__cta sv-hero2d__cta--ghost">
            {secondaryCta} <span aria-hidden="true">{isAr ? "←" : "→"}</span>
          </Link>
        </div>

        <ul className="sv-hero2d__stats" aria-label={isAr ? "أرقام تثبت الصناعة" : "trust stats"} data-hero-fadeup>
          {STATS.map((s) => (
            <li key={s.value} className="sv-hero2d__stat">
              <p className="sv-hero2d__stat-val">{s.value}</p>
              <p className="sv-hero2d__stat-lbl sv-mono">
                {isAr ? s.labelAr : s.labelEn}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="sv-hero2d__marquee" aria-hidden="true">
        <div className="sv-hero2d__marquee-track">
          {[...caps, ...caps, ...caps].map((w, i) => (
            <span key={`${w}-${i}`} className="sv-hero2d__marquee-word">
              {w}
              <span className="sv-hero2d__marquee-dot">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
