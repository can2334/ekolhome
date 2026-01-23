"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const API_URL = "https://ekolhome.smusa9883x.workers.dev/api/services";

interface HizmetItem {
    id: number;
    title: string;
    slug: string; // Slug artık zorunlu
    cover_image: string;
    description: string;
    category: string;
}

export default function HizmetlerPage() {
    const [hizmetler, setHizmetler] = useState<HizmetItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(API_URL)
            .then((res) => res.json())
            .then((data) => {
                setHizmetler(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Veri çekme hatası:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 text-[#d9a066] animate-spin" />
            <div className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold">Koleksiyonlar Hazırlanıyor...</div>
        </div>
    );

    return (
        <main className="min-h-screen bg-[#FBFBFB] pt-44 pb-20 px-6 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-24">
                    <span className="text-[#d9a066] text-[10px] font-bold tracking-[0.5em] uppercase block mb-4">
                        Ekol Home — Exclusive
                    </span>
                    <h1 className="text-5xl md:text-8xl font-extralight tracking-tighter text-black uppercase leading-[0.9]">
                        Hizmet <br /> <span className="font-serif italic text-gray-400 lowercase">Koleksiyonları</span>
                    </h1>
                </header>

                {hizmetler.length === 0 ? (
                    <div className="text-center py-20 border-y border-black/5">
                        <p className="text-gray-400 text-xs uppercase tracking-widest">Henüz bir koleksiyon eklenmemiş.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
                        {hizmetler.map((hizmet, index) => (
                            <motion.div
                                key={hizmet.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group"
                            >
                                {/* DÜZELTME: Link yapısını id yerine slug'a çevirdik */}
                                <Link href={`/hizmetlerimiz/${hizmet.slug || hizmet.id}`} className="block">
                                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 mb-8 shadow-2xl">
                                        <img
                                            src={hizmet.cover_image || "/placeholder.jpg"}
                                            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                                            alt={hizmet.title}
                                        />
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors" />

                                        <div className="absolute top-6 left-6">
                                            <span className="bg-white/90 backdrop-blur-sm text-black text-[9px] font-bold px-3 py-1 uppercase tracking-widest">
                                                {hizmet.category || "TASARIM"}
                                            </span>
                                        </div>

                                        <div className="absolute bottom-8 left-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <ArrowUpRight size={32} strokeWidth={1} />
                                        </div>
                                    </div>
                                </Link>

                                <div className="space-y-4 px-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-light uppercase tracking-tight text-black">
                                            {hizmet.title}
                                        </h3>
                                        <span className="text-[10px] text-gray-300 font-medium">0{index + 1}</span>
                                    </div>
                                    <p className="text-gray-500 text-xs leading-relaxed font-light min-h-[3em]">
                                        {hizmet.description || "Zanaatkarlığın ve estetiğin buluştuğu özel tasarım hizmetimiz."}
                                    </p>
                                    <div className="pt-4">
                                        <Link
                                            href={`/hizmetlerimiz/${hizmet.slug || hizmet.id}`}
                                            className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-black/10 pb-1 hover:border-[#d9a066] hover:text-[#d9a066] transition-all"
                                        >
                                            Projeyi İncele
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}