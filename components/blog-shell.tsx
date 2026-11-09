import Link from "next/link";
import type React from "react";
import { site } from "@/lib/site";

type Crumb = { name: string; href?: string };

/** Minimal layout for blog pages, matching the portfolio's look. */
export function BlogShell({
  crumbs,
  children,
}: {
  crumbs: Crumb[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 sm:px-8">
        <header className="py-10 sm:py-14">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground font-mono">
              <li>
                <Link
                  href="/"
                  className="hover:text-foreground transition-colors duration-300"
                >
                  {site.name}
                </Link>
              </li>
              {crumbs.map((crumb) => (
                <li key={crumb.name} className="flex items-center gap-2">
                  <span aria-hidden="true">/</span>
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="hover:text-foreground transition-colors duration-300"
                    >
                      {crumb.name}
                    </Link>
                  ) : (
                    <span aria-current="page" className="line-clamp-1">
                      {crumb.name}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="mt-24 py-12 border-t border-border text-sm text-muted-foreground flex flex-col sm:flex-row gap-4 sm:justify-between">
          <span>
            Written by{" "}
            <Link href="/" className="text-foreground hover:underline">
              {site.name}
            </Link>
            , {site.jobTitle}.
          </span>
          <a
            href="/blog/feed.xml"
            className="hover:text-foreground transition-colors duration-300"
          >
            RSS
          </a>
        </footer>
      </div>
    </div>
  );
}
