"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";

// Worker API URL - Burayı kendi endpoint'inle kontrol et
const API_URL = "https://ekolhome.smusa9883x.workers.dev/api/services";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [dynamicServices, setDynamicServices] = useState<{ name: string; href: string; id: string }[]>([]);

    // Veritabanından Hizmetleri Çekme
    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const formatted = data.map((item: any) => ({
                        id: item.id.toString(),
                        name: item.title,
                        href: `/hizmetlerimiz/${item.slug || item.id}`
                    }));
                    setDynamicServices(formatted);
                }
            })
            .catch(err => console.error("Navbar hizmetleri yüklenemedi:", err));
    }, []);

    const NAV_LINKS = [
        { name: "Anasayfa", href: "/" },
        { name: "katalog", href: "/katalog" },
        {
            name: "Hizmetlerimiz",
            href: "/hizmetlerimiz",
            subLinks: dynamicServices
        },
        { name: "Referanslar", href: "/referanslar" },
        { name: "İletişim", href: "/iletisim" },
    ];

    return (
        <>
            <nav className="fixed top-0 w-full px-6 md:px-12 py-6 flex justify-between items-center z-[100] bg-white/90 backdrop-blur-xl border-b border-black/5">
                {/* Logo */}
                <div className="relative z-[110]">
                    <Link href="/" onClick={() => setMenuOpen(false)} className="text-2xl font-light tracking-tighter uppercase">
                        EKOL<span className="font-serif italic text-[#d9a066] lowercase ml-1">Home</span>
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-10 text-[10px] uppercase tracking-[0.3em] font-bold items-center">
                    {NAV_LINKS.map((link) => (
                        <div
                            key={link.name}
                            className="relative group py-2"
                            onMouseEnter={() => link.subLinks && setServicesOpen(true)}
                            onMouseLeave={() => link.subLinks && setServicesOpen(false)}
                        >
                            <div className="flex items-center gap-1 cursor-pointer">
                                <Link
                                    href={link.href}
                                    className="text-black/50 hover:text-black transition-colors"
                                >
                                    {link.name}
                                </Link>
                                {link.subLinks && (
                                    <ChevronDown className={`w-3 h-3 text-black/20 transition-transform duration-500 ${servicesOpen ? 'rotate-180' : ''}`} />
                                )}
                            </div>

                            {/* Dropdown Menu */}
                            {link.subLinks && (
                                <AnimatePresence>
                                    {servicesOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 15 }}
                                            className="absolute top-full left-[-20px] pt-4 w-72"
                                        >
                                            <div className="bg-white border border-black/5 shadow-[0_20px_40px_rgba(0,0,0,0.08)] p-5 flex flex-col gap-1 rounded-sm backdrop-blur-3xl">
                                                {link.subLinks.map((sub) => (
                                                    <Link
                                                        key={sub.id}
                                                        href={sub.href}
                                                        className="text-[11px] uppercase tracking-widest text-black/40 hover:text-[#d9a066] hover:translate-x-2 transition-all py-2 border-b border-black/[0.03] last:border-0"
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    ))}
                </div>

                {/* Mobile Toggle */}
                <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden relative z-[110] p-2">
                    {menuOpen ? <X className="w-5 h-5 text-black" /> : <Menu className="w-5 h-5 text-black" />}
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 w-full h-screen bg-white z-[90] flex flex-col justify-center items-center p-12 overflow-y-auto"
                    >
                        <div className="flex flex-col items-center gap-8 w-full max-w-xs">
                            {NAV_LINKS.map((link) => (
                                <div key={link.name} className="w-full text-center border-b border-black/5 pb-4">
                                    {link.subLinks ? (
                                        <div className="flex flex-col gap-4">
                                            <button
                                                onClick={() => setServicesOpen(!servicesOpen)}
                                                className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.3em]"
                                            >
                                                {link.name} <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                                            </button>

                                            {servicesOpen && (
                                                <div className="flex flex-col gap-3 pt-2">
                                                    {link.subLinks.map((sub) => (
                                                        <Link
                                                            key={sub.id}
                                                            href={sub.href}
                                                            onClick={() => setMenuOpen(false)}
                                                            className="text-xs uppercase tracking-widest text-black/40"
                                                        >
                                                            {sub.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            onClick={() => setMenuOpen(false)}
                                            className="text-sm font-bold uppercase tracking-[0.3em]"
                                        >
                                            {link.name}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;