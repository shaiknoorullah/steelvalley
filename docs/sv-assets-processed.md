# SV Assets — processing report (2026-05-25)

Bulk pass over `C:\Users\moham\OneDrive\Desktop\NoorGithub\SV Assets\`: 76 photos + 9 videos + the logo.

## Pipeline (scripts)

| Step | Script | Inputs | Outputs |
|---|---|---|---|
| Triage | (subagent) | 76 source photos | `scripts/sv-asset-manifest.json` |
| Logo | `scripts/sv-process-logo.mjs` | `SV Assets/Steel Valley/Steel Valley..png` | `public/images/logo/` |
| Photos | `scripts/sv-process-photos.mjs` | manifest + sources | committed + staged AVIF/WebP |
| Videos | `scripts/sv-process-videos.mjs` | 9 MP4s | `public/video/` faststart + posters |

Re-run any step idempotently. The photo script reads the manifest, so editing categories or rejecting items just means re-running it.

## Results

### Photos
- **76 total → 71 kept → 5 rejected**
- Rejects: 1 duplicate, 1 redundant cabinet shot, 1 motion-blurred/rotated, 1 awkward overhead, 1 bystander-on-phone uncroppable
- Light retouch applied: 1-99% range normalize + gentle sharpen pass to recover detail lost to WhatsApp compression

### Output buckets

| Path | Files | Size |
|---|---|---|
| `public/images/logo/` | 14 (PNG + AVIF + WebP + favicons) | 0.27 MB |
| `public/images/services/kitchen-equipment/` | 172 (18 install shots × multiple variants) | 8.33 MB |
| `public/images/about/` | 20 (5 process shots × variants) | 0.55 MB |
| `public/images/hero/` | 6 (3 promoted hero plates × 2 sizes) | ~0.6 MB |
| `public/video/` | 9 MP4 + 9 poster JPGs | 34.35 MB |
| `SV-Assets-processed/products/{storage,cooking,workstations,washing,hoods}/` | 352 (53 products × variants) | 9.05 MB |

**Total in repo (committed):** ~43.5 MB (dominated by videos).
**Total in staging (Payload bulk-upload):** ~9 MB across 53 products.

### Hero plates promoted to `public/images/hero/`
The triage didn't explicitly use the `hero` category, but several photos were tagged `hero-16x9`-eligible. Three best were copied to `public/images/hero/`:
- `prep-container-shelf-stack__hero-16x9__{1200,2400}w.{avif,webp}` — pizza-box rack, clean workshop lit
- `pizza-prep-shelf-stack-hero__hero-16x9__{1200,2400}w.{avif,webp}` — multi-shelf prep stack
- `install-hero-16x9__{1200,2400}w.{avif,webp}` — long prep-sink line install, window-lit (from `long-prep-sink-line-install`)

Their originals remain in their natural category folders too (so they're still product/service-usable).

### Videos

| Source | → Output | Before | After |
|---|---|---|---|
| `WhatsApp Video ... 4.36.13 AM.mp4` (2:45) | `sv-clip-01.mp4` | 28.54 MB | 18.87 MB |
| 8 other clips (1.5–5 MB each) | `sv-clip-02..09.mp4` | 18.84 MB | 15.16 MB |
| **Total** | | **47.4 MB** | **34.0 MB** |

All H.264 + AAC, `+faststart` for byte-range streaming. Each has a paired `sv-clip-NN.jpg` poster from the 1-second frame.

### Photo categories (from manifest)

| Category | Kept | Where |
|---|---|---|
| products/storage | 16 | `SV-Assets-processed/products/storage/` |
| products/cooking | 5 | `SV-Assets-processed/products/cooking/` |
| products/workstations | 9 | `SV-Assets-processed/products/workstations/` |
| products/washing | 9 | `SV-Assets-processed/products/washing/` |
| products/hoods | 3 | `SV-Assets-processed/products/hoods/` |
| services/kitchen-equipment | 18 | `public/images/services/kitchen-equipment/` |
| about/process | 5 | `public/images/about/` |
| reject | 5 | (not output) |

**No hand-railing / column-cladding / decorative photos in this batch.** Those service pages will need separate photography.

## File naming convention

`<slug>__<use>__<width>w.<ext>`

Examples:
- `prep-container-shelf-stack__catalog-tile-4x3__800w.avif` — product card thumb, AVIF
- `lab-counter-install__service-photo-4x3__1400w.webp` — service section photo, WebP fallback
- `hot-line-hood-fryer-install__hero-16x9__2400w.avif` — homepage hero plate, retina width

Use cases → ratios → widths:
| `use` value | Ratio | Widths emitted |
|---|---|---|
| `catalog-tile-4x3` | 4:3 | 800, 400 |
| `detail-hero-4x3` | 4:3 | 1600, 800 |
| `detail-gallery-4x3` | 4:3 | 800, 400 |
| `service-photo-4x3` | 4:3 | 1400, 700 |
| `installation-16x9` | 16:9 | 1600, 800 |
| `hero-16x9` | 16:9 | 2400, 1200 |
| `process-3x4` | 3:4 | 800, 400 |

## Next steps to wire into the site

1. **Logo**: drop `<Image>` references at `public/images/logo/logo-full.{avif,webp}` into `SiteHeader.tsx` / footer. Apple-touch-icon + favicon should be linked from `src/app/layout.tsx` head metadata.
2. **Services page**: 18 kitchen-equipment install shots at `public/images/services/kitchen-equipment/*__service-photo-4x3__*` are ready for `ServicesPage.tsx`. The Kitchen Equipment service tile can use 3-5 of these as a small gallery.
3. **Homepage hero**: pick one of the 3 plates in `public/images/hero/` for the `Hero2D` backdrop or featured-case block.
4. **About / Process**: 5 workshop shots in `public/images/about/*__process-3x4__*` for the About page's process section.
5. **Products (deferred)**: when Supabase is provisioned, bulk-upload from `SV-Assets-processed/products/*` via Payload `/admin`. Use `SV-Assets-processed/upload-manifest.json` as the mapping (slug → category → file list).

## What was not done

- **Hand-railing / column-cladding / decorative service photography** — none in the source set
- **Hand-cropping each photo per `crop_intent`** — script does center-crop with top-bias for landscape→portrait or panoramic→4:3. The `crop_intent` notes in the manifest record "should be done" but the automated pass uses geometric center-crop. Manual touch-ups can be done per-image if needed.
- **Vector logo (SVG)** — no PDF→SVG converter available locally; raster master is 6575×2062 transparent PNG which scales to all web sizes cleanly. SVG would be a later polish step.
- **Video trimming** — the 18.87 MB clip is still 2:45 long. Best path is to trim to a 10-15s highlight before deploy.
