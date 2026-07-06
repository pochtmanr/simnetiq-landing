import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Required for app/global-not-found.tsx — with two root layouts (en/ru
    // route groups) there is no single layout to compose a global 404 from.
    globalNotFound: true,
  },
};

export default nextConfig;
