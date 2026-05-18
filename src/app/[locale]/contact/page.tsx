<<<<<<< HEAD
import { setRequestLocale } from "next-intl/server";
import { QuoteBuilder } from "@/components/forms/QuoteBuilder";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ product?: string }>;
};

export default async function ContactPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { product } = await searchParams;
  setRequestLocale(locale);
  return (
    <main id="main-content" className="sv-contact-page">
      <div className="sv-contact-page__intro">
        <p className="sv-contact-page__eyebrow">
          {locale === "ar" ? "خطوة واحدة" : "step into the build"}
        </p>
        <h1 className="sv-contact-page__title">
          {locale === "ar"
            ? "لنقِس المكان معاً."
            : "let’s measure the space."}
        </h1>
        <p className="sv-contact-page__lede">
          {locale === "ar"
            ? "ستّ خطوات. ردّ خلال يوم عمل واحد، وعادةً أقل."
            : "Six short steps. A reply within one business day — usually less."}
        </p>
      </div>
      <QuoteBuilder sourceProductSlug={product} />
    </main>
  );
=======
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ContactPage } from "@/components/contact/ContactPage";
import { getContactCopy } from "@/components/contact/ContactCopy";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const copy = getContactCopy(locale);
  return {
    title: copy.meta.title,
    description: copy.meta.description,
  };
}

export default async function ContactRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactPage locale={locale} />;
>>>>>>> feat-pages-a
}
