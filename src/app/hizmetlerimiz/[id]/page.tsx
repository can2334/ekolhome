"use client";

import React, { useState, useEffect, use } from "react";
import { Loader2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function HizmetDetayPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const identifier = resolvedParams.id;

    const [hizmet, setHizmet] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!identifier) return;

        fetch(`https://ekolhome.smusa9883x.workers.dev/api/services/${identifier}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setHizmet(null);
                } else {
                    setHizmet(data);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Detay getirme hatası:", err);
                setLoading(false);
            });
    }, [identifier]);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <Loader2 className="w-10 h-10 animate-spin text-[#d9a066] mb-4" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-gray-400">Yükleniyor</span>
        </div>
    );

    if (!hizmet) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9f9] text-black">
            <h2 className="text-2xl font-light mb-4">Üzgünüz, Aradığınız Hizmet Bulunamadı</h2>
            <Link href="/hizmetlerimiz" className="text-sm font-bold border-b-2 border-[#d9a066] pb-1 hover:text-[#d9a066] transition-all">
                TÜM HİZMETLERE GÖZ AT
            </Link>
        </div>
    );

    const extraImages = hizmet.extra_images
        ? hizmet.extra_images.split(",").map((img: string) => img.trim()).filter((img: string) => img !== "")
        : [];

    return (
        <main className="min-h-screen bg-white font-sans">
            {/* Üst Kısım / Hero */}
            <div className="relative h-[60vh] w-full overflow-hidden bg-[#1a1a1a]">
                {/* DÜZELTME: Boş string kontrolü eklendi */}
                {hizmet.cover_image && hizmet.cover_image !== "" ? (
                    <img
                        src={hizmet.cover_image}
                        alt={hizmet.title}
                        className="w-full h-full object-cover opacity-70"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                        <ImageIcon size={48} className="text-white/10" />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

                <div className="absolute top-32 left-8 md:left-20">
                    <Link href="/hizmetlerimiz" className="group flex items-center gap-2 text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Geri Dön
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <span className="text-[#d9a066] text-xs font-bold uppercase tracking-[0.4em] mb-4 block">
                            {hizmet.category || "Ekol Home"}
                        </span>
                        <h1 className="text-5xl md:text-7xl font-extralight text-white uppercase tracking-tighter">
                            {hizmet.title}
                        </h1>
                    </motion.div>
                </div>
            </div>

            {/* İçerik Bölümü */}
            <section className="max-w-7xl mx-auto px-8 md:px-20 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-7">
                        <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400 mb-8 flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-[#d9a066]"></span> Proje Detayları
                        </h2>
                        <div className="text-lg text-gray-700 leading-relaxed font-light whitespace-pre-wrap">
                            {hizmet.content || hizmet.description}
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-[#fcfcfc] border border-gray-100 p-10">
                            <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Bilgi Kartı</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-gray-400 uppercase font-bold">Kategori</span>
                                    <span className="text-xs uppercase">{hizmet.category}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-gray-400 uppercase font-bold">Durum</span>
                                    <span className="text-xs uppercase text-green-600">Aktif Koleksiyon</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Galeri Bölümü */}
                {extraImages.length > 0 && (
                    <div className="mt-32">
                        <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400 mb-12 flex items-center gap-2">
                            <ImageIcon size={16} className="text-[#d9a066]" /> Proje Galerisi
                        </h2>
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                            {extraImages.map((img: string, index: number) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.02 }}
                                    className="break-inside-avoid shadow-sm hover:shadow-2xl transition-all duration-500 cursor-zoom-in bg-gray-50 rounded-sm overflow-hidden"
                                >
                                    {/* DÜZELTME: Galeri resimleri için de kontrol eklendi */}
                                    {img && img !== "" && (
                                        <img
                                            src={img}
                                            alt={`${hizmet.title} Galeri ${index + 1}`}
                                            className="w-full h-auto rounded-sm object-cover"
                                            // Resim yüklenemezse gizle veya placeholder göster
                                            onError={(e) => (e.currentTarget.style.display = "none")}
                                        />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}