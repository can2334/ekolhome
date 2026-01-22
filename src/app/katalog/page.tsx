"use client";

import { useState, useEffect } from "react";
import Image from 'next/image';
import { Download, Eye } from 'lucide-react';
import { motion } from "framer-motion";

// Worker API Endpoint
const API_URL = "https://ekolhome.smusa9883x.workers.dev/api/catalog";

interface KatalogItem {
    id: number;
    title: string;
    cover_image: string;
    pdf_url: string;
    season: string;
    description: string;
}

export default function KatalogPage() {
    const [kataloglar, setKataloglar] = useState<KatalogItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                setKataloglar(data);
                setLoading(false);
            })
            .catch(err => console.error("Katalog yüklenemedi:", err));
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center text-[10px] tracking-[0.3em] uppercase opacity-50">
            Koleksiyonlar Hazırlanıyor...
        </div>
    );

    return (
        <main className="min-h-screen bg-[#F9F9F9] pt-40 pb-20 px-6 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Başlık Bölümü */}
                <header className="text-center mb-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[11px] uppercase tracking-[0.5em] text-gray-400 mb-4 font-bold"
                    >
                        EkolHome Koleksiyonları
                    </motion.h2>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-extralight tracking-tighter text-black mb-8"
                    >
                        Dijital <span className="font-serif italic text-gray-500">Katalog</span>
                    </motion.h1>
                    <div className="w-16 h-[1px] bg-black mx-auto"></div>
                </header>

                {/* Katalog Listesi */}
                <div className="space-y-32">
                    {kataloglar.map((item, index) => (
                        <motion.section
                            key={item.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
                        >
                            {/* Katalog Kapağı */}
                            <div className="w-full md:w-1/2 relative group">
                                <div className="relative aspect-[3/4] overflow-hidden shadow-[30px_30px_60px_-15px_rgba(0,0,0,0.3)] bg-white rounded-sm">
                                    <Image
                                        src={item.cover_image}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                        <a
                                            href={item.pdf_url}
                                            target="_blank"
                                            className="bg-white text-black px-8 py-4 text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-gray-100 transition-all transform translate-y-4 group-hover:translate-y-0 duration-500"
                                        >
                                            <Eye size={16} /> Hemen İncele
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Katalog Bilgisi */}
                            <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
                                <span className="text-[10px] text-[#d9a066] font-bold uppercase tracking-widest">{item.season}</span>
                                <h3 className="text-4xl font-light text-black tracking-tight leading-tight">
                                    {item.title} <br />
                                    <span className="text-xl text-gray-400 font-serif italic tracking-normal">Tasarım & Uygulama</span>
                                </h3>
                                <p className="text-gray-500 font-light leading-relaxed max-w-md mx-auto md:mx-0">
                                    {item.description || "Zanaatkar dokunuşların ve modern estetiğin bir araya geldiği özel koleksiyonumuzu detaylıca inceleyin."}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                                    <a
                                        href={item.pdf_url}
                                        download
                                        className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold border-b border-black pb-2 hover:text-[#d9a066] hover:border-[#d9a066] transition-all"
                                    >
                                        <Download size={14} /> PDF Olarak İndir
                                    </a>
                                </div>
                            </div>
                        </motion.section>
                    ))}
                </div>

                {/* Alt Bilgi */}
                <footer className="mt-40 pt-20 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-400 font-light italic">
                        Basılı katalog talepleriniz için lütfen <a href="/iletisim" className="text-black border-b border-black hover:text-[#d9a066] transition-colors">merkez ofisimizle</a> iletişime geçiniz.
                    </p>
                </footer>
            </div>
        </main>
    );
}