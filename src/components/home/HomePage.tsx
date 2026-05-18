/**
 * HomePage — server component composing all home-route sections.
 *
 * Order maps to the spec §3 Home arc (Earth → Heat → Form → Edge → Place,
 * compressed into a single scroll-down):
 *   1. <HeroPinSection> (the 500vh pinned arc, locked on first paint)
 *   2. Capabilities — 4 service cards
 *   3. Process — 6-step strip
 *   4. Trust — client logos
 *   5. Featured Case — anchor installation
 *   6. Lead-magnet teaser
 *   7. Footer
 */
import { Link } from "@/ds/components/Link";
import { HeroPinSection } from "@/components/hero/HeroPinSection";
import { getHomeCopy } from "./HomeCopy";

interface Props {
  locale: string;
}

export function HomePage({ locale }: Props) {
  const c = getHomeCopy(locale);
  const isAr = locale === "ar";

  return (
    <main id="main-content" className="sv-home">
      <HeroPinSection />

      {/* ── 2. Capabilities ───────────────────────────────────────── */}
      <section className="sv-home-section sv-home-capabilities" aria-labelledby="caps-title">
        <div className="sv-home-container">
          <p className="sv-home-eyebrow">{c.capabilities.eyebrow}</p>
          <h2 id="caps-title" className="sv-home-section-title">
            {c.capabilities.headline}
          </h2>
          <p className="sv-home-lede">{c.capabilities.lede}</p>

          <div className="sv-home-cap-grid">
            {c.capabilities.cards.map((card) => (
              <article key={card.slug} className="sv-home-cap-card">
                <div className="sv-home-cap-card__art" aria-hidden="true" />
                <h3 className="sv-home-cap-card__title">{card.title}</h3>
                <p className="sv-home-cap-card__blurb">{card.blurb}</p>
                <p className="sv-mono sv-home-cap-card__mono">{card.mono}</p>
                <Link href={card.href} className="sv-home-cap-card__cta">
                  {isAr ? "تعرّف →" : "explore →"}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Process ────────────────────────────────────────────── */}
      <section className="sv-home-section sv-home-process" aria-labelledby="proc-title">
        <div className="sv-home-container">
          <p className="sv-home-eyebrow sv-home-eyebrow--bone">{c.process.eyebrow}</p>
          <h2 id="proc-title" className="sv-home-section-title sv-home-section-title--bone">
            {c.process.headline}
          </h2>

          <ol className="sv-home-proc-strip">
            {c.process.steps.map((step) => (
              <li key={step.n} className="sv-home-proc-step">
                <span className="sv-mono sv-home-proc-step__n">{step.n}</span>
                <h3 className="sv-home-proc-step__title">{step.title}</h3>
                <p className="sv-home-proc-step__body">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 4. Trust strip ────────────────────────────────────────── */}
      <section className="sv-home-section sv-home-trust" aria-labelledby="trust-title">
        <div className="sv-home-container">
          <p className="sv-home-eyebrow">{c.trust.eyebrow}</p>
          <h2 id="trust-title" className="sv-home-section-title">{c.trust.headline}</h2>
          <ul className="sv-home-trust-grid">
            {c.trust.logos.map((logo) => (
              <li key={logo.name} className="sv-home-trust-card">
                <div className="sv-home-trust-card__mark" aria-hidden="true">
                  {logo.name.split(" ").map((w) => w[0]).join("")}
                </div>
                <p className="sv-home-trust-card__name">{logo.name}</p>
                <p className="sv-mono sv-home-trust-card__mono">{logo.mono}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 5. Featured case ──────────────────────────────────────── */}
      <section className="sv-home-section sv-home-feature" aria-labelledby="feat-title">
        <div className="sv-home-container">
          <p className="sv-home-eyebrow">{c.featuredCase.eyebrow}</p>
          <h2 id="feat-title" className="sv-home-section-title">{c.featuredCase.headline}</h2>
          <div className="sv-home-feature__grid">
            <div className="sv-home-feature__photo" aria-hidden="true" />
            <div className="sv-home-feature__body">
              <p className="sv-home-feature__lede">{c.featuredCase.body}</p>
              <dl className="sv-home-feature__specs">
                {c.featuredCase.specs.map((s) => (
                  <div key={s.label} className="sv-home-feature__spec-row">
                    <dt className="sv-mono">{s.label}</dt>
                    <dd className="sv-mono sv-home-feature__spec-val">{s.value}</dd>
                  </div>
                ))}
              </dl>
              <Link
                href={`/${locale === "ar" ? "" : "en/"}contact`}
                className="sv-home-feature__cta"
              >
                {c.featuredCase.ctaLabel} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Lead magnet teaser ─────────────────────────────────── */}
      <section
        className="sv-home-section sv-home-magnet"
        aria-labelledby="magnet-title"
      >
        <div className="sv-home-container sv-home-magnet__container">
          <div>
            <p className="sv-home-eyebrow">{c.leadMagnet.eyebrow}</p>
            <h2 id="magnet-title" className="sv-home-section-title">{c.leadMagnet.headline}</h2>
            <p className="sv-home-lede sv-home-magnet__body">{c.leadMagnet.body}</p>
          </div>
          <Link
            href={`/${locale === "ar" ? "" : "en/"}contact`}
            className="sv-home-magnet__cta"
          >
            {c.leadMagnet.cta} →
          </Link>
        </div>
      </section>

      {/* ── 7. Footer ─────────────────────────────────────────────── */}
      <footer className="sv-home-footer" aria-label="footer">
        <div className="sv-home-container">
          <p className="sv-home-footer__anthem">{c.footer.anthem}</p>

          <div className="sv-home-footer__grid">
            <div className="sv-home-footer__col">
              <p className="sv-mono sv-home-footer__heading">
                {isAr ? "تواصل" : "contact"}
              </p>
              <address className="sv-home-footer__addr">{c.footer.address}</address>
              <a href={`tel:${c.footer.phone.replace(/\s/g, "")}`} className="sv-home-footer__link">
                {c.footer.phone}
              </a>
              <a href={`mailto:${c.footer.email}`} className="sv-home-footer__link">
                {c.footer.email}
              </a>
            </div>

            {c.footer.columns.map((col) => (
              <div key={col.heading} className="sv-home-footer__col">
                <p className="sv-mono sv-home-footer__heading">{col.heading}</p>
                <ul className="sv-home-footer__list">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="sv-home-footer__link">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="sv-home-footer__legal sv-mono">{c.footer.legal}</p>
        </div>
      </footer>
    </main>
  );
}
