import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: '/modules/upload',
        destination: '/modules',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
