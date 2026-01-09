"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";

// Linkleri tek bir merkezden yönetiyoruz
const NAV_LINKS = [
    { name: "Koleksiyonlar", href: "/#collections" },
    { name: "Hakkımızda", href: "/about" },
    { name: "İletişim", href: "/iletisim" },
];

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-0 w-full px-6 md:px-12 py-6 flex justify-between items-center z-[100] bg-white/80 backdrop-blur-md border-b border-black/5">
                <div className="font-light text-2xl tracking-tight relative z-[110]">
                    <Link href="/" onClick={() => setMenuOpen(false)}>EkolHome</Link>
                </div>

                {/* Desktop Menu - Map ile çekiyoruz */}
                <div className="hidden md:flex gap-12 text-xs uppercase tracking-[0.2em] font-light">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="hover:text-gray-400 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden relative z-[110] p-2 -mr-2"
                >
                    {menuOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6 text-black" />}
                </button>
            </nav>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 w-full h-screen bg-white z-[90] flex flex-col justify-center items-center gap-10 md:hidden"
                    >
                        {/* Mobile Menu - Aynı veriyi burada da Map ile çekiyoruz */}
                        <div className="flex flex-col items-center gap-8 text-2xl font-light uppercase tracking-[0.2em]">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <div className="absolute bottom-12 text-[10px] tracking-[0.5em] text-gray-400">
                            EKOLHOME STUDIO © 2026
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;