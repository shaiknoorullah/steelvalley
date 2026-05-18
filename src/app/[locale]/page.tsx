import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Nav");

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Steel Valley — {locale.toUpperCase()}</h1>
      <p>{t("home")}</p>
      <p>
        This placeholder will be replaced by the Claude Design home
        implementation.
      </p>
    </main>
  );
}
