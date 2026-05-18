# Steel Valley — Technical Foundation Prep

> Paste this into a fresh Claude Code session in the steelvalley repo.
> Strategic context: `docs/superpowers/specs/2026-05-18-steelvalley-redesign.md`
> Phased implementation plan: `docs/superpowers/plans/2026-05-18-plan-1-security-and-scaffold.md` (and the four plans that follow)

---

You are working in `/home/devsupreme/work/steelvalley` on the Steel Valley website redesign. Read the strategic spec at `docs/superpowers/specs/2026-05-18-steelvalley-redesign.md` fully before doing anything else.

Your job is to **build the technical foundation** while visual design is being produced in parallel by Claude Design. **Do not implement the visual design.** When mockups land, a later session will translate them onto the foundation you build.

## Immediate (Phase 0 — security, do this first)
1. **Rotate the Airtable API key.** It is currently committed in `/.env` and present in git history. Have the user generate a new key, store it locally only.
2. Add `.env` to `.gitignore` (currently only `.env*.local` is ignored).
3. Purge `.env` from git history with `git-filter-repo` (preferred) or BFG. Force-push only after confirming with the user.
4. Create `.env.example` documenting all required env vars (no secrets).

## Phase 1 — branch & scaffold
1. Create branch `redesign` off `main`. All Phase 1+ work happens here.
2. Initialize a Next.js 15 App Router structure **alongside** the existing Pages Router (Next supports both during migration). New routes land under `src/app/**`.
3. Install: `next@latest`, `react@latest`, `typescript`, `@types/react`, `@types/node`. Set strict TS.

## Phase 2 — Payload v3 + Supabase
1. Create a Supabase project (or have the user create one; capture connection string).
2. Install Payload v3: `payload`, `@payloadcms/next`, `@payloadcms/db-postgres`, `@payloadcms/storage-s3`, `@payloadcms/richtext-lexical`.
3. Mount Payload at `/admin` per Payload v3's Next-native pattern.
4. Configure storage adapter to use Supabase Storage (S3-compatible endpoint).
5. Define collections per the spec §8: `pages`, `services`, `products`, `categories`, `posts`, `authors`, `enquiries`, `leads`, `media`. Globals: `settings`, `nav`.
6. Set access control: public read on content, authenticated-only on `enquiries`/`leads`. Editor + Admin roles.
7. Generate types: `payload generate:types`.
8. Seed minimal fixtures so the admin is browsable.

## Phase 3 — i18n routing (next-intl)
1. Install `next-intl`.
2. Configure with locales `['ar','en']`, default `ar`, LTR locale `en`.
3. Set up middleware so `/` → Arabic, `/en/*` → English.
4. Create message catalogs under `messages/ar.json`, `messages/en.json` with structural placeholders only (no real copy yet — copy comes from Payload).
5. Wire `<html lang dir>` based on locale.
6. Add a locale toggle component primitive (just structure, no styling).

## Phase 4 — Design system tokens (scaffold only)
> **Boundary:** spec §2.1 colors and §2.2 type families are *seed values*. Final spacing scale, type ramp, motion curves, focus ring spec, and component states arrive in Claude Design's "Design system page" deliverable. Don't invent these — scaffold the token layer so the design hand-off is a values-only swap, not a structural rewrite.

1. Install Tailwind CSS v4. Configure with:
   - Color tokens exactly per spec §2.1
   - Type families per spec §2.2 — five free/OFL Google Fonts (Saira Condensed, Inter, JetBrains Mono, Tajawal, IBM Plex Sans Arabic). No license handoff required; loaded via `next/font/google` in Plan 5.
   - Spacing scale on an 8px base (provisional — Claude Design confirms)
   - Motion tokens: durations (150/250/350/600ms), easing curves (provisional)
