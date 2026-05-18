# Steel Valley — Bilingual Website Redesign Brief

> Paste this entire document into Claude Design. Every section is a constraint, not a suggestion.
> Full strategic context: `docs/superpowers/specs/2026-05-18-steelvalley-redesign.md`

---

You are designing a complete website redesign for **Steel Valley**, a 20-year-old stainless steel fabrication company based in Jeddah, Saudi Arabia. The goal is an **Awwwards Site of the Day-grade** website that converts hospitality, healthcare, and F&B buyers — without sacrificing performance or accessibility.

## Brand direction — Refined Industrial
The brand is the material. Honest, technical, surgical. Steel speaks; the design doesn't oversell.

**Palette (use exactly):**
- `#0A0A0B` ink (primary text/dark surface)
- `#1F2937` graphite (secondary surface)
- `#C7CDD6` steel (mid-tone, dividers)
- `#F2F0EC` bone (primary paper)
- `#E2611B` rust (single accent — CTAs, focus states, "Heat" moments only; never as a fill block)
- `#0F1419` void (hero/scene backdrop only)

**Typography:**
- Latin display: **Saira Condensed** (Black 900 / ExtraBold 800) — free/OFL via Google Fonts. Heavy condensed industrial grotesk; honours the original Söhne Schmal intent without the license cost.
- Latin body: **Inter** (Regular 400 / Bold 700) — free/OFL. The canonical Aktiv Grotesk alternative, optimised for screen.
- Mono accent: **JetBrains Mono** (Regular 400 / SemiBold 600) — free/OFL. Used for spec labels (dimensions, gauge, material, finish).
- Arabic display: **Tajawal** (Black 900) — free/OFL by Boutros Fonts. Geometric modern Arabic; closest free analog to 29LT Bukra.
- Arabic body: **IBM Plex Sans Arabic** (Regular 400 / Medium 500) — free/OFL. Modern naskh, designed for long-form reading; closest free analog to TPTQ Massira.
- Latin and Arabic must feel like one voice — match x-height, weight rhythm, and tracking. All five families are commercial-use safe with no attribution required in production.

**Voice:** "We measure twice. Steel knows." Measured, technical, confident. No exclamation marks. No marketing hyperbole. Numbers (dimensions, material grades, gauges) are content, not decoration.

## Audience
- Restaurant owners / chefs / F&B operators
- Hotel & hospitality procurement
- Hospital facilities managers
- Commercial kitchen consultants

Saudi-based, decision-makers, mostly bilingual (Arabic primary, English secondary).

## Story arc — every page hits this in miniature
**Earth → Heat → Form → Edge → Place**
> Raw stainless coil → fire/cut/weld → measured fabrication → finished edge → installed in a Jeddah kitchen serving its first plate.

Every page opens at *Earth* (weight, raw material), moves through *Heat* (process, sparks — the rust-orange accent finally appears), *Form* (the part being made), *Edge* (precision close-up with mono-spaced spec callouts), and resolves at *Place* (a real installation in context). The CTA lives at *Place* with the line: **"let us build your edge."**

