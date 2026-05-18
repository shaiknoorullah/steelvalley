# Steel Valley — Plan 4: Conversion + Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire every conversion surface (Quote Builder, per-product Enquire, lead-magnet popup, WhatsApp CTA, soft mid-scroll CTAs) into Payload, plus full SEO (JSON-LD, sitemaps, hreflang, OG), analytics (OpenPanel + PDPL cookie consent), and a one-shot Airtable → Payload migration script.

**Architecture:** Forms submit to `/api/quote` and `/api/lead` (App Router route handlers) — both validate with zod, write to Payload, and trigger Resend transactional emails. Quote Builder UI is composed from the `Stepper` primitive (Plan 3) + a zod schema for each step. Lead-magnet PDF lives in Supabase Storage under a private bucket; download links are short-lived signed URLs. OpenPanel SDK loads only after user consent. The migration script reads the existing Airtable tables and inserts into Payload via the local API.

**Tech Stack:** Resend, OpenPanel, zod, next-seo, `next/og`, Airtable JS SDK.

**Spec reference:** `docs/superpowers/specs/2026-05-18-steelvalley-redesign.md` §7, §10, §11 Phase 6-8.

**Prerequisite:** Plans 1, 2, 3 complete.

**End-state test:**
1. Submit the Quote Builder end-to-end → record appears in Payload `Enquiries` with a unique `reference`; sales gets an email.
2. Trigger the lead-magnet popup → submit email → record appears in `Leads`; user gets the PDF via signed URL.
3. WhatsApp button on every locale page (except `/admin`) → opens with prefilled context.
4. View source on `/` and `/en/products/<slug>` → JSON-LD blocks for Organization/LocalBusiness/Product present.
5. `GET /sitemap-index.xml`, `/sitemap-ar.xml`, `/sitemap-en.xml` → all 200.
6. `GET /og?title=…&locale=ar` → 200, returns a PNG.
7. Cookie banner blocks OpenPanel until accepted.
8. Migration script dry-run prints a counts report; with `--apply`, content lands in Payload.
9. `npm test` and `npm run test:e2e` green.

---

## Task 1: Install Resend + OpenPanel + Airtable SDK + next-seo

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install**

```bash
npm install resend @openpanel/web @openpanel/nextjs next-seo airtable
```

- [ ] **Step 2: Verify**

Run: `grep -E '"(resend|@openpanel/|next-seo|airtable)"' package.json`
Expected: all four lines present.

- [ ] **Step 3: User-handoff for Resend + OpenPanel keys**

Output to user:

```
Need two more keys:

1. Resend (transactional email):
   - Sign up at resend.com.
   - Verify a sending domain (e.g. mail.steelvalley.example).
   - Create an API key → paste back as RESEND_API_KEY.
   - Also tell me the verified FROM address (e.g. quotes@steelvalley.example).

2. OpenPanel:
   - Sign up at openpanel.dev.
   - Create a project "Steel Valley".
   - From Settings → Clients, create a "Web" client.
   - Paste back the Client ID → NEXT_PUBLIC_OPENPANEL_CLIENT_ID.
   - Paste back the Client Secret → OPENPANEL_CLIENT_SECRET.
```

Add to `.env.local`:

```
RESEND_API_KEY=...
RESEND_FROM_EMAIL=quotes@steelvalley.example
RESEND_SALES_EMAIL=sales@steelvalley.example

NEXT_PUBLIC_OPENPANEL_CLIENT_ID=...
OPENPANEL_CLIENT_SECRET=...

NEXT_PUBLIC_WHATSAPP_NUMBER=+9665XXXXXXXX
```

- [ ] **Step 4: Update `.env.example`**

Add the same keys with empty values (`.env.example` already lists them from Plan 1 — verify and add any missing).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json .env.example
git commit -m "feat(conversion): install Resend, OpenPanel, next-seo, Airtable SDK"
```

---

## Task 2: Quote schema + Enquiry reference generator

**Files:**
- Create: `src/lib/schemas/quote.ts`
- Create: `src/lib/quote/reference.ts`
- Create: `src/lib/quote/__tests__/reference.test.ts`

- [ ] **Step 1: Create the zod schema**

`src/lib/schemas/quote.ts`:

```ts
import { z } from "zod";

export const ProjectType = z.enum(["restaurant", "hotel", "hospital", "decorative", "other"]);
export const Scope = z.enum(["railing", "cladding", "kitchen", "decorative"]);
export const BudgetBand = z.enum(["lt50k", "50to150k", "150to500k", "gt500k", "skip"]);
export const Timeline = z.enum(["now", "1to3", "3to6", "planning"]);

export const quoteSchema = z.object({
  projectType: ProjectType,
  scope: z.array(Scope).min(1, "Select at least one service."),
  scopeNotes: z.string().max(2000).optional(),
  dimensions: z.string().max(500).optional(),
  budgetBand: BudgetBand,
  timeline: Timeline,
  name: z.string().min(2, "Name is required."),
  company: z.string().optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, "Enter a valid phone number."),
  email: z.string().email("Enter a valid email."),
  whatsappOptIn: z.boolean().default(false),
  sourceProductSlug: z.string().optional(),
  sourcePage: z.string().optional(),
  locale: z.enum(["ar", "en"]),
});

export type QuoteInput = z.infer<typeof quoteSchema>;

// Per-step subschemas (Stepper uses these to validate one step at a time)
export const stepSchemas = {
  type: quoteSchema.pick({ projectType: true }),
  scope: quoteSchema.pick({ scope: true, scopeNotes: true }),
  dimensions: quoteSchema.pick({ dimensions: true }),
  budget: quoteSchema.pick({ budgetBand: true }),
  timeline: quoteSchema.pick({ timeline: true }),
  contact: quoteSchema.pick({
    name: true,
    company: true,
    phone: true,
    email: true,
    whatsappOptIn: true,
  }),
};
```

- [ ] **Step 2: Create the reference generator**

`src/lib/quote/reference.ts`:

```ts
// ENQ-2026-####. Counter persists in Payload Enquiries (uniqueness enforced),
// so we generate optimistically and retry on collision.

export function generateReference(year = new Date().getUTCFullYear()): string {
  const random = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
  return `ENQ-${year}-${random}`;
}
```

- [ ] **Step 3: Write a quick test**

`src/lib/quote/__tests__/reference.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { generateReference } from "../reference";

describe("generateReference", () => {
  it("matches ENQ-YYYY-NNNN", () => {
    expect(generateReference(2026)).toMatch(/^ENQ-2026-\d{4}$/);
  });

  it("randomizes the suffix", () => {
    const refs = new Set(Array.from({ length: 50 }, () => generateReference(2026)));
    expect(refs.size).toBeGreaterThan(40);
  });
});
```

- [ ] **Step 4: Run tests**

Run: `npm test -- reference`
Expected: green.

- [ ] **Step 5: Commit**

```bash
git add src/lib/schemas src/lib/quote
git commit -m "feat(quote): zod schema + reference generator + tests"
```

---

## Task 3: Quote submission API route

**Files:**
- Create: `src/app/api/quote/route.ts`
- Create: `src/lib/email/resend.ts`
- Create: `src/lib/email/templates/enquiry-receipt.tsx`
- Create: `src/lib/email/templates/sales-notification.tsx`

- [ ] **Step 1: Create the Resend client wrapper**

`src/lib/email/resend.ts`:

```ts
import { Resend } from "resend";

let cached: Resend | null = null;

export function resend(): Resend {
  if (!cached) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not set");
    cached = new Resend(key);
  }
  return cached;
}

