/* eslint-disable @next/next/no-css-tags */
import config from "@payload-config";
import { RootLayout } from "@payloadcms/next/layouts";
import type { ReactNode } from "react";
import "./custom.scss";

export const metadata = {
  title: "Steel Valley — Admin",
};

const Layout = ({ children }: { children: ReactNode }) => (
  <RootLayout config={config}>{children}</RootLayout>
);

export default Layout;
