"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        // TypeScript hatasını düzelten kısım: e: MouseEvent
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);



    return (
        <main className="h-screen relative overflow-hidden bg-[#FAF9F6]">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 11px)`
                }} />
            </div>



            {/* Main Content */}
            <div className="h-full flex flex-col items-center justify-center px-6 relative z-10">
                <div className="text-center space-y-12 max-w-2xl">

                    {/* Parallax 404 Header */}
                    <div className="relative">
                        <motion.h1
                            animate={{
                                x: mousePosition.x * 0.8,
                                y: mousePosition.y * 0.8
                            }}
                            className="text-[20vw] md:text-[15vw] font-extralight tracking-tighter leading-none text-black/[0.03] select-none"
                        >
                            404
                        </motion.h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                animate={{ rotate: 45 + (mousePosition.x * 0.5) }}
                                className="w-32 h-32 md:w-48 md:h-48 border border-black/[0.05]"
                            />
                        </div>
                    </div>

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-6"
                    >
                        <h2 className="text-xl md:text-2xl uppercase tracking-[0.5em] font-light text-black">
                            Sayfa Bulunamadı
                        </h2>
                        <p className="text-sm text-gray-500 font-light max-w-md mx-auto leading-relaxed">
                            Aradığınız sayfanın iplikleri henüz dokunmamış olabilir.
                            Atölyemizin ana sayfasına dönerek yeni koleksiyonlarımızı keşfedin.
                        </p>
                    </motion.div>

                    {/* Navigation */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-col sm:flex-row gap-8 justify-center items-center pt-4"
                    >
                        <Link
                            href="/"
                            className="group relative px-12 py-5 bg-black text-white text-[10px] uppercase tracking-[0.3em] overflow-hidden transition-all duration-500"
                        >
                            <span className="relative z-10">Anasayfaya Dön</span>
                            <div className="absolute inset-0 bg-gray-800 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </Link>

                        <Link
                            href="/#collections"
                            className="text-[10px] uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors duration-300 border-b border-transparent hover:border-black"
                        >
                            Koleksiyonlar
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Decorative Borders */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/5 to-transparent" />
            <div className="absolute top-0 right-12 w-px h-full bg-gradient-to-b from-transparent via-black/5 to-transparent" />
        </main>
    );
}