"use client";

import { useEffect, useState } from "react";

interface Props {
  /** 0..1, drives the dimension line and the ticking mm counter. */
  progress: number;
  /** When true, hold the final frame briefly then run the section-cut reveal. */
  ready: boolean;
  /** Used for the aria-label + an English caption. The anthem line is always Arabic. */
  locale: "ar" | "en";
}

/**
 * MeasurementStampLoader — the visual loader specified in
 * docs/superpowers/specs/2026-05-18-loading-and-transitions.md §2.4.
 *
 * A void-black overlay. A CAD dimension line grows from 0 → 1800mm as
 * `progress` advances. When `ready` flips true the top half slides up,
 * the bottom slides down, and a rust line traces the cut. The actual
 * lifecycle (progress driver, reveal-then-unmount, prefers-reduced-motion
 * fallback, session de-dupe) lives in LoaderShell — this component is
 * intentionally a pure visual.
 */
export function MeasurementStampLoader({ progress, ready, locale }: Props) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!ready) return;
    // Hold the final 100% state for 200ms before kicking off the cut so the
    // visitor actually registers `1800 MM` instead of seeing it flash past.
    const t = setTimeout(() => setRevealed(true), 200);
    return () => clearTimeout(t);
  }, [ready]);

  const clamped = Math.max(0, Math.min(1, progress));
  const mm = Math.round(clamped * 1800);
  // 0 → 760 px in the viewBox; the dimension line lives between x=20 and x=780.
  const lineEnd = 20 + 760 * clamped;

  return (
    <div
      data-loader
      data-revealed={revealed || undefined}
      role="status"
      aria-live="polite"
      aria-label={locale === "ar" ? "جاري التحميل" : "loading"}
    >
      <div data-loader-half data-loader-half-top>
        <div data-loader-stamp>STEEL VALLEY · جدّة</div>
      </div>

      <svg
        data-loader-dim
        viewBox="0 0 800 60"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        {/* Dimension line itself */}
        <line
          x1="20"
          y1="30"
          x2={lineEnd}
          y2="30"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        {/* Left tick (CAD-style slash tick uses a short perpendicular) */}
        <line
          x1="20"
          y1="20"
          x2="20"
          y2="40"
          stroke="currentColor"
          strokeWidth="1"
        />
        {/* Right tick — moves with the leading edge */}
        <line
          x1={lineEnd}
          y1="20"
          x2={lineEnd}
          y2="40"
          stroke="currentColor"
          strokeWidth="1"
        />
        {/* Ticking mm counter, anchored to the right of the viewBox so it
            stays put as the line grows toward it. */}
        <text
          x="780"
          y="50"
          fontFamily="JetBrains Mono, ui-monospace, SF Mono, monospace"
          fontSize="14"
          fill="currentColor"
          textAnchor="end"
        >
          {mm} MM
        </text>
      </svg>

      <div data-loader-half data-loader-half-bottom>
        <div data-loader-anthem dir="rtl" lang="ar">
          حديد جدّة، يطعم المملكة.
        </div>
        {locale === "en" ? (
          <div data-loader-caption-en dir="ltr" lang="en">
            stainless steel fabrication · jeddah · since 2005
          </div>
        ) : null}
      </div>

      <div data-loader-cut aria-hidden="true" />
    </div>
  );
}
