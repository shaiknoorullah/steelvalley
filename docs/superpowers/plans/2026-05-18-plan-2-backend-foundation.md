# Steel Valley — Plan 2: Backend Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up Payload CMS v3 at `/admin` backed by Supabase Postgres + Supabase Storage, define every content collection from the spec, and add bilingual routing (Arabic default at `/`, English at `/en/*`) via next-intl.

**Architecture:** Payload v3 mounts as a route group inside the existing App Router scaffold from Plan 1. Two Payload tables: structured content (products/pages/posts) and operational data (enquiries/leads/users). Supabase provides Postgres (Payload's database) and Storage (Payload's media). next-intl provides locale routing and message catalogs. Payload's per-field localization fills in the actual translatable copy — message catalogs only hold UI chrome.

**Tech Stack:** Payload v3, `@payloadcms/db-postgres`, `@payloadcms/storage-s3`, `@payloadcms/richtext-lexical`, next-intl, Supabase Postgres + Storage.

**Spec reference:** `docs/superpowers/specs/2026-05-18-steelvalley-redesign.md` §4, §8, §11 Phase 2-3.

**Prerequisite:** Plan 1 complete. You are on the `redesign` branch with Next 15 + App Router scaffold.

**End-state test:**
1. `npm run dev` boots without errors.
2. Visit `http://localhost:3000/admin` → Payload login screen renders.
3. Log in with the seeded admin user → see all 9 collections + 2 globals in the sidebar.
4. Create a `Product` with English and Arabic name → both locales persist.
5. Visit `http://localhost:3000/` → redirects to `http://localhost:3000/ar` (Arabic default). HTML `<html lang="ar" dir="rtl">`.
6. Visit `http://localhost:3000/en` → renders with `<html lang="en" dir="ltr">`.
7. `npm test` passes (smoke tests for /admin and locale routing).

---

## Task 1: Create Supabase project (user-gated)

**Files:** none

- [ ] **Step 1: Confirm what's needed from the user**

Output:

```
SUPABASE ACTION REQUIRED:
1. Go to https://supabase.com/dashboard and create a project named "steelvalley".
2. Choose region "eu-central-1" (closest to KSA on Supabase's current map; we can revisit later).
3. Set a strong DB password — store it in your password manager.
4. Once the project is up, send me from Settings → API:
   - Project URL (NEXT_PUBLIC_SUPABASE_URL → SUPABASE_URL)
   - anon public key → SUPABASE_ANON_KEY
   - service_role key (KEEP THIS PRIVATE) → SUPABASE_SERVICE_ROLE_KEY
5. From Settings → Database → Connection string → Transaction pooler:
   - DATABASE_URL (with the password substituted in)
6. From Storage → Settings → S3 Connection:
   - Endpoint → SUPABASE_S3_ENDPOINT
   - Region → SUPABASE_S3_REGION
   - Create new S3 access keys → SUPABASE_S3_ACCESS_KEY_ID + SUPABASE_S3_SECRET_ACCESS_KEY
7. From Storage, create two buckets:
   - "media" (public)
   - "lead-magnets" (private)
```

Wait until user confirms project exists and provides credentials. Do not proceed until all values are pasted back.

- [ ] **Step 2: Update `.env.local` (NOT `.env.example`) with the supplied values**

Replace placeholder values in `.env.local`. Confirm shape with `grep -E '^(DATABASE_URL|SUPABASE_|PAYLOAD_)' .env.local` showing every key populated.

- [ ] **Step 3: Generate a Payload secret**

Run:

```bash
openssl rand -hex 32
```

Add the output to `.env.local`:

```
PAYLOAD_SECRET=<the 64-char hex string>
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
```

- [ ] **Step 4: No commit yet**

`.env.local` is git-ignored. Move on.

---

## Task 2: Install Payload v3 packages

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Payload core + adapters**

Run:

```bash
npm install payload @payloadcms/next @payloadcms/db-postgres @payloadcms/storage-s3 @payloadcms/richtext-lexical
```

- [ ] **Step 2: Install supporting packages**

Run:

```bash
npm install graphql sharp
npm install -D @types/node
```

`sharp` is required by Payload for image processing. `graphql` is a Payload peer dep.

- [ ] **Step 3: Verify versions**

Run: `grep -E '"(payload|@payloadcms/)"' package.json`
Expected: all packages on `^3.x.x`.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat(payload): install Payload v3 + adapters (postgres, s3, lexical)"
```

---

## Task 3: Create `src/payload.config.ts`

**Files:**
- Create: `src/payload.config.ts`
- Create: `src/payload/collections/.gitkeep` (empty — next tasks fill this)
- Create: `src/payload/globals/.gitkeep`

- [ ] **Step 1: Create directory structure**

Run:

```bash
mkdir -p src/payload/collections src/payload/globals
touch src/payload/collections/.gitkeep src/payload/globals/.gitkeep
```

- [ ] **Step 2: Create `src/payload.config.ts`**

```ts
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: "users",
  },
  editor: lexicalEditor(),
  collections: [
    // populated by Tasks 4-12 (one collection per task)
  ],
  globals: [
    // populated by Tasks 13-14
  ],
  localization: {
    locales: [
      { label: "العربية", code: "ar", rtl: true },
      { label: "English", code: "en" },
    ],
    defaultLocale: "ar",
    fallback: true,
  },
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL ?? "" },
  }),
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: "media",
        },
        "lead-magnets": {
          prefix: "lead-magnets",
        },
      },
      bucket: "media",
      config: {
        endpoint: process.env.SUPABASE_S3_ENDPOINT ?? "",
        region: process.env.SUPABASE_S3_REGION ?? "",
        credentials: {
          accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID ?? "",
          secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY ?? "",
        },
        forcePathStyle: true,
      },
    }),
  ],
});
```

- [ ] **Step 3: Verify file compiles (no missing imports)**

Run: `npx tsc --noEmit src/payload.config.ts`
Expected: no errors. (Empty collections/globals arrays are valid for now.)

- [ ] **Step 4: Commit**

```bash
git add src/payload.config.ts src/payload
git commit -m "feat(payload): add payload.config.ts with postgres + s3 storage + lexical editor

