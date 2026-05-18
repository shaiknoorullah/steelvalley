import { setRequestLocale } from "next-intl/server";
import { HeroDemoPage } from "@/components/hero/HeroDemoPage";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HeroDemoPage />;
}
