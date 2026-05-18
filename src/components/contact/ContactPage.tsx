/**
 * ContactPage — server-rendered composition for /[locale]/contact.
 *
 * Per spec §3 Contact:
 *   - Hero: one line — "let's measure the space." / "نقيسُ المكان، معك."
 *   - Quote Builder placeholder div (a parallel agent is building the real one
 *     on feat-conversion; orchestrator swaps this stub at merge time).
 *   - Map of Jeddah location — styled static placeholder with an inline pin SVG.
 *   - WhatsApp + phone + email as alternative methods, mono labels.
 *
 * The QuoteBuilder mount point uses data-pending="quote-builder" so the
 * orchestrator's merge script can find and replace it deterministically.
 */

import type { ReactNode } from "react";
import { Link } from "@/ds/components/Link";
import { QuoteBuilder } from "@/components/forms/QuoteBuilder";
import { getContactCopy, type ContactCopyShape } from "./ContactCopy";

type ContactPageProps = {
  locale: string;
};

export function ContactPage({ locale }: ContactPageProps) {
  const copy = getContactCopy(locale);

  return (
    <main id="main" className="bg-[var(--color-bone)] text-[var(--color-ink)]">
      <ContactHero copy={copy} />
      <QuoteBuilderSlot copy={copy} />
      <MapSection copy={copy} />
      <AltContact copy={copy} />
    </main>
  );
}

/* ───────────────────────── sections ───────────────────────── */

function ContactHero({ copy }: { copy: ContactCopyShape }) {
  return (
    <section
      aria-labelledby="contact-hero-title"
      className="bg-[var(--color-bone)]"
      style={{ paddingBlock: "10rem" }}
    >
      <Container>
        <p data-component="mono" className="sv-mono text-[var(--color-rust)]">
          {copy.hero.eyebrow}
        </p>
        <h1
          id="contact-hero-title"
          className="mt-6 max-w-[16ch] text-balance"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3.25rem, 9vw, 8rem)",
            fontWeight: 900,
            lineHeight: 0.92,
            letterSpacing: "-0.02em",
            textTransform: "lowercase",
          }}
        >
          {copy.hero.headline}
        </h1>
        <p
          className="mt-8 max-w-[55ch] opacity-80"
          style={{ fontSize: "1.125rem", lineHeight: 1.55 }}
        >
          {copy.hero.lede}
        </p>
      </Container>
    </section>
  );
}

/**
 * Pending Quote Builder mount. The placeholder div carries
 * `data-pending="quote-builder"` so the orchestrator's merge script can locate
 * and swap it for `<QuoteBuilder />` once feat-conversion lands.
 *
 * Spec §7.1: 6 steps, each its own URL hash. The placeholder block describes
 * that contract so reviewers understand what is coming.
 */
function QuoteBuilderSlot({ copy }: { copy: ContactCopyShape }) {
  return (
    <section
      aria-labelledby="quote-builder-title"
      className="bg-[var(--color-bone)] border-t border-[var(--color-ink)]/15"
      style={{ paddingBlock: "8rem" }}
    >
      <Container>
        <p
          data-component="mono"
          className="sv-mono text-[var(--color-rust)]"
          style={{ fontSize: "11px" }}
        >
          {copy.quoteBuilder.sectionLabel}
        </p>
        <h2
          id="quote-builder-title"
          className="mt-6 max-w-[24ch]"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.875rem, 4vw, 3rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            textTransform: "lowercase",
          }}
        >
          {copy.quoteBuilder.placeholderHeading}
        </h2>

        <div className="mt-12">
          <QuoteBuilder />
        </div>
      </Container>
    </section>
  );
}

