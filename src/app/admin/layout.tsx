"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar"; // Sidebar yolunu kontrol et

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("admin_token");

        if (!token) {
            router.push("/admin/login");
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    // Kontrol süresince boş ekran veya loader göster
    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EAB308]"></div>
            </div>
        );
    }

    // Yetki varsa: Sidebar ve Sayfa İçeriğini render et
    return (
        <div className="flex h-screen bg-[#0A0A0A] overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto font-sans">
                {children}
            </main>
        </div>
    );
}