- Arabic default locale, English secondary
- Supabase Storage via S3 adapter, two buckets (media public, lead-magnets private)
- Collections + globals to be added in subsequent tasks"
```

---

## Task 4: Define `users` collection (Payload's auth collection)

**Files:**
- Create: `src/payload/collections/Users.ts`
- Modify: `src/payload.config.ts`

- [ ] **Step 1: Create `src/payload/collections/Users.ts`**

```ts
import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: { useAsTitle: "email" },
  auth: true,
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => req.user?.role === "admin",
    update: ({ req }) => req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "admin",
  },
  fields: [
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
    },
    { name: "name", type: "text", required: true },
  ],
};
```

- [ ] **Step 2: Register it in `payload.config.ts`**

Add the import at the top:

```ts
import { Users } from "./payload/collections/Users";
```

Add to the `collections` array:

```ts
collections: [Users],
```

- [ ] **Step 3: Commit**

```bash
git add src/payload/collections/Users.ts src/payload.config.ts
git commit -m "feat(payload): add Users collection with admin/editor roles"
```

---

## Task 5: Define `media` collection

**Files:**
- Create: `src/payload/collections/Media.ts`
- Modify: `src/payload.config.ts`

- [ ] **Step 1: Create `src/payload/collections/Media.ts`**

```ts
import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  admin: { useAsTitle: "filename" },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === "admin",
  },
  upload: {
    mimeTypes: ["image/*", "video/*", "application/pdf"],
    imageSizes: [
      { name: "thumbnail", width: 400 },
      { name: "card", width: 768 },
      { name: "hero", width: 1920 },
    ],
    focalPoint: true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "caption",
      type: "text",
      localized: true,
    },
  ],
};
```

- [ ] **Step 2: Register in `payload.config.ts`**

Import and add to collections array:

```ts
import { Media } from "./payload/collections/Media";

collections: [Users, Media],
```

- [ ] **Step 3: Commit**

```bash
git add src/payload/collections/Media.ts src/payload.config.ts
git commit -m "feat(payload): add Media collection (localized alt, hero/card/thumb sizes)"
```

---

## Task 6: Define `lead-magnets` collection (private bucket)

**Files:**
- Create: `src/payload/collections/LeadMagnets.ts`
- Modify: `src/payload.config.ts`

- [ ] **Step 1: Create `src/payload/collections/LeadMagnets.ts`**

```ts
import type { CollectionConfig } from "payload";

export const LeadMagnets: CollectionConfig = {
  slug: "lead-magnets",
  admin: { useAsTitle: "title" },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === "admin",
  },
  upload: {
    mimeTypes: ["application/pdf"],
  },
  fields: [
    { name: "title", type: "text", required: true, localized: true },
    {
      name: "locale",
      type: "select",
      required: true,
      options: [
        { label: "Arabic", value: "ar" },
        { label: "English", value: "en" },
      ],
    },
    {
      name: "active",
      type: "checkbox",
      defaultValue: true,
    },
  ],
};
```

- [ ] **Step 2: Register**

```ts
import { LeadMagnets } from "./payload/collections/LeadMagnets";

collections: [Users, Media, LeadMagnets],
```

- [ ] **Step 3: Commit**

```bash
git add src/payload/collections/LeadMagnets.ts src/payload.config.ts
git commit -m "feat(payload): add LeadMagnets collection (private PDF storage)"
```

---

## Task 7: Define `categories` collection

**Files:**
- Create: `src/payload/collections/Categories.ts`

- [ ] **Step 1: Create the file**

```ts
import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: { useAsTitle: "name" },
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true, localized: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "URL-safe identifier, e.g. 'storage', 'cooking'." },
    },
    { name: "description", type: "textarea", localized: true },
    {
      name: "icon",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "order",
      type: "number",
      admin: { description: "Display order on the products page." },
    },
  ],
};
```

- [ ] **Step 2: Register**

```ts
import { Categories } from "./payload/collections/Categories";

collections: [Users, Media, LeadMagnets, Categories],
```

- [ ] **Step 3: Commit**

```bash
git add src/payload/collections/Categories.ts src/payload.config.ts
git commit -m "feat(payload): add Categories collection"
```

---

## Task 8: Define `products` collection

**Files:**
- Create: `src/payload/collections/Products.ts`

- [ ] **Step 1: Create the file**

```ts
import type { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  admin: { useAsTitle: "name", defaultColumns: ["name", "category", "updatedAt"] },
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true, localized: true },
    { name: "slug", type: "text", required: true, unique: true },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
    },
    { name: "shortDescription", type: "textarea", localized: true },
    {
      name: "description",
      type: "richText",
      localized: true,
    },
    {
      name: "spec",
      type: "group",
      label: "CAD-style spec block (renders programmatically)",
      fields: [
        {
          type: "row",
          fields: [
            { name: "widthMm", type: "number", admin: { width: "33%" } },
            { name: "heightMm", type: "number", admin: { width: "33%" } },
            { name: "depthMm", type: "number", admin: { width: "33%" } },
          ],
        },
        {
          name: "material",
          type: "select",
          options: [
            { label: "SS 304", value: "ss304" },
            { label: "SS 316", value: "ss316" },
            { label: "SS 430", value: "ss430" },
            { label: "Mild Steel", value: "mild" },
            { label: "Aluminium", value: "aluminium" },
          ],
        },
        {
          name: "gaugeMm",
          type: "number",
          admin: { description: "Sheet thickness in mm (e.g. 1.2)" },
        },
        {
          name: "finish",
          type: "select",
          options: [
            { label: "#4 Brushed", value: "brushed-4" },
            { label: "#8 Mirror", value: "mirror-8" },
            { label: "Bead Blasted", value: "bead-blasted" },
            { label: "Powder Coated", value: "powder-coat" },
          ],
        },
      ],
    },
    {
      name: "gallery",
      type: "array",
      minRows: 1,
      labels: { singular: "Photo", plural: "Photos" },
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
        {
          name: "view",
          type: "select",
          options: [
            { label: "Front", value: "front" },
            { label: "Three-quarter", value: "three-quarter" },
            { label: "Detail", value: "detail" },
            { label: "Installed", value: "installed" },
          ],
        },
      ],
    },
    {
      name: "installations",
      type: "array",
      labels: { singular: "Installation photo", plural: "Installation photos" },
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
        { name: "caption", type: "text", localized: true },
        { name: "venue", type: "text", localized: true, admin: { description: "e.g. 'Hilton Jeddah Banquet Kitchen'" } },
      ],
    },
    {
      name: "model3d",
      type: "upload",
      relationTo: "media",
      admin: { description: "Optional GLB model — viewer renders only when present." },
    },
    {
      name: "relatedProducts",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
      maxDepth: 1,
    },
    {
      name: "seo",
      type: "group",
      fields: [
        { name: "title", type: "text", localized: true },
        { name: "description", type: "textarea", localized: true },
        { name: "ogImage", type: "upload", relationTo: "media" },
      ],
    },
  ],
};
```

- [ ] **Step 2: Register**

```ts
import { Products } from "./payload/collections/Products";

