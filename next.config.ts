import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/instrument";

const nextConfig: NextConfig = {
  basePath,
  assetPrefix: basePath,
  // Production behind Apache reverse proxy
  poweredByHeader: false,
};

export default nextConfig;
