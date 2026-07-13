import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/privacy-policy',
        destination: '/privacy',
        permanent: true,
      },
      {
        source: '/terms-and-conditions',
        destination: '/terms',
        permanent: true,
      },
      {
        source: '/cnts',
        destination: '/',
        permanent: true,
      },
      {
        source: '/student',
        destination: '/academy',
        permanent: true,
      },
      {
        source: '/student/:path*',
        destination: '/academy',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
