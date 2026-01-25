"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    const checkAuth = () => {
        const token = localStorage.getItem("admin_token");
        if (!token) {
            router.push("/admin"); // Login sayfasına salla
            return false;
        }
        return true;
    };

    useEffect(() => {
        // İlk açılış kontrolü
        if (checkAuth()) {
            setIsAuthenticated(true);
        }

        // DİĞER SAYFALARDAN GELEN LOGOUT İSTEĞİNİ DİNLE
        const handleUnauthorized = () => {
            localStorage.removeItem("admin_token");
            setIsAuthenticated(false);
            router.push("/admin");
        };

        window.addEventListener("force-logout", handleUnauthorized);

        // Sayfaya her dönüldüğünde (tab değiştirip gelince) kontrol et
        window.addEventListener("focus", checkAuth);

        return () => {
            window.removeEventListener("force-logout", handleUnauthorized);
            window.removeEventListener("focus", checkAuth);
        };
    }, [router]);

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d9a066]"></div>
            </div>
        );
    }

    return <>{children}</>;
}