2. Add `prefers-reduced-motion` media query helpers.
3. Set up `dir` attribute–aware Tailwind variants (`ltr:`/`rtl:` already exist; verify they're used in primitives).

## Phase 5 — primitive components (RTL-aware from day 1)
Build these as headless/unstyled primitives — style comes from design later. All must work in both directions.

- `Button`, `IconButton`
- `Link`, `LocaleLink`, `LocaleToggle`
- `Input`, `Textarea`, `Select`, `RadioCard`, `Checkbox`
- `Form` (react-hook-form + zod adapter)
- `Stepper` (for Quote Builder)
- `Dialog` / `Modal` (focus trap, Escape, restore focus)
- `Lightbox` (keyboard nav, focus trap)
- `Disclosure` / `Accordion`
- `Tabs`
- `Tag` / `Badge`
- `Toast`
- `SkipToContent`

Each gets a Storybook story (or a plain `/dev/components` route if no Storybook).

## Phase 6 — lead capture infrastructure
1. Quote Builder route at `/contact` — multi-step stepper, schema in `src/lib/schemas/quote.ts` (zod), drops into Payload `Enquiries`.
2. Per-product Enquire CTA pre-fills the Quote Builder.
3. Lead magnet popup: exit-intent + scroll + dwell triggers; once per session via `sessionStorage`; email field → Payload `Leads`; suppress on `/contact` and `/admin`.
4. WhatsApp floating CTA component (env-driven phone number).
5. Resend integration: install `resend`; transactional templates for enquiry receipt + lead magnet PDF delivery + 3-step nurture sequence.
6. **Lead-magnet PDF asset is user-supplied.** Build the delivery pipeline (upload to Supabase Storage under a private bucket, signed-URL link in the email). Use a placeholder PDF during prep so the flow is testable end-to-end; swap for the real PDF before launch.

## Phase 7 — SEO + analytics + OG
1. Install `next-seo`. Wire default SEO; per-page overrides.
2. JSON-LD helpers for `Organization`, `LocalBusiness`, `Product`, `BlogPosting`, `FAQPage`, `BreadcrumbList`.
3. Per-locale sitemap routes (`sitemap-en.xml`, `sitemap-ar.xml`) + root index.
4. `hreflang` per page pair.
5. OG image generation via `next/og` (Edge/Node runtime route) — bilingual.
6. Install OpenPanel SDK; wire base pageview tracking + named events (`enquiry_started`, `enquiry_submitted`, `lead_magnet_shown`, `lead_magnet_captured`, `whatsapp_clicked`, `product_enquired`).
7. Add PDPL-aware cookie banner that gates OpenPanel until consent.

## Phase 8 — content migration script (one-shot)
Write `scripts/migrate-airtable-to-payload.ts` that:
- Reads each Airtable table the current site uses
- Maps records into Payload collection shape (with both locales seeded — Arabic content from current site if present, English as fallback or vice versa)
- Uploads images to Supabase Storage via Payload's media collection
- Logs a migration report (records succeeded / skipped / errored)
- Idempotent: re-running won't duplicate

Do not run it against prod data until the user has reviewed the script and a dry-run output.

## Phase 9 — performance scaffolding
1. `next/dynamic` wrapper convention for any 3D component (always `ssr:false`, always with a skeleton).
2. A `<PerfGate>` component that checks `navigator.deviceMemory` and `navigator.connection.effectiveType` and decides whether to mount heavy children.
3. `next/font` setup for the Latin and Arabic font families. Preload only LCP weights.
4. Image policy: only `next/image` with explicit `sizes`; `priority` only on LCP element; AVIF preferred.
5. CI step: Lighthouse + size-limit run on every PR.

## What NOT to do
- **Do not start visual design.** No colors beyond tokens, no real layouts, no animations. Wait for Claude Design.
- **Do not migrate the existing Pages Router routes** to App Router beyond what Payload requires. They stay alive on `main` until launch.
- **Do not delete the existing components.** Keep them readable on `main` for reference. They'll be retired at launch.
- **Do not write content copy.** All copy comes from Payload, seeded by the user later.

## Deliverables at end of prep
- `redesign` branch with: Payload mounted, Supabase wired, i18n routing live, design tokens scaffolded, primitive components built and RTL-tested, lead capture infrastructure complete, SEO + analytics + migration script ready.
- A short status note in `docs/prep-status.md` listing: what's done, what's blocked (e.g., waiting on fonts, Resend API key), what runs locally.
- Git history clean (one logical commit per phase).
- A working `/admin` with seeded collections — user can log in and create a Product, see it on a stub `/products/[slug]` route that renders nothing but its name + spec block JSON.

## Constraint reminder
Everything you build must respect the performance contract in spec §5 and accessibility requirements in spec §6 — even the unstyled primitives. RTL is not an afterthought; it's the default.
