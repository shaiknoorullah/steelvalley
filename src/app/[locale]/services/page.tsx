import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ServicesPage } from "@/components/services/ServicesPage";
import { getServicesCopy } from "@/components/services/ServicesCopy";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const copy = getServicesCopy(locale);
  return {
    title: copy.meta.title,
    description: copy.meta.description,
  };
}

export default async function ServicesRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ServicesPage locale={locale} />;
}
