import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const githubPagesBasePath = process.env.GITHUB_PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // The production host uses server rendering, while GitHub Pages needs a
  // self-contained static export. The same source supports both.
  output: isGitHubPages ? "export" : undefined,
  basePath: isGitHubPages ? githubPagesBasePath : undefined,
  assetPrefix: isGitHubPages && githubPagesBasePath ? `${githubPagesBasePath}/` : undefined,
  trailingSlash: isGitHubPages,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
