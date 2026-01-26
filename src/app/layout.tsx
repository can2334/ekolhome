"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { usePathname } from "next/navigation";
import WhatsAppButton from "./components/WhatsAppButton";
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  // Sayfa yoluna göre başlığı belirleme fonksiyonu
  const getPageTitle = () => {
    if (pathname === "/") return "ANA SAYFA";

    // /hizmetler -> HİZMETLER , /hakkimizda -> HAKKIMIZDA yapar
    const path = pathname.split("/").pop() || "";
    const formattedPath = path.replace(/-/g, " ").toUpperCase();

    return formattedPath;
  };

  const dynamicTitle = `EKOLHOME | ${getPageTitle()}`;

  return (
    <html lang="tr">
      <head>
        <title>{dynamicTitle}</title>
        <meta name="description" content="Ekolhome Premium Veri Yönetim Paneli" />
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>

      <body className={`${inter.className} relative`}>
        {!isAdminPage && <Navbar />}

        {children}

        {!isAdminPage && <Footer />}
        {!isAdminPage && <WhatsAppButton />}

        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}