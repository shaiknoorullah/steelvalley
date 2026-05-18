import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

export const metadata = { title: "Steel Valley — Component showcase" };

/*
  Showcase route group root layout.

  Plan 2 moved the canonical root layout into `app/[locale]/layout.tsx`
  (locale-aware <html lang dir><body>). The (showcase) route group lives
  outside that locale segment, so we provide our own <html>/<body> here.

  The DS Link primitive uses next-intl's localized Link, which requires
  a NextIntlClientProvider to resolve the active locale. We provide one
  with the default locale's messages so /dev/components and
  /app-router-health continue to render without entering the [locale]
  segment.
*/
export default async function ShowcaseLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Showcase route uses English/LTR as the chrome (each inner pane sets its own
  // dir for the LTR-vs-RTL demonstration). Default-locale messages keep the
  // next-intl primitives resolving without entering the [locale] segment.
  const locale = routing.defaultLocale;
  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html lang="en" dir="ltr" className={fontVariables}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
