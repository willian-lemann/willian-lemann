import { ImageResponse } from "next/og";
import { page, YEARS_OF_EXPERIENCE } from "@/lib/constants";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.jobTitle}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          PORTFOLIO
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 96, fontWeight: 300, lineHeight: 1 }}>
            {site.name}
          </div>
          <div style={{ fontSize: 40, color: "#a1a1a1" }}>{site.jobTitle}</div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 26,
            color: "#a1a1a1",
          }}
        >
          <div>{page.focus.slice(0, 4).join(" · ")}</div>
          <div>{`${site.countryName} · ${YEARS_OF_EXPERIENCE}+ yrs`}</div>
        </div>
      </div>
    ),
    size,
  );
}