export const FROM_EMAIL = () => process.env.RESEND_FROM_EMAIL ?? "no-reply@steelvalley.example";
export const SALES_EMAIL = () => process.env.RESEND_SALES_EMAIL ?? "sales@steelvalley.example";
```

- [ ] **Step 2: Create email templates (server components — react-email-compatible)**

`src/lib/email/templates/enquiry-receipt.tsx`:

```tsx
import type { QuoteInput } from "@/lib/schemas/quote";

interface Props {
  reference: string;
  quote: QuoteInput;
}

export function EnquiryReceipt({ reference, quote }: Props) {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", color: "#0a0a0b", padding: "24px" }}>
      <h1 style={{ marginBottom: 8 }}>Thanks, {quote.name}.</h1>
      <p>We've received your enquiry. Reference: <strong>{reference}</strong></p>
      <p>Our team typically replies within one business day.</p>
      <hr />
      <p>Summary:</p>
      <ul>
        <li>Project type: {quote.projectType}</li>
        <li>Scope: {quote.scope.join(", ")}</li>
        {quote.dimensions ? <li>Dimensions / quantity: {quote.dimensions}</li> : null}
        <li>Budget band: {quote.budgetBand}</li>
        <li>Timeline: {quote.timeline}</li>
      </ul>
      <p>— Steel Valley, Jeddah</p>
    </div>
  );
}
```

`src/lib/email/templates/sales-notification.tsx`:

```tsx
import type { QuoteInput } from "@/lib/schemas/quote";

interface Props {
  reference: string;
  quote: QuoteInput;
}

export function SalesNotification({ reference, quote }: Props) {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", color: "#0a0a0b" }}>
      <h2>New enquiry — {reference}</h2>
      <p><strong>Name:</strong> {quote.name}</p>
      <p><strong>Company:</strong> {quote.company ?? "—"}</p>
      <p><strong>Phone:</strong> {quote.phone}</p>
      <p><strong>Email:</strong> {quote.email}</p>
      <p><strong>WhatsApp opt-in:</strong> {quote.whatsappOptIn ? "yes" : "no"}</p>
      <hr />
      <p><strong>Project type:</strong> {quote.projectType}</p>
      <p><strong>Scope:</strong> {quote.scope.join(", ")}</p>
      {quote.scopeNotes ? <p><strong>Notes:</strong> {quote.scopeNotes}</p> : null}
      <p><strong>Dimensions:</strong> {quote.dimensions ?? "—"}</p>
      <p><strong>Budget:</strong> {quote.budgetBand}</p>
      <p><strong>Timeline:</strong> {quote.timeline}</p>
      <p><strong>Locale:</strong> {quote.locale}</p>
      <p><strong>Source product:</strong> {quote.sourceProductSlug ?? "—"}</p>
      <p><strong>Source page:</strong> {quote.sourcePage ?? "—"}</p>
    </div>
  );
}
```

- [ ] **Step 3: Create the route handler**

`src/app/api/quote/route.ts`:

```ts
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { quoteSchema } from "@/lib/schemas/quote";
import { generateReference } from "@/lib/quote/reference";
import { resend, FROM_EMAIL, SALES_EMAIL } from "@/lib/email/resend";
import { EnquiryReceipt } from "@/lib/email/templates/enquiry-receipt";
import { SalesNotification } from "@/lib/email/templates/sales-notification";

export const runtime = "nodejs";

const MAX_REF_ATTEMPTS = 5;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid", issues: parsed.error.issues }, { status: 400 });
  }

  const quote = parsed.data;
  const payload = await getPayload({ config });

  // Resolve source product (if slug was provided)
  let sourceProductId: string | undefined;
  if (quote.sourceProductSlug) {
    const found = await payload.find({
      collection: "products",
      where: { slug: { equals: quote.sourceProductSlug } },
      limit: 1,
    });
    sourceProductId = found.docs[0]?.id;
  }

  // Generate a unique reference, retry on collision
  let reference = generateReference();
  let attempt = 0;
  while (attempt < MAX_REF_ATTEMPTS) {
    try {
      await payload.create({
        collection: "enquiries",
        data: {
          reference,
          status: "new",
          projectType: quote.projectType,
          scope: quote.scope,
          scopeNotes: quote.scopeNotes,
          dimensions: quote.dimensions,
          budgetBand: quote.budgetBand,
          timeline: quote.timeline,
          name: quote.name,
          company: quote.company,
          phone: quote.phone,
          email: quote.email,
          whatsappOptIn: quote.whatsappOptIn,
          locale: quote.locale,
          sourcePage: quote.sourcePage,
          sourceProduct: sourceProductId,
        },
      });
      break;
    } catch (err) {
      // Postgres unique violation → 23505. Pragma differs by adapter; use string match.
      const message = err instanceof Error ? err.message : String(err);
      if (/unique|23505|reference/i.test(message) && attempt < MAX_REF_ATTEMPTS - 1) {
        reference = generateReference();
        attempt++;
        continue;
      }
      payload.logger.error({ err }, "Failed to create enquiry");
      return NextResponse.json({ error: "server" }, { status: 500 });
    }
  }

  // Fire-and-log emails — failure does NOT roll back the enquiry (user gets reference regardless)
  try {
    await resend().emails.send({
      from: FROM_EMAIL(),
      to: quote.email,
      subject: `Steel Valley — Enquiry ${reference}`,
      react: EnquiryReceipt({ reference, quote }),
    });
  } catch (err) {
    payload.logger.warn({ err, reference }, "Receipt email failed (enquiry saved)");
  }

  try {
    await resend().emails.send({
      from: FROM_EMAIL(),
      to: SALES_EMAIL(),
      subject: `[Enquiry] ${reference} — ${quote.projectType}`,
      react: SalesNotification({ reference, quote }),
      replyTo: quote.email,
    });
  } catch (err) {
    payload.logger.warn({ err, reference }, "Sales notification failed (enquiry saved)");
  }

  return NextResponse.json({ reference }, { status: 201 });
}
```

- [ ] **Step 4: Smoke test the route**

Run: `npm run dev`

In another shell:

```bash
curl -sS -X POST http://localhost:3000/api/quote \
  -H "Content-Type: application/json" \
  -d '{
    "projectType":"restaurant",
    "scope":["kitchen"],
    "budgetBand":"50to150k",
    "timeline":"1to3",
    "name":"Test User",
    "phone":"+9665555000123",
    "email":"test@example.com",
    "whatsappOptIn":false,
    "locale":"ar"
  }'
```

Expected: `{"reference":"ENQ-2026-NNNN"}` with status 201.

Verify in `/admin/collections/enquiries` — the record appears.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/quote src/lib/email src/lib/quote
git commit -m "feat(quote): POST /api/quote with validation, unique ref retry, Resend emails

- Receipt to enquirer + notification to sales
- Email failures do not roll back the enquiry"
```

---

## Task 4: Quote Builder UI

**Files:**
- Create: `src/components/forms/QuoteBuilder.tsx`
- Create: `src/components/forms/QuoteBuilder.steps.tsx`
- Create: `src/app/[locale]/contact/page.tsx`
- Create: `src/app/[locale]/contact/thanks/page.tsx`

- [ ] **Step 1: Create the step components**

`src/components/forms/QuoteBuilder.steps.tsx`:

