import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  reactStrictMode: true,

  images: {
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },

  async headers() {
    return [
      // 🔓 SANITY STUDIO (SERBEST)
      {
        source: '/studio/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src * data: blob:;
              script-src * 'unsafe-inline' 'unsafe-eval';
              style-src * 'unsafe-inline';
              img-src * data: blob:;
              connect-src *;
              frame-ancestors *;
            `.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },

      // 🔒 NORMAL SITE (GÜVENLİ)
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              img-src 'self' https://cdn.sanity.io https://images.unsplash.com;
              script-src 'self';
              style-src 'self' 'unsafe-inline';
            `.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ]
  },
};

export default nextConfig;