"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // 1. BURASI KRİTİK: Eğer sayfa login sayfasıysa korumayı devre dışı bırak
    const isLoginPage = pathname === "/admin/login" || pathname === "/admin";

    useEffect(() => {
        const token = localStorage.getItem("admin_token");

        if (!token && !isLoginPage) {
            // Token yok ve login sayfasında değilse: Login'e şutla
            router.push("/admin/");
        } else if (token && isLoginPage) {
            // Token VAR ama hala login sayfasındaysa: Dashboard'a şutla
            router.push("/admin/dashboard");
        } else {
            // Her şey yolundaysa yüklemeyi bitir
            setIsAuthenticated(!!token);
            setIsLoading(false);
        }
    }, [pathname, isLoginPage, router]);

    // Sayfa kontrol ediliyorken bekleme ekranı
    if (isLoading && !isLoginPage) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d9a066]"></div>
            </div>
        );
    }

    // 2. SIDEBAR SADECE LOGIN DIŞINDA GÖRÜNSÜN
    return (
        <div className="flex h-screen bg-[#0A0A0A] overflow-hidden">
            {isAuthenticated && !isLoginPage && <Sidebar />}
            <main className={`flex-1 overflow-y-auto font-sans ${!isAuthenticated || isLoginPage ? 'w-full' : ''}`}>
                {children}
            </main>
        </div>
    );
}