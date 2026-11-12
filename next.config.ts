import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Cabin and hero photos live on GSM's Guesty account.
      { protocol: "https", hostname: "assets.guesty.com", pathname: "/image/upload/**" },
      // Images uploaded through the Design by Dial admin panel are served from its /api/media proxy.
      { protocol: "https", hostname: "admin.weblaucher.com", pathname: "/api/media/**" },
    ],
  },
};

export default nextConfig;
