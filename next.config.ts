import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // 🛡️ AÇIKLARI KAPATAN AYARLAR
  poweredByHeader: false, // Saldırganların "Next.js" kullandığını görmesini engeller.
  reactStrictMode: true, // Hataları ve güvensiz kod yaklaşımlarını erkenden yakalar.

  images: {
    // 🛡️ Sadece belirli boyutlara izin vererek "Görüntü Boyutu Bombardımanı" (DoS) saldırısını önler
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
      {
        source: '/(.*)',
        headers: [
          // 🛡️ XSS ve Veri Enjeksiyonu Koruması (Content Security Policy)
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: cdn.sanity.io images.unsplash.com; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';"
          },
          // 🛡️ Clickjacking Koruması (Sitenin başkasının içinde açılmasını engeller)
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          // 🛡️ MIME-Sniffing Koruması (Dosya türü taklidini engeller)
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // 🛡️ Bilgi Sızıntısını Önleme (Hangi siteden gelindiği bilgisini sınırlar)
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // 🛡️ HTTPS Zorunluluğu (HSTS)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          }
        ]
      }
    ];
  }
};

export default nextConfig;