collections: [Users, Media, LeadMagnets, Categories, Products],
```

- [ ] **Step 3: Commit**

```bash
git add src/payload/collections/Products.ts src/payload.config.ts
git commit -m "feat(payload): add Products collection (spec block, gallery, installations, model3d)"
```

---

## Task 9: Define `services` collection

**Files:**
- Create: `src/payload/collections/Services.ts`

- [ ] **Step 1: Create the file**

```ts
import type { CollectionConfig } from "payload";

export const Services: CollectionConfig = {
  slug: "services",
  admin: { useAsTitle: "name" },
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true, localized: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "tagline", type: "text", localized: true },
    { name: "description", type: "richText", localized: true },
    { name: "hero", type: "upload", relationTo: "media" },
    {
      name: "benefits",
      type: "array",
      labels: { singular: "Benefit", plural: "Benefits" },
      fields: [
        { name: "title", type: "text", required: true, localized: true },
        { name: "body", type: "textarea", localized: true },
      ],
    },
    {
      name: "useCases",
      type: "array",
      labels: { singular: "Use case", plural: "Use cases" },
      fields: [
        { name: "title", type: "text", required: true, localized: true },
        { name: "body", type: "textarea", localized: true },
        { name: "image", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "commonProducts",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
    },
    {
      name: "order",
      type: "number",
      admin: { description: "Display order on the services page." },
    },
    {
      name: "seo",
      type: "group",
      fields: [
        { name: "title", type: "text", localized: true },
        { name: "description", type: "textarea", localized: true },
        { name: "ogImage", type: "upload", relationTo: "media" },
      ],
    },
  ],
};
```

- [ ] **Step 2: Register**

```ts
import { Services } from "./payload/collections/Services";

collections: [Users, Media, LeadMagnets, Categories, Products, Services],
```

- [ ] **Step 3: Commit**

```bash
git add src/payload/collections/Services.ts src/payload.config.ts
git commit -m "feat(payload): add Services collection"
```

---

## Task 10: Define `authors` and `posts` collections

**Files:**
- Create: `src/payload/collections/Authors.ts`
- Create: `src/payload/collections/Posts.ts`

- [ ] **Step 1: Create `Authors.ts`**

```ts
import type { CollectionConfig } from "payload";

export const Authors: CollectionConfig = {
  slug: "authors",
  admin: { useAsTitle: "name" },
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true, localized: true },
    { name: "role", type: "text", localized: true },
    { name: "bio", type: "textarea", localized: true },
    { name: "photo", type: "upload", relationTo: "media" },
  ],
};
```

- [ ] **Step 2: Create `Posts.ts`**

```ts
import type { CollectionConfig } from "payload";

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: { useAsTitle: "title", defaultColumns: ["title", "publishedAt", "_status"] },
  access: {
    read: ({ req }) => {
      if (req.user) return true;
      return { _status: { equals: "published" } };
    },
  },
  versions: { drafts: { autosave: true } },
  fields: [
    { name: "title", type: "text", required: true, localized: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "excerpt", type: "textarea", localized: true },
    {
      name: "body",
      type: "richText",
      localized: true,
    },
    { name: "hero", type: "upload", relationTo: "media" },
    {
      name: "author",
      type: "relationship",
      relationTo: "authors",
      required: true,
    },
    {
      name: "tags",
      type: "array",
      labels: { singular: "Tag", plural: "Tags" },
      fields: [{ name: "label", type: "text", required: true, localized: true }],
    },
    {
      name: "publishedAt",
      type: "date",
      admin: { position: "sidebar" },
    },
    {
      name: "seo",
      type: "group",
      fields: [
        { name: "title", type: "text", localized: true },
        { name: "description", type: "textarea", localized: true },
        { name: "ogImage", type: "upload", relationTo: "media" },
      ],
    },
  ],
};
```

- [ ] **Step 3: Register both**

```ts
import { Authors } from "./payload/collections/Authors";
import { Posts } from "./payload/collections/Posts";

collections: [Users, Media, LeadMagnets, Categories, Products, Services, Authors, Posts],
```

- [ ] **Step 4: Commit**

```bash
git add src/payload/collections/Authors.ts src/payload/collections/Posts.ts src/payload.config.ts
git commit -m "feat(payload): add Authors and Posts collections (drafts + autosave)"
```

---

## Task 11: Define `pages` collection (page-level hero/SEO copy)

**Files:**
- Create: `src/payload/collections/Pages.ts`

- [ ] **Step 1: Create the file**

```ts
import type { CollectionConfig } from "payload";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: { useAsTitle: "title" },
  access: { read: () => true },
  fields: [
    {
      name: "key",
      type: "select",
      required: true,
      unique: true,
      options: [
        { label: "Home", value: "home" },
        { label: "About", value: "about" },
        { label: "Services", value: "services" },
        { label: "Products", value: "products" },
        { label: "Contact", value: "contact" },
        { label: "Blog index", value: "blog" },
        { label: "Privacy", value: "privacy" },
        { label: "Terms", value: "terms" },
      ],
    },
    { name: "title", type: "text", required: true, localized: true },
    { name: "heroHeadline", type: "text", localized: true },
    { name: "heroSubline", type: "textarea", localized: true },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "seo",
      type: "group",
      fields: [
        { name: "title", type: "text", localized: true },
        { name: "description", type: "textarea", localized: true },
        { name: "ogImage", type: "upload", relationTo: "media" },
      ],
    },
  ],
};
```

- [ ] **Step 2: Register**

```ts
import { Pages } from "./payload/collections/Pages";

