import { setRequestLocale } from "next-intl/server";
import { HomePage } from "@/components/home/HomePage";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  organizationJsonLd,
  localBusinessJsonLd,
} from "@/lib/seo/jsonld";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomeRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <JsonLd id="ld-org" data={organizationJsonLd()} />
      <JsonLd
        id="ld-local-business"
        data={localBusinessJsonLd({ addressLocality: "Jeddah" })}
      />
      <HomePage locale={locale} />
    </>
  );
}
