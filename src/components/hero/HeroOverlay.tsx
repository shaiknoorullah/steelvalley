"use client";
/**
 * HeroOverlay — DOM overlay layered over the canvas.
 *   - Renders the 5 chapter headlines + mono callouts.
 *   - Cross-fades 180ms at stage boundaries.
 *   - Skip-to-end chip (focusable, top-right, mono style).
 *   - CTA button at Stage 4 (Place).
 *
 * Spec ref: docs/superpowers/specs/2026-05-18-hero-from-blueprint-to-build.md §2,§5.
 */
import { useCallback, useEffect, useRef } from "react";
import { HERO_SKIP_CHIP, HERO_STAGES } from "./HeroCopy";
import { useLocaleSafe } from "./_useLocaleSafe";
import { useHeroProgress } from "./useHeroProgress";

const CROSSFADE_MS = 180;

export interface HeroOverlayProps {
  /** Selector for the pin section element — used by the skip chip to scroll past it. */
  pinSelector?: string;
}

export function HeroOverlay({ pinSelector }: HeroOverlayProps) {
  const stage = useHeroProgress((s) => s.stage);
  const locale = useLocaleSafe();
  const isAr = locale === "ar";

  // Skip = scroll to end of pinned section.
  const skipToEnd = useCallback(() => {
    if (typeof window === "undefined") return;
    const target = pinSelector ? document.querySelector(pinSelector) : null;
    if (target instanceof HTMLElement) {
      const rect = target.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      window.scrollTo({ top: sectionTop + target.offsetHeight, behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight * 5, behavior: "smooth" });
    }
  }, [pinSelector]);

  // Space-key handler for the skip chip.
  const chipRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const chip = chipRef.current;
    if (!chip) return;
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" && document.activeElement === chip) {
        e.preventDefault();
        skipToEnd();
      }
    };
    chip.addEventListener("keydown", handler);
    return () => chip.removeEventListener("keydown", handler);
  }, [skipToEnd]);

  return (
    <div
      // The overlay sits above the canvas but lets pointer events pass through
      // everywhere except interactive children (chip + CTA).
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        color: "#F2F0EC",
        zIndex: 2,
      }}
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* Screen-reader narrative — the whole 5-stage arc as text in DOM order. */}
      <ol
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {HERO_STAGES.map((s) => (
          <li key={s.key}>{isAr ? s.headlineAr : s.headlineEn}</li>
        ))}
      </ol>

      {/* Skip chip — top-right (logical end), focusable, mono. */}
      <button
        ref={chipRef}
        type="button"
        onClick={skipToEnd}
        aria-label={isAr ? HERO_SKIP_CHIP.ariaLabel.ar : HERO_SKIP_CHIP.ariaLabel.en}
        style={{
          position: "absolute",
          insetBlockStart: "1.25rem",
          insetInlineEnd: "1.25rem",
          pointerEvents: "auto",
          padding: "0.5rem 0.875rem",
          fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
          fontSize: "0.75rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#F2F0EC",
          background: "rgba(15, 20, 25, 0.6)",
          border: "1px solid rgba(242, 240, 236, 0.25)",
          borderRadius: 2,
          cursor: "pointer",
          direction: "ltr",
          unicodeBidi: "embed",
        }}
      >
        {isAr ? HERO_SKIP_CHIP.ar : HERO_SKIP_CHIP.en}
      </button>

      {/* Stack of headlines — only the active stage's text is visible (opacity 1). */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          insetBlockEnd: "12vh",
          insetInline: "5vw",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "32ch",
        }}
      >
        {HERO_STAGES.map((s, i) => {
          const active = i === stage;
          return (
            <div
              key={s.key}
              style={{
                position: "absolute",
                inset: 0,
                opacity: active ? 1 : 0,
                transition: `opacity ${CROSSFADE_MS}ms ease`,
                willChange: "opacity",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  opacity: 0.7,
                  margin: "0 0 0.75rem 0",
                  direction: "ltr",
                  unicodeBidi: "embed",
                }}
              >
                {s.mono}
              </p>
              <h2
                style={{
                  fontFamily: isAr
                    ? "var(--font-ar-display, 'Tajawal', system-ui)"
                    : "var(--font-en-display, 'Saira Condensed', system-ui)",
                  fontSize: "clamp(1.75rem, 5vw, 3.75rem)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.01em",
                  margin: 0,
                }}
              >
                {isAr ? s.headlineAr : s.headlineEn}
              </h2>
            </div>
          );
        })}
      </div>

      {/* Place-stage CTA — only focusable / clickable when reached. */}
      <a
        href="#quote"
        tabIndex={stage === 4 ? 0 : -1}
        aria-hidden={stage !== 4}
        style={{
          position: "absolute",
          insetBlockEnd: "5vh",
          insetInlineEnd: "5vw",
          pointerEvents: stage === 4 ? "auto" : "none",
          opacity: stage === 4 ? 1 : 0,
          transition: `opacity ${CROSSFADE_MS}ms ease`,
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.875rem 1.5rem",
          border: "1px solid #F2F0EC",
          color: "#F2F0EC",
          fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
          fontSize: "0.8125rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          textDecoration: "none",
          background: "transparent",
        }}
      >
        {isAr ? HERO_STAGES[4]!.cta!.ar : HERO_STAGES[4]!.cta!.en}
      </a>
    </div>
  );
}
