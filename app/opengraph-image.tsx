import { page, YEARS_OF_EXPERIENCE } from "@/lib/constants";
import { OG_SIZE, renderOgCard } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.jobTitle}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgCard({
    eyebrow: "PORTFOLIO",
    title: site.name,
    subtitle: site.jobTitle,
    footerLeft: page.focus.slice(0, 4).join(" · "),
    footerRight: `${site.countryName} · ${YEARS_OF_EXPERIENCE}+ yrs`,
  });
}
