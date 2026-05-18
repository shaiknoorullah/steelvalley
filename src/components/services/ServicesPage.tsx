/**
 * ServicesPage — server-rendered composition for /[locale]/services.
 *
 * Layout (per spec §3 Services):
 *   - Hero with 4-service sticky index (anchor nav using CSS position: sticky).
 *   - One generous section per service: photo placeholder, mono spec sheet,
 *     3 use cases, sub-list of common products.
 *   - Mid-scroll soft CTA after service #2 (~60% scroll target).
 *   - Bottom: cross-link to /products + "get a quote" → /contact.
 *
 * Implementation note: the sticky index is pure CSS — no client JS needed for
 * jump-to-section behaviour. Anchor links work everywhere; sticky positioning
 * is supported in all baseline browsers Steel Valley targets.
 */

import type { ReactNode } from "react";
import { Link } from "@/ds/components/Link";
import {
  getServicesCopy,
  type ServicesCopyShape,
  type ServiceCopy,
} from "./ServicesCopy";

type ServicesPageProps = {
  locale: string;
};

export function ServicesPage({ locale }: ServicesPageProps) {
  const copy = getServicesCopy(locale);

  return (
    <main id="main" className="bg-[var(--color-bone)] text-[var(--color-ink)]">
      <ServicesHero copy={copy} />
      <ServicesIndex copy={copy} />

      <div className="bg-[var(--color-bone)]">
        {copy.services.map((service, idx) => (
          <ServiceSection key={service.slug} service={service} index={idx} />
        ))}
      </div>

      <MidScrollCta copy={copy} />

      {/* Render the 3rd and 4th services AFTER the mid-scroll strip would land
          if the page is shorter than expected. Order is preserved above; this
          extra block intentionally empty — kept comment for future variants. */}

      <ServicesBottom copy={copy} />
    </main>
  );
}

/* ───────────────────────── hero + sticky index ───────────────────────── */

function ServicesHero({ copy }: { copy: ServicesCopyShape }) {
  return (
    <section
      aria-labelledby="services-hero-title"
      className="bg-[var(--color-bone)]"
      style={{ paddingBlock: "10rem" }}
    >
      <Container>
        <p data-component="mono" className="sv-mono text-[var(--color-rust)]">
          {copy.hero.eyebrow}
        </p>
        <h1
          id="services-hero-title"
          className="mt-6 max-w-[18ch] text-balance"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 8vw, 7rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            fontWeight: 900,
            textTransform: "lowercase",
          }}
        >
          {copy.hero.headline}
        </h1>
        <p
          className="mt-8 max-w-[58ch] opacity-80"
          style={{ fontSize: "1.0625rem", lineHeight: 1.6 }}
        >
          {copy.hero.lede}
        </p>
      </Container>
    </section>
  );
}

/**
 * Index strip. Sticky on scroll (CSS only). All anchors are in-page jumps —
 * no client-side router needed. The sticky offset accounts for the loader
 * shell having released by this point.
 */
function ServicesIndex({ copy }: { copy: ServicesCopyShape }) {
  return (
    <nav
      aria-label={copy.hero.indexLabel}
      className="sticky top-0 z-10 border-y border-[var(--color-ink)]/15 bg-[var(--color-bone)]/95 backdrop-blur-sm"
      style={{ paddingBlock: "1rem" }}
    >
      <Container>
        <ol
          className="flex flex-wrap items-center gap-x-8 gap-y-2"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <li className="opacity-50">{copy.hero.indexLabel}</li>
          {copy.services.map((service) => (
            <li key={service.slug}>
              <a
                href={`#${service.slug}`}
                className="border-b border-transparent transition-colors hover:border-[var(--color-rust)] hover:text-[var(--color-rust)]"
                data-component="mono"
              >
                {service.indexLabel}
              </a>
            </li>
          ))}
        </ol>
      </Container>
    </nav>
  );
}

/* ───────────────────────── per-service section ───────────────────────── */

