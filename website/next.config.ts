import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/forge",
        destination: "/nanoforge",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;