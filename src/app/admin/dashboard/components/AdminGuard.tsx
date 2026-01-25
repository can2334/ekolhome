"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
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

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EAB308]"></div>
            </div>
        );
    }

    return <>{children}</>;
}