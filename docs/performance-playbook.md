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
