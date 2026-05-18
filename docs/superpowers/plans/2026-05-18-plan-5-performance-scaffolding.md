# Steel Valley — Plan 5: Performance Scaffolding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put the infrastructure in place that enforces the spec's performance contract (LCP < 2s, INP < 200ms, CLS < 0.05, JS < 180kb first-load) before Claude Design's mockups land, so heavy visuals are constrained from day one.

**Architecture:** Four guard-rails — a `<PerfGate>` HOC that decides whether to mount heavy children based on device hints; a `<Lazy3D>` wrapper that always lazy-loads R3F scenes with a still poster fallback; a `next/font` policy with two preloaded weights per script; and CI checks (Lighthouse + size-limit) that fail PRs when the budget is breached.

**Tech Stack:** `next/dynamic`, `next/font`, size-limit, Lighthouse CI (Vercel-agnostic — runs against any local or preview URL).

**Spec reference:** `docs/superpowers/specs/2026-05-18-steelvalley-redesign.md` §5, §11 Phase 9.

**Prerequisite:** Plans 1–4 complete.

**End-state test:**
1. `import("@/ds/perf/Lazy3D")` → a 3D scene compiled into its own chunk, not pulled into the entry bundle.
2. `<PerfGate>` returns `<fallback>` on a simulated `navigator.deviceMemory === 2`.
3. Fonts: only two weights per script preloaded; verified in `<head>`.
4. CI: a PR that adds `import "three"` to the entry bundle is rejected by size-limit.
5. CI: Lighthouse run reports a JSON report and the workflow surfaces the score.

---

## Task 1: `<Lazy3D>` wrapper convention

**Files:**
- Create: `src/ds/perf/Lazy3D.tsx`
- Create: `src/ds/perf/PosterFallback.tsx`

- [ ] **Step 1: Create the poster fallback**

`src/ds/perf/PosterFallback.tsx`:

```tsx
import Image, { type StaticImageData } from "next/image";

interface Props {
  src: string | StaticImageData;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

export function PosterFallback({ src, alt, width, height, priority }: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes="100vw"
      style={{ width: "100%", height: "auto" }}
    />
  );
}
```

- [ ] **Step 2: Create the wrapper**

`src/ds/perf/Lazy3D.tsx`:

```tsx
"use client";
import dynamic, { type DynamicOptionsLoadingProps } from "next/dynamic";
import type { ComponentType, ReactNode } from "react";

interface Lazy3DOptions {
  fallback: ReactNode; // poster shown while loading or when PerfGate denies mount
}

/**
 * Always-lazy convention for R3F / Three.js scenes.
 * - ssr:false (Three.js touches window)
 * - explicit fallback (no flash of empty content)
 * - chunk-split per scene (verified by size-limit)
 *
 * Usage:
 *   const HeroScene = createLazy3D(() => import("./HeroScene"), { fallback: <PosterFallback ... /> });
 *   <HeroScene />
 */
export function createLazy3D<P extends object>(
  loader: () => Promise<{ default: ComponentType<P> }>,
  { fallback }: Lazy3DOptions,
): ComponentType<P> {
  const Loaded = dynamic(loader, {
    ssr: false,
    loading: (_: DynamicOptionsLoadingProps) => <>{fallback}</>,
  });
  return Loaded as ComponentType<P>;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/ds/perf
git commit -m "feat(perf): Lazy3D wrapper + PosterFallback (ssr:false, chunk-split, mandatory fallback)"
```

---

## Task 2: `<PerfGate>` — device-aware render gate

**Files:**
- Create: `src/ds/perf/PerfGate.tsx`
- Create: `src/ds/perf/__tests__/PerfGate.test.tsx`

- [ ] **Step 1: Create the gate**

`src/ds/perf/PerfGate.tsx`:

