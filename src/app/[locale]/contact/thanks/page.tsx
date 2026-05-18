import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ref?: string }>;
};

export default async function ThanksPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { ref } = await searchParams;
  setRequestLocale(locale);
  const reference = ref ?? "—";
  return (
    <main id="main-content" className="sv-thanks-page">
      <p className="sv-thanks-page__eyebrow">
        {locale === "ar" ? "تم الاستلام" : "received"}
      </p>
      <h1 className="sv-thanks-page__title">
        {locale === "ar" ? "شكراً. الفريق على الخط." : "Thanks. We’re on it."}
      </h1>
      <p className="sv-thanks-page__ref">
        {locale === "ar" ? "رقم الطلب" : "reference"}:{" "}
        <strong>{reference}</strong>
      </p>
      <p>
        {locale === "ar"
          ? "نتواصل خلال يوم عمل واحد — في الغالب أقل."
          : "Expect a reply within one business day — usually less."}
      </p>
    </main>
  );
}
