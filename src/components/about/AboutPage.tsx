/**
 * AboutPage — server-rendered composition for /[locale]/about.
 *
 * Visual language (per docs/superpowers/specs/2026-05-18-steelvalley-redesign.md §3, §2):
 *   - Bone (#F2F0EC) primary surface; one void (#0F1419) overlap section for contrast.
 *   - Display headlines: var(--font-display) at clamp() display sizes.
 *   - Mono spec footers: 11px, 0.08em tracking, uppercase, LTR-pinned via .sv-mono.
 *   - Rust as signal, never as fill.
 *   - 8rem padding-block between editorial sections.
 *
 * All visual rules use Tailwind v4 utilities + the @theme tokens from globals.css.
 * No new dependencies introduced.
 */

import type { ReactNode } from "react";
import { Link } from "@/ds/components/Link";
import { getAboutCopy, type AboutCopyShape } from "./AboutCopy";

type AboutPageProps = {
  locale: string;
};

export function AboutPage({ locale }: AboutPageProps) {
  const copy = getAboutCopy(locale);

  return (
    <main id="main" className="bg-[var(--color-bone)] text-[var(--color-ink)]">
      <AboutHero copy={copy} />
      <AboutStory copy={copy} />
      <AboutProcess copy={copy} />
      <AboutPillars copy={copy} />
      <AboutTeam copy={copy} />
      <AboutClosing copy={copy} />
    </main>
  );
}

/* ───────────────────────── sections ───────────────────────── */

function AboutHero({ copy }: { copy: AboutCopyShape }) {
  return (
    <section
      aria-labelledby="about-hero-title"
      className="relative overflow-hidden bg-[var(--color-bone)]"
      style={{ paddingBlock: "10rem" }}
    >
      {/* Asset placeholder — full-bleed photographic plate lands here later.
          Spec §3 calls for a single black-and-white workshop shot. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(199,205,214,0.18) 0%, rgba(242,240,236,1) 70%)",
        }}
      />
      <Container>
        <p data-component="mono" className="sv-mono text-[var(--color-rust)]">
          {copy.hero.sinceLabel}
        </p>
        <h1
          id="about-hero-title"
          className="mt-6 max-w-[18ch] text-balance"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3.5rem, 9vw, 8rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.02em",
            fontWeight: 900,
            textTransform: "lowercase",
          }}
        >
          {copy.hero.headline}
        </h1>
        <p
          className="mt-8 max-w-[60ch] text-balance opacity-80"
          style={{ fontSize: "1.125rem", lineHeight: 1.55 }}
        >
          {copy.hero.tagline}
        </p>
      </Container>
    </section>
  );
}

function AboutStory({ copy }: { copy: AboutCopyShape }) {
  return (
    <Section labelledBy="about-story-title" tone="bone">
      <Container>
        <SectionEyebrow>{copy.story.eyebrow}</SectionEyebrow>
        <SectionTitle id="about-story-title">{copy.story.title}</SectionTitle>

        <div className="mt-20 grid gap-16 md:gap-24">
          {copy.story.acts.map((act) => (
            <article
              key={act.number}
              className="grid grid-cols-1 gap-6 md:grid-cols-[8rem_1fr] md:gap-12"
            >
              <p
                data-component="mono"
                className="sv-mono text-[var(--color-rust)]"
                style={{ fontSize: "13px" }}
              >
                ACT {act.number}
              </p>
              <div>
                <h3
                  className="mb-4"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.75rem, 3.2vw, 2.75rem)",
                    lineHeight: 1.05,
                    fontWeight: 800,
                    textTransform: "lowercase",
                  }}
                >
                  {act.heading}
                </h3>
                <p
                  className="max-w-[60ch] opacity-85"
                  style={{ fontSize: "1.0625rem", lineHeight: 1.65 }}
                >
                  {act.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function AboutProcess({ copy }: { copy: AboutCopyShape }) {
  return (
    <Section labelledBy="about-process-title" tone="void">
      <Container>
        <SectionEyebrow tone="onDark">{copy.process.eyebrow}</SectionEyebrow>
        <SectionTitle id="about-process-title" tone="onDark">
          {copy.process.title}
        </SectionTitle>
        <p
          className="mt-8 max-w-[55ch] opacity-80 text-[var(--color-bone)]"
          style={{ fontSize: "1.0625rem", lineHeight: 1.65 }}
        >
          {copy.process.body}
        </p>

        {/* TODO(process-loop): replace with real silent 30s loop component.
            For now this is a styled empty <section> matching the brief. */}
        <section
          data-pending="process-loop-video"
          aria-label={copy.process.placeholderNote}
          className="mt-16 grid place-items-center border border-[var(--color-steel)]/30"
          style={{
            aspectRatio: "16 / 9",
            background:
              "linear-gradient(135deg, rgba(31,41,55,0.6) 0%, rgba(15,20,25,1) 100%)",
          }}
        >
          <div className="px-8 text-center">
            <p
              data-component="mono"
              className="sv-mono text-[var(--color-steel)]"
              style={{ fontSize: "10px" }}
            >
              {copy.process.durationMono}
            </p>
            <p
              className="mt-4 text-[var(--color-bone)] opacity-90"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.9375rem",
              }}
            >
              {copy.process.placeholderNote}
            </p>
          </div>
        </section>
      </Container>
    </Section>
  );
}

