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
                const foundProduct = data.find(item => item.id.toString() === productID.toString());
                if (foundProduct) {
                    setHizmet(foundProduct);
                } else {
                    setHizmet(null);
                }
            })
            .catch(() => setHizmet(null))
            .finally(() => setLoading(false));
    }, [productID]);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-gray-100 rounded-full"></div>
                <div className="absolute top-0 left-0 w-20 h-20 border-4 border-[#d9a066] border-t-transparent rounded-full animate-spin"></div>
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-[#d9a066] animate-pulse" />
            </div>
        </div>
    );

    if (!hizmet) return <div className="text-center py-20 uppercase tracking-widest">Ürün Bulunamadı</div>;

    const allImages = [
        hizmet.cover_image,
        ...(hizmet.extra_images ? hizmet.extra_images.split(",").map((img: string) => img.trim()).filter((img: string) => img !== "") : [])
    ];

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (activeIndex !== null) setActiveIndex((activeIndex + 1) % allImages.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (activeIndex !== null) setActiveIndex((activeIndex - 1 + allImages.length) % allImages.length);
    };

    return (
        <main className="min-h-screen bg-white font-sans selection:bg-[#d9a066] selection:text-white">

            {/* Lightbox Modal */}
            <AnimatePresence>
                {activeIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActiveIndex(null)}
                        className="fixed inset-0 bg-black/98 z-[9999] flex items-center justify-center p-4"
                    >
                        <button onClick={prevImage} className="absolute left-4 md:left-10 text-white/70 hover:text-white transition-all z-[10000]">
                            <ChevronLeft size={48} strokeWidth={1} />
                        </button>

                        <motion.img
                            key={activeIndex}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            src={allImages[activeIndex]}
                            className="max-w-full max-h-[90vh] object-contain shadow-2xl"
                        />

                        <button onClick={nextImage} className="absolute right-4 md:right-10 text-white/70 hover:text-white transition-all z-[10000]">
                            <ChevronRight size={48} strokeWidth={1} />
                        </button>

                        <button className="absolute top-10 right-10 text-white/50 hover:text-white"><X size={32} /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <div className="relative h-screen w-full overflow-hidden">

                {/* 4K Kapak Görseli */}
                <div className="absolute inset-0">
                    <img
                        src={hizmet.cover_image}
                        alt={hizmet.title}
                        className="w-full h-full object-cover"
                        style={{ objectPosition: 'center' }}
                    />
                    {/* Görseli karartmadan sadece yazıların okunması için hafif gölge */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                </div>
                {/* Hero Section */}
                <div className="relative h-screen w-full overflow-hidden">

                    {/* 4K Kapak Görseli */}
                    <div className="absolute inset-0">
                        <img
                            src={hizmet.cover_image}
                            alt={hizmet.title}
                            className="w-full h-full object-cover shadow-inner"
                            style={{ objectPosition: 'center' }}
                        />
                        {/* Yazıların okunması için sadece alt ve sol kısımdan hafif bir gölge */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/10 to-transparent" />
                    </div>

                    {/* SOL ALT KÖŞEYE YERLEŞTİRİLMİŞ BUTON VE YAZILAR */}
                    <div className="absolute bottom-16 left-8 md:left-20 z-50 max-w-4xl">

                        {/* Koleksiyona Dön Butonu - Küçük ve Rafine */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="mb-10"
                        >
                            <Link href={`/hizmetlerimiz/${categorySlug}`} className="group flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-md bg-white/5 group-hover:bg-[#d9a066] group-hover:border-[#d9a066] transition-all duration-500">
                                    <ArrowLeft size={20} className="text-white group-hover:-translate-x-1 transition-transform" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white/50 text-[9px] font-bold uppercase tracking-[0.3em] mb-1">Geri Dön</span>
                                    <span className="text-white text-[10px] font-black uppercase tracking-[0.4em] group-hover:text-[#d9a066] transition-colors">
                                        Koleksiyonlar
                                    </span>
                                </div>
                            </Link>
                        </motion.div>

                        {/* Ürün Başlığı - Sol Alt Yerleşim */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 1 }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-[1px] bg-[#d9a066]"></div>
                                <span className="text-[#d9a066] text-[10px] font-bold uppercase tracking-[0.6em] drop-shadow-lg">
                                    EKOL HOME PREMIUM
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-8xl font-extralight text-white leading-[0.9] tracking-tighter uppercase drop-shadow-2xl select-none">
                                {hizmet.title.split(' ').map((word: string, i: number) => (
                                    <span key={i} className="block">{word}</span>
                                ))}
                            </h1>
                        </motion.div>
                    </div>

                    {/* Sağ Alt Köşede Estetik Bir Detay (Opsiyonel) */}
                    <div className="absolute bottom-16 right-8 md:right-20 hidden md:block">
                        <div className="flex items-center gap-4 rotate-90 origin-right">
                            <span className="text-white/20 text-[9px] font-bold uppercase tracking-[1em] whitespace-nowrap">
                                SCROLL TO EXPLORE
                            </span>
                            <div className="w-12 h-[1px] bg-white/20"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detay ve Alt Galeri */}
            <section className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    <div className="lg:col-span-8">
                        <p className="text-gray-800 font-light leading-relaxed text-xl md:text-3xl italic mb-16 border-l-4 border-[#d9a066] pl-8">
                            {hizmet.description || hizmet.content}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {allImages.map((img, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -10 }}
                                    onClick={() => setActiveIndex(i)}
                                    className={`cursor-pointer overflow-hidden shadow-xl ${i === 0 ? 'md:col-span-2 aspect-video' : 'aspect-[4/5]'}`}
                                >
                                    <img src={img} alt="Detay" className="w-full h-full object-cover" />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="sticky top-32 bg-[#fafafa] p-12 border border-gray-100 shadow-sm">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] mb-10 border-b pb-4">Ürün Bilgisi</h3>
                            <div className="space-y-6">
                                <div className="flex justify-between text-[11px] uppercase tracking-widest">
                                    <span className="text-gray-400">Referans</span>
                                    <span className="font-bold">EH-0{hizmet.id}</span>
                                </div>
                                <div className="flex justify-between text-[11px] uppercase tracking-widest">
                                    <span className="text-gray-400">Kategori</span>
                                    <span className="font-bold">{hizmet.category}</span>
                                </div>
                            </div>
                            <Link href="/iletisim" className="mt-12 w-full bg-black text-white py-6 text-[10px] font-bold uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-[#d9a066] transition-all group">
                                Bilgi Al <ExternalLink size={14} />
                            </Link>
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}