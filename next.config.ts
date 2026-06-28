import type { NextConfig } from "next";

const repo = "KTC";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  // GitHub Pages serves at https://<user>.github.io/<repo>/
  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,
  trailingSlash: true,
};

export default nextConfig;
