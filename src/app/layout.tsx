"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // URL "/admin" ile başlıyorsa Navbar ve Footer'ı gizle
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <html lang="tr">
      <body className={inter.className}>
        {!isAdminPage && <Navbar />}

        {children}

        {!isAdminPage && <Footer />}
      </body>
    </html>
  );
}