```tsx
"use client";
import { useFormContext } from "react-hook-form";
import type { QuoteInput } from "@/lib/schemas/quote";
import { Field, Input, Textarea, RadioGroup, RadioCard, Select, SelectTrigger, SelectContent, SelectItem, SelectValue, Checkbox } from "@/ds/components";

export function StepType() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<QuoteInput>();
  const value = watch("projectType");
  return (
    <fieldset>
      <legend>Project type</legend>
      <RadioGroup value={value} onValueChange={(v) => setValue("projectType", v as QuoteInput["projectType"], { shouldValidate: true })}>
        <RadioCard value="restaurant" title="Restaurant fit-out" description="Cooking lines, prep tables, hoods, workstations." />
        <RadioCard value="hotel" title="Hotel kitchen" description="Banquet, room-service, staff dining." />
        <RadioCard value="hospital" title="Hospital" description="Sterile, medical-grade fabrication." />
        <RadioCard value="decorative" title="Decorative" description="Cladding, railings, feature pieces." />
        <RadioCard value="other" title="Other" description="Describe in the next step." />
      </RadioGroup>
      {errors.projectType ? <small role="alert">{errors.projectType.message}</small> : null}
    </fieldset>
  );
}

export function StepScope() {
  const { watch, setValue, register, formState: { errors } } = useFormContext<QuoteInput>();
  const scope = watch("scope") ?? [];
  const toggle = (v: QuoteInput["scope"][number]) => {
    setValue("scope", scope.includes(v) ? scope.filter((s) => s !== v) : [...scope, v], { shouldValidate: true });
  };
  return (
    <fieldset>
      <legend>Scope</legend>
      {(["railing", "cladding", "kitchen", "decorative"] as const).map((v) => (
        <label key={v} style={{ display: "flex", gap: "0.5rem" }}>
          <Checkbox checked={scope.includes(v)} onCheckedChange={() => toggle(v)} />
          {v}
        </label>
      ))}
      {errors.scope ? <small role="alert">{errors.scope.message}</small> : null}
      <Field label="Notes (optional)">
        {({ inputId, describedBy }) => <Textarea id={inputId} aria-describedby={describedBy} {...register("scopeNotes")} />}
      </Field>
    </fieldset>
  );
}

export function StepDimensions() {
  const { register } = useFormContext<QuoteInput>();
  return (
    <Field label="Dimensions / quantity (optional)" help="e.g. 12m railing across 3 floors; 4 cooking stations.">
      {({ inputId, describedBy }) => <Input id={inputId} aria-describedby={describedBy} {...register("dimensions")} />}
    </Field>
  );
}

export function StepBudget() {
  const { watch, setValue } = useFormContext<QuoteInput>();
  const value = watch("budgetBand");
  return (
    <Field label="Budget band">
      {() => (
        <Select value={value} onValueChange={(v) => setValue("budgetBand", v as QuoteInput["budgetBand"], { shouldValidate: true })}>
          <SelectTrigger><SelectValue placeholder="Choose…" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="lt50k">Less than 50K SAR</SelectItem>
            <SelectItem value="50to150k">50K – 150K SAR</SelectItem>
            <SelectItem value="150to500k">150K – 500K SAR</SelectItem>
            <SelectItem value="gt500k">More than 500K SAR</SelectItem>
            <SelectItem value="skip">Prefer not to say</SelectItem>
          </SelectContent>
        </Select>
      )}
    </Field>
  );
}

export function StepTimeline() {
  const { watch, setValue } = useFormContext<QuoteInput>();
  const value = watch("timeline");
  return (
    <Field label="Timeline">
      {() => (
        <RadioGroup value={value} onValueChange={(v) => setValue("timeline", v as QuoteInput["timeline"], { shouldValidate: true })}>
          <RadioCard value="now" title="Now" />
          <RadioCard value="1to3" title="1–3 months" />
          <RadioCard value="3to6" title="3–6 months" />
          <RadioCard value="planning" title="Planning" />
        </RadioGroup>
      )}
    </Field>
  );
}

export function StepContact() {
  const { register, formState: { errors } } = useFormContext<QuoteInput>();
  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <Field label="Name" required error={errors.name?.message}>
        {({ inputId, describedBy }) => <Input id={inputId} aria-describedby={describedBy} {...register("name")} />}
      </Field>
      <Field label="Company">
        {({ inputId, describedBy }) => <Input id={inputId} aria-describedby={describedBy} {...register("company")} />}
      </Field>
      <Field label="Phone" required error={errors.phone?.message}>
        {({ inputId, describedBy }) => <Input id={inputId} aria-describedby={describedBy} {...register("phone")} type="tel" />}
      </Field>
      <Field label="Email" required error={errors.email?.message}>
        {({ inputId, describedBy }) => <Input id={inputId} aria-describedby={describedBy} {...register("email")} type="email" />}
      </Field>
      <label style={{ display: "flex", gap: "0.5rem" }}>
        <input type="checkbox" {...register("whatsappOptIn")} />
        Contact me via WhatsApp
      </label>
    </div>
  );
}
```

- [ ] **Step 2: Create the orchestrator**

`src/components/forms/QuoteBuilder.tsx`:

