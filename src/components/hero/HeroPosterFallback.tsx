"use client";
/**
 * HeroPosterFallback — static composition shown when:
 *   - `<PerfGate>` denies mount (low memory, slow connection, Save-Data)
 *   - `prefers-reduced-motion` is set
 *   - the R3F bundle is still loading (Suspense fallback)
 *
 * Spec ref: docs/superpowers/specs/2026-05-18-hero-from-blueprint-to-build.md §5.
 */
import { HERO_STAGES, HERO_STATIC_HEADLINE } from "./HeroCopy";
import { useLocale } from "next-intl";

export function HeroPosterFallback() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const place = HERO_STAGES[4]!;
  const headline = isAr ? HERO_STATIC_HEADLINE.ar : HERO_STATIC_HEADLINE.en;
  const ctaLabel = isAr ? place.cta!.ar : place.cta!.en;
  const mono = place.mono;

  return (
    <div
      // The fallback fills the section. Background mirrors the void backdrop
      // so the transition from the canvas (or stand-in) is seamless.
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        padding: "2rem",
        textAlign: "center",
        backgroundColor: "#0F1419",
        color: "#F2F0EC",
      }}
      dir={isAr ? "rtl" : "ltr"}
    >
      {/*
        TODO: swap for user-supplied kitchen plate AVIF. The plate is the LCP
        candidate for poster mode — text headline below is the actual LCP.
      */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(ellipse at center, rgba(50,40,30,0.6), rgba(15,20,25,1) 65%)",
          opacity: 0.85,
        }}
      />
      <h1
        style={{
          position: "relative",
          fontFamily: isAr
            ? "var(--font-ar-display, 'Tajawal', system-ui)"
            : "var(--font-en-display, 'Saira Condensed', system-ui)",
          fontSize: "clamp(2rem, 6vw, 4.5rem)",
          lineHeight: 1.05,
          letterSpacing: "-0.01em",
          maxWidth: "26ch",
          margin: 0,
        }}
      >
        {headline}
      </h1>
      <p
        style={{
          position: "relative",
          fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
          fontSize: "0.875rem",
          letterSpacing: "0.08em",
          opacity: 0.7,
          textTransform: "uppercase",
          direction: "ltr",
          unicodeBidi: "embed",
        }}
      >
        {mono}
      </p>
      <a
        href="#quote"
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.875rem 1.5rem",
          border: "1px solid #F2F0EC",
          backgroundColor: "transparent",
          color: "#F2F0EC",
          fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
          fontSize: "0.8125rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          textDecoration: "none",
        }}
      >
        {ctaLabel}
      </a>
    </div>
  );
}
