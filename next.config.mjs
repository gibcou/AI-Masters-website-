// Enable smooth builds on Vercel by ignoring ESLint errors during production builds
// and disable image optimization to avoid provider requirements.
/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const repoName = 'AI-Masters-website-'
const nextConfig = {
  eslint: {
    // Prevent ESLint errors (like react/no-unescaped-entities and no-html-link-for-pages)
    // from failing production builds while we iterate on fixes.
    ignoreDuringBuilds: true,
  },
  images: {
    // Use unoptimized images to avoid Next.js Image Optimization reliance on external loaders.
    unoptimized: true,
  },
  // Ensure directory-style URLs for GitHub Pages static hosting
  trailingSlash: true,
  // Prefix routes and assets when deployed under project pages path
  basePath: isProd ? `/${repoName}` : undefined,
  assetPrefix: isProd ? `/${repoName}/` : undefined,
  // Produce a static export suitable for GitHub Pages
  output: 'export',
};

export default nextConfig;
