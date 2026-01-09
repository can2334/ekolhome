"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            {/* --- Main Navigation --- */}
            <nav className="fixed top-0 w-full px-6 md:px-12 py-6 flex justify-between items-center z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-light text-2xl tracking-tight"
                >
                    <Link href="/">EkolHome</Link>
                </motion.div>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-12 text-xs uppercase tracking-[0.2em] font-light">
                    <Link href="/#collections" className="hover:text-gray-400 transition-colors">Koleksiyonlar</Link>
                    <Link href="/about" className="hover:text-gray-400 transition-colors">Hakkımızda</Link>
                    <Link href="/iletisim" className="hover:text-gray-400 transition-colors">İletişim</Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden w-10 h-10 flex items-center justify-center z-[60]"
                >
                    {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </nav>

            {/* --- Mobile Menu Overlay --- */}
            <motion.div
                initial={false}
                animate={{ x: menuOpen ? 0 : "100%" }}
                transition={{ type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="fixed top-0 right-0 w-full h-screen bg-white z-[55] flex flex-col justify-center items-center gap-8 text-3xl uppercase tracking-wider md:hidden shadow-2xl"
            >
                <Link href="/#collections" onClick={() => setMenuOpen(false)}>Koleksiyonlar</Link>
                <Link href="/hakkimizda" onClick={() => setMenuOpen(false)}>Hakkımızda</Link>
                <Link href="/iletisim" onClick={() => setMenuOpen(false)}>İletişim</Link>
            </motion.div>
        </>
    );
};

export default Navbar;