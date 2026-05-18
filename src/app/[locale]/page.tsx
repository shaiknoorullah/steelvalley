import { setRequestLocale } from "next-intl/server";
import { HeroDemoPage } from "@/components/hero/HeroDemoPage";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  organizationJsonLd,
  localBusinessJsonLd,
} from "@/lib/seo/jsonld";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <JsonLd id="ld-org" data={organizationJsonLd()} />
      <JsonLd
        id="ld-local-business"
        data={localBusinessJsonLd({ addressLocality: "Jeddah" })}
      />
      <HeroDemoPage />
    </>
  );
}
