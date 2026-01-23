"use client";

import { useState, useEffect } from "react";
import Image from 'next/image';
import { Download, Eye, FileText } from 'lucide-react';
import { motion } from "framer-motion";
import Link from "next/link"; // Next.js Link bileşeni eklendi

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

    // Yardımcı fonksiyon: URL'lerin başına / ekler
    const formatUrl = (path: string) => path.startsWith('/') ? path : `/${path}`;

    if (loading) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-2 border-[#d9a066] border-t-transparent rounded-full animate-spin"></div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-gray-400 animate-pulse">
                Koleksiyonlar Hazırlanıyor...
            </div>
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
                    <div className="w-16 h-[1px] bg-black mx-auto opacity-20"></div>
                </header>

                {/* Katalog Listesi */}
                <div className="space-y-40">
                    {kataloglar.map((item, index) => (
                        <motion.section
                            key={item.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-16 items-center`}
                        >
                            {/* Katalog Kapağı */}
                            <div className="w-full md:w-1/2 relative group">
                                <Link href={`/katalog/${item.id}`}> {/* Detay sayfasına link */}
                                    <div className="relative aspect-[3/4] overflow-hidden shadow-[20px_40px_80px_-15px_rgba(0,0,0,0.2)] bg-white rounded-sm cursor-pointer">
                                        <Image
                                            src={formatUrl(item.cover_image)}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                                            unoptimized
                                        />
                                        {/* Overlay Hover */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                            <div className="flex flex-col items-center gap-4 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                                                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                                                    <Eye size={20} />
                                                </div>
                                                <span className="text-white text-[10px] uppercase tracking-[0.3em] font-bold">Kataloğu Aç</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                {/* Arka Dekoratif Sayı */}
                                <span className="absolute -bottom-10 -left-10 text-[12rem] font-black text-black/[0.03] -z-10 select-none hidden md:block">
                                    0{index + 1}
                                </span>
                            </div>

                            {/* Katalog Bilgisi */}
                            <div className="w-full md:w-1/2 space-y-8 text-center md:text-left">
                                <div className="space-y-2">
                                    <span className="text-[10px] text-[#d9a066] font-black uppercase tracking-[0.4em]">{item.season}</span>
                                    <h3 className="text-4xl md:text-5xl font-light text-black tracking-tight leading-tight uppercase">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center gap-2 justify-center md:justify-start pt-2">
                                        <div className="w-8 h-[1px] bg-[#d9a066]"></div>
                                        <span className="text-xs text-gray-400 font-serif italic tracking-wide">Premium Tasarım Serisi</span>
                                    </div>
                                </div>

                                <p className="text-gray-500 font-light leading-relaxed max-w-sm mx-auto md:mx-0 text-sm">
                                    {item.description || "Zanaatkar dokunuşların ve modern estetiğin bir araya geldiği, Ekol Home imzası taşıyan özel koleksiyonumuzu detaylıca inceleyin."}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-8 pt-6 justify-center md:justify-start items-center">
                                    <Link
                                        href={`/katalog/${item.id}`}
                                        className="bg-black text-white px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#d9a066] transition-all duration-300"
                                    >
                                        Hemen İncele
                                    </Link>

                                    <a
                                        href={formatUrl(item.pdf_url)}
                                        download
                                        className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-black/10 pb-1 hover:text-[#d9a066] hover:border-[#d9a066] transition-all group"
                                    >
                                        <Download size={14} className="group-hover:-translate-y-1 transition-transform" /> PDF İNDİR
                                    </a>
                                </div>
                            </div>
                        </motion.section>
                    ))}
                </div>

                {/* Alt Bilgi */}
                <footer className="mt-60 pt-20 border-t border-gray-100 text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="p-4 bg-white shadow-sm rounded-full">
                            <FileText className="text-[#d9a066]" size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 font-light tracking-wide max-w-md mx-auto leading-relaxed">
                        Basılı katalog talepleriniz veya projeleriniz için <br />
                        <Link href="/iletisim" className="text-black font-bold border-b border-black/20 hover:text-[#d9a066] transition-colors uppercase ml-1">
                            iletişim sayfamızı
                        </Link> ziyaret edebilirsiniz.
                    </p>
                </footer>
            </div>
        </main>
    );
}