## Bilingual & directionality
- **Arabic is default.** RTL is the primary layout. LTR (English at `/en/*`) is the variant.
- Every section, grid, and asymmetric composition must work mirrored.
- Provide explicit RTL specs where layout shifts (don't just "flip everything").
- Numerals, dimensions, and mono accents stay LTR even inside Arabic text.

## Information architecture (design all)
- `/` Home (story arc compressed, 5–7 anchor sections)
- `/about` About (the 20-year story, the process, the team)
- `/services` Services (Hand Railing • Column Cladding • Kitchen Equipment • Decorative)
- `/products` Products catalog (filter by category: Storage / Cooking / Workstations / Washing / Hoods)
- `/products/[slug]` Product detail
- `/contact` Contact + multi-step Quote Builder + Jeddah map + WhatsApp CTA
- `/blog`, `/blog/[slug]` Blog index + post
- `/legal/privacy`, `/legal/terms`
- Global: Navbar, Footer, Cookie banner (Saudi PDPL-aware)

## Section-by-section requirements

### Home
1. **Hero (Earth):** weight-forward composition. Bold display headline ("we shape steel into spaces that feed cities"), one-line tagline, a quiet primary CTA. Background is a slow shader study of brushed steel surface with rust-orange light raking across (R3F, single mesh). Headline supports bilingual variants in one composition.
2. **Mask reveal (Heat) — PRESERVED CONCEPT:** Cursor (or finger on touch) reveals a layer of workshop footage *underneath* a bold headline. Mask is grid-snapped to an 8px grid (CAD measurement window, not soft spotlight). The revealed layer is warm — sparks, cutting, welding. Touch fallback: idle reveal pulse + tap-to-pin. Mirror cleanly for RTL.
3. **Capabilities (Form):** four service cards (Railing, Cladding, Kitchen, Decorative). Each card has a precision photograph, a one-line value prop, and a mono-spaced footer (`SS 304 · gauge 1.2mm · made-to-spec`). Hovering surfaces a quiet "explore →".
4. **Process strip (Edge):** the 6-step Steel Valley process — Consult → Measure → Cut → Weld → Finish → Install — as a horizontal scrolled timeline. Each step has a CAD-style line drawing + photo.
5. **Trust strip:** brand logos of past clients (placeholders), with a subtle marquee. Greyscale until hover.
6. **Featured case (Place):** one anchor installation — large photograph, contextual story (2–3 sentences), spec callouts (square meters, gauge, days to install). CTA: "let us build your edge" → Quote Builder.
7. **Footer / lead magnet teaser:** mid-CTA before the footer, offering the buyer's guide.

### About
- Hero opens with the 20-year heritage: a single black-and-white shot of the founder/floor + a confident headline.
- Story section: long-form copy in 3 acts (where we started / what we learned / what we build now). Editorial pacing, generous whitespace.
- Process video block: silent 30-second loop of the floor at work (welding, brushing, measuring). Captions for accessibility.
- Three Pillars: Craft / Precision / Endurance — each as a generous panel with a mono-spec footer.
- Team grid: portraits in a strict modular grid, names in Latin + Arabic, role mono-spaced.
- Closing CTA: "tour the workshop" → Contact.

### Services
- Hero with the 4 services as a navigable index (sticky on scroll).
- One generous section per service: photography + spec sheet + use cases + a sub-list of common products in that line. Mid-scroll soft CTA.
- Bottom: cross-link to Products + Quote Builder.

### Products
- Hero with category filters as the primary navigation (Storage / Cooking / Workstations / Washing / Hoods). Filters use mono labels.
- Product grid: precision photography on bone-paper cards, name + key spec (size or gauge) below. Hover reveals a subtle measurement overlay.
- Pagination is invisible (infinite scroll with sentinel, but graceful pagination fallback for SEO/RTL).

### Product detail
- **Above the fold:** product name (display), single hero photograph, primary spec block (mono): dimensions, gauge, finish, material grade. "Enquire" CTA pinned (mobile: bottom sheet).
- **Gallery:** 4–8 angles (front / three-quarter / detail / installed). Zoomable, lightbox, keyboard-navigable.
- **CAD-style spec block — SIGNATURE TREATMENT:** generated from data, rendered as a measured technical drawing on bone paper with dimension lines, leader callouts, mono labels. Sharp at every viewport (SVG). Treat this as the page's visual identity — it's what makes Steel Valley product pages feel different from competitors'.
- **Installation gallery:** "where this lives" — real Jeddah kitchen photos with a one-line caption per photo.
- **Related products:** 3 cross-sells.
- **Enquire footer:** pre-filled Quote Builder embedded inline.

### Contact
- Hero: one line — "let's measure the space."
- Quote Builder (multi-step stepper): Project type → Scope → Dimensions/quantity → Budget band → Timeline → Contact. Each step is its own URL hash. Progress indicator is mono-spaced (`step 02 / 06`). Validation inline. Submit shows a reference number.
- Map of Jeddah location (static map image preferred over interactive — perf budget).
- WhatsApp + phone + email as alternative contact methods.

### Blog index + post
- Index: editorial grid, generous whitespace, mono date + reading time, category filter.
- Post: long-form template with display headline, lead image, body type at a comfortable measure (60–75ch), pull-quotes, captioned images, end-CTA (lead magnet or contact).

### Global
- Navbar: thin, mono-accented. Locale toggle (ar / en) is mono and prominent. Sticky on scroll but collapses to a thinner state.
- Footer: tall, structured, paper-color (bone). Brand mark, navigation, address (bilingual), contact lines, social, legal links, "Made in Jeddah" line.
- Cookie banner: PDPL-aware, three buttons (Accept / Reject / Manage). No dark patterns.
- Lead magnet popup: opens once per session on exit-intent / 60% scroll / 90s dwell. Email-only field. Suppress on `/contact` and `/admin`. Bilingual.

## Motion language
- **Lenis smooth scroll** site-wide; respects `prefers-reduced-motion`.
- **GSAP + ScrollTrigger** for choreography. Surgical — slow, measured, never bouncy. Easing leans toward `power3.out` and CSS `cubic-bezier(.2,.7,.2,1)`.
- **Three.js / R3F** only for:
  - Hero shader scene (brushed steel surface with rust-orange light)
  - One small scroll-tied morph between abstract steel forms (coil → cut → folded → finished) in About / Home process section
  - Optional WebGL distortion of the HomeMaskComponent reveal layer (device-gated)
- **No Theatre.js.**
- **Heavy motion gates:** below `navigator.deviceMemory < 4` or non-4G, drop to still posters.
- Page transitions: 250–350ms cross-fade with a subtle 4px Y translate. No view-transition heroics yet.

## Performance constraints (HARD — design around them)
- **LCP < 2.0s on 4G.** No hero video, no hero carousel.
- **CLS < 0.05.** Every image has a reserved aspect ratio.
- **JS < 180kb first-load gzip.** Means: most pages are static + lightly interactive; heavy 3D scenes are route-scoped and lazy.
- Fonts: subset both Latin and Arabic; preload only two weights per script.

## Accessibility
- WCAG 2.2 AA.
- Visible focus ring in `#E2611B` rust, 2px solid offset 2px. Never removed, never replaced with outline:none.
- Skip-to-content link.
- One `h1` per page; logical heading order.
- All decorative motion stops at `prefers-reduced-motion`.
- Modals/lightbox/popups: focus trap, Escape closes, restores focus.
- Color contrast verified at every type size (palette is designed to meet 4.5:1 / 3:1).

## Deliverables expected
1. **Design system page**: tokens (color, type scale, spacing scale, motion primitives, focus state, radius scale), all in both LTR and RTL examples.
2. **Per-page mockups** for all routes in §IA, in both Arabic (default) and English. Mobile (390px) + tablet (768px) + desktop (1440px) + ultrawide (1920px).
3. **Section-level micro-interaction specs** — what hovers, what scrolls, what reveals, timing in ms.
4. **HomeMaskComponent re-spec** — explicit cursor/touch behavior, mask grid, RTL behavior, motion budget.
5. **CAD-style spec block template** — the signature treatment, fully spec'd so it can be programmatically generated.
6. **Empty/loading/error states** for every dynamic surface (product grid, blog index, quote builder, lightbox).
7. **OG / social card system** — bilingual templates.
8. **Component states**: all primitives (Button, Link, Input, Select, Stepper, Card, Tag, Tab) in default / hover / focus / active / disabled, both directions.

## What to avoid
- Generic SaaS hero ("Trusted by 100+ brands"). Steel Valley isn't a SaaS.
- Gradient meshes, glassmorphism, generic "modern" softness. This brand is hard-edged.
- Stock photography. Every photo should look like it was shot on the Steel Valley floor or in a Jeddah kitchen.
- Decorative animation that doesn't reinforce craft.
- Western F&B imagery. Bias toward Saudi context (shawarma stations, halal kitchens, hotel banquet kitchens in Jeddah/Riyadh).
- Filling the rust accent into large fills. It's a *signal*, not a wash.