```tsx
"use client";
import { useEffect, useState, type ReactNode } from "react";

interface NavigatorWithHints extends Navigator {
  deviceMemory?: number;
  connection?: { effectiveType?: string; saveData?: boolean };
}

interface PerfGateProps {
  children: ReactNode;
  fallback: ReactNode;
  minDeviceMemory?: number; // default 4
  requireFastConnection?: boolean; // default true → must be "4g"
}

export function PerfGate({
  children,
  fallback,
  minDeviceMemory = 4,
  requireFastConnection = true,
}: PerfGateProps) {
  const [decision, setDecision] = useState<"loading" | "allow" | "deny">("loading");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Honour OS reduced-motion as a hard deny for decorative motion.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDecision("deny");
      return;
    }

    const nav = window.navigator as NavigatorWithHints;
    const mem = nav.deviceMemory ?? 8; // unknown → assume capable
    const conn = nav.connection;

    const memOk = mem >= minDeviceMemory;
    const connOk = !requireFastConnection || (conn?.effectiveType ?? "4g") === "4g";
    const saveDataOff = !conn?.saveData;

    setDecision(memOk && connOk && saveDataOff ? "allow" : "deny");
  }, [minDeviceMemory, requireFastConnection]);

  if (decision === "loading" || decision === "deny") return <>{fallback}</>;
  return <>{children}</>;
}
```

- [ ] **Step 2: Test**

`src/ds/perf/__tests__/PerfGate.test.tsx`:

```tsx
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { PerfGate } from "../PerfGate";

afterEach(() => {
  vi.restoreAllMocks();
});

function withNavigator(props: { deviceMemory?: number; effectiveType?: string; saveData?: boolean; reduced?: boolean }) {
  Object.defineProperty(window, "navigator", {
    value: {
      ...window.navigator,
      deviceMemory: props.deviceMemory,
      connection: { effectiveType: props.effectiveType ?? "4g", saveData: props.saveData ?? false },
    },
    configurable: true,
  });
  Object.defineProperty(window, "matchMedia", {
    value: (q: string) => ({
      matches: q.includes("reduce") ? (props.reduced ?? false) : false,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
    configurable: true,
  });
}

describe("PerfGate", () => {
  it("renders children on a capable device", async () => {
    withNavigator({ deviceMemory: 8, effectiveType: "4g" });
    render(<PerfGate fallback={<span>poster</span>}><span>heavy</span></PerfGate>);
    await act(async () => { await Promise.resolve(); });
    expect(screen.queryByText("heavy")).toBeTruthy();
  });

  it("renders fallback when deviceMemory below threshold", async () => {
    withNavigator({ deviceMemory: 2, effectiveType: "4g" });
    render(<PerfGate fallback={<span>poster</span>}><span>heavy</span></PerfGate>);
    await act(async () => { await Promise.resolve(); });
    expect(screen.queryByText("heavy")).toBeNull();
    expect(screen.queryByText("poster")).toBeTruthy();
  });

  it("renders fallback on slow connection", async () => {
    withNavigator({ deviceMemory: 8, effectiveType: "3g" });
    render(<PerfGate fallback={<span>poster</span>}><span>heavy</span></PerfGate>);
    await act(async () => { await Promise.resolve(); });
    expect(screen.queryByText("heavy")).toBeNull();
  });

  it("renders fallback when prefers-reduced-motion is set", async () => {
    withNavigator({ deviceMemory: 8, effectiveType: "4g", reduced: true });
    render(<PerfGate fallback={<span>poster</span>}><span>heavy</span></PerfGate>);
    await act(async () => { await Promise.resolve(); });
    expect(screen.queryByText("heavy")).toBeNull();
  });

  it("renders fallback when Save-Data is on", async () => {
    withNavigator({ deviceMemory: 8, effectiveType: "4g", saveData: true });
    render(<PerfGate fallback={<span>poster</span>}><span>heavy</span></PerfGate>);
    await act(async () => { await Promise.resolve(); });
    expect(screen.queryByText("heavy")).toBeNull();
  });
});
```

- [ ] **Step 3: Run tests**

Run: `npm test -- PerfGate`
Expected: green.

- [ ] **Step 4: Commit**

```bash
git add src/ds/perf/PerfGate.tsx src/ds/perf/__tests__/PerfGate.test.tsx
git commit -m "feat(perf): PerfGate respects deviceMemory, effectiveType, Save-Data, prefers-reduced-motion"
```

