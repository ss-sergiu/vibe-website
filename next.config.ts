import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'cdn.sanity.io' },
      { hostname: 'images.unsplash.com' },
      { hostname: 'szfpobjmpbewgnbjaeba.supabase.co' },
    ],
    qualities: [80],
  },
  transpilePackages: ['sanity', '@sanity/vision', '@sanity/ui', '@sanity/icons'],
  async redirects() {
    return [
      { source: '/studio', destination: '/studio/structure', permanent: false },
    ]
  },
};

export default nextConfig;