```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Form } from "@/ds/components/Form";
import { Stepper, StepperStep, StepperProgress, useStepper } from "@/ds/components/Stepper";
import { Button } from "@/ds/components/Button";
import { quoteSchema, type QuoteInput } from "@/lib/schemas/quote";
import {
  StepType,
  StepScope,
  StepDimensions,
  StepBudget,
  StepTimeline,
  StepContact,
} from "./QuoteBuilder.steps";

interface Props {
  sourceProductSlug?: string;
}

function StepNav({ onSubmit, isSubmitting }: { onSubmit: () => void; isSubmitting: boolean }) {
  const { current, total, goNext, goPrev } = useStepper();
  const isLast = current === total - 1;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
      <Button variant="ghost" onClick={goPrev} disabled={current === 0}>
        Previous
      </Button>
      {isLast ? (
        <Button onClick={onSubmit} loading={isSubmitting}>
          Submit enquiry
        </Button>
      ) : (
        <Button onClick={goNext}>Next</Button>
      )}
    </div>
  );
}

export function QuoteBuilder({ sourceProductSlug }: Props) {
  const locale = useLocale() as QuoteInput["locale"];
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: QuoteInput) => {
    setSubmitting(true);
    setError(null);
    try {
      const payload: QuoteInput = {
        ...values,
        locale,
        sourceProductSlug,
        sourcePage: typeof window !== "undefined" ? window.location.pathname : undefined,
      };
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Server ${res.status}`);
      const { reference } = await res.json();
      router.push(`/${locale === "ar" ? "" : "en/"}contact/thanks?ref=${encodeURIComponent(reference)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
      setSubmitting(false);
    }
  };

  return (
    <Form schema={quoteSchema} onSubmit={handleSubmit} defaultValues={{ locale, scope: [] }}>
      <Stepper steps={6} syncHash="step">
        <StepperProgress />

        <StepperStep index={0}><StepType /></StepperStep>
        <StepperStep index={1}><StepScope /></StepperStep>
        <StepperStep index={2}><StepDimensions /></StepperStep>
        <StepperStep index={3}><StepBudget /></StepperStep>
        <StepperStep index={4}><StepTimeline /></StepperStep>
        <StepperStep index={5}><StepContact /></StepperStep>

        <StepNav
          isSubmitting={submitting}
          onSubmit={() => {
            const form = document.querySelector<HTMLFormElement>("form[data-component='form']");
            form?.requestSubmit();
          }}
        />
        {error ? <small role="alert">{error}</small> : null}
      </Stepper>
    </Form>
  );
}
```

- [ ] **Step 3: Create the contact page**

`src/app/[locale]/contact/page.tsx`:

```tsx
import { setRequestLocale } from "next-intl/server";
import { QuoteBuilder } from "@/components/forms/QuoteBuilder";

export default function ContactPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { product?: string };
}) {
  setRequestLocale(params.locale);
  return (
    <main id="main-content" style={{ padding: "2rem", maxWidth: "720px", margin: "0 auto" }}>
      <h1>let's measure the space.</h1>
      <QuoteBuilder sourceProductSlug={searchParams.product} />
    </main>
  );
}
```

- [ ] **Step 4: Create the thanks page**

`src/app/[locale]/contact/thanks/page.tsx`:

```tsx
import { setRequestLocale } from "next-intl/server";

export default function ThanksPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { ref?: string };
}) {
  setRequestLocale(params.locale);
  const ref = searchParams.ref ?? "—";
  return (
    <main id="main-content" style={{ padding: "2rem" }}>
      <h1>Thanks. We're on it.</h1>
      <p>Your enquiry reference: <strong>{ref}</strong></p>
      <p>Expect a reply within one business day.</p>
    </main>
  );
}
```

- [ ] **Step 5: Verify end-to-end**

`npm run dev`. Visit `/contact`. Walk through 6 steps, submit. Lands on `/contact/thanks?ref=ENQ-2026-NNNN`. Confirm Payload has the row.

- [ ] **Step 6: Commit**

```bash
git add src/components/forms src/app/\[locale\]/contact
git commit -m "feat(quote): Quote Builder UI (6-step Stepper, hash-synced, ARIA, locale-aware)"
```

---

## Task 5: Per-product Enquire CTA

**Files:**
- Create: `src/components/products/ProductEnquireCTA.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";
import { Link } from "@/ds/components/Link";
import { Button } from "@/ds/components/Button";
import { useLocale, useTranslations } from "next-intl";

interface Props {
  productSlug: string;
  productName: string;
}

export function ProductEnquireCTA({ productSlug, productName }: Props) {
  const t = useTranslations("Common");
  const locale = useLocale();
  const base = locale === "ar" ? "/contact" : "/en/contact";
  const href = `${base}?product=${encodeURIComponent(productSlug)}#step-1`;
  return (
    <Link href={href} variant="cta" aria-label={`${t("enquire")} — ${productName}`}>
      <Button>{t("enquire")}</Button>
    </Link>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/products
git commit -m "feat(quote): per-product Enquire CTA links to Quote Builder with source product"
```

---

## Task 6: Lead-magnet popup (exit-intent + scroll + dwell)

**Files:**
- Create: `src/lib/hooks/useLeadMagnetTriggers.ts`
- Create: `src/components/marketing/LeadMagnetPopup.tsx`
- Create: `src/app/api/lead/route.ts`
- Create: `src/lib/email/templates/lead-magnet-delivery.tsx`

- [ ] **Step 1: Create the trigger hook**

`src/lib/hooks/useLeadMagnetTriggers.ts`:

```ts
"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "sv-lead-shown";
const SUPPRESS_PATHS = ["/contact", "/admin"];

export function useLeadMagnetTriggers(): boolean {
  const [shouldShow, setShouldShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (SUPPRESS_PATHS.some((p) => pathname.startsWith(p))) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY) === "1") return;

    let dwellTimer: ReturnType<typeof setTimeout>;
    let scrollHandler: () => void;
    let exitHandler: (e: MouseEvent) => void;

    const trigger = (reason: string) => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setShouldShow(true);
      cleanup();
      window.dispatchEvent(new CustomEvent("sv:lead-magnet-shown", { detail: { reason } }));
    };

    dwellTimer = setTimeout(() => trigger("dwell-90s"), 90_000);

    scrollHandler = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (total > 0 && scrolled / total >= 0.6) trigger("scroll-60");
    };
    window.addEventListener("scroll", scrollHandler, { passive: true });

    exitHandler = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger("exit-intent");
    };
    document.addEventListener("mouseout", exitHandler);

    function cleanup() {
      clearTimeout(dwellTimer);
      window.removeEventListener("scroll", scrollHandler);
      document.removeEventListener("mouseout", exitHandler);
    }
    return cleanup;
  }, [pathname]);

  return shouldShow;
}
```

- [ ] **Step 2: Create the popup component**

`src/components/marketing/LeadMagnetPopup.tsx`:

```tsx
"use client";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Dialog, DialogContent } from "@/ds/components/Dialog";
import { Field, Input, Button } from "@/ds/components";
import { useLeadMagnetTriggers } from "@/lib/hooks/useLeadMagnetTriggers";
import { z } from "zod";

const emailSchema = z.string().email();