collections: [Users, Media, LeadMagnets, Categories, Products, Services, Authors, Posts, Pages],
```

- [ ] **Step 3: Commit**

```bash
git add src/payload/collections/Pages.ts src/payload.config.ts
git commit -m "feat(payload): add Pages collection (page-level hero + SEO)"
```

---

## Task 12: Define `enquiries` and `leads` collections (internal, no localization)

**Files:**
- Create: `src/payload/collections/Enquiries.ts`
- Create: `src/payload/collections/Leads.ts`

- [ ] **Step 1: Create `Enquiries.ts`**

```ts
import type { CollectionConfig } from "payload";

export const Enquiries: CollectionConfig = {
  slug: "enquiries",
  admin: {
    useAsTitle: "reference",
    defaultColumns: ["reference", "name", "projectType", "createdAt", "status"],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true, // public submissions
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === "admin",
  },
  fields: [
    {
      name: "reference",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "Auto-generated short reference, e.g. ENQ-2026-0001" },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Contacted", value: "contacted" },
        { label: "Quoted", value: "quoted" },
        { label: "Won", value: "won" },
        { label: "Lost", value: "lost" },
      ],
    },
    {
      name: "projectType",
      type: "select",
      required: true,
      options: [
        { label: "Restaurant fit-out", value: "restaurant" },
        { label: "Hotel kitchen", value: "hotel" },
        { label: "Hospital", value: "hospital" },
        { label: "Decorative", value: "decorative" },
        { label: "Other", value: "other" },
      ],
    },
    {
      name: "scope",
      type: "select",
      hasMany: true,
      options: [
        { label: "Hand Railing", value: "railing" },
        { label: "Column Cladding", value: "cladding" },
        { label: "Kitchen Equipment", value: "kitchen" },
        { label: "Decorative Items", value: "decorative" },
      ],
    },
    {
      name: "scopeNotes",
      type: "textarea",
    },
    {
      name: "dimensions",
      type: "text",
      admin: { description: "Free text — e.g. '12m railing × 3 floors'" },
    },
    {
      name: "budgetBand",
      type: "select",
      options: [
        { label: "< 50K SAR", value: "lt50k" },
        { label: "50K–150K SAR", value: "50to150k" },
        { label: "150K–500K SAR", value: "150to500k" },
        { label: "> 500K SAR", value: "gt500k" },
        { label: "Prefer not to say", value: "skip" },
      ],
    },
    {
      name: "timeline",
      type: "select",
      options: [
        { label: "Now", value: "now" },
        { label: "1–3 months", value: "1to3" },
        { label: "3–6 months", value: "3to6" },
        { label: "Planning", value: "planning" },
      ],
    },
    { name: "name", type: "text", required: true },
    { name: "company", type: "text" },
    {
      name: "phone",
      type: "text",
      required: true,
      admin: { description: "KSA format expected, e.g. +9665XXXXXXXX" },
    },
    { name: "email", type: "email", required: true },
    { name: "whatsappOptIn", type: "checkbox", defaultValue: false },
    {
      name: "sourceProduct",
      type: "relationship",
      relationTo: "products",
      admin: { description: "Populated when submitted from a product detail page." },
    },
    {
      name: "sourcePage",
      type: "text",
      admin: { description: "The page URL where the enquiry started." },
    },
    {
      name: "locale",
      type: "select",
      options: [
        { label: "Arabic", value: "ar" },
        { label: "English", value: "en" },
      ],
    },
    {
      name: "internalNotes",
      type: "textarea",
      admin: { description: "Internal — not visible to the customer." },
    },
  ],
};
```

- [ ] **Step 2: Create `Leads.ts`**

```ts
import type { CollectionConfig } from "payload";

export const Leads: CollectionConfig = {
  slug: "leads",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "source", "createdAt", "delivered"],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === "admin",
  },
  fields: [
    { name: "email", type: "email", required: true, unique: true },
    {
      name: "source",
      type: "select",
      required: true,
      defaultValue: "lead-magnet-popup",
      options: [
        { label: "Lead magnet popup", value: "lead-magnet-popup" },
        { label: "Blog footer", value: "blog-footer" },
        { label: "Other", value: "other" },
      ],
    },
    {
      name: "sourcePage",
      type: "text",
    },
    {
      name: "locale",
      type: "select",
      required: true,
      options: [
        { label: "Arabic", value: "ar" },
        { label: "English", value: "en" },
      ],
    },
    {
      name: "delivered",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "True once the lead magnet PDF email has sent successfully." },
    },
    {
      name: "deliveredAt",
      type: "date",
    },
    {
      name: "unsubscribedAt",
      type: "date",
    },
  ],
};
```

- [ ] **Step 3: Register both**

```ts
import { Enquiries } from "./payload/collections/Enquiries";
import { Leads } from "./payload/collections/Leads";

collections: [Users, Media, LeadMagnets, Categories, Products, Services, Authors, Posts, Pages, Enquiries, Leads],
```

- [ ] **Step 4: Commit**

```bash
git add src/payload/collections/Enquiries.ts src/payload/collections/Leads.ts src/payload.config.ts
git commit -m "feat(payload): add Enquiries and Leads collections (public create, auth read)"
```

---

## Task 13: Define `settings` global (phone, addresses, social)

**Files:**
- Create: `src/payload/globals/Settings.ts`

- [ ] **Step 1: Create the file**

```ts
import type { GlobalConfig } from "payload";

