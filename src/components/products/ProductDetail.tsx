import { Link } from "@/ds/components";
import { PageShell } from "@/components/page-chrome/PageShell";
import { CadSpecBlock } from "./CadSpecBlock";
import {
  type Product,
  FINISH_LABELS,
  MATERIAL_LABELS,
  CATEGORY_LABELS,
} from "@/lib/data/stub-products";

type Locale = "en" | "ar";

const LABELS: Record<
  Locale,
  {
    dimensions: string;
    gauge: string;
    finish: string;
    material: string;
    enquire: string;
    gallery: string;
    spec: string;
    installation: string;
    installationNote: string;
    related: string;
    intro: string;
    introBody: string;
    cad: {
      front: string;
      top: string;
      side: string;
      width: string;
      height: string;
      depth: string;
      gauge: string;
      scale: string;
      units: string;
    };
  }
> = {
  en: {
    dimensions: "Dimensions",
    gauge: "Gauge",
    finish: "Finish",
    material: "Material",
    enquire: "Enquire",
    gallery: "Gallery",
    spec: "Spec drawing",
    installation: "Installed",
    installationNote:
      "Installation photography placeholder. Real photographs land with the next site delivery.",
    related: "Related pieces",
    intro: "On this piece",
    introBody:
      "Every dimension below is what we cut to, not what we round to. Tolerances tighten in the welds — the parts you can see, and the parts only the inspector ever will.",
    cad: {
      front: "Front",
      top: "Top",
      side: "Side",
      width: "Width",
      height: "Height",
      depth: "Depth",
      gauge: "Gauge",
      scale: "Scale",
      units: "Units",
    },
  },
  ar: {
    dimensions: "المقاسات",
    gauge: "السماكة",
    finish: "التشطيب",
    material: "المعدن",
    enquire: "اطلب عرض",
    gallery: "صور القطعة",
    spec: "رسم تنفيذي",
    installation: "في موقعها",
    installationNote: "صور مواقع التركيب تنزل مع التسليم القادم. هذا مكانها.",
    related: "قطع تكمّلها",
    intro: "عن هذي القطعة",
    introBody:
      "كل قياس تحت هذا، هو اللي نقصّ عليه — مو اللي نقرّبه. التفاوتات تضيق عند اللحامات — اللي تشوفها العين، واللي ما يشوفها إلا المفتش.",
    cad: {
      front: "أمامي",
      top: "علوي",
      side: "جانبي",
      width: "العرض",
      height: "الارتفاع",
      depth: "العمق",
      gauge: "السماكة",
      scale: "المقياس",
      units: "الوحدات",
    },
  },
};

const ENQUIRE_FOOTER: Record<Locale, { title: string; body: string }> = {
  en: {
    title: "Quote this piece, or the kitchen that needs it.",
    body: "Send us your floor plan, your service capacity, and the date you open. We will reply within one working day, in Arabic or English, with a measured quote — not a guess.",
  },
  ar: {
    title: "اطلب عرض على هذي القطعة، أو على المطبخ كلّه.",
    body: "ابعث لنا المخطط، عدد الكراسي اللي تخدمها، وموعد الافتتاح. نرد عليك خلال يوم عمل، بالعربي أو الإنجليزي، بعرض مدروس — مو تخمين.",
  },
};

export interface ProductDetailProps {
  locale: Locale;
  product: Product;
  related: Product[];
}

export function ProductDetail({ locale, product, related }: ProductDetailProps) {
  const c = product.copy[locale];
  const t = LABELS[locale];

  return (
    <PageShell locale={locale}>
      <article data-product-detail>
        <section data-product-detail-hero>
          <figure data-detail-hero-image>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.heroImage} alt="" />
          </figure>
          <div data-detail-summary>
            <p data-mono-eyebrow>{CATEGORY_LABELS[product.category][locale]}</p>
            <h1 data-display-title>{c.name}</h1>
            <p data-lede>{c.short}</p>
            <dl data-detail-spec-block>
              <div>
                <dt>{t.dimensions.toUpperCase()}</dt>
                <dd>
                  {product.spec.widthMm} × {product.spec.depthMm} ×{" "}
                  {product.spec.heightMm} MM
                </dd>
              </div>
              <div>
                <dt>{t.gauge.toUpperCase()}</dt>
                <dd>{product.spec.gaugeMm.toFixed(1)} MM</dd>
              </div>
              <div>
                <dt>{t.material.toUpperCase()}</dt>
                <dd>{MATERIAL_LABELS[product.spec.material][locale]}</dd>
              </div>
              <div>
                <dt>{t.finish.toUpperCase()}</dt>
                <dd>{FINISH_LABELS[product.spec.finish][locale]}</dd>
              </div>
            </dl>
            <Link href="/#quote" variant="cta" data-detail-enquire>
              {t.enquire}
            </Link>
          </div>
        </section>

        <section data-detail-section>
          <h2 data-section-title>{t.intro}</h2>
          <p data-lede style={{ maxInlineSize: "65ch" }}>{t.introBody}</p>
          <p style={{ marginBlockStart: "1.5rem", maxInlineSize: "65ch" }}>
            {c.long}
          </p>
        </section>

        <section data-detail-section>
          <h2 data-section-title>{t.gallery}</h2>
          <ul data-detail-gallery>
            {product.gallery.map((src, i) => (
              <li key={i}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="lazy" decoding="async" />
              </li>
            ))}
          </ul>
        </section>

        <section data-detail-section>
          <h2 data-section-title>{t.spec}</h2>
          <div data-detail-cad>
            <CadSpecBlock
              spec={product.spec}
              productName={c.name}
              labels={t.cad}
            />
          </div>
        </section>

        <section data-detail-section>
          <h2 data-section-title>{t.installation}</h2>
          <p style={{ opacity: 0.7, maxInlineSize: "56ch" }}>
            {t.installationNote}
          </p>
          <div
            style={{
              marginBlockStart: "1.5rem",
              aspectRatio: "16 / 9",
              background:
                "color-mix(in srgb, var(--color-ink) 4%, var(--color-bone))",
              border:
                "1px dashed color-mix(in srgb, var(--color-ink) 15%, transparent)",
            }}
            aria-hidden="true"
          />
        </section>

        {related.length > 0 && (
          <section data-detail-section>
            <h2 data-section-title>{t.related}</h2>
            <ul data-related-list>
              {related.map((r) => {
                const rc = r.copy[locale];
                return (
                  <li key={r.slug}>
                    <Link href={`/products/${r.slug}`} aria-label={rc.name}>
                      <figure>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={r.heroImage} alt="" loading="lazy" />
                      </figure>
                      <div data-related-body>
                        <p data-mono-category>
                          {CATEGORY_LABELS[r.category][locale]}
                        </p>
                        <h3 data-related-name>{rc.name}</h3>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <section data-enquire-footer>
          <h2>{ENQUIRE_FOOTER[locale].title}</h2>
          <p>{ENQUIRE_FOOTER[locale].body}</p>
          <Link href="/#quote" variant="cta" data-detail-enquire>
            {t.enquire}
          </Link>
        </section>

        <div data-mobile-enquire-bar>
          <span data-mobile-enquire-name>{c.name}</span>
          <Link href="/#quote" variant="cta" data-detail-enquire>
            {t.enquire}
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