function MapSection({ copy }: { copy: ContactCopyShape }) {
  return (
    <section
      aria-labelledby="map-title"
      className="bg-[var(--color-void)] text-[var(--color-bone)]"
      style={{ paddingBlock: "8rem" }}
    >
      <Container>
        <p
          data-component="mono"
          className="sv-mono text-[var(--color-rust)]"
          style={{ fontSize: "11px" }}
        >
          {copy.map.sectionLabel}
        </p>
        <h2
          id="map-title"
          className="mt-6 max-w-[20ch]"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.25rem, 5vw, 4rem)",
            fontWeight: 900,
            lineHeight: 0.98,
            letterSpacing: "-0.015em",
            textTransform: "lowercase",
            color: "var(--color-bone)",
          }}
        >
          {copy.map.cityLine}
        </h2>
        <p
          className="mt-4 opacity-80"
          style={{ fontSize: "1.0625rem", lineHeight: 1.55 }}
        >
          {copy.map.districtLine}
        </p>

        {/* Static map placeholder. Real implementation will render a
            performance-budget-friendly static map tile (see spec §3 Contact
            "static map image preferred over interactive — perf budget"). */}
        <figure
          aria-hidden="true"
          data-pending="static-map-tile"
          className="relative mt-12 grid place-items-center border border-[var(--color-steel)]/30 overflow-hidden"
          style={{
            aspectRatio: "16 / 9",
            background:
              "radial-gradient(circle at 50% 50%, rgba(199,205,214,0.18) 0%, rgba(15,20,25,1) 70%)",
          }}
        >
          {/* Coarse 8px grid backdrop — CAD measurement window aesthetic. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "linear-gradient(rgba(199,205,214,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(199,205,214,0.15) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Jeddah pin — inline SVG, no asset dependency. */}
          <svg
            viewBox="0 0 32 40"
            width="40"
            height="50"
            aria-hidden="true"
            className="relative"
            style={{ color: "var(--color-rust)" }}
          >
            <path
              d="M16 0C7.16 0 0 7.16 0 16c0 11 16 24 16 24s16-13 16-24C32 7.16 24.84 0 16 0zm0 22a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"
              fill="currentColor"
            />
          </svg>

          <p
            data-component="mono"
            className="sv-mono absolute bottom-4 left-4 text-[var(--color-steel)]"
            style={{ fontSize: "10px" }}
          >
            {copy.map.workshopMono}
          </p>
        </figure>
      </Container>
    </section>
  );
}

function AltContact({ copy }: { copy: ContactCopyShape }) {
  return (
    <section
      aria-labelledby="alt-contact-title"
      className="bg-[var(--color-bone)]"
      style={{ paddingBlock: "8rem" }}
    >
      <Container>
        <p
          data-component="mono"
          className="sv-mono text-[var(--color-rust)]"
          style={{ fontSize: "11px" }}
        >
          {copy.alt.sectionLabel}
        </p>
        <h2
          id="alt-contact-title"
          className="mt-6 max-w-[18ch]"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 5vw, 4rem)",
            fontWeight: 900,
            lineHeight: 0.98,
            letterSpacing: "-0.015em",
            textTransform: "lowercase",
          }}
        >
          {copy.alt.title}
        </h2>
        <p
          className="mt-8 max-w-[55ch] opacity-85"
          style={{ fontSize: "1.0625rem", lineHeight: 1.55 }}
        >
          {copy.alt.intro}
        </p>

        <ul
          role="list"
          className="mt-16 grid grid-cols-1 gap-px border border-[var(--color-ink)]/15 bg-[var(--color-ink)]/15 md:grid-cols-3"
        >
          <ContactMethod
            label={copy.alt.methods.whatsapp.label}
            value={copy.alt.methods.whatsapp.value}
            href={copy.alt.methods.whatsapp.href}
          />
          <ContactMethod
            label={copy.alt.methods.phone.label}
            value={copy.alt.methods.phone.value}
            href={copy.alt.methods.phone.href}
          />
          <ContactMethod
            label={copy.alt.methods.email.label}
            value={copy.alt.methods.email.value}
            href={copy.alt.methods.email.href}
          />
        </ul>

        <p
          data-component="mono"
          className="sv-mono mt-12 opacity-65"
          style={{ fontSize: "11px" }}
        >
          {copy.alt.hours.label} · {copy.alt.hours.value}
        </p>
      </Container>
    </section>
  );
}

function ContactMethod({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <li className="bg-[var(--color-bone)] p-8">
      <p
        data-component="mono"
        className="sv-mono opacity-65"
        style={{ fontSize: "10px" }}
      >
        {label}
      </p>
      <Link
        href={href}
        external
        className="mt-3 inline-block"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.375rem",
          fontWeight: 800,
          lineHeight: 1.1,
          // Phone / WhatsApp numerals stay LTR even in Arabic context.
          direction: "ltr",
          unicodeBidi: "embed",
        }}
      >
        {value}
      </Link>
    </li>
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
