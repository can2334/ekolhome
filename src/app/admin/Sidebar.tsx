"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    ImageIcon,
    FileText,
    Settings,
    LogOut,
    Phone,
    Menu,
    X
} from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("admin_token");
        router.push("/");
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    const sidebarItems = [
        { name: "Genel Bakış", icon: <LayoutDashboard size={18} />, href: "/admin/dashboard" },
        { name: "Kataloglar", icon: <FileText size={18} />, href: "/admin/dashboard/katalog" },
        { name: "Referanslar", icon: <ImageIcon size={18} />, href: "/admin/dashboard/references" },
        { name: "İletişim", icon: <Phone size={18} />, href: "/admin/dashboard/iletisim" },
        { name: "Ayarlar", icon: <Settings size={18} />, href: "/admin/dashboard/settings" },
    ];

    return (
        <>
            {/* MOBİL ÜST BAR (Sadece mobilde görünür ve en üst katmandadır) */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0A0A0A] border-b border-white/5 flex items-center justify-between px-6 z-[110]">
                <h2 className="text-lg font-extralight tracking-[0.2em] uppercase">
                    Ekol<span className="font-serif italic text-[#d9a066]">Home</span>
                </h2>
                <button
                    onClick={toggleMenu}
                    className="p-2 text-[#d9a066] hover:bg-white/5 rounded-lg transition-all active:scale-90"
                >
                    {isOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
            </div>

            {/* ARKA PLAN KARARTMA (Menü açıkken tıklanırsa kapanır) */}
            <div
                className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[100] lg:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={toggleMenu}
            />

            {/* SIDEBAR ANA GÖVDE */}
            <aside className={`
                fixed top-0 left-0 h-screen w-72 bg-[#0A0A0A] border-r border-white/5 
                flex flex-col p-8 z-[120] transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
                lg:sticky lg:translate-x-0 
                ${isOpen ? "translate-x-0 shadow-2xl shadow-black" : "-translate-x-full"}
            `}>
                {/* Logo Bölümü (Mobilde X butonu ile) */}
                <div className="mb-12 flex items-center justify-between">
                    <h2 className="text-2xl font-extralight tracking-[0.3em] uppercase">
                        Ekol<span className="font-serif italic text-[#d9a066]">Home</span>
                    </h2>
                    <button onClick={toggleMenu} className="lg:hidden p-2 text-gray-500 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Navigasyon Linkleri */}
                <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] transition-all duration-300 group ${isActive
                                    ? "bg-[#d9a066] text-black font-bold shadow-[0_10px_25px_rgba(217,160,102,0.25)]"
                                    : "text-gray-500 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <span className={`${isActive ? "text-black" : "text-[#d9a066] group-hover:scale-110 transition-transform duration-300"}`}>
                                    {item.icon}
                                </span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Alt Kısım: Çıkış Yap */}
                <div className="mt-auto pt-6 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-5 py-4 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all text-[11px] uppercase tracking-[0.2em]"
                    >
                        <LogOut size={18} /> Çıkış Yap
                    </button>
                </div>
            </aside>
        </>
    );
}