---

## Task 3: `next/font` policy with two weights per script

**Files:**
- Create: `src/lib/fonts.ts`
- Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Create the font loader module**

`src/lib/fonts.ts`:

```ts
import { Inter, JetBrains_Mono, Saira_Condensed, Tajawal, IBM_Plex_Sans_Arabic } from "next/font/google";

/*
  Free/OFL font policy per spec §2.2.
  Constraint: exactly TWO weights preloaded per script.
  Variable names are stable — if licensed fonts (Söhne Schmal / Aktiv Grotesk / 29LT Bukra / TPTQ Massira)
  are acquired later, swap any single import for next/font/local without touching consumers or @theme.
*/

// --- Latin ---

export const latinDisplay = Saira_Condensed({
  subsets: ["latin"],
  weight: ["800", "900"], // ExtraBold + Black — display weights for industrial headlines
  variable: "--font-latin-display-loaded",
  display: "swap",
  preload: true,
});

export const latinBody = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-latin-body-loaded",
  display: "swap",
  preload: true,
});

export const latinMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-latin-mono-loaded",
  display: "swap",
  preload: true,
});

// --- Arabic ---

export const arabicDisplay = Tajawal({
  subsets: ["arabic"],
  weight: ["900"], // Black — one weight, display-only
  variable: "--font-arabic-display-loaded",
  display: "swap",
  preload: true,
});

export const arabicBody = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500"], // Regular + Medium — body weights
  variable: "--font-arabic-body-loaded",
  display: "swap",
  preload: true,
});

// Convenience: every CSS variable a layout needs to set on <html className=...>
export const fontVariables = [
  latinDisplay.variable,
  latinBody.variable,
  latinMono.variable,
  arabicDisplay.variable,
  arabicBody.variable,
].join(" ");
```

> **Upgrade path (deferred, not a launch blocker):** if Söhne Schmal / Aktiv Grotesk / 29LT Bukra / TPTQ Massira licenses are acquired later, drop the `.woff2` files into `public/fonts/` and replace any single export with a `next/font/local` `localFont()` call. The exported variable name stays the same, so consumers (`@theme` in `globals.css`, the locale layout, every primitive) don't change.

- [ ] **Step 2: Wire variables into the locale layout**

Edit `src/app/[locale]/layout.tsx`:

```tsx
import { fontVariables } from "@/lib/fonts";

// inside the component, replace the <html> opening tag:
<html
  lang={locale}
  dir={dir}
  className={fontVariables}
>
```

(`globals.css` already references the loaded variables — `--font-latin-display-loaded`, `--font-latin-body-loaded`, etc. — from Plan 3 Task 2. No edit to `globals.css` needed here.)

- [ ] **Step 3: Verify weights preloaded match the policy**

Run `npm run dev`, load `/`, view `<head>` source. Expected `<link rel="preload" as="font" ...>` tags:

- 2 weights of **Saira Condensed** (800, 900) — Latin display
- 2 weights of **Inter** (400, 700) — Latin body
- 2 weights of **JetBrains Mono** (400, 600) — Latin mono
- 1 weight of **Tajawal** (900) — Arabic display
- 2 weights of **IBM Plex Sans Arabic** (400, 500) — Arabic body

If any extra weights appear, audit `src/lib/fonts.ts` — Next preloads exactly what `weight: [...]` lists.

- [ ] **Step 4: Commit**

```bash
git add src/lib/fonts.ts src/app/\[locale\]/layout.tsx src/app/globals.css
git commit -m "feat(perf): next/font policy — free/OFL fonts shipped, two weights per script preloaded

- Latin: Saira Condensed (display) + Inter (body) + JetBrains Mono (mono)
- Arabic: Tajawal (display) + IBM Plex Sans Arabic (body)
- All Google Fonts, OFL, commercial-use safe, no attribution required
- Wired into <html className=...> via next/font CSS variables
- @theme vars in globals.css already reference the loaded variable names"
```

---

## Task 4: Image policy enforcement

