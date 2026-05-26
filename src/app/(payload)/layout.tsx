/* eslint-disable @next/next/no-css-tags */
import config from "@payload-config";
import {
  type ServerFunctionClient,
  handleServerFunctions,
  RootLayout,
} from "@payloadcms/next/layouts";
import type { ReactNode } from "react";
import { importMap } from "./admin/importMap.js";
// Payload v3 admin stylesheet — without this the admin renders raw HTML
import "@payloadcms/next/css";
import "./custom.scss";

export const metadata = {
  title: "Steel Valley — Admin",
};

// Required by Payload v3 (since ~3.20): the admin shell calls server actions
// through this client to fetch data, run server-side hooks, etc.
const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

const Layout = ({ children }: { children: ReactNode }) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
);

export default Layout;