export function LeadMagnetPopup() {
  const shouldShow = useLeadMagnetTriggers();
  const t = useTranslations("Common");
  const locale = useLocale() as "ar" | "en";
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  if (shouldShow && !open && state === "idle") setOpen(true);

  const submit = async () => {
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError("Enter a valid email.");
      return;
    }
    setState("submitting");
    setError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "lead-magnet-popup",
          locale,
          sourcePage: window.location.pathname,
        }),
      });
      if (!res.ok) throw new Error(`Server ${res.status}`);
      setState("done");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Submission failed.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        title="The Commercial Kitchen Buyer's Guide"
        description="20 years of lessons from Jeddah's top restaurants. Bilingual PDF."
      >
        {state === "done" ? (
          <p>Check your inbox — the guide is on its way.</p>
        ) : (
          <>
            <Field label="Email" required error={error ?? undefined}>
              {({ inputId, describedBy }) => (
                <Input
                  id={inputId}
                  aria-describedby={describedBy}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              )}
            </Field>
            <Button onClick={submit} loading={state === "submitting"}>
              Send me the guide
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 3: Create the lead-magnet delivery email template**

`src/lib/email/templates/lead-magnet-delivery.tsx`:

```tsx
interface Props {
  signedUrl: string;
  locale: "ar" | "en";
}

export function LeadMagnetDelivery({ signedUrl, locale }: Props) {
  const dir = locale === "ar" ? "rtl" : "ltr";
  return (
    <div dir={dir} style={{ fontFamily: "system-ui, sans-serif", color: "#0a0a0b", padding: "24px" }}>
      <h1>The Commercial Kitchen Buyer's Guide</h1>
      <p>20 years of lessons from Jeddah's top restaurants — yours to keep.</p>
      <p>
        <a href={signedUrl} style={{ color: "#e2611b" }}>
          Download the PDF
        </a>
      </p>
      <p style={{ fontSize: "12px", color: "#666" }}>This link expires in 7 days.</p>
      <p>— Steel Valley, Jeddah</p>
    </div>
  );
}
```

- [ ] **Step 4: Create the API route**

`src/app/api/lead/route.ts`:

```ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { getPayload } from "payload";
import config from "@payload-config";
import { resend, FROM_EMAIL } from "@/lib/email/resend";
import { LeadMagnetDelivery } from "@/lib/email/templates/lead-magnet-delivery";

export const runtime = "nodejs";

const leadSchema = z.object({
  email: z.string().email(),
  source: z.enum(["lead-magnet-popup", "blog-footer", "other"]),
  locale: z.enum(["ar", "en"]),
  sourcePage: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const lead = parsed.data;
  const payload = await getPayload({ config });

  // Idempotent insert — if email exists, update sourcePage and re-send the PDF
  const existing = await payload.find({
    collection: "leads",
    where: { email: { equals: lead.email } },
    limit: 1,
  });
  let id: string;
  if (existing.docs[0]) {
    id = existing.docs[0].id;
    await payload.update({
      collection: "leads",
      id,
      data: { sourcePage: lead.sourcePage, source: lead.source, locale: lead.locale },
    });
  } else {
    const created = await payload.create({
      collection: "leads",
      data: { email: lead.email, source: lead.source, locale: lead.locale, sourcePage: lead.sourcePage },
    });
    id = created.id;
  }

  // Resolve active lead magnet for the locale
  const magnet = await payload.find({
    collection: "lead-magnets",
    where: { locale: { equals: lead.locale }, active: { equals: true } },
    limit: 1,
  });
  const file = magnet.docs[0];
  if (!file?.url) {
    payload.logger.warn({ id, locale: lead.locale }, "No active lead magnet — lead saved, no delivery");
    return NextResponse.json({ ok: true, delivered: false });
  }

  // For now: use Payload media URL. When bucket is private, swap to a Supabase signed URL.
  const downloadUrl = file.url;

  try {
    await resend().emails.send({
      from: FROM_EMAIL(),
      to: lead.email,
      subject: lead.locale === "ar" ? "دليلك من ستيل فالي" : "Your Steel Valley guide",
      react: LeadMagnetDelivery({ signedUrl: downloadUrl, locale: lead.locale }),
    });
    await payload.update({ collection: "leads", id, data: { delivered: true, deliveredAt: new Date().toISOString() } });
  } catch (err) {
    payload.logger.warn({ err, id }, "Lead magnet email failed");
    return NextResponse.json({ ok: true, delivered: false });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
```

> **Follow-up:** when the real PDF replaces the placeholder, change the `lead-magnets` bucket to private and swap `downloadUrl` for a `supabase.storage.from('lead-magnets').createSignedUrl(path, 604800)` call (7-day signed URL). Track this in `docs/prep-status.md`.

- [ ] **Step 5: Mount the popup in the locale layout**

Edit `src/app/[locale]/layout.tsx`. Add the import and mount inside `<NextIntlClientProvider>`:

```tsx
import { LeadMagnetPopup } from "@/components/marketing/LeadMagnetPopup";

// inside the provider, after {children}:
<LeadMagnetPopup />
```

- [ ] **Step 6: Manual verify**

`npm run dev`. Visit `/`. Scroll past 60% → popup fires. Submit email → confirmation appears.

Check Payload `Leads` collection — row exists.

- [ ] **Step 7: Commit**

```bash
git add src/lib/hooks/useLeadMagnetTriggers.ts src/components/marketing src/app/api/lead src/lib/email/templates/lead-magnet-delivery.tsx src/app/\[locale\]/layout.tsx
git commit -m "feat(lead-magnet): popup with exit-intent + scroll + dwell triggers, Resend delivery"
```

---

## Task 7: WhatsApp floating CTA

**Files:**
- Create: `src/components/marketing/WhatsAppCTA.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";
import { usePathname } from "next/navigation";

const SUPPRESS_PATHS = ["/admin"];

export function WhatsAppCTA() {
  const pathname = usePathname();
  if (SUPPRESS_PATHS.some((p) => pathname.startsWith(p))) return null;

  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!phone) return null;
  const cleanPhone = phone.replace(/\D/g, "");

  const message =
    typeof window !== "undefined"
      ? `Hi Steel Valley — I'm on ${window.location.pathname}, would like to talk to a fabricator.`
      : "Hi Steel Valley.";

  const href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  const onClick = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("sv:whatsapp-click", { detail: { path: window.location.pathname } }));
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Steel Valley on WhatsApp"
      onClick={onClick}
      data-component="whatsapp-cta"
      style={{
        position: "fixed",
        bottom: "1rem",
        insetInlineEnd: "1rem",
        zIndex: 40,
        background: "var(--color-rust)",
        color: "white",
        padding: "0.75rem 1rem",
        borderRadius: "9999px",
      }}
    >
      WhatsApp
    </a>
  );
}
```

`insetInlineEnd` is the logical property — bottom-right in LTR, bottom-left in RTL.

- [ ] **Step 2: Mount in locale layout**

In `src/app/[locale]/layout.tsx`, add after the popup mount:

```tsx
import { WhatsAppCTA } from "@/components/marketing/WhatsAppCTA";
<WhatsAppCTA />
```

- [ ] **Step 3: Commit**

```bash
git add src/components/marketing/WhatsAppCTA.tsx src/app/\[locale\]/layout.tsx
git commit -m "feat(conversion): WhatsApp floating CTA (env-driven, logical positioning, /admin suppressed)"
```

---

## Task 8: next-seo defaults + per-page overrides

**Files:**
- Create: `src/lib/seo/defaults.ts`
- Create: `src/lib/seo/buildMetadata.ts`

- [ ] **Step 1: Create defaults**

`src/lib/seo/defaults.ts`:

```ts
export const SITE_NAME = "Steel Valley";
export const SITE_URL = process.env.PAYLOAD_PUBLIC_SERVER_URL ?? "https://steelvalley.example";

export const seoDefaults = {
  ar: {
    title: "ستيل فالي — تصنيع الفولاذ المقاوم للصدأ في جدة",
    description:
      "أكثر من 20 عاماً في تصنيع المطابخ التجارية والديكورات الفولاذية للمطاعم والفنادق والمستشفيات في جدة والمملكة العربية السعودية.",
  },
  en: {
    title: "Steel Valley — Stainless Steel Fabrication, Jeddah",
    description:
      "20+ years building commercial kitchens, hand railings, column cladding, and decorative steel for restaurants, hotels, and hospitals across Saudi Arabia.",
  },
};
```

- [ ] **Step 2: Create the metadata builder**

`src/lib/seo/buildMetadata.ts`:

```ts
import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, seoDefaults } from "./defaults";

interface Args {
  locale: "ar" | "en";
  title?: string;
  description?: string;
  path: string; // e.g. "/products/workstation"
  ogImage?: string;
}

export function buildMetadata({ locale, title, description, path, ogImage }: Args): Metadata {
  const d = seoDefaults[locale];
  const fullTitle = title ? `${title} — ${SITE_NAME}` : d.title;
  const desc = description ?? d.description;

  const canonical = `${SITE_URL}${locale === "ar" ? "" : "/en"}${path}`;
  const arAlt = `${SITE_URL}${path}`;
  const enAlt = `${SITE_URL}/en${path}`;
  const ogUrl = ogImage ?? `${SITE_URL}/og?title=${encodeURIComponent(title ?? d.title)}&locale=${locale}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: fullTitle,
    description: desc,
    alternates: {
      canonical,
      languages: { ar: arAlt, en: enAlt, "x-default": arAlt },
    },
    openGraph: {
      title: fullTitle,
      description: desc,
      type: "website",
      locale: locale === "ar" ? "ar_SA" : "en_US",
      url: canonical,
      siteName: SITE_NAME,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [ogUrl],
    },
  };
}
```

- [ ] **Step 3: Use it in the locale layout's `generateMetadata`**

Edit `src/app/[locale]/layout.tsx`. Remove the static `export const metadata = ...`, replace with:

```tsx
import { buildMetadata } from "@/lib/seo/buildMetadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safe = (locale === "ar" || locale === "en") ? locale : "ar";
  return buildMetadata({ locale: safe, path: "/" });
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/seo src/app/\[locale\]/layout.tsx
git commit -m "feat(seo): default metadata + hreflang + OG via buildMetadata helper"
```

---

## Task 9: JSON-LD helpers + render component

**Files:**
- Create: `src/lib/seo/jsonld.ts`
- Create: `src/components/seo/JsonLd.tsx`

- [ ] **Step 1: Create the JSON-LD builders**

`src/lib/seo/jsonld.ts`:

```ts
import { SITE_NAME, SITE_URL } from "./defaults";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [],
  };
}

export function localBusinessJsonLd(args: {
  phone?: string;
  email?: string;
  addressLocality?: string;
  addressRegion?: string;
  addressCountry?: string;
  latitude?: number;
  longitude?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    url: SITE_URL,
    telephone: args.phone,
    email: args.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: args.addressLocality ?? "Jeddah",
      addressRegion: args.addressRegion ?? "Makkah",
      addressCountry: args.addressCountry ?? "SA",
    },
    geo:
      args.latitude && args.longitude
        ? { "@type": "GeoCoordinates", latitude: args.latitude, longitude: args.longitude }
        : undefined,
    areaServed: "SA",
  };
}

export function productJsonLd(args: {
  name: string;
  description?: string;
  image?: string;
  slug: string;
  locale: "ar" | "en";
}) {
  const url = `${SITE_URL}${args.locale === "ar" ? "" : "/en"}/products/${args.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: args.name,
    description: args.description,
    image: args.image,
    url,
    brand: { "@type": "Brand", name: SITE_NAME },
  };
}