export const Settings: GlobalConfig = {
  slug: "settings",
  access: { read: () => true },
  fields: [
    {
      name: "company",
      type: "group",
      fields: [
        { name: "name", type: "text", localized: true, required: true },
        { name: "tagline", type: "text", localized: true },
        { name: "logo", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "contact",
      type: "group",
      fields: [
        { name: "phone", type: "text", required: true },
        {
          name: "whatsappNumber",
          type: "text",
          admin: { description: "International format, e.g. +9665XXXXXXXX. Used by the WhatsApp floating CTA." },
        },
        { name: "email", type: "email", required: true },
        { name: "salesEmail", type: "email" },
      ],
    },
    {
      name: "address",
      type: "group",
      fields: [
        { name: "line1", type: "text", localized: true, required: true },
        { name: "line2", type: "text", localized: true },
        { name: "city", type: "text", localized: true, required: true, defaultValue: "Jeddah" },
        { name: "region", type: "text", localized: true, defaultValue: "Makkah" },
        { name: "country", type: "text", localized: true, required: true, defaultValue: "Saudi Arabia" },
        { name: "mapsUrl", type: "text" },
        { name: "latitude", type: "number" },
        { name: "longitude", type: "number" },
      ],
    },
    {
      name: "social",
      type: "array",
      labels: { singular: "Social link", plural: "Social links" },
      fields: [
        {
          name: "platform",
          type: "select",
          required: true,
          options: [
            { label: "Instagram", value: "instagram" },
            { label: "LinkedIn", value: "linkedin" },
            { label: "X (Twitter)", value: "x" },
            { label: "YouTube", value: "youtube" },
            { label: "TikTok", value: "tiktok" },
          ],
        },
        { name: "url", type: "text", required: true },
      ],
    },
  ],
};
```

- [ ] **Step 2: Register in `payload.config.ts`**

```ts
import { Settings } from "./payload/globals/Settings";

globals: [Settings],
```

- [ ] **Step 3: Commit**

```bash
git add src/payload/globals/Settings.ts src/payload.config.ts
git commit -m "feat(payload): add Settings global (company, contact, address, social)"
```

---

## Task 14: Define `nav` global (header + footer navigation)

**Files:**
- Create: `src/payload/globals/Nav.ts`

- [ ] **Step 1: Create the file**

```ts
import type { GlobalConfig } from "payload";

const linkFields = [
  { name: "label", type: "text" as const, required: true, localized: true },
  {
    name: "type",
    type: "select" as const,
    required: true,
    defaultValue: "internal",
    options: [
      { label: "Internal", value: "internal" },
      { label: "External", value: "external" },
    ],
  },
  { name: "href", type: "text" as const, required: true },
];

export const Nav: GlobalConfig = {
  slug: "nav",
  access: { read: () => true },
  fields: [
    {
      name: "header",
      type: "array",
      labels: { singular: "Header link", plural: "Header links" },
      fields: linkFields,
    },
    {
      name: "footer",
      type: "group",
      fields: [
        {
          name: "columns",
          type: "array",
          labels: { singular: "Footer column", plural: "Footer columns" },
          fields: [
            { name: "heading", type: "text", required: true, localized: true },
            {
              name: "links",
              type: "array",
              labels: { singular: "Link", plural: "Links" },
              fields: linkFields,
            },
          ],
        },
        {
          name: "legalLinks",
          type: "array",
          labels: { singular: "Legal link", plural: "Legal links" },
          fields: linkFields,
        },
      ],
    },
  ],
};
```

- [ ] **Step 2: Register**

```ts
import { Nav } from "./payload/globals/Nav";

globals: [Settings, Nav],
```

- [ ] **Step 3: Commit**

```bash
git add src/payload/globals/Nav.ts src/payload.config.ts
git commit -m "feat(payload): add Nav global (header + footer columns + legal links)"
```

---

## Task 15: Mount Payload at `/admin` and at `/api/*` (App Router)

**Files:**
- Create: `src/app/(payload)/admin/[[...segments]]/page.tsx`
- Create: `src/app/(payload)/admin/[[...segments]]/not-found.tsx`
- Create: `src/app/(payload)/api/[...slug]/route.ts`
- Create: `src/app/(payload)/api/graphql/route.ts`
- Create: `src/app/(payload)/api/graphql-playground/route.ts`
- Create: `src/app/(payload)/layout.tsx`
- Create: `src/app/(payload)/custom.scss`

Payload v3 ships with a generator (`npx payload generate:importmap`) but we want explicit files so we can read them in the repo.

- [ ] **Step 1: Create `src/app/(payload)/layout.tsx`**

```tsx
/* eslint-disable @next/next/no-css-tags */
import config from "@payload-config";
import { RootLayout } from "@payloadcms/next/layouts";
import type { ReactNode } from "react";
import "./custom.scss";

export const metadata = {
  title: "Steel Valley — Admin",
};

const Layout = ({ children }: { children: ReactNode }) => (
  <RootLayout config={config}>{children}</RootLayout>
);

export default Layout;
```

- [ ] **Step 2: Create `src/app/(payload)/custom.scss`**

```scss
/* Payload admin custom styles — kept minimal for now. */
```

- [ ] **Step 3: Create `src/app/(payload)/admin/[[...segments]]/page.tsx`**

```tsx
import type { Metadata } from "next";
import config from "@payload-config";
import { generatePageMetadata, RootPage } from "@payloadcms/next/views";

type Args = {
  params: Promise<{ segments?: string[] }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams });

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, params, searchParams });

export default Page;
```

- [ ] **Step 4: Create `src/app/(payload)/admin/[[...segments]]/not-found.tsx`**

```tsx
import config from "@payload-config";
import { generatePageMetadata, NotFoundPage } from "@payloadcms/next/views";

