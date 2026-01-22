"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Image as ImageIcon,
    FileText,
    Settings,
    LogOut,
    Phone // İletişim için ekledim
} from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("admin_token");
        router.push("/");
    };

    const sidebarItems = [
        { name: "Genel Bakış", icon: <LayoutDashboard size={18} />, href: "/admin/dashboard" },
        { name: "Kataloglar", icon: <FileText size={18} />, href: "/admin/dashboard/katalog" },
        { name: "Referanslar", icon: <ImageIcon size={18} />, href: "/admin/dashboard/references" },
        { name: "İletişim", icon: <Phone size={18} />, href: "/admin/dashboard/iletisim" },
        { name: "Ayarlar", icon: <Settings size={18} />, href: "/admin/dashboard/settings" },
    ];

    return (
        <aside className="w-72 border-r border-white/5 bg-[#0A0A0A] flex flex-col p-8 sticky top-0 h-screen">
            <div className="mb-12">
                <h2 className="text-2xl font-extralight tracking-[0.3em] uppercase">
                    Ekol<span className="font-serif italic text-[#d9a066]">H</span>
                </h2>
            </div>

            <nav className="flex-1 space-y-2">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[11px] uppercase tracking-[0.2em] transition-all duration-300 ${isActive
                                ? "bg-[#d9a066] text-black font-bold shadow-[0_0_20px_rgba(217,160,102,0.3)]"
                                : "text-gray-500 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <button
                onClick={handleLogout}
                className="flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-red-400 transition-colors text-[11px] uppercase tracking-[0.2em]"
            >
                <LogOut size={18} /> Çıkış Yap
            </button>
        </aside>
    );
}