import type { ReactNode } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { ViewTransitions } from "next-view-transitions";
import { routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { LoaderShell } from "@/components/loader/LoaderShell";
import { TransitionStyles } from "@/components/transitions/TransitionStyles";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata = {
  title: "Steel Valley",
  description: "Stainless steel fabrication — Jeddah, Saudi Arabia.",
};

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";
  // Narrow the validated `locale` to the literal type the loader expects.
  // hasLocale above already confirmed `locale` is one of routing.locales.
  const safeLocale: "ar" | "en" =
    locale === "ar" || locale === "en" ? locale : "ar";

  return (
    <html lang={locale} dir={dir} className={fontVariables}>
      <body>
        <ViewTransitions>
          <TransitionStyles />
          <NextIntlClientProvider messages={messages}>
            <LoaderShell locale={safeLocale}>{children}</LoaderShell>
          </NextIntlClientProvider>
        </ViewTransitions>
      </body>
    </html>
  );
}