type Args = {
  params: Promise<{ segments?: string[] }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export const generateMetadata = ({ params, searchParams }: Args) =>
  generatePageMetadata({ config, params, searchParams });

const NotFound = ({ params, searchParams }: Args) =>
  NotFoundPage({ config, params, searchParams });

export default NotFound;
```

- [ ] **Step 5: Create `src/app/(payload)/api/[...slug]/route.ts`**

```ts
import config from "@payload-config";
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from "@payloadcms/next/routes";

export const GET = REST_GET(config);
export const POST = REST_POST(config);
export const DELETE = REST_DELETE(config);
export const PATCH = REST_PATCH(config);
export const PUT = REST_PUT(config);
export const OPTIONS = REST_OPTIONS(config);
```

- [ ] **Step 6: Create `src/app/(payload)/api/graphql/route.ts`**

```ts
import config from "@payload-config";
import { GRAPHQL_POST, REST_OPTIONS } from "@payloadcms/next/routes";

export const POST = GRAPHQL_POST(config);
export const OPTIONS = REST_OPTIONS(config);
```

- [ ] **Step 7: Create `src/app/(payload)/api/graphql-playground/route.ts`**

```ts
import config from "@payload-config";
import { GRAPHQL_PLAYGROUND_GET } from "@payloadcms/next/routes";

export const GET = GRAPHQL_PLAYGROUND_GET(config);
```

- [ ] **Step 8: Add `@payload-config` path alias**

Edit `tsconfig.json`. Under `compilerOptions.paths`, add:

```json
"paths": {
  "@/*": ["./src/*"],
  "@payload-config": ["./src/payload.config.ts"]
}
```

- [ ] **Step 9: Mirror the path alias in Next config**

Edit `next.config.mjs` (or `.js`). The Payload Next plugin sets this up too, but we need to wrap the config.

If `next.config.mjs` exists, replace its contents with:

```js
import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default withPayload(nextConfig);
```

If it was `next.config.js` (CommonJS), rename to `next.config.mjs` first, then use the snippet above.

- [ ] **Step 10: Commit**

```bash
git add src/app/\(payload\) tsconfig.json next.config.mjs
git commit -m "feat(payload): mount admin at /admin + REST/GraphQL APIs via App Router

- (payload) route group with layout, admin page, REST + GraphQL routes
- @payload-config tsconfig alias
- next.config wrapped with withPayload"
```

---

## Task 16: First boot — verify migrations and admin loads

**Files:** none

- [ ] **Step 1: Start dev server**

Run: `npm run dev`

Watch the output. On first boot Payload will:
1. Connect to Postgres
2. Sync the schema (create tables for every collection)
3. Print a URL for the admin

Expected: no errors. If "permission denied" errors appear, the DATABASE_URL probably lacks the right pooler suffix — switch to the Direct Connection string instead of the Transaction pooler for the initial migration, then back.

- [ ] **Step 2: Visit `/admin`**

Open `http://localhost:3000/admin` in a browser.

Expected: a "Create your first user" form.

- [ ] **Step 3: Create the admin user**

Fill in:
- email: a real email the user controls
- password: strong, stored in password manager
- name: "Steel Valley Admin"
- role: Admin

Submit. You're now in the Payload dashboard.

- [ ] **Step 4: Confirm every collection + global is present in the sidebar**

Expected sidebar items:
- Users
- Media
- Lead Magnets
- Categories
- Products
- Services
- Authors
- Posts
- Pages
- Enquiries
- Leads
- Settings (under Globals)
- Nav (under Globals)

If any are missing, check that they were registered in `payload.config.ts`.

- [ ] **Step 5: Generate Payload types**

Run: `npx payload generate:types`

Expected: `src/payload-types.ts` is created (or updated) with every collection and global typed.

- [ ] **Step 6: Stop dev server, commit generated types**

```bash
git add src/payload-types.ts
git commit -m "chore(payload): generate payload-types from current schema"
```

---

## Task 17: Seed minimal fixtures so admin is browsable

**Files:**
- Create: `scripts/seed.ts`
- Modify: `package.json` (add script)

- [ ] **Step 1: Create `scripts/seed.ts`**

```ts
import { getPayload } from "payload";
import config from "../src/payload.config";

async function seed() {
  const payload = await getPayload({ config });

  // Seed Categories
  const categories = [
    { name: "Storage", slug: "storage", order: 1 },
    { name: "Cooking", slug: "cooking", order: 2 },
    { name: "Workstations", slug: "workstations", order: 3 },
    { name: "Washing", slug: "washing", order: 4 },
    { name: "Hoods", slug: "hoods", order: 5 },
  ];

  for (const cat of categories) {
    const existing = await payload.find({
      collection: "categories",
      where: { slug: { equals: cat.slug } },
      limit: 1,
    });
    if (existing.totalDocs === 0) {
      await payload.create({ collection: "categories", data: cat, locale: "en" });
      payload.logger.info(`Seeded category: ${cat.slug}`);
    }
  }

  // Seed Settings global (English values; user adds Arabic via admin)
  await payload.updateGlobal({
    slug: "settings",
    data: {
      company: {
        name: "Steel Valley",
        tagline: "Stainless steel fabrication — Jeddah",
      },
      contact: {
        phone: "+966 12 XXX XXXX",
        email: "info@steelvalley.example",
      },
      address: {
        line1: "Industrial Area",
        city: "Jeddah",
        region: "Makkah",
        country: "Saudi Arabia",
      },
    },
    locale: "en",
  });
  payload.logger.info("Seeded Settings global (en)");

  // Seed Pages stubs
  const pageKeys = ["home", "about", "services", "products", "contact", "blog", "privacy", "terms"];
  for (const key of pageKeys) {
    const existing = await payload.find({
      collection: "pages",
      where: { key: { equals: key } },
      limit: 1,
    });
    if (existing.totalDocs === 0) {
      await payload.create({
        collection: "pages",
        data: { key, title: key.charAt(0).toUpperCase() + key.slice(1) },
        locale: "en",
      });
      payload.logger.info(`Seeded page stub: ${key}`);
    }
  }

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Add tsx for running TypeScript scripts**

Run: `npm install -D tsx`

- [ ] **Step 3: Add seed script to package.json**

In `package.json` `"scripts"`:

```json
"seed": "tsx scripts/seed.ts"
```

- [ ] **Step 4: Run seed**

Run: `npm run seed`
Expected: log lines like "Seeded category: storage", etc.

- [ ] **Step 5: Verify in admin**

Restart dev, visit `/admin/collections/categories` — should show 5 categories.
Visit `/admin/globals/settings` — should show seeded company info.
Visit `/admin/collections/pages` — should show 8 page stubs.

- [ ] **Step 6: Commit**

```bash
git add scripts/seed.ts package.json package-lock.json
git commit -m "chore(payload): add seed script for categories, settings, page stubs"
```

---

## Task 18: Install next-intl

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install**

```bash
npm install next-intl
```

- [ ] **Step 2: Verify**

Run: `grep '"next-intl"' package.json`
Expected: `^3.x.x` or newer.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat(i18n): install next-intl"
```

---

## Task 19: Configure next-intl (locales, default, routing)

**Files:**
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/request.ts`
- Create: `messages/ar.json`
- Create: `messages/en.json`

- [ ] **Step 1: Create `src/i18n/routing.ts`**

```ts
import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  localePrefix: "as-needed",
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

`localePrefix: "as-needed"` means the default locale (`ar`) has no prefix (`/`), and `en` is at `/en/*` — exactly the spec.

- [ ] **Step 2: Create `src/i18n/request.ts`**

```ts
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 3: Create `messages/ar.json` (structural placeholders)**

```json
{
  "Nav": {
    "home": "الرئيسية",
    "about": "عن الشركة",
    "services": "الخدمات",
    "products": "المنتجات",
    "contact": "تواصل معنا",
    "blog": "المدونة"
  },
  "Common": {
    "languageSwitch": "English",
    "enquire": "اطلب عرض سعر",
    "skipToContent": "تخطي إلى المحتوى"
  }
}
```

- [ ] **Step 4: Create `messages/en.json`**

```json
{
  "Nav": {
    "home": "Home",
    "about": "About",
    "services": "Services",
    "products": "Products",
    "contact": "Contact",
    "blog": "Blog"
  },
  "Common": {
    "languageSwitch": "العربية",
    "enquire": "Get a Quote",
    "skipToContent": "Skip to content"
  }
}
```

- [ ] **Step 5: Wire next-intl plugin into next.config**

Edit `next.config.mjs`:

```js
import createNextIntlPlugin from "next-intl/plugin";
import { withPayload } from "@payloadcms/next/withPayload";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default withPayload(withNextIntl(nextConfig));
```

- [ ] **Step 6: Commit**

```bash
git add src/i18n messages next.config.mjs
git commit -m "feat(i18n): configure next-intl (ar default, en at /en, message catalogs)"
```

---

## Task 20: Add locale-aware middleware

**Files:**
- Create: `src/middleware.ts`

- [ ] **Step 1: Create the middleware**

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Let Payload handle its own routes
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_app-router-health") ||
    pathname.includes(".")
  ) {
    return;
  }

  return intlMiddleware(req);
}

export const config = {
  // Match everything except /admin, /api, static assets
  matcher: ["/((?!admin|api|_next/static|_next/image|favicon.ico).*)"],
};
```

- [ ] **Step 2: Verify the middleware runs**

Run: `npm run dev`

Visit `http://localhost:3000/`. Expected: stays at `/` (default locale, no prefix). HTML should have `lang="ar" dir="rtl"`. (Layout will be wired in Task 21.)

Visit `http://localhost:3000/en`. Expected: 200.

Visit `http://localhost:3000/admin`. Expected: Payload admin loads — middleware is correctly excluding it.

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts
git commit -m "feat(i18n): add locale middleware that excludes /admin and /api"
```

---

## Task 21: Locale-aware root layout

**Files:**
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/app/[locale]/page.tsx`
- Delete: `src/app/layout.tsx` (the static one from Plan 1 — locale-aware version replaces it)
- Delete: `src/app/page.tsx` (the placeholder from Plan 1)
- Keep: `src/app/_app-router-health/page.tsx` (still useful as a no-locale health check)
- Keep: `src/app/globals.css`

- [ ] **Step 1: Create `src/app/[locale]/layout.tsx`**

```tsx
import type { ReactNode } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata = {
  title: "Steel Valley",
  description: "Stainless steel fabrication — Jeddah, Saudi Arabia.",
};

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create `src/app/[locale]/page.tsx` (placeholder, will be replaced by Claude Design implementations)**

```tsx
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export default function HomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = useTranslations("Nav");
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Steel Valley — {params.locale.toUpperCase()}</h1>
      <p>{t("home")}</p>
      <p>This placeholder will be replaced by the Claude Design home implementation.</p>
    </main>
  );
}
```

- [ ] **Step 3: Delete the old non-locale layout/page**

```bash
rm src/app/layout.tsx src/app/page.tsx
```

- [ ] **Step 4: Verify build still works**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Verify dev**

Run: `npm run dev`

Visit `http://localhost:3000/` → renders with `<html lang="ar" dir="rtl">`, body shows "Steel Valley — AR".
Visit `http://localhost:3000/en` → renders with `<html lang="en" dir="ltr">`, body shows "Steel Valley — EN".
Visit `http://localhost:3000/admin` → still works (Payload admin).
Visit `http://localhost:3000/_app-router-health` → still works.

