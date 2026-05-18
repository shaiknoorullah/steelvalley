"use client";

import { useMemo, useState } from "react";
import { Link } from "@/ds/components";
import { PageShell } from "@/components/page-chrome/PageShell";
import type {
  Product,
  ProductCategory,
} from "@/lib/data/stub-products";
import { MATERIAL_LABELS, FINISH_LABELS } from "@/lib/data/stub-products";

type Locale = "en" | "ar";

const HERO: Record<
  Locale,
  { eyebrow: string; title: string; lede: string; filterLabel: string; allLabel: string }
> = {
  en: {
    eyebrow: "Catalogue · 2026",
    title: "Stainless steel, made for the line.",
    lede: "Eight pieces in stock today. Hundreds more built to order, to the same standard. Filter by where they belong in the kitchen.",
    filterLabel: "Filter",
    allLabel: "All",
  },
  ar: {
    eyebrow: "كتالوج · ٢٠٢٦",
    title: "إستانلس، مصنوع للخط.",
    lede: "ثمان قطع جاهزة اليوم. ومئات تتصنّع على الطلب بنفس المستوى. اختار حسب موقعها في المطبخ.",
    filterLabel: "صنّف",
    allLabel: "الكل",
  },
};

const META_LABEL: Record<Locale, { dims: string; gauge: string; finish: string; material: string }> = {
  en: { dims: "DIMENSIONS", gauge: "GAUGE", finish: "FINISH", material: "MATERIAL" },
  ar: { dims: "المقاسات", gauge: "السماكة", finish: "التشطيب", material: "المعدن" },
};

const EMPTY: Record<Locale, string> = {
  en: "No pieces in this category yet. Filter another, or enquire — we likely already build it.",
  ar: "ما في قطع بهالقسم لين الآن. جرّب قسم ثاني، أو تواصل معنا — على الأغلب نصنعها.",
};

export interface ProductsCatalogProps {
  locale: Locale;
  products: Product[];
  categories: ProductCategory[];
  categoryLabels: Record<ProductCategory, { en: string; ar: string }>;
  activeCategory: ProductCategory | null;
}

export function ProductsCatalog({
  locale,
  products,
  categories,
  categoryLabels,
  activeCategory: initial,
}: ProductsCatalogProps) {
  const [active, setActive] = useState<ProductCategory | null>(initial);

  const filtered = useMemo(
    () =>
      active ? products.filter((p) => p.category === active) : products,
    [active, products],
  );

  const hero = HERO[locale];
  const meta = META_LABEL[locale];

  return (
    <PageShell locale={locale}>
      <section data-products-hero>
        <p data-mono-eyebrow>{hero.eyebrow}</p>
        <h1 data-display-title>{hero.title}</h1>
        <p data-lede>{hero.lede}</p>
        <div
          role="group"
          aria-label={hero.filterLabel}
          data-category-filter
        >
          <span data-filter-label>{hero.filterLabel} ·</span>
          <button
            type="button"
            data-filter-chip
            data-active={active === null || undefined}
            onClick={() => setActive(null)}
          >
            {hero.allLabel}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              data-filter-chip
              data-active={active === cat || undefined}
              onClick={() => setActive(cat)}
            >
              {categoryLabels[cat][locale]}
            </button>
          ))}
        </div>
      </section>

      <section data-products-grid-wrap>
        {filtered.length === 0 ? (
          <p data-products-empty>{EMPTY[locale]}</p>
        ) : (
          <ul data-products-grid>
            {filtered.map((p) => {
              const c = p.copy[locale];
              return (
                <li key={p.slug} data-product-card>
                  <Link
                    href={`/products/${p.slug}`}
                    variant="nav"
                    data-product-link
                    aria-label={c.name}
                  >
                    <figure data-product-figure>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.heroImage}
                        alt=""
                        data-product-image
                        loading="lazy"
                        decoding="async"
                      />
                      <figcaption data-product-overlay aria-hidden="true">
                        <span data-overlay-row>
                          <span>{meta.dims}</span>
                          <span>
                            {p.spec.widthMm} × {p.spec.depthMm} × {p.spec.heightMm} MM
                          </span>
                        </span>
                        <span data-overlay-row>
                          <span>{meta.gauge}</span>
                          <span>{p.spec.gaugeMm.toFixed(1)} MM</span>
                        </span>
                        <span data-overlay-row>
                          <span>{meta.finish}</span>
                          <span>{FINISH_LABELS[p.spec.finish][locale]}</span>
                        </span>
                      </figcaption>
                    </figure>
                    <div data-product-body>
                      <p data-mono-category>
                        {categoryLabels[p.category][locale]}
                      </p>
                      <h2 data-product-name>{c.name}</h2>
                      <p data-product-short>{c.short}</p>
                      <p data-mono-material>
                        {MATERIAL_LABELS[p.spec.material][locale]} ·{" "}
                        {p.spec.gaugeMm.toFixed(1)} MM
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </PageShell>
  );
}
