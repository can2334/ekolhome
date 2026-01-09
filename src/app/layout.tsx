"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { usePathname } from "next/navigation";
import WhatsAppButton from "./components/WhatsAppButton";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdminPage = pathname.startsWith("/admin");

  return (
    <html lang="tr">
      <body className={`${inter.className} relative`}>
        {!isAdminPage && <Navbar />}

        {children}

        {!isAdminPage && <Footer />}
        {!isAdminPage && <WhatsAppButton />}
      </body>
    </html>
  );
}