- [ ] **Step 6: Commit**

```bash
git add src/app
git commit -m "feat(i18n): locale-aware layout under /[locale] with NextIntlClientProvider

- Arabic at /, English at /en
- <html lang dir> set dynamically
- Old non-locale layout/page removed
- /admin, /api, /_app-router-health unaffected"
```

---

## Task 22: LocaleToggle primitive (structure only)

**Files:**
- Create: `src/components/i18n/LocaleToggle.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useRouter } from "@/i18n/routing";

export function LocaleToggle() {
  const t = useTranslations("Common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const nextLocale = locale === "ar" ? "en" : "ar";

  const onClick = () => {
    // Strip the current locale prefix if present
    const stripped = pathname.replace(/^\/(ar|en)(?=\/|$)/, "") || "/";
    router.push(stripped, { locale: nextLocale });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Switch to ${nextLocale === "ar" ? "Arabic" : "English"}`}
      data-component="locale-toggle"
    >
      {t("languageSwitch")}
    </button>
  );
}
```

- [ ] **Step 2: Mount it in the locale layout for now (for verification — will be moved into the Navbar later)**

Edit `src/app/[locale]/page.tsx`:

```tsx
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { LocaleToggle } from "@/components/i18n/LocaleToggle";

export default function HomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = useTranslations("Nav");
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Steel Valley — {params.locale.toUpperCase()}</h1>
      <p>{t("home")}</p>
      <LocaleToggle />
      <p>This placeholder will be replaced by the Claude Design home implementation.</p>
    </main>
  );
}
```

- [ ] **Step 3: Verify it switches locales**

Run dev, visit `/`. Click the toggle. URL should change to `/en`, content should switch language.

Click again. Back to `/`.

- [ ] **Step 4: Commit**

```bash
git add src/components/i18n/LocaleToggle.tsx src/app/[locale]/page.tsx
git commit -m "feat(i18n): add LocaleToggle primitive (structure only — design TBD)"
```

---

## Task 23: Smoke tests for /admin and locale routing

**Files:**
- Modify: `tests/app-router-health.test.ts` (extend with new cases)

- [ ] **Step 1: Extend the test file**

Replace `tests/app-router-health.test.ts` with:

```ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { spawn, type ChildProcess } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";

