import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Cursor from "./components/Cursor";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ekol Textile | Ustalıkla Şekillenen Sanat",
  description: "Modern ve lüks tekstil çözümleri.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Navbar />
        {/* Cursor artık body içinde, hydration hatası vermez */}
        <Cursor />
        {/* Sayfa içerikleri */}
        {children}
        <Footer />

      </body>
    </html>
  );
}