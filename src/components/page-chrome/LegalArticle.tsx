import type { ReactNode } from "react";
import { PageShell } from "./PageShell";

type Locale = "en" | "ar";

export interface LegalArticleProps {
  locale: Locale;
  effectiveDate: string;
  title: string;
  todoNote: string;
  children: ReactNode;
}

const META_LABEL: Record<Locale, string> = {
  en: "Effective",
  ar: "ساري من",
};

export function LegalArticle({
  locale,
  effectiveDate,
  title,
  todoNote,
  children,
}: LegalArticleProps) {
  return (
    <PageShell locale={locale}>
      <article data-legal-article>
        <p data-legal-meta>
          {META_LABEL[locale]} · {effectiveDate}
        </p>
        <h1>{title}</h1>
        {children}
        <p data-legal-todo>TODO · {todoNote}</p>
      </article>
    </PageShell>
  );
}