let dev: ChildProcess;

beforeAll(async () => {
  dev = spawn("npm", ["run", "dev"], {
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, PORT: "3001" },
  });

  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("dev server timeout")), 60_000);
    dev.stdout!.on("data", (chunk: Buffer) => {
      if (chunk.toString().includes("Ready")) {
        clearTimeout(timer);
        resolve();
      }
    });
  });

  await wait(1000);
}, 90_000);

afterAll(() => {
  dev?.kill("SIGTERM");
});

describe("App Router scaffold", () => {
  it("serves /_app-router-health", async () => {
    const res = await fetch("http://localhost:3001/_app-router-health");
    expect(res.status).toBe(200);
    expect(await res.text()).toContain("App Router is alive.");
  });
});

describe("Bilingual routing", () => {
  it("serves Arabic at / with lang=ar dir=rtl", async () => {
    const res = await fetch("http://localhost:3001/");
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toMatch(/<html[^>]*\blang="ar"/);
    expect(html).toMatch(/<html[^>]*\bdir="rtl"/);
  });

  it("serves English at /en with lang=en dir=ltr", async () => {
    const res = await fetch("http://localhost:3001/en");
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toMatch(/<html[^>]*\blang="en"/);
    expect(html).toMatch(/<html[^>]*\bdir="ltr"/);
  });

  it("404s an unknown locale", async () => {
    const res = await fetch("http://localhost:3001/fr");
    expect(res.status).toBe(404);
  });
});

describe("Payload admin", () => {
  it("serves /admin with HTML containing the Payload login or dashboard", async () => {
    const res = await fetch("http://localhost:3001/admin", { redirect: "manual" });
    expect([200, 307, 308]).toContain(res.status);
  });

  it("serves /api/users (Payload REST) with JSON", async () => {
    const res = await fetch("http://localhost:3001/api/users", { redirect: "manual" });
    // Unauth = 200 with public-safe empty result, or 403 — both confirm Payload is mounted
    expect([200, 401, 403]).toContain(res.status);
  });
});
```

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: all green. The longer beforeAll timeout accounts for Payload's first-run schema sync.

If a test fails because the dev server logs "Ready" before Payload finishes syncing, increase the `wait(1000)` to `wait(3000)`.

- [ ] **Step 3: Commit**

```bash
git add tests/app-router-health.test.ts
git commit -m "test: smoke tests for bilingual routing + Payload admin"
```

---

## Task 24: Update prep-status.md

**Files:**
- Modify: `docs/prep-status.md`

- [ ] **Step 1: Update Plan 2 row to complete**

Edit `docs/prep-status.md`. Replace the Plans table with:

```markdown
| # | Plan | Status | Notes |
|---|------|--------|-------|
| 1 | Security & Scaffold | ✅ complete + pushed | Branch `redesign`, Next 15 + React 19, App Router alongside Pages Router |
| 2 | Backend Foundation (Payload + Supabase + i18n) | ✅ complete | 9 collections + 2 globals; /admin live; Arabic at /, English at /en |
| 3 | Design System + Primitives | ⏸ pending | Will absorb final tokens from Claude Design when they land |
| 4 | Conversion + Discovery | ⏸ pending | Resend API key required |
| 5 | Performance Scaffolding | ⏸ pending | |
```

Update "What runs locally today" to add:
- `http://localhost:3000/admin` — Payload admin (log in with the user created in Task 16)
- `http://localhost:3000/` → Arabic placeholder
- `http://localhost:3000/en` → English placeholder

Update "What's blocked / waiting on user" — remove "Supabase project + connection string" (now done).

- [ ] **Step 2: Commit + push**

```bash
git add docs/prep-status.md
git commit -m "docs(prep-status): mark Plan 2 complete"
git push origin redesign
```

---

## Plan 2 — done.

**End-state achieved:**
- Supabase project provisioned, env wired into `.env.local`, schema synced.
- Payload v3 mounted at `/admin` with 9 collections and 2 globals.
- First admin user exists; can browse and edit content.
- Categories + page stubs + Settings seeded.
- Bilingual routing live: `/` (ar) + `/en/*`, `<html lang dir>` correct.
- `LocaleToggle` primitive switches between locales.
- Smoke tests cover App Router scaffold, bilingual routing, and Payload admin.
- `docs/prep-status.md` reflects current state.

**Next:** Plan 3 — Design System tokens + primitive components, scaffolded to absorb Claude Design's final tokens cleanly.
