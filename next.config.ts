import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },

  async rewrites() {
    return [
      { source: '/public/home', destination: '/' },        // home → root
      { source: '/public/:path*', destination: '/:path*' }, // everything else
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms4.webfocusprod.wsiph2.com',
      },
    ],
  },
};

export default nextConfig;