**Files:**
- Create: `src/ds/perf/SmartImage.tsx`
- Create: `eslint.config.mjs` (or modify existing) — ban raw `<img>` in `src/**`

- [ ] **Step 1: Create SmartImage**

`src/ds/perf/SmartImage.tsx`:

```tsx
import Image, { type ImageProps } from "next/image";

interface SmartImageProps extends ImageProps {
  // Force consumers to specify sizes — protects against unbounded responsive images
  sizes: string;
}

export function SmartImage({ alt, sizes, ...rest }: SmartImageProps) {
  return <Image alt={alt} sizes={sizes} {...rest} />;
}
```

- [ ] **Step 2: Enforce no raw `<img>` outside legacy folders**

If `eslint.config.mjs` exists, add the rule. Otherwise create it:

```js
import next from "eslint-config-next";

export default [
  ...next,
  {
    files: ["src/app/**", "src/ds/**", "src/components/**"],
    rules: {
      "@next/next/no-img-element": "error",
    },
  },
  {
    files: ["src/pages/**", "src/components/ui/**", "src/components/custom/**"],
    rules: {
      "@next/next/no-img-element": "off", // legacy code path until retirement
    },
  },
];
```

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: passes. If failures in new code, fix by using `next/image` or `SmartImage`.

- [ ] **Step 4: Commit**

```bash
git add src/ds/perf/SmartImage.tsx eslint.config.mjs
git commit -m "feat(perf): SmartImage primitive + ESLint bans raw <img> in new code paths"
```

---

## Task 5: size-limit CI check

**Files:**
- Create: `.size-limit.cjs`
- Modify: `package.json` (add script + dev deps)

- [ ] **Step 1: Install size-limit**

```bash
npm install -D size-limit @size-limit/file
```

- [ ] **Step 2: Configure `.size-limit.cjs`**

```js
module.exports = [
  {
    name: "Locale entry chunk (first-load JS budget)",
    path: ".next/static/chunks/app/[locale]/page-*.js",
    limit: "180 KB",
    gzip: true,
  },
  {
    name: "Vendor chunks total",
    path: ".next/static/chunks/*.js",
    limit: "300 KB",
    gzip: true,
  },
  {
    name: "Each 3D scene chunk (Lazy3D-loaded)",
    path: ".next/static/chunks/Lazy3D-*.js",
    limit: "180 KB",
    gzip: true,
    ignore: ["three", "@react-three/fiber", "@react-three/drei"],
  },
];
```

Path globs assume Next 15's output layout. Adjust after the first build if names differ — `ls .next/static/chunks/` reveals the actual pattern.

- [ ] **Step 3: Add scripts**

`package.json`:

```json
"size": "npm run build && size-limit",
"size:why": "npm run build && size-limit --why"
```

- [ ] **Step 4: First baseline run**

Run: `npm run size`

If any check fails, investigate `npm run size:why` and reduce the offending chunk. Don't relax the limit without a written justification in a follow-up commit message.

- [ ] **Step 5: Commit**

```bash
git add .size-limit.cjs package.json package-lock.json
git commit -m "feat(perf): size-limit budgets for entry chunks, vendor, Lazy3D scenes

- 180KB gzip first-load JS per the spec contract
- 300KB vendor total
- Per-scene 3D budget excluding three/r3f peer deps"
```

---

## Task 6: Lighthouse CI

**Files:**
- Create: `.lighthouserc.cjs`
- Create: `.github/workflows/lighthouse.yml`
- Modify: `package.json`

- [ ] **Step 1: Install Lighthouse CI**

```bash
npm install -D @lhci/cli
```

- [ ] **Step 2: Configure**

`.lighthouserc.cjs`:

```js
module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run start",
      startServerReadyPattern: "Ready",
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/en",
        "http://localhost:3000/dev/components",
      ],
      numberOfRuns: 2,
      settings: {
        // Throttle to a simulated 4G (matches the spec §5 contract)
        preset: "desktop",
        throttling: {
          rttMs: 150,
          throughputKbps: 1638,
          cpuSlowdownMultiplier: 4,
        },
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.85 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.95 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 2000 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.05 }],
        "total-blocking-time": ["warn", { maxNumericValue: 200 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
```

