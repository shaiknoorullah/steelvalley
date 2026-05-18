"use client";

import { useEffect } from "react";

/**
 * TransitionStyles — injects the View Transitions API CSS once per session.
 * Spec: docs/superpowers/specs/2026-05-18-loading-and-transitions.md §3.3.
 *
 * The animation is a "section cut": the outgoing page is clipped to its
 * vertical center (top + bottom halves shrink toward the cut line), the
 * incoming page reveals from that same center outward, and a thin rust
 * line traces the cut. The whole gesture mirrors the initial loader so
 * the brand grammar is unbroken from first paint through every navigation.
 *
 * - Browsers without the View Transitions API get an instant route swap
 *   (no animation, no breakage).
 * - prefers-reduced-motion swaps the cut for an instant transition.
 * - RTL flips the cut's draw direction via [dir="rtl"].
 *
 * We inject via a runtime <style> tag (rather than globals.css) because
 * the ::view-transition pseudo-elements live on the document root and we
 * want to keep them scoped + idempotent for HMR. The CSS is <1 KB gzip.
 */
export function TransitionStyles() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById("sv-transition-styles")) return;

    const style = document.createElement("style");
    style.id = "sv-transition-styles";
    style.textContent = `
      @media (prefers-reduced-motion: no-preference) {
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation-duration: 350ms;
          animation-timing-function: cubic-bezier(0.2, 0.7, 0.2, 1);
        }

        ::view-transition-old(root) {
          animation-name: sv-page-out;
        }
        ::view-transition-new(root) {
          animation-name: sv-page-in;
        }

        @keyframes sv-page-out {
          0%   { clip-path: inset(0 0 0 0); }
          50%  { clip-path: inset(50% 0 50% 0); }
          100% { clip-path: inset(50% 0 50% 0); opacity: 0; }
        }
        @keyframes sv-page-in {
          0%   { clip-path: inset(50% 0 50% 0); opacity: 0; }
          50%  { clip-path: inset(50% 0 50% 0); opacity: 1; }
          100% { clip-path: inset(0 0 0 0); }
        }

        /* Rust cut line — fixed overlay tracing the seam during the transition. */
        ::view-transition-group(root)::after {
          content: "";
          position: fixed;
          inset-block-start: 50%;
          inset-inline: 0;
          height: 1px;
          background: var(--color-rust, #e2611b);
          transform: scaleX(0);
          transform-origin: left center;
          animation:
            sv-cut-draw 350ms cubic-bezier(0.2, 0.7, 0.2, 1) forwards,
            sv-cut-fade 200ms 350ms forwards;
          pointer-events: none;
        }

        @keyframes sv-cut-draw { to { transform: scaleX(1); } }
        @keyframes sv-cut-fade { to { opacity: 0; } }

        /* RTL: cut draws from inline-end → inline-start. */
        [dir="rtl"] ::view-transition-group(root)::after {
          transform-origin: right center;
        }
      }

      /* Reduced motion: instant route swap, no cut. */
      @media (prefers-reduced-motion: reduce) {
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation: none;
        }
        ::view-transition-group(root)::after {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Leave the style tag in place across remounts — removing it would
      // strip the animation mid-transition during HMR. The id guard above
      // prevents duplicates on remount.
    };
  }, []);

  return null;
}
