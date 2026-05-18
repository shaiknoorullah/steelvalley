# Steel Valley — Production Launch Checklist

A walkthrough for taking the redesign from "everything wired with stubs"
to fully production-live with external services connected and tests green.

Estimated time end-to-end: **2-3 hours of focused work**.

---

## 1 · External Services to Provision

### 1.1 Supabase Postgres + Storage (powers `/admin`)

1. Go to https://supabase.com/dashboard → **New project**
2. Name `steelvalley`, region `eu-central-1` (closest to KSA on current map)
3. Set a strong DB password — store in your password manager
4. After provisioning, from **Settings → API** copy:
   - Project URL → `SUPABASE_URL`
   - `anon` `public` → `SUPABASE_ANON_KEY`
   - `service_role` (keep secret) → `SUPABASE_SERVICE_ROLE_KEY`
5. From **Settings → Database → Connection string → Transaction pooler**, build:
   - `DATABASE_URL` (substitute the password)
6. From **Storage → Settings → S3 Connection**:
   - Endpoint → `SUPABASE_S3_ENDPOINT`
   - Region → `SUPABASE_S3_REGION`
   - Create new S3 access keys → `SUPABASE_S3_ACCESS_KEY_ID` + `SUPABASE_S3_SECRET_ACCESS_KEY`
7. In **Storage**, create two buckets:
   - `media` (public)
   - `lead-magnets` (private)
8. Generate a Payload secret: `openssl rand -hex 32` → `PAYLOAD_SECRET`
9. Set `PAYLOAD_PUBLIC_SERVER_URL` = your production URL (e.g. `https://steelvalley.sa`)

### 1.2 Resend (transactional email)

1. Sign up at https://resend.com
2. Add and verify a sending domain (e.g. `mail.steelvalley.sa`)
3. Create an API key → `RESEND_API_KEY`
4. Set `RESEND_FROM_EMAIL` (e.g. `quotes@mail.steelvalley.sa`)
5. Set `RESEND_SALES_EMAIL` (e.g. `sales@steelvalley.sa`) — the inbox sales reads

### 1.3 OpenPanel (analytics, consent-gated)

1. Sign up at https://openpanel.dev (free tier)
2. Create project "Steel Valley", then a **Web** client
3. Copy Client ID → `NEXT_PUBLIC_OPENPANEL_CLIENT_ID`
4. Copy Client Secret → `OPENPANEL_CLIENT_SECRET`

### 1.4 Sales WhatsApp number

1. Set `NEXT_PUBLIC_WHATSAPP_NUMBER` in international format, e.g. `+966551234567`
2. Make sure the corresponding WhatsApp Business account is set up to receive site enquiries

### 1.5 GitHub repo secrets (for CI)

Add at **Settings → Secrets and variables → Actions**:

- `DATABASE_URL_TEST` — separate Supabase project or Neon free DB for CI Lighthouse runs (never prod)
- `PAYLOAD_SECRET_TEST` — random hex; CI-only

---

## 2 · Push env vars to Vercel

Either via dashboard (**Project → Settings → Environment Variables**) or CLI:

```bash
npm i -g vercel
vercel link               # one-time
vercel env add DATABASE_URL production
vercel env add SUPABASE_URL production
# … and so on for every variable in .env.example
```

Tip: run `vercel env pull .env.local` after to verify locally.

---

## 3 · First Boot of Payload + Seed

Locally, with `.env.local` populated:

```bash
npm install
npm run dev
# Open http://localhost:3000/admin
# Create your first admin user (email + strong password)
# Verify the sidebar shows: Users, Media, Lead Magnets, Categories,
#   Products, Services, Authors, Posts, Pages, Enquiries, Leads
#   Globals: Settings, Nav
```

Then generate types and seed:

```bash
npx payload generate:types
npm run seed
# Re-open /admin — should see 5 categories + 8 page stubs + a Settings
```

---

## 4 · Content authoring in Payload

For each surface, log into `/admin` and create:

- **Settings** global: company name (en + ar), tagline, phone, WhatsApp number, email, address, social links
- **Nav** global: header links, footer columns
- **Pages**: hero copy + SEO meta per page key (home, about, services, products, contact, blog, privacy, terms)
- **Categories**: confirm the 5 stubbed match (Storage, Cooking, Workstations, Washing, Hoods)
- **Products**: real products — name, slug, dimensions, gauge, finish, gallery, installation photos
- **Services**: 4 services per spec — Hand Railing, Column Cladding, Kitchen Equipment, Decorative — with tagline, description, benefits, use cases
- **Authors** + **Posts**: blog content
- **Lead Magnets**: upload the buyer's guide PDF (Arabic + English variants), set `active: true`

---

## 5 · User-supplied assets to drop in

These currently use placeholders / stock dimensions:

| Asset | Location | Notes |
|---|---|---|
| Company logo | Settings → company.logo | SVG preferred; will appear in nav/footer |
| Kitchen-plate photo for hero Place stage | `public/3d/kitchen-plate.avif` | 4500 × 1500, AVIF |
| Chef-hand silhouette overlay | `public/3d/chef-hand.png` | PNG with transparency |
| Real photography for Services/Products | Payload Media library | Replace striped placeholders |
| Buyer's guide PDF | Payload Lead Magnets | Bilingual or 2 separate files |
| 6 client logos (or remove the Trust strip if not approved by clients) | Payload Media + Trust section copy | Currently uses initials in cards |

---

## 6 · Native Saudi Arabic copy review (LAUNCH GATE)

