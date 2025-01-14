import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["img.spoonacular.com"], // Tambahkan domain di sini
  },
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint checks during production builds
  },
};

export default nextConfig;
