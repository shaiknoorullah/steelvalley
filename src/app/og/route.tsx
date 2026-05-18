import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const title = url.searchParams.get("title") ?? "Steel Valley";
  const locale = url.searchParams.get("locale") === "en" ? "en" : "ar";
  const dir = locale === "ar" ? "rtl" : "ltr";

  return new ImageResponse(
    (
      <div
        dir={dir}
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0b",
          color: "#f2f0ec",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#c7cdd6",
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          STEEL VALLEY
        </div>
        <div style={{ fontSize: 88, lineHeight: 1.05, fontWeight: 700 }}>
          {title}
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#e2611b",
            fontFamily: "monospace",
          }}
        >
          {locale === "ar"
            ? "صناعة الفولاذ — جدة"
            : "stainless steel fabrication — jeddah"}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
