# Steel Valley — Full Redesign Spec

**Date:** 2026-05-18
**Branch:** `redesign` (current `main` stays deployable until launch)
**Status:** Locked. Awaiting user spec review → writing-plans skill produces implementation plan.

---

## 0. Company & Audience (source of truth)

- **Name:** Steel Valley
- **Industry:** Stainless steel fabrication
- **Location:** Jeddah, Saudi Arabia (delivery: all of KSA)
- **Heritage:** 20+ years
- **Buyers:** Restaurants, hospitals, hotels, commercial kitchens (F&B operators, hospitality procurement, hospital facilities)
- **Specialties:** Custom restaurant workstations, shawarma cooking stations, all SS fabrication
- **Service lines:** Hand Railing • Column Cladding • Kitchen Equipment (tables, sinks, hot cabinets, bain marie, exhaust hoods) • Decorative Items
- **Brand asset note:** Logo is a placeholder; the design system must work with a wordmark of 1–3 Latin words OR 1–3 Arabic words at equivalent x-height.

---

## 1. Locked Decisions

| Topic | Decision |
|------|----------|
| Aesthetic | **Refined Industrial** — charcoal/steel/bone palette, rust-orange accent, mechanical/grotesk type, surgical motion |
| Scope | **Full ground-up rebuild** on `redesign` branch |
| Preserved concept | **HomeMaskComponent** — cursor reveal of workshop under typography, re-executed for mobile/touch + RTL |
| CMS | **Payload v3** — lives at `/admin`, same Vercel deploy |
| IA | **5 pages + Blog** — Home, About, Services, Products (+ detail), Contact, /blog |
| Default language | **Arabic-first** (`/`), English at `/en`, `dir="rtl"` primary |
| Analytics | **OpenPanel Cloud** (free tier, OSS underneath, migrate to self-host later) |
| Lead capture | Quote Builder + per-product Enquire CTA + Exit-intent popup with lead magnet + WhatsApp floating CTA |
| Hosting | **Vercel** for the Next.js app — **no Vercel-managed data/storage services** |
| Database | **Supabase Postgres** |
| Media | **Supabase Storage** (S3-compatible, via Payload's S3 storage adapter) |
| Product visualisation | **Photo gallery + CAD-style spec block + installation gallery** (no 3D product models; `model3d` field stays optional) |
| 3D budget | Hero shader scene + small scroll-tied morph + optional mask distortion. **No Theatre.js.** |

---

## 2. Brand & Story

### 2.1 Palette
```
#0A0A0B  ink            primary text on light, primary surface on dark
#1F2937  graphite       secondary surface
#C7CDD6  steel          mid-tone, dividers, charts
#F2F0EC  bone           primary light surface (paper)
#E2611B  rust           single accent — CTAs, focus, "Heat" moments
#0F1419  void           hero/scene backdrop only
```

### 2.2 Typography (free / OFL — production-ready)
Picked to honour the original brief while using fonts that ship today with no license cost. Every font is OFL-licensed, Google-Fonts-hosted (Inter also self-hostable from rsms.me).

- **Latin display:** **Saira Condensed** (Black 900 + ExtraBold 800) — variable-width condensed grotesk; the closest free analog to a heavy condensed Söhne. Reads as industrial precision; works at any display size.
- **Latin body:** **Inter** (Regular 400 + Bold 700) — the canonical free Aktiv Grotesk alternative; designed for screen, dense glyph coverage, excellent on every weight.
- **Mono accent:** **JetBrains Mono** (Regular 400 + SemiBold 600) — kept from the original brief (already free, OFL). Used for spec labels, dimensions, gauge, finish names.
- **Arabic display:** **Tajawal** (Black 900) — geometric modern Arabic by Boutros Fonts, the closest free analog to 29LT Bukra; structured, machine-precise, pairs visually with Saira.
- **Arabic body:** **IBM Plex Sans Arabic** (Regular 400 + Medium 500) — modern naskh designed for long-form reading; the closest free analog to TPTQ Massira; pairs cleanly with Inter at matched x-height.
- **Pairing constraint (still mandatory):** the line "Steel Valley / مصنع ستيل فالي" set at the same point size should feel like one voice — matched x-height, weight rhythm, and tracking.
- **Upgrade path (deferred — not a launch blocker):** if licenses for Söhne Schmal / Aktiv Grotesk / 29LT Bukra / TPTQ Massira are acquired later, swap via `localFont()` in `src/lib/fonts.ts` — variable names in `@theme` stay identical, no structural change.

### 2.3 Voice
- Measured, technical, confident. "We measure twice. Steel knows."
- Spec-sheet over sales-sheet. No exclamation marks. No marketing hyperbole.
- Numbers, dimensions, material grades treated as content, not decoration.

### 2.4 Story arc — **Earth → Heat → Form → Edge → Place**
> Raw stainless coil → fire/cut/weld → measured fabrication → finished edge → installed in a Jeddah kitchen serving its first plate.

Every page hits this arc in miniature. Hero opens at *Earth* (raw material, weight). Scroll moves through *Heat* (process, sparks, fire — single rust-orange light raking across). *Form* (the part being made). *Edge* (precision close-up, mono-spec callouts). Resolves at *Place* (a real installation). CTA lives at *Place*: **"let us build your edge."**

---

## 3. Site Architecture

```
/                         Home (story arc compressed)
/about                    About / Story / Process / Team
/services                 Hand Railing | Column Cladding | Kitchen Equipment | Decorative
/products                 Catalog: Storage | Cooking | Workstations | Washing | Hoods
/products/[slug]          Product detail + Enquire CTA
/contact                  Contact + multi-step Quote Builder + Jeddah map + WhatsApp
/blog                     Blog index
/blog/[slug]              Blog post
/legal/privacy
/legal/terms
/admin                    Payload Studio (the "separate admin panel")
/api/*                    Payload + form endpoints
```

Arabic is the default route. `/en/*` is the English mirror. Locale-aware slugs (e.g. `/products/طاولة-عمل` ↔ `/en/products/workstation`) handled by next-intl + Payload locale fields.

---

## 4. Tech Stack

| Concern | Choice |
|---------|--------|
| Framework | Next.js 15 (App Router) |
| CMS | Payload CMS v3 (Next-native, same repo, mounted at `/admin`) |
| DB | Supabase Postgres |
| Media | Supabase Storage via `@payloadcms/storage-s3` |
| Auth (admin) | Payload's built-in auth |
| i18n | `next-intl` (routing + messages) + Payload locale fields |
| Animation | GSAP + ScrollTrigger; Lenis smooth-scroll (with `prefers-reduced-motion` opt-out) |
| 3D / WebGL | Three.js + R3F + Drei — **ambient only**, route-scoped & lazy |
| Forms | react-hook-form + zod |
| Email | Resend (transactional: enquiry receipts, lead magnet delivery) |
| Analytics | OpenPanel Cloud (free tier) |
| SEO | next-seo + JSON-LD: Organization, LocalBusiness, Product, BlogPosting, FAQPage |
| Hosting | Vercel (Next.js app only — no Vercel Blob/Analytics/Postgres) |

---

## 5. Performance Contract

Hard budgets — design and code must respect these:

- **LCP < 2.0s on 4G** (Saudi mobile networks)
- **INP < 200ms**
- **CLS < 0.05**
- **JS < 180kb gzipped on first load**
- **One Theatre.js sequence MAX → dropped entirely.** GSAP-only.
- 3D scenes **route-scoped and lazy** via `next/dynamic({ ssr:false, loading: <Skeleton/> })`
- Heavy WebGL is **device-gated** — drop to still poster on low-perf devices (rough proxy: `navigator.deviceMemory < 4` or `connection.effectiveType !== '4g'`)
- Images: AVIF + responsive `sizes`, `priority` only on the LCP element
- Every animation respects `prefers-reduced-motion`
- Font loading: variable fonts where possible, `font-display: swap`, preload only the two LCP weights

---

## 6. Accessibility (non-negotiable)

- WCAG 2.2 AA target
- Full keyboard navigation (visible focus ring in rust-orange, never removed)
- Skip-to-content link
- Logical heading order (one `h1` per page)
- All interactive elements have accessible names + roles
- Color contrast 4.5:1 minimum for body, 3:1 for large text (palette designed around this)
- `lang` and `dir` attributes drive layout — every component is RTL-aware from day one
- Motion: `prefers-reduced-motion` collapses GSAP, kills Lenis, disables WebGL ambient scenes
- Forms: visible labels, inline validation, error summary on submit, accessible required-field hint
- Lightbox/popup/modals: focus trap, Escape closes, returns focus to invoking element

---

## 7. Conversion Architecture

### 7.1 Quote Builder (`/contact`)
Multi-step stepper. Each step is its own URL hash for back-button safety.

1. **Project type** — radio cards: Restaurant fit-out / Hotel kitchen / Hospital / Decorative / Other
2. **Scope** — multi-select services (Railing, Cladding, Kitchen Equip, Decorative) + free-text notes
3. **Dimensions / quantity** — soft, optional. "Rough size? Number of stations?"
4. **Budget band** — SAR ranges (helps qualify)
5. **Timeline** — Now / 1–3 months / 3–6 months / Planning
6. **Contact** — name, company, phone (KSA validation), email, optional WhatsApp opt-in
7. **Submit** — drops into Payload `Enquiries` collection; triggers Resend email to sales; redirects to `/contact/thanks` with quote reference number

### 7.2 Per-product Enquire
On every product detail page. Opens the Quote Builder pre-filled with the product slug + name. Same Enquiries collection, tagged `source: product`.

### 7.3 Exit-intent lead magnet
**"The Commercial Kitchen Buyer's Guide — 20 Years of Lessons from Jeddah's Top Restaurants."**
- Bilingual PDF (en + ar)
- Triggers on first exit-intent OR 60% scroll OR 90s dwell (whichever first), once per session
- Email-gated: drops into Payload `Leads` collection
- Resend delivers the PDF + a 3-email nurture sequence over 14 days
- Suppress on `/contact` and `/admin` paths

### 7.4 WhatsApp floating CTA
- Saudi-native; always-visible on mobile, bottom-right
- Prefilled message: `Hi Steel Valley — I'm on {page title}, would like to talk to a fabricator.`
- Routes to a sales WhatsApp number (env var `NEXT_PUBLIC_WHATSAPP_NUMBER`)
- Suppressed inside `/admin`

### 7.5 Mid-scroll soft CTA
On Services and Product detail pages, at ~60% scroll: a quiet inline strip — "Talk to a fabricator — usually replies in 30 min" — opens the Quote Builder.

---

## 8. Content Model (Payload collections)

| Collection | Purpose | Localized fields |
|------------|---------|------------------|
| `pages` | Page-level meta + hero copy (Home/About/Services/Contact/Blog index hero) | title, hero copy, SEO |
| `services` | The 4 service lines | name, description, hero, benefits, gallery |
| `products` | Product catalog | name, slug, description, dimensions, materials, finishes, gauge, gallery, optional `model3d`, related products |
| `categories` | Product categories | name, slug, description |
| `posts` | Blog | title, slug, excerpt, body (rich text), hero, author, tags, SEO, publishedAt |
| `authors` | Blog authors | name, role, bio, photo |
| `enquiries` | Quote builder submissions | (no localization — internal) |
| `leads` | Lead magnet email captures | (internal) |
| `media` | Image library (Supabase Storage) | alt (localized) |
| `globals.settings` | Phone, WhatsApp, email, addresses, social | localized address blocks |
| `globals.nav` | Header + footer navigation | localized labels |

Access control: public read on `pages`/`services`/`products`/`categories`/`posts`/`authors`/`media`. Authenticated-only on `enquiries`/`leads`. Editor + Admin roles.

---

## 9. HomeMaskComponent — Preserved Concept, Rebuilt

**Concept (kept):** Cursor reveals workshop footage *under* a bold display headline. Typography = cold steel surface; reveal = warm orange of cutting/welding.

**Re-execution:**
- The reveal mask is grid-snapped to a coarse 8px grid → feels like a CAD measurement window, not a freeform spotlight
- Touch fallback: idle reveal pulse on a slow loop + tap to pin the reveal area
- RTL: cursor logic unchanged, but the headline anchors right-aligned and the reveal opens "leftward"
- Performance: the reveal layer is a single video poster (or static photo) — no live video element; WebGL distortion is optional polish and only enabled when device passes the perf gate
- `prefers-reduced-motion`: skip the cursor reveal, render the photo at 60% opacity behind the headline as a static composition

---

## 10. SEO

- **Per-locale sitemaps:** `sitemap-en.xml`, `sitemap-ar.xml`, plus a root index
- **`hreflang`** tags on every page pair
- **JSON-LD:** Organization + LocalBusiness on `/`, Service on `/services` + each service, Product on each product, BlogPosting on each post, FAQPage where applicable, BreadcrumbList everywhere
- **OG images:** Generated per-page via `@vercel/og` (this is the Next.js OG library, not a Vercel service dependency — it ships with Next)
- **Robots:** index everything except `/admin`, `/api`, `/contact/thanks`
- **Schema for KSA presence:** `LocalBusiness` with `areaServed: "SA"`, address in Jeddah, opening hours

---

## 11. Migration Plan (high-level — full plan in writing-plans output)

1. **Phase 0 (immediate, security):** rotate Airtable API key; add `.env` to `.gitignore`; purge `.env` from git history with `git-filter-repo`
2. **Phase 1:** create `redesign` branch; scaffold Next.js 15 App Router app alongside Pages Router (gradual migration is supported)
3. **Phase 2:** stand up Supabase project; install Payload v3; define collections; mount `/admin`
4. **Phase 3:** install next-intl; wire locale routing; set up message catalogs
5. **Phase 4:** build the design system from Refined Industrial tokens — colors, type scale, spacing, motion primitives
6. **Phase 5:** build primitive components (Button, Input, Form, NavLink, etc.) RTL-aware
7. **Phase 6:** receive Claude Design deliverables; implement page-by-page
8. **Phase 7:** one-time migration script: Airtable → Payload; manual content review per locale
9. **Phase 8:** lead capture wiring (Resend, OpenPanel events, WhatsApp link)
10. **Phase 9:** SEO + JSON-LD + sitemaps + OG images
11. **Phase 10:** perf pass against the contract in §5; Lighthouse, WebPageTest from Jeddah
12. **Phase 11:** UAT, content QA bilingual, accessibility audit; swap DNS

---

## 12. Out of Scope (v1)

- Admin role permissions beyond editor/admin
- E-commerce / cart / payments
- Server-side A/B testing
- Project case-study pages (added later if needed)
- 3D product models (architecture supports them when assets land)
- App / native mobile

---

---

# PROMPT A — for Claude Design

> *Paste this into Claude Design as the brief. Keep all sections — Claude Design uses them as constraints, not as suggestions.*

---

## Steel Valley — Bilingual Website Redesign (Refined Industrial)

You are designing a complete website redesign for **Steel Valley**, a 20-year-old stainless steel fabrication company based in Jeddah, Saudi Arabia. The goal is an **Awwwards Site of the Day-grade** website that converts hospitality, healthcare, and F&B buyers — without sacrificing performance or accessibility.

### Brand direction — **Refined Industrial**
The brand is the material. Honest, technical, surgical. Steel speaks; the design doesn't oversell.

**Palette (use exactly):**
- `#0A0A0B` ink (primary text/dark surface)
- `#1F2937` graphite (secondary surface)
- `#C7CDD6` steel (mid-tone, dividers)
- `#F2F0EC` bone (primary paper)
- `#E2611B` rust (single accent — CTAs, focus states, "Heat" moments only; never as a fill block)
- `#0F1419` void (hero/scene backdrop only)

**Typography:**
- Latin display: **Saira Condensed** (Black 900 / ExtraBold 800) — free/OFL condensed industrial grotesk, the closest free analog to a heavy condensed Söhne
- Latin body: **Inter** (Regular 400 / Bold 700) — free/OFL, the canonical Aktiv Grotesk alternative
- Mono accent: **JetBrains Mono** (Regular 400 / SemiBold 600) — free/OFL, used for spec labels (dimensions, gauge, material, finish)
- Arabic display: **Tajawal** (Black 900) — free/OFL geometric Arabic, the closest free analog to 29LT Bukra
- Arabic body: **IBM Plex Sans Arabic** (Regular 400 / Medium 500) — free/OFL modern naskh, the closest free analog to TPTQ Massira
- Latin and Arabic must feel like one voice — match x-height, weight rhythm, and tracking. All five fonts ship from Google Fonts; none require attribution in production.

**Voice:** "We measure twice. Steel knows." Measured, technical, confident. No exclamation marks. No marketing hyperbole. Numbers (dimensions, material grades, gauges) are content, not decoration.

### Audience
- Restaurant owners / chefs / F&B operators
- Hotel & hospitality procurement
- Hospital facilities managers
- Commercial kitchen consultants
Saudi-based, decision-makers, mostly bilingual (Arabic primary, English secondary).

### Story arc — every page hits this in miniature
**Earth → Heat → Form → Edge → Place**
> Raw stainless coil → fire/cut/weld → measured fabrication → finished edge → installed in a Jeddah kitchen serving its first plate.

Every page opens at *Earth* (weight, raw material), moves through *Heat* (process, sparks — the rust-orange accent finally appears), *Form* (the part being made), *Edge* (precision close-up with mono-spaced spec callouts), and resolves at *Place* (a real installation in context). The CTA lives at *Place* with the line: **"let us build your edge."**

### Bilingual & directionality
- **Arabic is default.** RTL is the primary layout. LTR (English at `/en/*`) is the variant.
- Every section, grid, and asymmetric composition must work mirrored.
- Provide explicit RTL specs where layout shifts (don't just "flip everything").
- Numerals, dimensions, and mono accents stay LTR even inside Arabic text.

### Information architecture (design all)
- `/` Home (story arc compressed, 5–7 anchor sections)
- `/about` About (the 20-year story, the process, the team)
- `/services` Services (Hand Railing • Column Cladding • Kitchen Equipment • Decorative)
- `/products` Products catalog (filter by category: Storage / Cooking / Workstations / Washing / Hoods)
- `/products/[slug]` Product detail
- `/contact` Contact + multi-step Quote Builder + Jeddah map + WhatsApp CTA
- `/blog`, `/blog/[slug]` Blog index + post
- `/legal/privacy`, `/legal/terms`
- Global: Navbar, Footer, Cookie banner (Saudi PDPL-aware)

### Section-by-section requirements

**Home**
1. **Hero (Earth):** weight-forward composition. Bold display headline ("we shape steel into spaces that feed cities"), one-line tagline, a quiet primary CTA. Background is a slow shader study of brushed steel surface with rust-orange light raking across (R3F, single mesh). Headline supports bilingual variants in one composition.
2. **Mask reveal (Heat) — PRESERVED CONCEPT:** Cursor (or finger on touch) reveals a layer of workshop footage *underneath* a bold headline. Mask is grid-snapped to an 8px grid (CAD measurement window, not soft spotlight). The revealed layer is warm — sparks, cutting, welding. Touch fallback: idle reveal pulse + tap-to-pin. Mirror cleanly for RTL.
3. **Capabilities (Form):** four service cards (Railing, Cladding, Kitchen, Decorative). Each card has a precision photograph, a one-line value prop, and a mono-spaced footer (`SS 304 · gauge 1.2mm · made-to-spec`). Hovering surfaces a quiet "explore →".
4. **Process strip (Edge):** the 6-step Steel Valley process — Consult → Measure → Cut → Weld → Finish → Install — as a horizontal scrolled timeline. Each step has a CAD-style line drawing + photo.
5. **Trust strip:** brand logos of past clients (placeholders), with a subtle marquee. Greyscale until hover.
6. **Featured case (Place):** one anchor installation — large photograph, contextual story (2–3 sentences), spec callouts (square meters, gauge, days to install). CTA: "let us build your edge" → Quote Builder.
7. **Footer / lead magnet teaser:** mid-CTA before the footer, offering the buyer's guide.

**About**
- Hero opens with the 20-year heritage: a single black-and-white shot of the founder/floor + a confident headline.
- Story section: long-form copy in 3 acts (where we started / what we learned / what we build now). Editorial pacing, generous whitespace.
- Process video block: silent 30-second loop of the floor at work (welding, brushing, measuring). Captions for accessibility.
- Three Pillars: Craft / Precision / Endurance — each as a generous panel with a mono-spec footer.
- Team grid: portraits in a strict modular grid, names in Latin + Arabic, role mono-spaced.
- Closing CTA: "tour the workshop" → Contact.

**Services**
- Hero with the 4 services as a navigable index (sticky on scroll).
- One generous section per service: photography + spec sheet + use cases + a sub-list of common products in that line. Mid-scroll soft CTA.
- Bottom: cross-link to Products + Quote Builder.

**Products**
- Hero with category filters as the primary navigation (Storage / Cooking / Workstations / Washing / Hoods). Filters use mono labels.
- Product grid: precision photography on bone-paper cards, name + key spec (size or gauge) below. Hover reveals a subtle measurement overlay.
- Pagination is invisible (infinite scroll with sentinel, but graceful pagination fallback for SEO/RTL).

**Product detail**
- **Above the fold:** product name (display), single hero photograph, primary spec block (mono): dimensions, gauge, finish, material grade. "Enquire" CTA pinned (mobile: bottom sheet).
- **Gallery:** 4–8 angles (front / three-quarter / detail / installed). Zoomable, lightbox, keyboard-navigable.
- **CAD-style spec block — SIGNATURE TREATMENT:** generated from data, rendered as a measured technical drawing on bone paper with dimension lines, leader callouts, mono labels. Sharp at every viewport (SVG). Treat this as the page's visual identity — it's what makes Steel Valley product pages feel different from competitors'.
- **Installation gallery:** "where this lives" — real Jeddah kitchen photos with a one-line caption per photo.
- **Related products:** 3 cross-sells.
- **Enquire footer:** pre-filled Quote Builder embedded inline.

**Contact**
- Hero: one line — "let's measure the space."
- Quote Builder (multi-step stepper): Project type → Scope → Dimensions/quantity → Budget band → Timeline → Contact. Each step is its own URL hash. Progress indicator is mono-spaced (`step 02 / 06`). Validation inline. Submit shows a reference number.
- Map of Jeddah location (static map image preferred over interactive — perf budget).
- WhatsApp + phone + email as alternative contact methods.

**Blog index + post**
- Index: editorial grid, generous whitespace, mono date + reading time, category filter.
- Post: long-form template with display headline, lead image, body type at a comfortable measure (60–75ch), pull-quotes, captioned images, end-CTA (lead magnet or contact).

**Global**
- Navbar: thin, mono-accented. Locale toggle (ar / en) is mono and prominent. Sticky on scroll but collapses to a thinner state.
- Footer: tall, structured, paper-color (bone). Brand mark, navigation, address (bilingual), contact lines, social, legal links, "Made in Jeddah" line.
- Cookie banner: PDPL-aware, three buttons (Accept / Reject / Manage). No dark patterns.
- Lead magnet popup: opens once per session on exit-intent / 60% scroll / 90s dwell. Email-only field. Suppress on `/contact` and `/admin`. Bilingual.

### Motion language
- **Lenis smooth scroll** site-wide; respects `prefers-reduced-motion`.
- **GSAP + ScrollTrigger** for choreography. Surgical — slow, measured, never bouncy. Easing leans toward `power3.out` and CSS `cubic-bezier(.2,.7,.2,1)`.
- **Three.js / R3F** only for:
  - Hero shader scene (brushed steel surface with rust-orange light)
  - One small scroll-tied morph between abstract steel forms (coil → cut → folded → finished) in About / Home process section
  - Optional WebGL distortion of the HomeMaskComponent reveal layer (device-gated)
- **No Theatre.js.**
- **Heavy motion gates:** below `navigator.deviceMemory < 4` or non-4G, drop to still posters.
- Page transitions: 250–350ms cross-fade with a subtle 4px Y translate. No view-transition heroics yet.

### Performance constraints (HARD — design around them)
- **LCP < 2.0s on 4G.** No hero video, no hero carousel.
- **CLS < 0.05.** Every image has a reserved aspect ratio.
- **JS < 180kb first-load gzip.** Means: most pages are static + lightly interactive; heavy 3D scenes are route-scoped and lazy.
- Fonts: subset both Latin and Arabic; preload only two weights per script.

### Accessibility
- WCAG 2.2 AA.
- Visible focus ring in `#E2611B` rust, 2px solid offset 2px. Never removed, never replaced with outline:none.
- Skip-to-content link.
- One `h1` per page; logical heading order.
- All decorative motion stops at `prefers-reduced-motion`.
- Modals/lightbox/popups: focus trap, Escape closes, restores focus.
- Color contrast verified at every type size (palette is designed to meet 4.5:1 / 3:1).

### Deliverables expected from Claude Design
1. **Design system page**: tokens (color, type scale, spacing scale, motion primitives, focus state, radius scale), all in both LTR and RTL examples.
2. **Per-page mockups** for all routes in §IA, in both Arabic (default) and English. Mobile (390px) + tablet (768px) + desktop (1440px) + ultrawide (1920px).
3. **Section-level micro-interaction specs** — what hovers, what scrolls, what reveals, timing in ms.
4. **HomeMaskComponent re-spec** — explicit cursor/touch behavior, mask grid, RTL behavior, motion budget.
5. **CAD-style spec block template** — the signature treatment, fully spec'd so it can be programmatically generated.
6. **Empty/loading/error states** for every dynamic surface (product grid, blog index, quote builder, lightbox).
7. **OG / social card system** — bilingual templates.
8. **Component states**: all primitives (Button, Link, Input, Select, Stepper, Card, Tag, Tab) in default / hover / focus / active / disabled, both directions.

### What to avoid
- Generic SaaS hero ("Trusted by 100+ brands"). Steel Valley isn't a SaaS.
- Gradient meshes, glassmorphism, generic "modern" softness. This brand is hard-edged.
- Stock photography. Every photo should look like it was shot on the Steel Valley floor or in a Jeddah kitchen.
- Decorative animation that doesn't reinforce craft.
- Western F&B imagery. Bias toward Saudi context (shawarma stations, halal kitchens, hotel banquet kitchens in Jeddah/Riyadh).
- Filling the rust accent into large fills. It's a *signal*, not a wash.

---

---

# PROMPT B — for the Technical Prep Session

> *Paste this into a fresh Claude Code session in this repo. It produces the technical foundation in parallel with Claude Design's mockups. Do not implement visual design from this prompt — that comes after design lands.*

---

## Steel Valley — Technical Foundation Prep (parallel to design)

You are working in `/home/devsupreme/work/steelvalley` on the Steel Valley website redesign. The strategic spec is at `docs/superpowers/specs/2026-05-18-steelvalley-redesign.md` — read it fully before doing anything else.

Your job is to **build the technical foundation** while visual design is being produced in parallel by Claude Design. **Do not implement the visual design.** When mockups land, a later session will translate them onto the foundation you build.

### Immediate (Phase 0 — security, do this first)
1. **Rotate the Airtable API key.** It is currently committed in `/.env` and present in git history. Have the user generate a new key, store it locally only.
2. Add `.env` to `.gitignore` (currently only `.env*.local` is ignored).
3. Purge `.env` from git history with `git-filter-repo` (preferred) or BFG. Force-push only after confirming with the user.
4. Create `.env.example` documenting all required env vars (no secrets).

### Phase 1 — branch & scaffold
1. Create branch `redesign` off `main`. All Phase 1+ work happens here.
2. Initialize a Next.js 15 App Router structure **alongside** the existing Pages Router (Next supports both during migration). New routes land under `src/app/**`.
3. Install: `next@latest`, `react@latest`, `typescript`, `@types/react`, `@types/node`. Set strict TS.

### Phase 2 — Payload v3 + Supabase
1. Create a Supabase project (or have the user create one; capture connection string).
2. Install Payload v3: `payload`, `@payloadcms/next`, `@payloadcms/db-postgres`, `@payloadcms/storage-s3`, `@payloadcms/richtext-lexical`.
3. Mount Payload at `/admin` per Payload v3's Next-native pattern.
4. Configure storage adapter to use Supabase Storage (S3-compatible endpoint).
5. Define collections per the spec §8: `pages`, `services`, `products`, `categories`, `posts`, `authors`, `enquiries`, `leads`, `media`. Globals: `settings`, `nav`.
6. Set access control: public read on content, authenticated-only on `enquiries`/`leads`. Editor + Admin roles.
7. Generate types: `payload generate:types`.
8. Seed minimal fixtures so the admin is browsable.

### Phase 3 — i18n routing (next-intl)
1. Install `next-intl`.
2. Configure with locales `['ar','en']`, default `ar`, LTR locale `en`.
3. Set up middleware so `/` → Arabic, `/en/*` → English.
4. Create message catalogs under `messages/ar.json`, `messages/en.json` with structural placeholders only (no real copy yet — copy comes from Payload).
5. Wire `<html lang dir>` based on locale.
6. Add a locale toggle component primitive (just structure, no styling).

### Phase 4 — Design system tokens (scaffold only)
> **Boundary:** spec §2.1 colors and §2.2 type families are *seed values*. Final spacing scale, type ramp, motion curves, focus ring spec, and component states arrive in Claude Design's "Design system page" deliverable (see Prompt A). Don't invent these — scaffold the token layer so the design hand-off is a values-only swap, not a structural rewrite.

1. Install Tailwind CSS v4. Configure with:
   - Color tokens exactly per spec §2.1
   - Type families per spec §2.2 (use CSS @font-face from local files; user will provide font licenses — load placeholders for now)
   - Spacing scale on an 8px base (provisional — Claude Design confirms)
   - Motion tokens: durations (150/250/350/600ms), easing curves (provisional)
2. Add `prefers-reduced-motion` media query helpers.
3. Set up `dir` attribute–aware Tailwind variants (`ltr:`/`rtl:` already exist; verify they're used in primitives).

### Phase 5 — primitive components (RTL-aware from day 1)
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

### Phase 6 — lead capture infrastructure
1. Quote Builder route at `/contact` — multi-step stepper, schema in `src/lib/schemas/quote.ts` (zod), drops into Payload `Enquiries`.
2. Per-product Enquire CTA pre-fills the Quote Builder.
3. Lead magnet popup: exit-intent + scroll + dwell triggers; once per session via `sessionStorage`; email field → Payload `Leads`; suppress on `/contact` and `/admin`.
4. WhatsApp floating CTA component (env-driven phone number).
5. Resend integration: install `resend`; transactional templates for enquiry receipt + lead magnet PDF delivery + 3-step nurture sequence.
6. **Lead-magnet PDF asset is user-supplied.** Build the delivery pipeline (upload to Supabase Storage under a private bucket, signed-URL link in the email). Use a placeholder PDF during prep so the flow is testable end-to-end; swap for the real PDF before launch.

### Phase 7 — SEO + analytics + OG
1. Install `next-seo`. Wire default SEO; per-page overrides.
2. JSON-LD helpers for `Organization`, `LocalBusiness`, `Product`, `BlogPosting`, `FAQPage`, `BreadcrumbList`.
3. Per-locale sitemap routes (`sitemap-en.xml`, `sitemap-ar.xml`) + root index.
4. `hreflang` per page pair.
5. OG image generation via `next/og` (Edge/Node runtime route) — bilingual.
6. Install OpenPanel SDK; wire base pageview tracking + named events (`enquiry_started`, `enquiry_submitted`, `lead_magnet_shown`, `lead_magnet_captured`, `whatsapp_clicked`, `product_enquired`).
7. Add PDPL-aware cookie banner that gates OpenPanel until consent.

### Phase 8 — content migration script (one-shot)
Write `scripts/migrate-airtable-to-payload.ts` that:
- Reads each Airtable table the current site uses
- Maps records into Payload collection shape (with both locales seeded — Arabic content from current site if present, English as fallback or vice versa)
- Uploads images to Supabase Storage via Payload's media collection
- Logs a migration report (records succeeded / skipped / errored)
- Idempotent: re-running won't duplicate

Do not run it against prod data until the user has reviewed the script and a dry-run output.

### Phase 9 — performance scaffolding
1. `next/dynamic` wrapper convention for any 3D component (always `ssr:false`, always with a skeleton).
2. A `<PerfGate>` component that checks `navigator.deviceMemory` and `navigator.connection.effectiveType` and decides whether to mount heavy children.
3. `next/font` setup for the Latin and Arabic font families. Preload only LCP weights.
4. Image policy: only `next/image` with explicit `sizes`; `priority` only on LCP element; AVIF preferred.
5. CI step: Lighthouse + size-limit run on every PR.

### What NOT to do
- **Do not start visual design.** No colors beyond tokens, no real layouts, no animations. Wait for Claude Design.
- **Do not migrate the existing Pages Router routes** to App Router beyond what Payload requires. They stay alive on `main` until launch.
- **Do not delete the existing components.** Keep them readable on `main` for reference. They'll be retired at launch.
- **Do not write content copy.** All copy comes from Payload, seeded by the user later.

### Deliverables at end of prep
- `redesign` branch with: Payload mounted, Supabase wired, i18n routing live, design tokens scaffolded, primitive components built and RTL-tested, lead capture infrastructure complete, SEO + analytics + migration script ready.
- A short status note in `docs/prep-status.md` listing: what's done, what's blocked (e.g., waiting on fonts, Resend API key), what runs locally.
- Git history clean (one logical commit per phase).
- A working `/admin` with seeded collections — user can log in and create a Product, see it on a stub `/products/[slug]` route that renders nothing but its name + spec block JSON.

### Constraint reminder
Everything you build must respect the performance contract in spec §5 and accessibility requirements in spec §6 — even the unstyled primitives. RTL is not an afterthought; it's the default.
