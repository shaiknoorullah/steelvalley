/*
  size-limit budgets for Steel Valley.

  Targets ONLY App Router (`.next/static/chunks/app/**`).
  Pages Router chunks (e.g. /products at 246 KB) are legacy and retire in Plan 4
  — they are intentionally excluded from these budgets.

  Spec §5 contract: JS first-load < 180kb gzip per locale entry.
*/
module.exports = [
  {
    name: "App Router page chunks (first-load JS budget — per page)",
    path: ".next/static/chunks/app/**/page-*.js",
    limit: "180 KB",
    gzip: true,
  },
  {
    name: "App Router framework + main-app + webpack runtime",
    path: [
      ".next/static/chunks/framework-*.js",
      ".next/static/chunks/main-app-*.js",
      ".next/static/chunks/webpack-*.js",
    ],
    limit: "300 KB",
    gzip: true,
  },
  // Per-scene 3D budget — uncomment when Plan 6 lands the first Lazy3D scene
  // with `webpackChunkName: "Lazy3D-<sceneName>"`. Until then, size-limit
  // errors on empty matches so we leave this commented and documented.
  //
  // {
  //   name: "Each 3D scene chunk (Lazy3D-loaded)",
  //   path: ".next/static/chunks/Lazy3D-*.js",
  //   limit: "180 KB",
  //   gzip: true,
  //   // To exclude peer deps (three/@react-three/fiber/drei) from the count,
  //   // install @size-limit/webpack and add: ignore: ["three", "@react-three/fiber", "@react-three/drei"].
  // },
];

