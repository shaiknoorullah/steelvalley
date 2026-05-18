import type { ReactNode } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { ViewTransitions } from "next-view-transitions";
import { routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { LoaderShell } from "@/components/loader/LoaderShell";
import { TransitionStyles } from "@/components/transitions/TransitionStyles";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import { LeadMagnetPopup } from "@/components/marketing/LeadMagnetPopup";
import { WhatsAppCTA } from "@/components/marketing/WhatsAppCTA";
import { CookieBanner } from "@/components/marketing/CookieBanner";
import { OpenPanelGate } from "@/components/analytics/OpenPanelGate";
import { EventBridge } from "@/components/analytics/EventBridge";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safe: "ar" | "en" = locale === "en" ? "en" : "ar";
  return buildMetadata({ locale: safe, path: "/" });
}

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
  const safeLocale: "ar" | "en" =
    locale === "ar" || locale === "en" ? locale : "ar";

  const openPanelClientId =
    process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID?.trim() ?? "";

  return (
    <html lang={locale} dir={dir} className={fontVariables}>
      <body>
        <ViewTransitions>
          <TransitionStyles />
          <NextIntlClientProvider messages={messages}>
            <LoaderShell locale={safeLocale}>{children}</LoaderShell>
            <LeadMagnetPopup />
            <WhatsAppCTA />
            <CookieBanner />
            <OpenPanelGate clientId={openPanelClientId} />
            <EventBridge />
          </NextIntlClientProvider>
        </ViewTransitions>
      </body>
    </html>
  );
}
