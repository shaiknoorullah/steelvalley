"use client";

import { useMemo, useState } from "react";
import { Link } from "@/ds/components";
import { PageShell } from "@/components/page-chrome/PageShell";
import {
  type Post,
  type PostCategory,
  POST_CATEGORY_LABELS,
  POST_CATEGORY_ORDER,
} from "@/lib/data/stub-posts";

type Locale = "en" | "ar";

const HERO: Record<
  Locale,
  { eyebrow: string; title: string; lede: string; filterLabel: string; allLabel: string }
> = {
  en: {
    eyebrow: "Journal · 2026",
    title: "Notes from the shop floor.",
    lede: "Craft arguments, kitchen design opinions, and field notes from the studios where we work. Long form when it deserves it, short when it doesn't.",
    filterLabel: "Filter",
    allLabel: "All",
  },
  ar: {
    eyebrow: "المدوّنة · ٢٠٢٦",
    title: "ملاحظات من أرض الورشة.",
    lede: "آراء صنعة، نقاشات في تصميم المطابخ، وملاحظات من المواقع اللي نشتغل فيها. تطويل لمّا يستاهل، اختصار لمّا ما يستاهل.",
    filterLabel: "صنّف",
    allLabel: "الكل",
  },
};

const READ_LABEL: Record<Locale, string> = {
  en: "MIN READ",
  ar: "دقائق قراءة",
};

const EMPTY: Record<Locale, string> = {
  en: "Nothing in this category yet. Pick another, or come back next month.",
  ar: "ما في شي بهالقسم لين الآن. جرّب قسم ثاني، أو ارجع بعد شهر.",
};

function formatDate(iso: string, locale: Locale) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export interface BlogIndexProps {
  locale: Locale;
  posts: Post[];
}

export function BlogIndex({ locale, posts }: BlogIndexProps) {
  const [active, setActive] = useState<PostCategory | null>(null);

  const filtered = useMemo(
    () =>
      active ? posts.filter((p) => p.category === active) : posts,
    [active, posts],
  );

  const hero = HERO[locale];

  return (
    <PageShell locale={locale}>
      <section data-blog-hero>
        <p data-mono-eyebrow>{hero.eyebrow}</p>
        <h1 data-display-title>{hero.title}</h1>
        <p data-lede>{hero.lede}</p>
        <div role="group" aria-label={hero.filterLabel} data-blog-filter>
          <span data-filter-label>{hero.filterLabel} ·</span>
          <button
            type="button"
            data-filter-chip
            data-active={active === null || undefined}
            onClick={() => setActive(null)}
          >
            {hero.allLabel}
          </button>
          {POST_CATEGORY_ORDER.map((cat) => (
            <button
              key={cat}
              type="button"
              data-filter-chip
              data-active={active === cat || undefined}
              onClick={() => setActive(cat)}
            >
              {POST_CATEGORY_LABELS[cat][locale]}
            </button>
          ))}
        </div>
      </section>

      {filtered.length === 0 ? (
        <div style={{ padding: "0 clamp(1.25rem, 4vw, 3rem) 4rem", opacity: 0.7 }}>
          <p>{EMPTY[locale]}</p>
        </div>
      ) : (
        <ul data-blog-grid>
          {filtered.map((p) => {
            const c = p.copy[locale];
            return (
              <li key={p.slug} data-blog-card>
                <Link href={`/blog/${p.slug}`} aria-label={c.title}>
                  <figure>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.heroImage} alt="" loading="lazy" decoding="async" />
                  </figure>
                  <div data-card-meta>
                    <span>{POST_CATEGORY_LABELS[p.category][locale]}</span>
                    <span>·</span>
                    <span>{formatDate(p.date, locale)}</span>
                    <span>·</span>
                    <span>
                      {p.readingTimeMin} {READ_LABEL[locale]}
                    </span>
                  </div>
                  <h2>{c.title}</h2>
                  <p>{c.excerpt}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </PageShell>
  );
}