**Non-negotiable before launch.** All Arabic strings in the project are
AI-authored using the Saudi copy toolkit (memory `feedback-saudi-arabic-copy-strategy`)
but require a native Saudi copywriter sign-off.

Files containing Arabic copy to review:

- `messages/ar.json` — UI chrome
- `src/components/home/HomeCopy.ts` — home page (Capabilities, Process, Trust, Featured, Lead Magnet, Footer)
- `src/components/about/AboutCopy.ts`
- `src/components/services/ServicesCopy.ts`
- `src/components/contact/ContactCopy.ts`
- `src/components/hero/HeroCopy.ts` — the 5 hero chapter headlines
- `src/components/loader/MeasurementStampLoader.tsx` — the brand anthem line
- `src/lib/data/stub-products.ts` (will be replaced by Payload content)
- `src/lib/data/stub-posts.ts` (will be replaced by Payload content)
- `src/lib/seo/defaults.ts` — meta titles + descriptions

Brief the reviewer: "Hijazi register, Surah Al-Hadid echoes (شدّة, منفعة)
where natural, Vision 2030 undertones, craft dignity (صنعة not إنتاج),
possessive warmth in CTAs. NEVER a translation of the English."

---

## 7 · Legal review

- `src/app/[locale]/legal/privacy/page.tsx` — placeholder PDPL-compliant boilerplate
- `src/app/[locale]/legal/terms/page.tsx` — same
- Both files have a `rust-dashed TODO callout` calling out the lawyer review

Get Saudi counsel to vet against the **Personal Data Protection Law (PDPL)
Royal Decree M/19** and Saudi consumer-protection regulations. Update the
content via Payload (eventually) or directly in those files.

---

## 8 · Run the Airtable migration (one-shot)

If you want existing Airtable products migrated into Payload:

1. Re-issue an Airtable API token (the old one was leaked + revoked in spirit
   — actually we kept it per your instruction; rotate if you want to be safe)
2. Set in `.env.local`: `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`
3. Dry-run first: `npm run migrate:airtable`
4. Review the dry-run report carefully (counts succeeded/skipped/errored)
5. Apply for real: `npm run migrate:airtable -- --apply`
6. Verify the new records in `/admin`

---

## 9 · Performance + accessibility pass

```bash
npm run build
npm run size                 # size-limit budgets
npm run test                 # vitest unit suite
npm run test:e2e             # playwright + axe a11y
npx @lhci/cli autorun        # Lighthouse CI (needs DATABASE_URL_TEST locally)
```

Target metrics (from spec §5):
- LCP < 2.0 s on 4G
- INP < 200 ms
- CLS < 0.05
- First-load JS < 180 kb gzip

If anything fails, the failure surface will be clearly logged. Fix and rerun.

---

## 10 · Deploy

```bash
# Vercel will auto-deploy on every push to main.
# Manual production deploy if needed:
vercel --prod
```

After deploy:
1. Smoke-test critical paths in the preview URL: `/`, `/en`, `/services`, `/products`, `/contact`, `/admin`
2. Submit a quote via the Quote Builder; confirm it lands in `/admin/collections/enquiries` and emails fire via Resend
3. Trigger the lead-magnet popup (scroll past 60% or wait 90s); submit; confirm Lead lands + email fires
4. Test the WhatsApp floating button (mobile + desktop)
5. View source on `/`; confirm JSON-LD blocks for Organization + LocalBusiness
6. Visit `/sitemap.xml` and `/robots.txt`
7. Visit `/og?title=Workstation&locale=en` — confirm it returns a PNG
8. Run Lighthouse from the Vercel preview URL — verify scores in production
9. Cookie banner: accept → confirm OpenPanel sees the page view in the dashboard

---

## 11 · Promote to production domain

1. In Vercel Project Settings → Domains, add `steelvalley.sa` (or your domain)
2. Update `PAYLOAD_PUBLIC_SERVER_URL` to the real domain
3. Promote the latest preview to production

---

## 12 · Post-launch monitoring

- OpenPanel dashboard: enquiry conversion rate, lead-magnet capture rate, WhatsApp click rate
- Vercel Analytics (free tier auto-on)
- Resend dashboard: deliverability, bounces, complaints
- Supabase dashboard: DB connections, storage usage

---

## Deferred to v2 (acknowledged, not blocking launch)

- **WebGPU raytracing** for the hero (Three.js WebGPURenderer in r170+ doesn't yet ship hardware RT; revisit when stable)
- **Photoreal kitchen environment** for the hero Place stage (currently a warm-toned backdrop plane)
- **Depth-of-field post-processing** in the hero (would require `@react-three/postprocessing` EffectComposer setup; cost-benefit defer)
- **Per-region case study pages** (e.g. `/work/hilton-jeddah`) — Featured Case is a single home-page section for now
- **Multi-language beyond ar/en** (next-intl is configured to add more locales trivially when needed)

---

## Files for orientation

- Strategic spec: `docs/superpowers/specs/2026-05-18-steelvalley-redesign.md`
- Hero spec: `docs/superpowers/specs/2026-05-18-hero-from-blueprint-to-build.md`
- Loader spec: `docs/superpowers/specs/2026-05-18-loading-and-transitions.md`
- Live status: `docs/prep-status.md`
- Memory: `~/.claude/projects/-home-devsupreme-work-steelvalley/memory/MEMORY.md`
  (includes the Arabic-native-authoring and Saudi-copy-strategy guides)

---

You're 90% of the way there. The above gets you the last 10% to production.
