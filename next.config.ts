import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "youtube-sr",
    "ytmusic-api"
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/**',
      }
    ]
  }

};

export default nextConfig;
