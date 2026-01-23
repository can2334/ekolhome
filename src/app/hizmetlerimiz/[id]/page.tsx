"use client";

import React, { useState, useEffect, use } from "react";
import { Loader2, ArrowLeft, Image, Calendar, Tag, ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function HizmetDetayPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const identifier = resolvedParams.id;

    const [hizmet, setHizmet] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-20 h-20 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-amber-500 animate-pulse" />
            </div>
            <span className="text-xs tracking-[0.3em] uppercase text-gray-500 mt-6 font-semibold">Yükleniyor</span>
        </div>
    );

    if (!hizmet) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Image className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-3xl font-light mb-4 text-gray-800">Hizmet Bulunamadı</h2>
                <p className="text-gray-500 mb-8">Aradığınız hizmet mevcut değil veya kaldırılmış olabilir.</p>
                <Link href="/hizmetlerimiz" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl">
                    <ArrowLeft size={18} />
                    Tüm Hizmetler
                </Link>
            </motion.div>
        </div>
    );

    const extraImages = hizmet.extra_images
        ? hizmet.extra_images.split(",").map((img: string) => img.trim()).filter((img: string) => img !== "")
        : [];

    return (
        <main className="min-h-screen bg-white font-sans">
            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4 cursor-zoom-out"
                    >
                        <motion.img
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            src={selectedImage}
                            alt="Büyütülmüş görsel"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
                        >
                            ✕
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Bölümü - Tam Ekran Yüksek Kalite */}
            <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
                {hizmet.cover_image && hizmet.cover_image !== "" ? (
                    <>
                        {/* Ana Görsel - Yüksek Kalite */}
                        <div className="absolute inset-0">
                            <img
                                src={hizmet.cover_image}
                                alt={hizmet.title}
                                className="w-full h-full object-cover scale-105"
                                style={{
                                    filter: 'brightness(0.85) contrast(1.1)'
                                }}
                            />
                        </div>

                        {/* Gradient Overlay - Daha yumuşak */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                    </>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                        <Image size={120} className="text-white/10" />
                    </div>
                )}

                {/* İçerik - Daha İyi Konumlandırma */}
                <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-16">
                    {/* Üst Navigasyon */}
                    <div>
                        <br />
                        <Link href="/hizmetlerimiz" className="group inline-flex items-center gap-3 text-white/90 text-sm font-semibold uppercase tracking-wide backdrop-blur-md bg-white/10 px-6 py-3 rounded-full hover:bg-white/20 transition-all">
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            Geri
                        </Link>
                    </div>

                    {/* Alt Başlık ve Bilgi */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-4xl"
                    >
                        {/* Kategori Badge */}
                        <div className="inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-xl border border-amber-500/30 text-amber-300 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                            <Tag size={14} />
                            {hizmet.category || "Ekol Home"}
                        </div>

                        {/* Başlık */}
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight text-white mb-6 leading-[0.9] tracking-tight">
                            {hizmet.title}
                        </h1>

                        {/* Kısa Açıklama */}
                        {hizmet.description && (
                            <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed max-w-2xl">
                                {hizmet.description.substring(0, 150)}
                            </p>
                        )}
                    </motion.div>
                </div>

                {/* Scroll İndikatörü */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
                        <div className="w-1 h-2 bg-white/60 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* İçerik Bölümü - Modern Grid */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Sol Kolon - Ana İçerik */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Başlık */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-[2px] bg-gradient-to-r from-amber-500 to-orange-500"></div>
                                <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-500">
                                    Proje Detayları
                                </h2>
                            </div>
                        </motion.div>

                        {/* İçerik Kartı */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-8 md:p-12 shadow-sm hover:shadow-xl transition-all"
                        >
                            <div className="prose prose-lg max-w-none">
                                <div className="text-gray-700 leading-relaxed font-light whitespace-pre-wrap text-base md:text-lg">
                                    {hizmet.content || hizmet.description}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sağ Kolon - Bilgi Kartları */}
                    <div className="space-y-6">
                        {/* Bilgi Kartı */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-8 shadow-sm sticky top-24"
                        >
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-amber-200">
                                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800">
                                    Proje Bilgileri
                                </h3>
                            </div>

                            <div className="space-y-5">
                                <div className="flex items-center justify-between group">
                                    <span className="text-xs text-gray-500 uppercase font-semibold tracking-wide flex items-center gap-2">
                                        <Tag size={14} className="text-amber-500" />
                                        Kategori
                                    </span>
                                    <span className="text-sm font-semibold text-gray-800 bg-white px-3 py-1.5 rounded-lg">
                                        {hizmet.category}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between group">
                                    <span className="text-xs text-gray-500 uppercase font-semibold tracking-wide flex items-center gap-2">
                                        <Calendar size={14} className="text-amber-500" />
                                        Durum
                                    </span>
                                    <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        Aktif
                                    </span>
                                </div>
                            </div>

                            {/* CTA Butonu */}
                            <div className="mt-8 pt-6 border-t border-amber-200">
                                <Link
                                    href="/iletisim"
                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3.5 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl group"
                                >
                                    Teklif Al
                                    <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Galeri Bölümü - Masonry Grid */}
                {extraImages.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-32"
                    >
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-12 h-[2px] bg-gradient-to-r from-amber-500 to-orange-500"></div>
                            <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-500 flex items-center gap-3">
                                <Image size={18} className="text-amber-500" />
                                Proje Galerisi
                                <span className="text-xs text-gray-400 font-normal">({extraImages.length} Görsel)</span>
                            </h2>
                        </div>

                        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                            {extraImages.map((img: string, index: number) => (
                                img && img !== "" && (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.03, y: -5 }}
                                        onClick={() => setSelectedImage(img)}
                                        className="break-inside-avoid relative group cursor-zoom-in rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
                                    >
                                        <img
                                            src={img}
                                            alt={`${hizmet.title} Galeri ${index + 1}`}
                                            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                                            onError={(e) => (e.currentTarget.style.display = "none")}
                                        />

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                            <span className="text-white text-sm font-semibold">
                                                Görüntüle
                                            </span>
                                        </div>
                                    </motion.div>
                                )
                            ))}
                        </div>
                    </motion.div>
                )}
            </section>
        </main>
    );
}