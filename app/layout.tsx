import type React from "react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { YEARS_OF_EXPERIENCE } from "@/lib/constants";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Willian Lemann - Software Engineer - Heavy Frontend",
  description: `Software Engineer with heavy skills for Frontend and AI integrations from Brazil with ${YEARS_OF_EXPERIENCE} years of experience.`,
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