export function blogPostingJsonLd(args: {
  title: string;
  excerpt?: string;
  image?: string;
  slug: string;
  locale: "ar" | "en";
  authorName?: string;
  publishedAt?: string;
}) {
  const url = `${SITE_URL}${args.locale === "ar" ? "" : "/en"}/blog/${args.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: args.title,
    description: args.excerpt,
    image: args.image,
    mainEntityOfPage: url,
    author: args.authorName ? { "@type": "Person", name: args.authorName } : undefined,
    datePublished: args.publishedAt,
    publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` } },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
```

- [ ] **Step 2: Create the render component**

`src/components/seo/JsonLd.tsx` — implement using the standard Next.js JSON-LD pattern documented at https://nextjs.org/docs/app/guides/json-ld. The component takes a `data` prop, escapes `<` to `<` defensively, and renders a `<script type="application/ld+json">` tag with the serialized payload injected. Sanitization is unnecessary because the input is always our own server-built JSON (never user content) — but the `<` escape is a belt-and-braces measure against an upstream change that ever inlines a string with HTML.

Reference the linked Next docs for the exact shape — it's a single tiny component (~10 lines).

- [ ] **Step 3: Drop Organization + LocalBusiness on the home page**

Edit `src/app/[locale]/page.tsx` to include the JSON-LD scripts (this page is placeholder content until Claude Design lands — we're proving the pattern):

```tsx
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { LocaleToggle } from "@/components/i18n/LocaleToggle";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd, localBusinessJsonLd } from "@/lib/seo/jsonld";

export default function HomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = useTranslations("Nav");
  return (
    <main id="main-content" style={{ padding: "2rem" }}>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={localBusinessJsonLd({ phone: "+9661234567890", addressLocality: "Jeddah" })} />
      <h1>Steel Valley — {params.locale.toUpperCase()}</h1>
      <p>{t("home")}</p>
      <LocaleToggle />
    </main>
  );
}
```

- [ ] **Step 4: Verify in HTML source**

`npm run dev`. View source on `/`. Expected: two `<script type="application/ld+json">` blocks.

- [ ] **Step 5: Commit**

```bash
git add src/lib/seo/jsonld.ts src/components/seo src/app/\[locale\]/page.tsx
git commit -m "feat(seo): JSON-LD helpers + render component (Organization, LocalBusiness, Product, BlogPosting, Breadcrumb)"
```

---

## Task 10: Sitemaps + robots

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

- [ ] **Step 1: Create the sitemap**

`src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { getPayload } from "payload";
import config from "@payload-config";
import { SITE_URL } from "@/lib/seo/defaults";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config });

  const staticPaths = ["/", "/about", "/services", "/products", "/contact", "/blog", "/legal/privacy", "/legal/terms"];

  const [products, posts, services] = await Promise.all([
    payload.find({ collection: "products", limit: 500 }),
    payload.find({ collection: "posts", limit: 500, where: { _status: { equals: "published" } } }),
    payload.find({ collection: "services", limit: 50 }),
  ]);

  const productPaths = products.docs.map((p) => `/products/${p.slug}`);
  const servicePaths = services.docs.map((s) => `/services#${s.slug}`);
  const postPaths = posts.docs.map((p) => `/blog/${p.slug}`);

  const allPaths = [...staticPaths, ...productPaths, ...servicePaths, ...postPaths];

  return allPaths.flatMap((path) => [
    {
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          ar: `${SITE_URL}${path}`,
          en: `${SITE_URL}/en${path}`,
          "x-default": `${SITE_URL}${path}`,
        },
      },
    },
    {
      url: `${SITE_URL}/en${path}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          ar: `${SITE_URL}${path}`,
          en: `${SITE_URL}/en${path}`,
          "x-default": `${SITE_URL}${path}`,
        },
      },
    },
  ]);
}
```

- [ ] **Step 2: Create robots**

`src/app/robots.ts`:

```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/defaults";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/contact/thanks"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 3: Verify**

Visit `/sitemap.xml` and `/robots.txt`. Both should serve 200.

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts
git commit -m "feat(seo): sitemap.xml (hreflang per URL) + robots.txt"
```

---

## Task 11: OG image generation

**Files:**
- Create: `src/app/og/route.tsx`

- [ ] **Step 1: Create the route**

`src/app/og/route.tsx`:

```tsx
import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const title = url.searchParams.get("title") ?? "Steel Valley";
  const locale = url.searchParams.get("locale") === "en" ? "en" : "ar";
  const dir = locale === "ar" ? "rtl" : "ltr";

  return new ImageResponse(
    (
      <div
        dir={dir}
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0b",
          color: "#f2f0ec",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#c7cdd6", textTransform: "uppercase", letterSpacing: 2 }}>
          STEEL VALLEY
        </div>
        <div style={{ fontSize: 88, lineHeight: 1.05, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 24, color: "#e2611b", fontFamily: "monospace" }}>
          {locale === "ar" ? "صناعة الفولاذ — جدة" : "stainless steel fabrication — jeddah"}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
```

- [ ] **Step 2: Verify**

Visit `http://localhost:3000/og?title=Workstation&locale=ar` → returns a PNG.

- [ ] **Step 3: Commit**

```bash
git add src/app/og
git commit -m "feat(seo): OG image generation via next/og (bilingual, Refined Industrial palette)"
```

---

## Task 12: OpenPanel SDK + typed event taxonomy

**Files:**
- Create: `src/lib/analytics/events.ts`
- Create: `src/lib/analytics/openpanel.ts`
- Create: `src/components/analytics/EventBridge.tsx`

- [ ] **Step 1: Define the event taxonomy**

`src/lib/analytics/events.ts`:

```ts
export type SvEvent =
  | { name: "enquiry_started"; props: { source?: string; product?: string } }
  | { name: "enquiry_step_advanced"; props: { step: number } }
  | { name: "enquiry_submitted"; props: { reference: string; projectType: string; budgetBand: string } }
  | { name: "lead_magnet_shown"; props: { reason: "dwell-90s" | "scroll-60" | "exit-intent" } }
  | { name: "lead_magnet_captured"; props: { source: string } }
  | { name: "whatsapp_clicked"; props: { path: string } }
  | { name: "product_enquired"; props: { product: string } };
```

- [ ] **Step 2: Create the consent-aware client wrapper**

`src/lib/analytics/openpanel.ts`:

```ts
"use client";
import type { SvEvent } from "./events";

let consentGiven = false;

export function setAnalyticsConsent(value: boolean) {
  consentGiven = value;
  if (typeof window !== "undefined") {
    window.localStorage.setItem("sv-analytics-consent", value ? "1" : "0");
  }
}

export function getStoredConsent(): boolean | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("sv-analytics-consent");
  if (raw === "1") return true;
  if (raw === "0") return false;
  return null;
}

export function track<E extends SvEvent>(evt: E) {
  if (!consentGiven) return;
  if (typeof window === "undefined") return;
  // OpenPanel attaches a global op() once mounted
  const op = (window as unknown as { op?: (...args: unknown[]) => void }).op;
  op?.("track", evt.name, evt.props);
}
```

- [ ] **Step 3: Create the event bridge**

`src/components/analytics/EventBridge.tsx`:

```tsx
"use client";
import { useEffect } from "react";
import { track } from "@/lib/analytics/openpanel";

export function EventBridge() {
  useEffect(() => {
    const onLead = (e: Event) => {
      const reason = (e as CustomEvent).detail?.reason ?? "scroll-60";
      track({ name: "lead_magnet_shown", props: { reason } });
    };
    const onWa = (e: Event) => {
      const path = (e as CustomEvent).detail?.path ?? "/";
      track({ name: "whatsapp_clicked", props: { path } });
    };
    window.addEventListener("sv:lead-magnet-shown", onLead);
    window.addEventListener("sv:whatsapp-click", onWa);
    return () => {
      window.removeEventListener("sv:lead-magnet-shown", onLead);
      window.removeEventListener("sv:whatsapp-click", onWa);
    };
  }, []);
  return null;
}
```

- [ ] **Step 4: Commit (the mount happens in Task 13 after consent gate is in place)**

```bash
git add src/lib/analytics src/components/analytics/EventBridge.tsx
git commit -m "feat(analytics): OpenPanel consent-aware wrapper + typed event taxonomy + bridge"
```

---

## Task 13: PDPL-aware cookie banner + OpenPanel gate

**Files:**
- Create: `src/components/marketing/CookieBanner.tsx`
- Create: `src/components/analytics/OpenPanelGate.tsx`
- Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Create the banner**

`src/components/marketing/CookieBanner.tsx`:

```tsx
"use client";
import { useEffect, useState } from "react";
import { Button } from "@/ds/components";
import { setAnalyticsConsent, getStoredConsent } from "@/lib/analytics/openpanel";

export function CookieBanner() {
  const [decision, setDecision] = useState<boolean | null>(null);

  useEffect(() => {
    setDecision(getStoredConsent());
  }, []);

  if (decision !== null) return null;

  const accept = () => {
    setAnalyticsConsent(true);
    setDecision(true);
  };
  const reject = () => {
    setAnalyticsConsent(false);
    setDecision(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie preferences"
      data-component="cookie-banner"
      style={{
        position: "fixed",
        insetBlockEnd: 0,
        insetInline: 0,
        zIndex: 60,
        background: "var(--color-ink)",
        color: "var(--color-bone)",
        padding: "1rem",
        display: "flex",
        gap: "1rem",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <p style={{ margin: 0, maxWidth: "60ch" }}>
        We use a small set of analytics cookies (OpenPanel) to understand traffic. No third-party ad networks.
        Required for basic site function are always on.
      </p>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Button variant="ghost" onClick={reject}>Reject</Button>
        <Button onClick={accept}>Accept</Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the consent-gated OpenPanel mount**

`src/components/analytics/OpenPanelGate.tsx`:

```tsx
"use client";
import { useEffect, useState } from "react";
import { OpenPanelComponent } from "@openpanel/nextjs";
import { getStoredConsent, setAnalyticsConsent } from "@/lib/analytics/openpanel";

export function OpenPanelGate({ clientId }: { clientId: string }) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored === true) {
      setAnalyticsConsent(true);
      setAllowed(true);
    }
    const onStorage = () => {
      const v = getStoredConsent();
      setAllowed(v === true);
      if (v === true) setAnalyticsConsent(true);
    };
    window.addEventListener("storage", onStorage);

    // Also react to in-tab changes via a tiny custom event
    const onConsent = () => {
      const v = getStoredConsent();
      setAllowed(v === true);
    };
    window.addEventListener("sv:consent-change", onConsent);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("sv:consent-change", onConsent);
    };
  }, []);

  if (!allowed || !clientId) return null;
  return <OpenPanelComponent clientId={clientId} trackScreenViews />;
}
```

Also update `setAnalyticsConsent` in `src/lib/analytics/openpanel.ts` to dispatch the event:

```ts
export function setAnalyticsConsent(value: boolean) {
  consentGiven = value;
  if (typeof window !== "undefined") {
    window.localStorage.setItem("sv-analytics-consent", value ? "1" : "0");
    window.dispatchEvent(new CustomEvent("sv:consent-change", { detail: { value } }));
  }
}
```

- [ ] **Step 3: Mount everything in the locale layout**

Edit `src/app/[locale]/layout.tsx`. Inside `<NextIntlClientProvider>`, after `{children}`:

```tsx
import { LeadMagnetPopup } from "@/components/marketing/LeadMagnetPopup";
import { WhatsAppCTA } from "@/components/marketing/WhatsAppCTA";
import { CookieBanner } from "@/components/marketing/CookieBanner";
import { OpenPanelGate } from "@/components/analytics/OpenPanelGate";
import { EventBridge } from "@/components/analytics/EventBridge";

