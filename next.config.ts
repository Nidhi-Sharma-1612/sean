import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Cabin and hero photos live on GSM's Guesty account.
      { protocol: "https", hostname: "assets.guesty.com", pathname: "/image/upload/**" },
    ],
  },
};

export default nextConfig;
