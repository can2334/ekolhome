/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // BU SATIR SİHİRLİ: Tüm domainlere izin verir
      },
    ],
  },
};

export default nextConfig;