// after {children}:
<LeadMagnetPopup />
<WhatsAppCTA />
<CookieBanner />
<OpenPanelGate clientId={process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID ?? ""} />
<EventBridge />
```

- [ ] **Step 4: Commit**

```bash
git add src/components/marketing/CookieBanner.tsx src/components/analytics/OpenPanelGate.tsx src/lib/analytics/openpanel.ts src/app/\[locale\]/layout.tsx
git commit -m "feat(privacy): PDPL-aware cookie banner gates OpenPanel until consent"
```

---

## Task 14: Mid-scroll soft CTA

**Files:**
- Create: `src/components/marketing/MidScrollCTA.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";
import { Link } from "@/ds/components/Link";
import { useLocale } from "next-intl";

export function MidScrollCTA() {
  const locale = useLocale();
  const href = locale === "ar" ? "/contact" : "/en/contact";
  return (
    <aside
      data-component="mid-scroll-cta"
      style={{
        marginBlock: "4rem",
        padding: "1.5rem",
        background: "var(--color-graphite)",
        color: "var(--color-bone)",
        textAlign: "center",
      }}
    >
      <p style={{ fontFamily: "var(--font-mono)", marginBottom: "0.5rem" }}>
        usually replies in 30 min
      </p>
      <p style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        Talk to a fabricator.
      </p>
      <Link href={href}>Get a Quote</Link>
    </aside>
  );
}
```

Consumers drop it inline at ~60% scroll on Services and Product detail (Claude Design will specify exact placement).

- [ ] **Step 2: Commit**

```bash
git add src/components/marketing/MidScrollCTA.tsx
git commit -m "feat(conversion): MidScrollCTA component for Services and Product detail pages"
```

---

## Task 15: Airtable → Payload migration script

**Files:**
- Create: `scripts/migrate-airtable-to-payload.ts`
- Modify: `package.json` (add script)

- [ ] **Step 1: Inspect current Airtable usage**

Run: `grep -rn "getTableData\|airtable\|appNpL3dO0aG3DBH9" src/ utils/`

Identify which tables the legacy site uses (likely Products + Mask text).

- [ ] **Step 2: Create the script**

`scripts/migrate-airtable-to-payload.ts`:

```ts
import Airtable from "airtable";
import { getPayload } from "payload";
import config from "../src/payload.config";

const DRY_RUN = !process.argv.includes("--apply");

interface MigrationReport {
  succeeded: number;
  skipped: number;
  errored: { id: string; reason: string }[];
}

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) {
  console.error("AIRTABLE_BASE_ID and AIRTABLE_API_KEY must be set in .env.local");
  process.exit(1);
}

