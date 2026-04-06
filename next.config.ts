import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

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

export default withNextIntl(nextConfig);
