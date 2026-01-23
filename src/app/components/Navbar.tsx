"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [dynamicServices, setDynamicServices] = useState<{ name: string; href: string; id: string }[]>([]);


    const NAV_LINKS = [
        { name: "katalog", href: "/katalog" },
        { name: "Koleksiyonlar", href: "/katalog" },
        {
            name: "Hizmetlerimiz",
            href: "/hizmetlerimiz",
            subLinks: dynamicServices
        },
        { name: "Referanslar", href: "/referanslar" },
        { name: "hakkımızda", href: "/hakkimizda" },
        { name: "İletişim", href: "/iletisim" },
    ];

    return (
        <>
            <nav className="fixed top-0 w-full px-6 md:px-12 py-6 flex justify-between items-center z-[100] bg-white/80 backdrop-blur-md border-b border-black/5">
                <div className="font-light text-2xl tracking-tight relative z-[110]">
                    <Link href="/" onClick={() => setMenuOpen(false)}>EkolHome</Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-12 text-xs uppercase tracking-[0.2em] font-light items-center">
                    {NAV_LINKS.map((link) => (
                        <div
                            key={link.name}
                            className="relative group"
                            onMouseEnter={() => link.subLinks && setServicesOpen(true)}
                            onMouseLeave={() => link.subLinks && setServicesOpen(false)}
                        >
                            {link.subLinks ? (
                                <div className="flex items-center gap-1">
                                    <Link
                                        href={link.href}
                                        className="text-black/60 hover:text-black transition-colors py-2"
                                    >
                                        {link.name}
                                    </Link>

                                    <ChevronDown className={`w-3 h-3 text-black/40 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />

                                    <AnimatePresence>
                                        {servicesOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-full left-0 mt-2 w-64 bg-white border border-black/5 shadow-xl p-6 flex flex-col gap-4 normal-case tracking-normal"
                                            >
                                                {link.subLinks.map((sub) => (
                                                    <Link
                                                        key={sub.id} // Benzersiz ID kullanıldı
                                                        href={sub.href}
                                                        className="text-sm text-black/50 hover:text-black hover:translate-x-2 transition-all"
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link href={link.href} className="text-black/60 hover:text-black transition-colors">
                                    {link.name}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>

                <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden relative z-[110] p-2">
                    {menuOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6 text-black" />}
                </button>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 w-full h-screen bg-white z-[90] flex flex-col justify-center items-center overflow-y-auto pt-20"
                    >
                        <div className="flex flex-col items-center gap-6 text-xl font-light uppercase tracking-[0.2em]">
                            {NAV_LINKS.map((link) => (
                                <div key={link.name} className="flex flex-col items-center">
                                    {link.subLinks ? (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={link.href}
                                                    onClick={() => setMenuOpen(false)}
                                                    className="text-black/40"
                                                >
                                                    {link.name}
                                                </Link>
                                                <button onClick={() => setServicesOpen(!servicesOpen)}>
                                                    <ChevronDown className={`w-6 h-6 text-black/40 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                            </div>

                                            <AnimatePresence>
                                                {servicesOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="flex flex-col items-center gap-3 mt-4 mb-2 overflow-hidden"
                                                    >
                                                        {link.subLinks.map((sub) => (
                                                            <Link
                                                                key={sub.id} // Benzersiz ID kullanıldı
                                                                href={sub.href}
                                                                className="text-sm normal-case tracking-tight text-black/60"
                                                                onClick={() => setMenuOpen(false)}
                                                            >
                                                                {sub.name}
                                                            </Link>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </>
                                    ) : (
                                        <Link href={link.href} onClick={() => setMenuOpen(false)} className="text-black/40">
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