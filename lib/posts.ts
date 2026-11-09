import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

/**
 * Blog posts live in `content/posts/<slug>.md` with frontmatter:
 *
 * ---
 * title: "Post title"
 * description: "One or two sentences — used for meta description, cards and RSS."
 * date: 2026-11-09
 * updated: 2026-11-20   # optional
 * tags: [React, Performance]
 * draft: true           # optional — drafts only show up in `next dev`
 * ---
 */

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const WORDS_PER_MINUTE = 220;

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: string[];
  draft: boolean;
  readingMinutes: number;
};

export type Post = PostMeta & {
  markdown: string;
  html: string;
};

function toIsoDate(value: unknown): string | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
}

function readPostFile(slug: string): Post {
  const raw = fs.readFileSync(path.join(POSTS_DIR, `${slug}.md`), "utf8");
  const { data, content } = matter(raw);

  const date = toIsoDate(data.date);
  if (!data.title || !data.description || !date) {
    throw new Error(
      `content/posts/${slug}.md must define title, description and a valid date in its frontmatter.`,
    );
  }

  const words = content.trim().split(/\s+/).filter(Boolean).length;

  return {
    slug,
    title: String(data.title),
    description: String(data.description),
    date,
    updated: toIsoDate(data.updated),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: Boolean(data.draft),
    readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
    markdown: content.trim(),
    html: marked.parse(content, { async: false, gfm: true }),
  };
}

const showDrafts = process.env.NODE_ENV === "development";

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
    .map((file) => readPostFile(file.replace(/\.md$/, "")))
    .filter((post) => showDrafts || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function toPostMeta({ markdown, html, ...meta }: Post): PostMeta {
  return meta;
}

export function formatPostDate(isoDate: string) {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