function AboutPillars({ copy }: { copy: AboutCopyShape }) {
  return (
    <Section labelledBy="about-pillars-title" tone="bone">
      <Container>
        <SectionEyebrow>{copy.pillars.eyebrow}</SectionEyebrow>
        <SectionTitle id="about-pillars-title">
          {copy.pillars.title}
        </SectionTitle>

        <div className="mt-20 grid gap-12 md:grid-cols-3 md:gap-8">
          {copy.pillars.items.map((pillar) => (
            <article
              key={pillar.name}
              className="flex flex-col border-t border-[var(--color-ink)]/15 pt-8"
            >
              <h3
                className="mb-4"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 3vw, 2.75rem)",
                  fontWeight: 900,
                  lineHeight: 1,
                  textTransform: "lowercase",
                }}
              >
                {pillar.name}
              </h3>
              <p
                className="mb-6 max-w-[28ch]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.25rem",
                  lineHeight: 1.3,
                  fontWeight: 700,
                  color: "var(--color-rust)",
                  textTransform: "lowercase",
                }}
              >
                {pillar.lede}
              </p>
              <p
                className="mb-8 max-w-[40ch] opacity-85"
                style={{ fontSize: "0.9375rem", lineHeight: 1.6 }}
              >
                {pillar.body}
              </p>
              <p
                data-component="mono"
                className="sv-mono mt-auto pt-6 border-t border-[var(--color-ink)]/10 opacity-70"
                style={{ fontSize: "10px" }}
              >
                {pillar.specFooter}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function AboutTeam({ copy }: { copy: AboutCopyShape }) {
  return (
    <Section labelledBy="about-team-title" tone="bone">
      <Container>
        <SectionEyebrow>{copy.team.eyebrow}</SectionEyebrow>
        <SectionTitle id="about-team-title">{copy.team.title}</SectionTitle>
        <p
          className="mt-8 max-w-[50ch] opacity-80"
          style={{ fontSize: "1.0625rem", lineHeight: 1.65 }}
        >
          {copy.team.intro}
        </p>

        <ul
          className="mt-16 grid grid-cols-2 gap-px bg-[var(--color-ink)]/15 lg:grid-cols-4"
          role="list"
        >
          {copy.team.members.map((member, idx) => (
            <li
              key={member.nameLatin}
              className="bg-[var(--color-bone)] p-6"
            >
              {/* Portrait placeholder — strict modular tile. Spec §3 calls for
                  a real portrait grid; this matches the aspect ratio so the
                  swap is non-disruptive. */}
              <div
                aria-hidden="true"
                className="mb-6 grid place-items-center border border-[var(--color-ink)]/20"
                style={{
                  aspectRatio: "3 / 4",
                  background:
                    "linear-gradient(180deg, rgba(199,205,214,0.35) 0%, rgba(199,205,214,0.1) 100%)",
                }}
              >
                <span
                  data-component="mono"
                  className="sv-mono opacity-50"
                  style={{ fontSize: "10px" }}
                >
                  PORTRAIT · {String(idx + 1).padStart(2, "0")}
                </span>
              </div>
              <p
                className="leading-tight"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.0625rem",
                  fontWeight: 800,
                  textTransform: "lowercase",
                }}
              >
                {member.nameLatin}
              </p>
              <p
                lang="ar"
                dir="rtl"
                className="mt-1 leading-tight"
                style={{
                  fontFamily: "var(--font-arabic-display)",
                  fontSize: "1.0625rem",
                  fontWeight: 900,
                }}
              >
                {member.nameArabic}
              </p>
              <p
                data-component="mono"
                className="sv-mono mt-3 opacity-65"
                style={{ fontSize: "10px" }}
              >
                {member.role}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

function AboutClosing({ copy }: { copy: AboutCopyShape }) {
  return (
    <Section labelledBy="about-closing-title" tone="bone">
      <Container>
        <div className="border-t border-[var(--color-ink)] pt-16">
          <h2
            id="about-closing-title"
            className="max-w-[16ch]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: "-0.015em",
              textTransform: "lowercase",
            }}
          >
            {copy.closing.headline}
          </h2>
          <p
            className="mt-8 max-w-[55ch] opacity-85"
            style={{ fontSize: "1.0625rem", lineHeight: 1.65 }}
          >
            {copy.closing.body}
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <Link href="/contact" variant="cta">
              {copy.closing.ctaPrimary}
            </Link>
            <Link href="/services" variant="cta">
              {copy.closing.ctaSecondary}
            </Link>
          </div>
        </div>
      </Container>
    </Section>
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

function Section({
  children,
  labelledBy,
  tone,
}: {
  children: ReactNode;
  labelledBy?: string;
  tone?: "bone" | "void";
}) {
  const isVoid = tone === "void";
  return (
    <section
      aria-labelledby={labelledBy}
      className={
        isVoid
          ? "bg-[var(--color-void)] text-[var(--color-bone)]"
          : "bg-[var(--color-bone)] text-[var(--color-ink)]"
      }
      style={{ paddingBlock: "8rem" }}
    >
      {children}
    </section>
  );
}

function SectionEyebrow({
  children,
  tone,
}: {
  children: ReactNode;
  tone?: "onDark";
}) {
  return (
    <p
      data-component="mono"
      className="sv-mono"
      style={{
        color:
          tone === "onDark"
            ? "var(--color-rust)"
            : "var(--color-rust)",
        fontSize: "11px",
      }}
    >
      {children}
    </p>
  );
}

function SectionTitle({
  children,
  id,
  tone,
}: {
  children: ReactNode;
  id?: string;
  tone?: "onDark";
}) {
  return (
    <h2
      id={id}
      className="mt-6 max-w-[20ch]"
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
        fontWeight: 900,
        lineHeight: 0.95,
        letterSpacing: "-0.015em",
        textTransform: "lowercase",
        color:
          tone === "onDark"
            ? "var(--color-bone)"
            : "var(--color-ink)",
      }}
    >
      {children}
    </h2>
  );
}