function ServiceSection({
  service,
  index,
}: {
  service: ServiceCopy;
  index: number;
}) {
  const altRow = index % 2 === 1;

  return (
    <section
      id={service.slug}
      aria-labelledby={`${service.slug}-title`}
      className="border-t border-[var(--color-ink)]/15"
      style={{ paddingBlock: "8rem", scrollMarginTop: "5rem" }}
    >
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Photography placeholder — half-bleed plate. Real photography
              lands here later; the aspect ratio is reserved so swap is CLS-safe. */}
          <div
            className={`order-2 lg:col-span-7 ${altRow ? "lg:order-2" : "lg:order-1"}`}
          >
            <figure
              aria-hidden="true"
              data-pending="service-photography"
              className="grid place-items-center border border-[var(--color-ink)]/15"
              style={{
                aspectRatio: "4 / 3",
                background:
                  "linear-gradient(135deg, rgba(199,205,214,0.45) 0%, rgba(199,205,214,0.12) 100%)",
              }}
            >
              <span
                data-component="mono"
                className="sv-mono opacity-55"
                style={{ fontSize: "10px" }}
              >
                PHOTOGRAPHY · {service.numberMono} · TO BE SHOT
              </span>
            </figure>
          </div>

          <div
            className={`order-1 lg:col-span-5 ${altRow ? "lg:order-1" : "lg:order-2"}`}
          >
            <p
              data-component="mono"
              className="sv-mono text-[var(--color-rust)]"
              style={{ fontSize: "11px" }}
            >
              {service.numberMono}
            </p>
            <h2
              id={`${service.slug}-title`}
              className="mt-4 max-w-[20ch]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.25rem, 4.5vw, 4rem)",
                fontWeight: 900,
                lineHeight: 0.98,
                letterSpacing: "-0.015em",
                textTransform: "lowercase",
              }}
            >
              {service.name}
            </h2>
            <p
              className="mt-6 max-w-[42ch]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.25rem",
                fontWeight: 700,
                lineHeight: 1.3,
                color: "var(--color-rust)",
                textTransform: "lowercase",
              }}
            >
              {service.headline}
            </p>
            <p
              className="mt-6 max-w-[55ch] opacity-85"
              style={{ fontSize: "1rem", lineHeight: 1.65 }}
            >
              {service.lede}
            </p>

            {/* Mono spec sheet — material / gauge / finishes. LTR-pinned even in AR. */}
            <dl
              className="mt-10 border-t border-[var(--color-ink)]/20"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                letterSpacing: "0.06em",
              }}
            >
              <SpecRow label="MATERIAL" value={service.spec.material} />
              <SpecRow label="GAUGE" value={service.spec.gauge} />
              <SpecRow label="FINISHES" value={service.spec.finishes} />
            </dl>
          </div>
        </div>

        {/* Use cases — three editorial micro-cards. */}
        <div className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6">
          {service.useCases.map((useCase, i) => (
            <article
              key={useCase.title}
              className="border-t border-[var(--color-ink)]/20 pt-6"
            >
              <p
                data-component="mono"
                className="sv-mono opacity-60"
                style={{ fontSize: "10px" }}
              >
                USE CASE · {String(i + 1).padStart(2, "0")}
              </p>
              <h3
                className="mt-4"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.375rem",
                  fontWeight: 800,
                  lineHeight: 1.15,
                  textTransform: "lowercase",
                }}
              >
                {useCase.title}
              </h3>
              <p
                className="mt-3 opacity-85"
                style={{ fontSize: "0.9375rem", lineHeight: 1.6 }}
              >
                {useCase.body}
              </p>
            </article>
          ))}
        </div>

        {/* Common products sub-list. */}
        <div className="mt-16 grid gap-8 md:grid-cols-[1fr_2fr]">
          <p
            data-component="mono"
            className="sv-mono pt-2 opacity-70"
            style={{ fontSize: "11px" }}
          >
            {service.commonProducts.title.toUpperCase()}
          </p>
          <ul
            className="grid grid-cols-1 gap-2 sm:grid-cols-2"
            style={{ fontSize: "0.9375rem" }}
          >
            {service.commonProducts.items.map((item) => (
              <li
                key={item}
                className="border-t border-[var(--color-ink)]/10 py-3 opacity-90"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="grid grid-cols-[7rem_1fr] items-baseline gap-4 border-b border-[var(--color-ink)]/15 py-3"
      // The whole row stays LTR — mono spec convention even in Arabic.
      style={{ direction: "ltr", unicodeBidi: "embed" }}
    >
      <dt className="opacity-60 uppercase">{label}</dt>
      <dd className="uppercase">{value}</dd>
    </div>
  );
}

/* ───────────────────────── mid-scroll + bottom ───────────────────────── */

function MidScrollCta({ copy }: { copy: ServicesCopyShape }) {
  return (
    <section
      data-component="mid-scroll-cta"
      aria-label={copy.midScroll.line}
      className="bg-[var(--color-void)] text-[var(--color-bone)]"
      style={{ paddingBlock: "5rem" }}
    >
      <Container>
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <p
            className="max-w-[40ch]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              textTransform: "lowercase",
            }}
          >
            {copy.midScroll.line}
          </p>
          <Link href="/contact" variant="cta" className="shrink-0">
            {copy.midScroll.cta}
          </Link>
        </div>
      </Container>
    </section>
  );
}

function ServicesBottom({ copy }: { copy: ServicesCopyShape }) {
  return (
    <section
      aria-labelledby="services-bottom-title"
      className="bg-[var(--color-bone)]"
      style={{ paddingBlock: "8rem" }}
    >
      <Container>
        <div className="border-t border-[var(--color-ink)] pt-16">
          <h2
            id="services-bottom-title"
            className="max-w-[18ch]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.25rem, 5vw, 4.5rem)",
              fontWeight: 900,
              lineHeight: 0.97,
              letterSpacing: "-0.015em",
              textTransform: "lowercase",
            }}
          >
            {copy.bottom.headline}
          </h2>
          <p
            className="mt-8 max-w-[55ch] opacity-85"
            style={{ fontSize: "1.0625rem", lineHeight: 1.6 }}
          >
            {copy.bottom.body}
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <Link href="/contact" variant="cta">
              {copy.bottom.ctaQuote}
            </Link>
            <Link href="/products" variant="cta">
              {copy.bottom.ctaCatalog}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ───────────────────────── primitives ───────────────────────── */

function Container({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 md:px-12">
      {children}
    </div>
  );
}
