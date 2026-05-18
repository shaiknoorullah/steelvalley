/**
 * Hero chapter copy — 5 stages × (EN headline + AR headline + mono callout).
 *
 * Spec ref: docs/superpowers/specs/2026-05-18-hero-from-blueprint-to-build.md §2.
 *
 * IMPORTANT — Arabic is NOT a translation. The strings here are the
 * culturally-rooted Saudi-native versions (Hijazi register, Surah Al-Hadid
 * echo on Stage 4 "Edge", craft dignity, place-rooting). See memories
 * `feedback-arabic-native-authoring` and `feedback-saudi-arabic-copy-strategy`.
 *
 * Every Arabic string here MUST be reviewed by a native Saudi copywriter
 * before launch (see `docs/prep-status.md` blocking pre-launch item).
 */

export type HeroStageKey = "earth" | "heat" | "form" | "edge" | "place";

export interface HeroStageCopy {
  /** Stage key for analytics + DOM identifiers. */
  key: HeroStageKey;
  /** English headline (independent authoring, not derived from AR). */
  headlineEn: string;
  /** Arabic headline (independent authoring, not derived from EN). */
  headlineAr: string;
  /** Mono callout — stays LTR even inside Arabic per Refined Industrial spec. */
  mono: string;
  /** Optional CTA — only Stage 4 (Place) sets this. */
  cta?: {
    en: string;
    ar: string;
  };
}

export const HERO_STAGES: readonly HeroStageCopy[] = [
  {
    key: "earth",
    headlineEn: "raw stainless. measured twice.",
    headlineAr: "في الورشة، يبدأ الحديد بالقياس، لا بالصوت.",
    mono: "304 · 1.2mm · #4",
  },
  {
    key: "heat",
    headlineEn: "fire knows the seam.",
    headlineAr: "النار تعرف اللُّحام، ونحن نعرف وقتها.",
    mono: "weld · TIG · 1800°C",
  },
  {
    key: "form",
    headlineEn: "the shop builds the part.",
    headlineAr: "صنعةٌ، تليق بالمكان.",
    mono: "1800 × 750 × 850 mm",
  },
  {
    key: "edge",
    headlineEn: "the edge is the promise.",
    headlineAr: "في الحدّ، شدّةٌ ووعد.",
    mono: "R6 bullnose · weld bead Ø3",
  },
  {
    key: "place",
    headlineEn: "let us build your edge.",
    headlineAr: "حدّك، نصنعه.",
    mono: "jeddah · since 2005",
    cta: {
      en: "get a quote",
      ar: "اطلب عرض سعرك",
    },
  },
] as const;

/**
 * Fallback static headline shown to `prefers-reduced-motion` and low-perf
 * users. Spec §5 "Accessibility". The English line is the brand line.
 */
export const HERO_STATIC_HEADLINE = {
  en: "we shape steel into spaces that feed cities.",
  ar: "نشكّل الفولاذ إلى فضاءات تُطعم المدن.",
} as const;

/** Skip-chip mono label. Top-right of pinned canvas, focusable. */
export const HERO_SKIP_CHIP = {
  en: "press space to skip →",
  ar: "اضغط المسافة للتخطّي ←",
  /** Accessible name (used as `aria-label`). */
  ariaLabel: {
    en: "Skip the hero animation",
    ar: "تخطّي مشهد البداية",
  },
} as const;
