import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { AboutPage } from "@/components/about/AboutPage";
import { getAboutCopy } from "@/components/about/AboutCopy";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const copy = getAboutCopy(locale);
  return {
    title: copy.meta.title,
    description: copy.meta.description,
  };
}

export default async function AboutRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutPage locale={locale} />;
}