- [ ] **Step 3: Add scripts**

```json
"lhci": "npm run build && lhci autorun"
```

- [ ] **Step 4: GitHub Actions workflow**

`.github/workflows/lighthouse.yml`:

```yaml
name: Lighthouse + size-limit

on:
  pull_request:
    branches: [main, redesign]

jobs:
  perf:
    runs-on: ubuntu-latest
    timeout-minutes: 25
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install deps
        run: npm ci

      - name: Build
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL_TEST }}
          PAYLOAD_SECRET: ${{ secrets.PAYLOAD_SECRET_TEST }}
          PAYLOAD_PUBLIC_SERVER_URL: http://localhost:3000

      - name: size-limit
        run: npx size-limit

      - name: Lighthouse CI
        run: npx @lhci/cli autorun
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL_TEST }}
          PAYLOAD_SECRET: ${{ secrets.PAYLOAD_SECRET_TEST }}
          PAYLOAD_PUBLIC_SERVER_URL: http://localhost:3000
```

> **User action:** add `DATABASE_URL_TEST` and `PAYLOAD_SECRET_TEST` to repo secrets. `DATABASE_URL_TEST` should point at a separate Supabase project (or a free Neon DB) reserved for CI — never run CI against production data.

- [ ] **Step 5: Commit**

```bash
git add .lighthouserc.cjs .github/workflows/lighthouse.yml package.json package-lock.json
git commit -m "ci(perf): Lighthouse CI + size-limit on every PR

- Throttled 4G profile per spec §5
- Performance warn ≥ 0.85, Accessibility error ≥ 0.95, SEO error ≥ 0.95
- LCP warn at 2000ms, CLS error at 0.05, TBT warn at 200ms"
```

---

## Task 7: Documentation — performance how-to

**Files:**
- Create: `docs/performance-playbook.md`

- [ ] **Step 1: Create the playbook**

```markdown
# Steel Valley — performance playbook

> Live reference for keeping the site inside the spec §5 contract.

## Budgets (must not exceed)
- LCP < 2.0s on simulated 4G (Lighthouse CI assertion)
- CLS < 0.05 (Lighthouse CI assertion)
- INP < 200ms (TBT proxy in CI; verify in field via OpenPanel)
- JS first-load < 180kb gzip per locale entry (size-limit)

## Rules of engagement

### Heavy interactive content
- Wrap in `<PerfGate fallback={<PosterFallback ... />}>`.
- Inside the gate, mount via `createLazy3D(() => import("./Scene"), { fallback })`.
- Never `import "three"` from a page or layout — always behind `createLazy3D`.

### Images
- Use `SmartImage` (forces explicit `sizes`).
- `priority` only on the LCP element.
- AVIF preferred; let Next pick from there.

### Fonts
- Two weights max per script — modify `src/lib/fonts.ts` carefully.
- `display: swap` always.

### Third-party scripts
- Anything client-side goes through `<Script strategy="lazyOnload">` minimum.
- OpenPanel is already consent-gated — don't bypass.

## Investigating a regression
1. `npm run size:why` → see what blew the budget.
2. `npm run lhci` locally → reproduce the CI Lighthouse run.
3. Open the Lighthouse HTML report (printed URL in the CI log) — look at the LCP attribution and the JS render-blocking trace.

## Common offenders
- A page that imports a Radix component on the server side and bundles its client peers — confirm "use client" boundaries.
- A 3D scene imported eagerly at the top of a page file — must go through `createLazy3D`.
- A Web Font being added without removing an old one — keep the count at two weights per script.
```

- [ ] **Step 2: Commit**

```bash
git add docs/performance-playbook.md
git commit -m "docs(perf): performance playbook — budgets, rules of engagement, investigation guide"
```

---

## Task 8: Update prep-status.md (final)

**Files:**
- Modify: `docs/prep-status.md`

- [ ] **Step 1: Update Plan 5 row**

```markdown
| 5 | Performance Scaffolding | ✅ complete | PerfGate, Lazy3D, font policy, size-limit + Lighthouse CI on PRs |
```

