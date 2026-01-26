"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const isLoginPage = pathname === "/admin/login" || pathname === "/admin";

    useEffect(() => {
        // --- GÜNCELLEME: Çerez Kontrolü ---
        const tokenInLocal = localStorage.getItem("admin_token");
        const tokenInCookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("admin_token="))
            ?.split("=")[1];

        // Hem local'de hem çerezde token olmalı
        const hasValidToken = !!(tokenInLocal && tokenInCookie);

        if (!hasValidToken && !isLoginPage) {
            // Oturum geçersiz, temizle ve login'e at
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin_user");
            router.push("/admin");
        } else if (hasValidToken && isLoginPage) {
            // Zaten giriş yapmış, dashboard'a gönder
            router.push("/admin/dashboard");
        } else {
            setIsAuthenticated(hasValidToken);
            setIsLoading(false);
        }
    }, [pathname, isLoginPage, router]);

    if (isLoading && !isLoginPage) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d9a066]"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#0A0A0A] overflow-hidden">
            {isAuthenticated && !isLoginPage && <Sidebar />}
            <main className={`flex-1 overflow-y-auto font-sans ${!isAuthenticated || isLoginPage ? 'w-full' : ''}`}>
                {children}
            </main>
        </div>
    );
}