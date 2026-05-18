# Steel Valley — Initial Loader & Inter-Page Transitions

**Date:** 2026-05-18
**Branch:** `redesign`
**Status:** Approved-pending-review. Sibling to the hero spec (`2026-05-18-hero-from-blueprint-to-build.md`), shares its visual vocabulary, but lives sitewide.

These two animations bookend the visitor's experience: the **initial loader** sets expectations before the first paint; **inter-page transitions** carry the brand language through every route change. They speak the same visual language as the hero arc — measurement, CAD lines, brushed steel, rust as signal — so the brand's grammar is unbroken from arrival through every navigation.

---

## 0. Source-of-truth references

- Hero spec (visual vocabulary source): `docs/superpowers/specs/2026-05-18-hero-from-blueprint-to-build.md`
- Strategic spec (palette, motion tokens, perf contract): `docs/superpowers/specs/2026-05-18-steelvalley-redesign.md`
- Arabic copy strategy (for the loader's tagline): memory `feedback-saudi-arabic-copy-strategy`

---

## 1. Locked Decisions

| Topic | Decision |
|-------|----------|
| Initial loader concept | **Measurement Stamp** — a CAD dimension line growing from `0 MM` to `1800 MM` (the BT-1875's length) in real time with load progress, brand stamp above, section-cut wipe reveal |
| Inter-page transition concept | **Section Cut** — a thin rust line traces a horizontal cut across the viewport; current page slides out below the cut, new page reveals from above the cut |
| Transition technology | **Next 15 View Transitions API** (native browser, zero JS payload) with **CSS opacity-crossfade fallback** for non-supporting browsers. **Not** Barba.js — kept available but unused for v1 |
| Loader payload budget | <8 KB gzip (pure SVG + CSS, inline-critical in `<head>`, never lazy-loaded) |
| Loader duration ceiling | 1.2s on fast connections; can grow to 4s on slow connections (caps progress display but doesn't time out the load) |
| Transition duration | 350ms enter + 350ms exit, easing `cubic-bezier(.2, .7, .2, 1)` (matches the existing motion tokens) |
| Reduced motion | Both fall back to instant — loader becomes a static brand stamp + caption; transitions become 100ms opacity crossfade |
| RTL behavior | Loader: dimension line draws right-to-left in `dir="rtl"`. Transitions: section cut runs leftward instead of rightward; new page enters from above (the cut direction is mirrored along the inline axis) |
| First-paint guarantee | The loader must paint within 200ms of `DOMContentLoaded` — it lives in critical-path inline SVG, not in any chunk |

---

## 2. The Initial Loader — "Measurement Stamp"

### 2.1 What the visitor sees

A void-black screen (`--void` `#0F1419`). Centered:

```
                    STEEL VALLEY · جدّة
                    ─────────────────────

         |  0 MM ════════════════════════════ 1800 MM  |
              ⬑ dimension line draws as load progresses

                    حديد جدّة، يطعم المملكة.
```

Three layers:
1. **Brand stamp** (top): wordmark + place-marker in bone-white, mono-tracked
2. **Dimension line** (middle): the centerpiece — a horizontal CAD dimension line that grows from 0 to 1800mm proportional to the load progress. Tick marks at the endpoints (CAD-style slash ticks). The number at the right end ticks up: `0 MM` → `1800 MM`. When complete, the number flicks once in rust before resolving.
3. **Arabic anthem line** (bottom): `حديد جدّة، يطعم المملكة.` — the brand's untranslatable Arabic anthem. Sets the cultural tone before anything else loads.

### 2.2 Reveal mechanic — "section cut"

When `loaded === true` (every critical asset settled), the loader screen does NOT fade out. Instead:

- A horizontal rust line draws across the full viewport width in 350ms, at the vertical center
- The top half of the loader slides up out of frame (translateY -100%)
- The bottom half slides down (translateY +100%)
- The page content beneath is revealed — already painted, ready to be interacted with

This is the same visual gesture as the inter-page transition (see §3) — the loader IS the very first inter-page transition. It establishes the language.

### 2.3 Why this works

- **Brand-coherent from word one.** The visitor's first 1.2s communicates: this brand measures things, in millimeters, with CAD precision. That's the entire pitch.
- **The dimension number IS the progress bar.** No abstract spinner. The 1800mm is the actual length of the hero workstation — the visitor learns the brand's signature dimension before they've seen the product.
- **Arabic-first.** The anthem line is the loader's only headline. English visitors see Arabic first; this is the website signaling "this is a Saudi business" before anything else.
- **Zero perceived lag.** The loader IS work — the dimension is growing because work is happening. There's no waste motion.

### 2.4 Implementation sketch

```tsx
// src/components/loader/MeasurementStampLoader.tsx
"use client";
import { useEffect, useState } from "react";

interface Props {
  progress: number; // 0..1
  ready: boolean;   // page is ready to reveal
  locale: "ar" | "en";
}

export function MeasurementStampLoader({ progress, ready, locale }: Props) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (ready) {
      // Hold the final 100% state for 200ms, then run the reveal
      const t = setTimeout(() => setRevealed(true), 200);
      return () => clearTimeout(t);
    }
  }, [ready]);

  const mm = Math.round(progress * 1800);

  return (
    <div
      data-loader
      data-revealed={revealed || undefined}
      aria-live="polite"
      aria-label={locale === "ar" ? "جاري التحميل" : "loading"}
      // Layout, transforms, transitions: see CSS below
    >
      <div data-loader-half data-loader-half-top>
        <div data-loader-stamp>STEEL VALLEY · جدّة</div>
      </div>
      <svg data-loader-dim viewBox="0 0 800 60">
        {/* dimension extension lines, line, ticks, number */}
        <line x1="20" y1="30" x2={20 + 760 * progress} y2="30"
              stroke="currentColor" strokeWidth="1.2" />
        <line x1="20" y1="20" x2="20" y2="40"
              stroke="currentColor" strokeWidth="1" />
        <line x1={20 + 760 * progress} y1="20" x2={20 + 760 * progress} y2="40"
              stroke="currentColor" strokeWidth="1" />
        <text x="780" y="50" fontFamily="JetBrains Mono, monospace" fontSize="14"
              fill="currentColor" textAnchor="end">{mm} MM</text>
      </svg>
      <div data-loader-half data-loader-half-bottom>
        <div data-loader-anthem>حديد جدّة، يطعم المملكة.</div>
      </div>
      <div data-loader-cut aria-hidden="true" />
    </div>
  );
}
```

```css
/* in globals.css (critical, inline-eligible) */
[data-loader] {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: var(--color-void);
  color: var(--color-bone);
  display: grid;
  grid-template-rows: 1fr auto 1fr;
  align-items: center;
  justify-items: center;
  transition: opacity 200ms;
}
[data-loader][data-revealed] [data-loader-half-top] { transform: translateY(-100%); }
[data-loader][data-revealed] [data-loader-half-bottom] { transform: translateY(100%); }
[data-loader-half] {
  transition: transform 350ms cubic-bezier(.2, .7, .2, 1);
}
[data-loader-cut] {
  position: absolute;
  inset-block-start: 50%;
  inset-inline: 0;
  height: 1px;
  background: var(--color-rust);
  transform: scaleX(0);
  transform-origin: inset-inline-start;
  transition: transform 350ms cubic-bezier(.2, .7, .2, 1);
}
[data-loader][data-revealed] [data-loader-cut] { transform: scaleX(1); }
[data-loader][data-revealed] {
  pointer-events: none;
}

/* Reduced motion: just dwell briefly then fade */
@media (prefers-reduced-motion: reduce) {
  [data-loader-half] { transition: none; transform: none !important; }
  [data-loader][data-revealed] { opacity: 0; }
  [data-loader-cut] { display: none; }
}

/* RTL: cut runs from inline-end to inline-start */
[dir="rtl"] [data-loader-cut] { transform-origin: inset-inline-end; }
```

### 2.5 Wiring (App Router)

```tsx
// src/app/[locale]/layout.tsx (additions)
import { LoaderShell } from "@/components/loader/LoaderShell";

// inside <body>:
<LoaderShell locale={locale}>
  {children}
</LoaderShell>
```

```tsx
// src/components/loader/LoaderShell.tsx (key parts)
"use client";
import { useEffect, useState } from "react";
import { MeasurementStampLoader } from "./MeasurementStampLoader";

export function LoaderShell({ locale, children }: { locale: "ar" | "en"; children: React.ReactNode }) {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Drive progress from: document.readyState, font-loaded events, and the hero GLB load promise.
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const fontsReady = document.fonts?.status === "loaded" ? 1 : 0;
      const docReady = document.readyState === "complete" ? 1 : (document.readyState === "interactive" ? 0.6 : 0.2);
      const target = Math.min(1, (fontsReady * 0.4) + (docReady * 0.6));
      setProgress((p) => p + (target - p) * 0.1);
      if (target >= 0.99) {
        setProgress(1);
        setReady(true);
      } else {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      {children}
      {!ready && <MeasurementStampLoader progress={progress} ready={ready} locale={locale} />}
    </>
  );
}
```

(Production-real implementation in Plan 8 — full code lands then.)

### 2.6 Edge cases

- **No JS / SSR**: the loader is rendered server-side at 0% progress; hydration completes the rest. If JS never loads, the loader stays visible — but Next 15 + Vercel's edge ensures this is vanishingly rare in our context.
- **Fast connection**: progress hits 100% in <200ms. We still hold the final state for 200ms (the `setTimeout` above) so the visitor can actually *see* the final number. Anything faster reads as a flash.
- **Slow connection (3G or worse)**: progress grows slowly. The `1800 MM` number serves as a perceived-performance indicator. The PerfGate already gates the heavy 3D below — so the page can become interactive even if the hero scene is still loading.
- **Repeat visits**: skip the loader entirely when `sessionStorage.getItem("sv-loader-shown") === "1"`. The brand makes its statement once per session.

---

## 3. Inter-Page Transitions — "Section Cut"

### 3.1 What the visitor sees

When the user clicks a link or otherwise navigates:

1. A thin rust line draws across the viewport at the vertical center (350ms).
2. The current page splits along that line: top half slides up, bottom half slides down (both 350ms, parallel).
3. The new page is already painted behind, becomes visible as the halves clear.
4. The rust line fades (200ms).

Total perceived duration: ~550ms. Feels weighty but never sluggish.

### 3.2 Why this works

- **Same gesture as the loader.** The visitor learned this language at first paint. Every navigation is a controlled extension of that first cut.
- **Communicates work.** A cut feels like fabrication. We're literally cutting from one page to the next.
- **Direction-aware.** RTL flips the line's draw direction (right-to-left instead of left-to-right), so the gesture feels native in each script.
- **Browser-native, zero JS.** Uses the View Transitions API. The library payload is zero. The CSS is ~40 lines.

### 3.3 Implementation — Next 15 View Transitions

Next 15 ships `<unstable_ViewTransition>` (in `next` 15.4+). We wrap link clicks in it. Browsers that support View Transitions get the animation; browsers that don't get a clean instant transition (no broken animation).

```tsx
// src/app/[locale]/layout.tsx (additions)
import { ViewTransitions } from "next-view-transitions";
import { TransitionStyles } from "@/components/transitions/TransitionStyles";

// inside body, wrapping children:
<ViewTransitions>
  <TransitionStyles />
  {children}
</ViewTransitions>
```

```tsx
// src/components/transitions/TransitionStyles.tsx
"use client";
import { useEffect } from "react";

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
          animation-timing-function: cubic-bezier(.2, .7, .2, 1);
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

        /* Rust cut line — fixed overlay during the transition */
        ::view-transition-group(root)::after {
          content: "";
          position: fixed;
          inset-block-start: 50%;
          inset-inline: 0;
          height: 1px;
          background: var(--color-rust);
          transform: scaleX(0);
          transform-origin: inset-inline-start;
          animation: sv-cut-draw 350ms cubic-bezier(.2, .7, .2, 1) forwards,
                     sv-cut-fade 200ms 350ms forwards;
        }
        @keyframes sv-cut-draw { to { transform: scaleX(1); } }
        @keyframes sv-cut-fade { to { opacity: 0; } }
      }

      /* RTL: cut runs from inline-end to inline-start */
      [dir="rtl"] ::view-transition-group(root)::after {
        transform-origin: inset-inline-end;
      }

      /* Reduced motion: instant */
      @media (prefers-reduced-motion: reduce) {
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation: none;
        }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return null;
}
```

### 3.4 Browser support + fallback

| Browser | Behavior |
|---------|----------|
| Chrome 111+, Edge 111+ | Full View Transitions API — gets the cut animation |
| Safari 18+ | Full View Transitions API — gets the cut animation |
| Firefox (current) | Behind a flag — gets the instant fallback |
| Older browsers | Instant fallback (no animation, just a route swap) |

The fallback is graceful: no animation, no breakage, no JS error. Users on Firefox get a fast site; users on Chrome/Safari get the brand experience.

### 3.5 Excluded routes

- `/admin/*` — Payload admin handles its own UX, doesn't need the transition
- `/api/*` — not pages
- `/_app-router-health` — internal

The transition wrapping is scoped to the locale layout, which already excludes those paths.

### 3.6 Element-specific transitions

For specific elements (e.g., a product card → product detail), we can opt into shared-element transitions:

```tsx
// On the source page (product card):
<div style={{ viewTransitionName: `product-${slug}` }}>
  <Image ... />
</div>

// On the destination page (product detail hero):
<div style={{ viewTransitionName: `product-${slug}` }}>
  <Image ... />
</div>
```

The browser cross-fades + morphs the element automatically. Use sparingly — overused, it gets gimmicky.

**v1 usage:** product card → product detail hero image (one transition). Everything else uses the default cut.

---

## 4. Accessibility

- **`prefers-reduced-motion`** — Loader becomes a static brand stamp + caption + 200ms opacity fade. Transitions become instant route swaps.
- **`aria-live="polite"`** on the loader so screen readers get a "loading" announcement.
- **`aria-label`** on the loader matches the active locale (Arabic users hear Arabic loading announcement).
- **Focus management**: when a route transitions, focus moves to the new page's `<h1>` (or `#main-content` if no h1) after the transition completes (~700ms timeout). Keyboard users don't get "lost" mid-cut.
- **`@media (prefers-reduced-data: reduce)`** — same behavior as reduced motion.
- **Keyboard navigation** continues to work mid-transition; the new page is real DOM under the animation overlay.

---

## 5. Performance

| Asset | Budget | How |
|-------|--------|-----|
| Loader SVG + CSS | <8 KB gzip | Inlined into the critical CSS payload |
| Loader JS (LoaderShell) | <2 KB gzip | Tiny progress loop, no deps |
| Transition CSS | <1 KB gzip | Pure CSS, injected once at mount |
| `next-view-transitions` package | <3 KB gzip | Tree-shaken wrapper |
| **Combined first-load impact** | **<14 KB gzip** | Within Plan 5's 180 KB first-load budget |

LCP impact: the loader's `<h1>`-equivalent stamp is text, paintable in the first frame. Loader does not block LCP — the LCP element is the page below, painted during the loader's reveal animation.

INP: transitions are CSS-only animations. Zero JS work during the cut. INP unaffected.

---

## 6. Bilingual Behavior (Arabic-native, not translated)

The loader's only headline is the **Arabic anthem line** — `حديد جدّة، يطعم المملكة.` — shown to **every visitor regardless of locale**. Why?

1. It establishes the brand's Saudi rootedness before any localized content loads.
2. The Arabic-native rule (memory `feedback-arabic-native-authoring`) means we don't have a translated English equivalent; the English brand line "we shape steel into spaces that feed cities" lives on the home page, not the loader.
3. Visitors from outside KSA see Arabic first and immediately understand: this is a Saudi business. That's a signal, not a barrier.

A small mono-style English caption sits below the anthem only when `locale === "en"`:

> `stainless steel fabrication · jeddah · since 2005`

That caption is the only translated string in the loader. The anthem is not.

---

## 7. Out of Scope (v1)

- Loading screen for inter-page transitions (the transition itself is fast enough; no spinner needed)
- Per-product or per-section custom transitions beyond the one product-card → product-hero shared transition
- Sound (silent by design; we keep the audio context closed for autoplay safety)
- Loader "splash" video (would blow the perf budget)
- Barba.js integration (kept available, but Next View Transitions API is the v1 choice)

---

## 8. Files this spec introduces

```
src/components/loader/
  LoaderShell.tsx                          ← progress driver + lifecycle
  MeasurementStampLoader.tsx               ← the visual loader
  __tests__/MeasurementStampLoader.test.tsx

src/components/transitions/
  TransitionStyles.tsx                     ← View Transitions API CSS injector

src/app/[locale]/layout.tsx                 ← adds <ViewTransitions> + <LoaderShell>

package.json                                 ← adds "next-view-transitions"
```

---

## 9. Success Criteria

- First paint of the loader within 200ms of `DOMContentLoaded`.
- The loader's `1800 MM` number grows visibly with load progress on every connection speed.
- The reveal animation runs at 60fps; no jank on the cut.
- Section-cut transitions run on every internal route change in supporting browsers (Chrome/Edge/Safari).
- Reduced-motion users get a static loader and instant transitions — no degraded experience, just a calmer one.
- Combined payload <14 KB gzip; LCP unaffected; INP <200ms during transitions.
- Arabic anthem line `حديد جدّة، يطعم المملكة.` paints in every loader, regardless of locale.
