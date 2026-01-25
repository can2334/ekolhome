"use client";
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
    // Daha akıcı bir hareket için spring animasyonu ekledik
    const mouseX = useSpring(useMotionValue(0), { stiffness: 50, damping: 20 });
    const mouseY = useSpring(useMotionValue(0), { stiffness: 50, damping: 20 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set((e.clientX / window.innerWidth - 0.5) * 30);
            mouseY.set((e.clientY / window.innerHeight - 0.5) * 30);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <main className="h-screen w-full relative overflow-hidden bg-[#FDFDFD] flex items-center justify-center">
            {/* Arka Plan Deseni - Daha zarif bir doku */}
            <div className="absolute inset-0 z-0 opacity-[0.02]"
                style={{ backgroundImage: `radial-gradient(#000 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }}
            />

            {/* İçerik Konteynırı */}
            <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center">

                {/* 404 Görsel Alanı */}
                <div className="relative mb-8 md:mb-12">
                    <motion.div
                        style={{ x: mouseX, y: mouseY }}
                        className="text-[25vw] md:text-[18vw] font-extralight text-black/[0.04] leading-none select-none italic"
                    >
                        404
                    </motion.div>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            animate={{
                                rotate: [45, 225, 45],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="w-24 h-24 md:w-40 md:h-40 border-[0.5px] border-black/10 backdrop-blur-[2px]"
                        />
                    </div>
                </div>

                {/* Yazı Alanı */}
                <div className="text-center space-y-6 md:space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-2xl md:text-4xl font-light tracking-[0.3em] uppercase text-neutral-900 mb-4">
                            Kusursuz Bir Hata
                        </h1>
                        <p className="text-xs md:text-sm text-neutral-500 font-light max-w-[280px] md:max-w-md mx-auto leading-relaxed tracking-wide">
                            Aradığınız sayfa henüz koleksiyonumuza dahil edilmemiş olabilir.
                            Zarafet dolu ana sayfamıza dönerek yolculuğunuza devam edin.
                        </p>
                    </motion.div>

                    {/* Butonlar - Mobil uyumlu yapı */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4"
                    >
                        <Link
                            href="/"
                            className="w-full sm:w-auto px-10 py-4 bg-neutral-900 text-white text-[10px] md:text-[11px] uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all duration-300 rounded-full shadow-sm shadow-black/10"
                        >
                            Ana Sayfaya Dön
                        </Link>

                        <Link
                            href="/#collections"
                            className="group relative text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-neutral-400 hover:text-neutral-900 transition-colors duration-300"
                        >
                            Koleksiyonlar
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-neutral-900 transition-all duration-300 group-hover:w-full" />
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Kenar Detayları - Tasarımın çerçevesi */}
            <div className="hidden md:block absolute top-10 left-10 text-[10px] tracking-[0.4em] text-neutral-300 uppercase vertical-text">
                Atölye No: 404
            </div>
            <div className="absolute bottom-10 right-10 flex gap-4 opacity-20">
                <div className="w-12 h-[1px] bg-black" />
                <div className="w-4 h-[1px] bg-black" />
            </div>
        </main>
    );
}