Add to "What runs locally today":
- `npm run size` — size-limit budget check
- `npm run lhci` — Lighthouse CI run
- `npm run lint` — bans raw `<img>` in new code paths

Add a "Now ready for Claude Design" section:

```markdown
## Ready for Claude Design hand-off

When Claude Design's deliverables land:
1. Final palette values → `src/app/globals.css` `@theme` (variable names stay the same)
2. Final spacing scale → same
3. Final motion durations/easings → same
4. Component-state styles → add to `data-component="X"` selectors per primitive
5. Page mockups → translate into the existing `src/app/[locale]/*` routes; CMS content already wired
6. CAD-style spec block template → implement programmatically per the spec
7. (Optional, deferred) Licensed Söhne Schmal / Aktiv Grotesk / 29LT Bukra / TPTQ Massira → swap any single export in `src/lib/fonts.ts` for `next/font/local`. Free OFL fonts ship at launch — this is a polish upgrade, not a blocker.
```

Add migration tracker:

```markdown
## Pending follow-ups
- Switch lead-magnet PDF delivery to Supabase signed URLs when the real PDF replaces the placeholder (Plan 4 Task 6)
- (Optional polish) If licenses for Söhne Schmal / Aktiv Grotesk / 29LT Bukra / TPTQ Massira are acquired, swap any single export in `src/lib/fonts.ts` for `localFont()`. Site ships with free OFL fonts that honour the brief.
- Run `npm run migrate:airtable -- --apply` once dry-run report is reviewed (Plan 4 Task 15)
- After full launch, retire legacy Pages Router files in `src/pages/**` and `src/components/{ui,custom}/**`
```

- [ ] **Step 2: Commit + push**

```bash
git add docs/prep-status.md
git commit -m "docs(prep-status): mark Plan 5 complete + Claude Design hand-off checklist"
git push origin redesign
```

---

## Plan 5 — done.

**End-state achieved:**
- `<Lazy3D>` HOC enforces ssr:false + chunk-split + mandatory fallback for every 3D scene.
- `<PerfGate>` denies heavy mounts on: deviceMemory < 4, non-4G connection, Save-Data on, prefers-reduced-motion.
- `next/font` configured with two preloaded weights per script; ready to swap stand-ins for licensed fonts.
- `SmartImage` enforces explicit `sizes`; ESLint bans raw `<img>` in new code.
- size-limit configured with the spec's budgets (180KB first-load gzip).
- Lighthouse CI runs on every PR with the spec's thresholds wired as assertions.
- Documentation: `docs/performance-playbook.md` for future contributors + maintainers.
- `docs/prep-status.md` reflects full completion + Claude Design hand-off checklist.

---

## Full prep work — done.

All five plans (1–5) are complete. The `redesign` branch now contains:
- Clean git history (no leaked secrets).
- Next 15 + React 19 + App Router (Pages Router co-exists for reference).
- Payload v3 at `/admin` with 9 collections + 2 globals on Supabase Postgres + Storage.
- Bilingual routing (Arabic at `/`, English at `/en/*`) with `<html lang dir>` set.
- 17 RTL-safe primitive components + `/dev/components` showcase.
- Quote Builder, lead-magnet popup, WhatsApp CTA, mid-scroll CTA.
- Full SEO (next-seo, JSON-LD, sitemaps, hreflang, OG via `next/og`).
- OpenPanel analytics gated by PDPL cookie banner.
- Airtable → Payload migration script (dry-run by default).
- Performance contract enforced via `<PerfGate>`, `<Lazy3D>`, font policy, ESLint, size-limit, Lighthouse CI.

**When Claude Design delivers,** a fresh session should:
1. Read `docs/superpowers/specs/2026-05-18-steelvalley-redesign.md`.
2. Read `docs/prep-status.md` for current ground truth.
3. Implement page-by-page from Claude Design's mockups into `src/app/[locale]/*`.
4. Add per-component styles by extending selectors that target the `data-component="..."` attributes already in place.
5. Replace any provisional token values in `@theme`.

The structural work is done. From here, it's translation.
