import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

type OgCardProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  footerLeft: string;
  footerRight: string;
  titleSize?: number;
};

/** Shared Open Graph card so every page previews with the same visual identity. */
export function renderOgCard({
  eyebrow,
  title,
  subtitle,
  footerLeft,
  footerRight,
  titleSize = 96,
}: OgCardProps) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 24, color: "#a1a1a1", letterSpacing: 4 }}>
          {eyebrow}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: titleSize, fontWeight: 300, lineHeight: 1.1 }}>
            {title}
          </div>
          <div style={{ fontSize: 36, color: "#a1a1a1", lineHeight: 1.3 }}>
            {subtitle}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 26,
            color: "#a1a1a1",
          }}
        >
          <div>{footerLeft}</div>
          <div>{footerRight}</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
