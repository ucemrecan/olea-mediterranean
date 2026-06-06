import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Compile the shared workspace package from source.
  transpilePackages: ["@olea/menu-data"],
};

export default nextConfig;
