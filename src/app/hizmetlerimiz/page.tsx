"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowUpRight, LayoutGrid } from "lucide-react";
import Link from "next/link";

const API_URL = "https://ekolhome.smusa9883x.workers.dev/api/services";

export default function HizmetlerPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // URL dostu slug oluşturucu
    const slugify = (text: string) => {
        return text
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[ığüşöç]/g, (m) => ({ 'ı': 'i', 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ö': 'o', 'ç': 'c' }[m] || m));
    };

    useEffect(() => {
        fetch(API_URL)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    // 1. Tüm kategorileri al
                    // 2. Set kullanarak benzersiz olanları ayıkla
                    // 3. Her kategori için örnek bir görsel seç (ilk bulduğunu al)
                    const uniqueCategoryNames = [...new Set(data.map(item => item.category))];

                    const categoryList = uniqueCategoryNames.map(catName => {
                        const firstItemWithCategory = data.find(item => item.category === catName);
                        return {
                            name: catName,
                            slug: slugify(catName || "genel"),
                            image: firstItemWithCategory?.cover_image || "/placeholder.jpg",
                            count: data.filter(item => item.category === catName).length
                        };
                    });

                    setCategories(categoryList);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Hata:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 text-[#d9a066] animate-spin" />
            <div className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold">Kategoriler Yükleniyor...</div>
        </div>
    );

    return (
        <main className="min-h-screen bg-[#FBFBFB] pt-44 pb-20 px-6 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-24">
                    <span className="text-[#d9a066] text-[10px] font-bold tracking-[0.5em] uppercase block mb-4">
                        Ekol Home — Koleksiyonlar
                    </span>
                    <h1 className="text-5xl md:text-8xl font-extralight tracking-tighter text-black uppercase leading-[0.9]">
                        Hizmet <br /> <span className="font-serif italic text-gray-400 lowercase">Kategorileri</span>
                    </h1>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
                    {categories.map((cat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                        >
                            {/* Link artık doğrudan kategori slug'ına gidiyor */}
                            <Link href={`/hizmetlerimiz/${cat.slug}`} className="block">
                                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 mb-8 shadow-2xl">
                                    <img
                                        src={cat.image}
                                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                                        alt={cat.name}
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />

                                    {/* Ürün Sayısı Badge */}
                                    <div className="absolute top-6 left-6">
                                        <span className="bg-white/90 backdrop-blur-sm text-black text-[9px] font-bold px-3 py-1 uppercase tracking-widest">
                                            {cat.count} MODEL
                                        </span>
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-full">
                                            <ArrowUpRight size={40} className="text-white" strokeWidth={1} />
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <div className="space-y-2 px-2 text-center">
                                <h3 className="text-3xl font-light uppercase tracking-tight text-black group-hover:text-[#d9a066] transition-colors">
                                    {cat.name}
                                </h3>
                                <div className="flex justify-center">
                                    <Link
                                        href={`/hizmetlerimiz/${cat.slug}`}
                                        className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-black/10 pb-1 hover:border-[#d9a066] transition-all text-gray-400 hover:text-black"
                                    >
                                        Koleksiyonu Gör
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}