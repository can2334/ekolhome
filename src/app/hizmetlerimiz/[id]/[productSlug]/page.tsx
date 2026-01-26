"use client";

import React, { useState, useEffect, use } from "react";
import { ArrowLeft, ExternalLink, Sparkles, X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface PageProps {
    params: Promise<{ id: string; productSlug: string }>;
}

export default function UrunDetayPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const categorySlug = resolvedParams.id;
    const productID = resolvedParams.productSlug;

    const [hizmet, setHizmet] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    useEffect(() => {
        if (!productID) return;
        setLoading(true);

        fetch(`https://ekolhome.smusa9883x.workers.dev/api/services`)
            .then((res) => res.json())
            .then((data: any[]) => {
                // HATA ÖNLEYİCİ ARAMA: Hem ID'ye hem Slug'a bakıyoruz
                const foundProduct = data.find(
                    (item) =>
                        String(item.id) === String(productID) ||
                        item.slug === productID
                );

                if (foundProduct) {
                    console.log("Bulunan Ürün:", foundProduct); // Tarayıcı konsolunda veriyi gör
                    setHizmet(foundProduct);
                } else {
                    console.error("Ürün eşleşmedi. Gelen productID:", productID);
                    setHizmet(null);
                }
            })
            .catch((err) => console.error("Fetch hatası:", err))
            .finally(() => setLoading(false));
    }, [productID]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-gray-100 rounded-full"></div>
                <div className="absolute top-0 left-0 w-20 h-20 border-4 border-[#d9a066] border-t-transparent rounded-full animate-spin"></div>
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-[#d9a066] animate-pulse" />
            </div>
        </div>
    );

    if (!hizmet) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <div className="uppercase tracking-[0.3em] text-gray-400">Ürün Bulunamadı</div>
            <Link href="/" className="text-sm underline text-[#d9a066]">Ana Sayfaya Dön</Link>
        </div>
    );

    // Görselleri hazırla
    const allImages = [
        hizmet?.cover_image,
        ...(hizmet?.extra_images ? hizmet.extra_images.split(",").map((img: string) => img.trim()).filter(Boolean) : [])
    ].filter(Boolean);

    return (
        <main className="min-h-screen bg-white font-sans selection:bg-[#d9a066] selection:text-white">

            {/* Lightbox Modal */}
            <AnimatePresence>
                {activeIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setActiveIndex(null)}
                        className="fixed inset-0 bg-black/98 z-[9999] flex items-center justify-center p-4"
                    >
                        <button onClick={(e) => { e.stopPropagation(); setActiveIndex((activeIndex - 1 + allImages.length) % allImages.length) }} className="absolute left-4 md:left-10 text-white/70 hover:text-white z-[10000]">
                            <ChevronLeft size={48} strokeWidth={1} />
                        </button>
                        <motion.img
                            key={activeIndex}
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            src={allImages[activeIndex]}
                            className="max-w-full max-h-[90vh] object-contain shadow-2xl"
                        />
                        <button onClick={(e) => { e.stopPropagation(); setActiveIndex((activeIndex + 1) % allImages.length) }} className="absolute right-4 md:right-10 text-white/70 hover:text-white z-[10000]">
                            <ChevronRight size={48} strokeWidth={1} />
                        </button>
                        <button className="absolute top-10 right-10 text-white/50 hover:text-white"><X size={32} /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <div className="relative h-[80vh] md:h-screen w-full overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={hizmet?.cover_image}
                        alt={hizmet?.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                <div className="absolute bottom-16 left-8 md:left-20 z-50 max-w-5xl">
                    {/* Geri Dön Butonu */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Link href={`/hizmetlerimiz/${categorySlug}`} className="group flex items-center gap-4 mb-12">
                            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-sm bg-white/5 group-hover:bg-[#d9a066] group-hover:border-[#d9a066] transition-all duration-500">
                                <ArrowLeft size={18} className="text-white group-hover:-translate-x-1 transition-transform" />
                            </div>
                            <span className="text-white/70 text-[10px] font-bold uppercase tracking-[0.4em] group-hover:text-white transition-colors">
                                Koleksiyona Dön
                            </span>
                        </Link>
                    </motion.div>

                    {/* Üst Başlık (Premium Etiketi) */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-[1px] bg-[#d9a066]"></div>
                        <span className="text-[#d9a066] text-[11px] font-bold uppercase tracking-[0.6em] drop-shadow-md">
                            EKOL HOME PREMIUM
                        </span>
                    </div>

                    {/* Ürün Başlığı */}
                    <h1 className="text-6xl md:text-9xl font-extralight text-white leading-none tracking-tighter uppercase drop-shadow-2xl mb-8">
                        {hizmet?.title}
                    </h1>

                    {/* Ürün Kısa Açıklaması - Daha zarif ve okunabilir formda */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="max-w-2xl text-white/80 text-lg md:text-xl font-light leading-relaxed italic border-l-2 border-[#d9a066]/50 pl-6 backdrop-blur-[2px]"
                    >
                        {hizmet?.description}
                    </motion.p>
                </div>
            </div>

            {/* Detaylar ve İçerik */}
            <section className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    <div className="lg:col-span-8">
                        {/* ASIL GÖRÜNMEYEN KISIM BURASIYDI, KONTROLLER EKLENDİ */}
                        <div className="mb-16 border-l-4 border-[#d9a066] pl-8">
                            <div className="text-gray-800 font-light leading-relaxed text-xl md:text-3xl italic prose prose-slate max-w-none">
                                {hizmet?.content || "Açıklama yükleniyor..."}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {allImages.map((img, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -10 }}
                                    onClick={() => setActiveIndex(i)}
                                    className={`cursor-pointer overflow-hidden shadow-lg bg-gray-100 ${i === 0 ? 'md:col-span-2 aspect-video' : 'aspect-[4/5]'}`}
                                >
                                    <img src={img} alt="Galeri" className="w-full h-full object-cover" />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="sticky top-32 bg-[#fafafa] p-10 border border-gray-100">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] mb-8 border-b pb-4">Ürün Detayları</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between text-[11px] uppercase tracking-widest">
                                    <span className="text-gray-400">Referans</span>
                                    <span className="font-bold">EH-{hizmet?.id}</span>
                                </div>
                                <div className="flex justify-between text-[11px] uppercase tracking-widest">
                                    <span className="text-gray-400">Kategori</span>
                                    <span className="font-bold">{hizmet?.category || 'Genel'}</span>
                                </div>
                            </div>
                            <Link href="/iletisim" className="mt-10 w-full bg-black text-white py-5 text-[10px] font-bold uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-[#d9a066] transition-all">
                                Teklif Al <ExternalLink size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}