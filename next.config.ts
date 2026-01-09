import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  reactStrictMode: true,
  // Sitenin Next.js ile yapıldığını gizler (küçük bir güvenlik önlemi)
  poweredByHeader: false, 

  images: {
    // Resimlerin patlamaması için gerekli olan Sanity ve Unsplash izinleri
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
};

export default nextConfig;
