import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/network-guide",
  images: { unoptimized: true },
};

export default withMDX(nextConfig);
