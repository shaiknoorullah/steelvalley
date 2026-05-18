import type { ReactNode } from "react";

export const metadata = { title: "Steel Valley — Component showcase" };

/*
  Showcase route group layout.
  Until Plan 2 introduces the [locale] segment, the only root layout is src/app/layout.tsx
  (which renders <html lang="ar" dir="rtl">). The showcase page sets dir on its inner
  panes, so a nested layout without <html>/<body> is correct here.
*/
export default function ShowcaseLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