const at = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function migrateProducts(): Promise<MigrationReport> {
  const report: MigrationReport = { succeeded: 0, skipped: 0, errored: [] };
  const payload = await getPayload({ config });

  // Adjust the table name and field map to match the current Airtable schema.
  const records = await at("Products").select({}).all();

  for (const rec of records) {
    const name = (rec.get("Name") as string) ?? null;
    const slug = (rec.get("Slug") as string) ?? slugify(name ?? rec.id);
    if (!name) {
      report.errored.push({ id: rec.id, reason: "missing Name field" });
      continue;
    }

    // Idempotency
    const existing = await payload.find({
      collection: "products",
      where: { slug: { equals: slug } },
      limit: 1,
    });
    if (existing.totalDocs > 0) {
      report.skipped++;
      continue;
    }

    // Category resolution
    const categoryName = (rec.get("Category") as string) ?? "Storage";
    const categorySlug = slugify(categoryName);
    let categoryId: string | undefined;
    const cat = await payload.find({
      collection: "categories",
      where: { slug: { equals: categorySlug } },
      limit: 1,
    });
    categoryId = cat.docs[0]?.id;
    if (!categoryId) {
      if (!DRY_RUN) {
        const created = await payload.create({
          collection: "categories",
          data: { name: categoryName, slug: categorySlug },
          locale: "en",
        });
        categoryId = created.id;
      } else {
        categoryId = "<would-create>";
      }
    }

    const data = {
      name,
      slug,
      category: categoryId!,
      shortDescription: (rec.get("Short") as string) ?? undefined,
    };

    if (DRY_RUN) {
      console.log(`[dry-run] would create product: ${slug}`);
      report.succeeded++;
    } else {
      try {
        await payload.create({ collection: "products", data, locale: "en" });
        report.succeeded++;
      } catch (err) {
        report.errored.push({ id: rec.id, reason: err instanceof Error ? err.message : String(err) });
      }
    }
  }

  return report;
}

async function main() {
  console.log(`Migration mode: ${DRY_RUN ? "DRY RUN (pass --apply to write)" : "APPLY"}`);
  const products = await migrateProducts();
  console.log("Products:", products);
  console.log(`Errored ids:\n${products.errored.map((e) => `  ${e.id}: ${e.reason}`).join("\n") || "  (none)"}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 3: Add the script**

In `package.json`:

```json
"migrate:airtable": "tsx scripts/migrate-airtable-to-payload.ts"
```

- [ ] **Step 4: Run a dry-run**

```bash
npm run migrate:airtable
```

Expected: report counts logged. No data written to Payload.

> **Stop.** Show the dry-run report to the user before running with `--apply`. Confirm:
> 1. Field mapping is correct for the current Airtable schema.
> 2. If Arabic translations exist in Airtable, plan a second pass with `locale: "ar"`.
>
> Then run: `npm run migrate:airtable -- --apply`

- [ ] **Step 5: Commit**

```bash
git add scripts/migrate-airtable-to-payload.ts package.json package-lock.json
git commit -m "feat(migration): Airtable → Payload migration script (dry-run by default, idempotent)"
```

---

## Task 16: Extend e2e tests for conversion + SEO

**Files:**
- Create: `e2e/conversion.spec.ts`
- Create: `e2e/seo.spec.ts`

- [ ] **Step 1: Conversion e2e**

`e2e/conversion.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("Quote API: validation rejects missing required fields", async ({ request }) => {
  const res = await request.post("/api/quote", { data: { projectType: "restaurant" } });
  expect(res.status()).toBe(400);
});

test("Quote API: full valid payload returns reference", async ({ request }) => {
  const res = await request.post("/api/quote", {
    data: {
      projectType: "restaurant",
      scope: ["kitchen"],
      budgetBand: "50to150k",
      timeline: "1to3",
      name: "E2E User",
      phone: "+966555000123",
      email: "e2e@example.com",
      whatsappOptIn: false,
      locale: "ar",
    },
  });
  expect(res.status()).toBe(201);
  const body = await res.json();
  expect(body.reference).toMatch(/^ENQ-\d{4}-\d{4}$/);
});

test("Lead API: rejects invalid email", async ({ request }) => {
  const res = await request.post("/api/lead", {
    data: { email: "not-an-email", source: "lead-magnet-popup", locale: "ar" },
  });
  expect(res.status()).toBe(400);
});

test("WhatsApp CTA appears on locale routes", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('[data-component="whatsapp-cta"]')).toBeVisible();
});

test("WhatsApp CTA does not appear on /admin", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.locator('[data-component="whatsapp-cta"]')).toHaveCount(0);
});
```

- [ ] **Step 2: SEO e2e**

`e2e/seo.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("/ has JSON-LD Organization + LocalBusiness", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.status()).toBe(200);
  const html = await page.content();
  expect(html).toContain('"@type":"Organization"');
  expect(html).toContain('"@type":"LocalBusiness"');
});

test("/ has hreflang ar + en + x-default", async ({ page }) => {
  await page.goto("/");
  const links = await page.locator('link[rel="alternate"][hreflang]').all();
  const hrefs = await Promise.all(links.map((l) => l.getAttribute("hreflang")));
  expect(hrefs).toEqual(expect.arrayContaining(["ar", "en", "x-default"]));
});

test("/sitemap.xml serves", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.status()).toBe(200);
  const text = await res.text();
  expect(text).toContain("<urlset");
});

test("/robots.txt disallows /admin", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.status()).toBe(200);
  const text = await res.text();
  expect(text).toContain("Disallow: /admin");
});

test("/og generates an image", async ({ request }) => {
  const res = await request.get("/og?title=Test&locale=en");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/");
});
```

- [ ] **Step 3: Run**

Run: `npm run test:e2e`
Expected: green.

- [ ] **Step 4: Commit**

```bash
git add e2e/conversion.spec.ts e2e/seo.spec.ts
git commit -m "test(e2e): conversion endpoints + SEO surfaces (sitemap, robots, JSON-LD, OG)"
```

---

## Task 17: Update prep-status.md

**Files:**
- Modify: `docs/prep-status.md`

- [ ] **Step 1: Update Plan 4 row**

```markdown
| 4 | Conversion + Discovery | ✅ complete | Quote builder, lead magnet, WhatsApp, SEO, OpenPanel (consent-gated), migration script |
```

Add to "What runs locally today":
- `POST /api/quote` accepting valid quote payloads
- `POST /api/lead` capturing emails into Payload Leads
- `/sitemap.xml`, `/robots.txt`, `/og?title=…&locale=ar`
- Cookie banner appears on first visit; OpenPanel mounts only after Accept
- `npm run migrate:airtable` dry-run

Remove from "What's waiting on user":
- Resend API key (now provided)
- OpenPanel client ID (now provided)
- WhatsApp number (now in env)

Add a TODO:
- "Switch lead-magnet PDF delivery to Supabase signed URLs when the real PDF replaces the placeholder."

- [ ] **Step 2: Commit + push**

```bash
git add docs/prep-status.md
git commit -m "docs(prep-status): mark Plan 4 complete"
git push origin redesign
```

---

## Plan 4 — done.

**End-state achieved:**
- Quote Builder UI at `/contact`: 6 steps, hash-synced, validates per step, drops into Payload `Enquiries` with unique reference.
- `/api/quote` issues receipt + sales notification via Resend.
- Per-product Enquire pre-fills the source product in the Builder.
- Lead-magnet popup triggers on dwell-90s / scroll-60% / exit-intent, once per session; submission writes to `Leads` and emails the PDF.
- WhatsApp floating CTA on every locale page (suppressed on `/admin`), prefilled with current page.
- next-seo defaults + hreflang + JSON-LD (Organization/LocalBusiness/Product/BlogPosting/Breadcrumb helpers).
- `sitemap.xml` covers all static + dynamic routes per locale.
- OG images via `next/og`, bilingual.
- OpenPanel client + typed event taxonomy, gated by PDPL cookie banner.
- Airtable → Payload migration script with dry-run-by-default.
- Conversion + SEO e2e tests green.

**Next:** Plan 5 — Performance scaffolding (PerfGate, dynamic-3D wrapper, font/image policy, Lighthouse + size-limit CI).
