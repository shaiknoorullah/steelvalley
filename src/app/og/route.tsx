import { ImageResponse } from "next/og";

export const runtime = "nodejs";

// Satori (the renderer behind ImageResponse) doesn't support all OpenType
// GSUB lookup formats used by Arabic system fonts, which can crash the
// route. Keep the OG image Latin-only and stage the brand line in Saira
// Condensed-ish weight so it reads as identity art rather than a literal
// translation of the page title.

export async function GET(req: Request) {
  const url = new URL(req.url);
  const title = url.searchParams.get("title") ?? "Steel Valley";

  return new ImageResponse(
    (
      <div
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
        <div
          style={{
            fontSize: 88,
            lineHeight: 1.05,
            fontWeight: 700,
            maxWidth: "78%",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#e2611b",
            fontFamily: "monospace",
            letterSpacing: 2,
          }}
        >
          stainless steel fabrication — jeddah
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
