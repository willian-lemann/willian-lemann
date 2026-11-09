/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      // Markdown version of each post for LLMs/agents: /blog/<slug>.md
      { source: "/blog/:slug.md", destination: "/blog/:slug/raw.md" },
    ];
  },
}

export default nextConfig
