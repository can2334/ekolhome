"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const API_URL = "https://ekolhome.smusa9883x.workers.dev/api/services";

export default function KategoriDetayPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const categorySlug = resolvedParams.id;

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState("");

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
                    // URL'deki slug ile API'den gelen kategoriyi eşleştiriyoruz
                    const filtered = data.filter(item => slugify(item.category || "") === categorySlug);
                    setProducts(filtered);
                    if (filtered.length > 0) setCategoryName(filtered[0].category);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [categorySlug]);

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#d9a066] animate-spin" />
        </div>
    );

    return (
        <main className="min-h-screen bg-[#FBFBFB] pt-44 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <Link href="/hizmetlerimiz" className="flex items-center gap-2 text-gray-400 hover:text-black mb-12 transition-colors text-xs uppercase tracking-widest">
                    <ArrowLeft size={14} /> Tüm Kategoriler
                </Link>

                <h1 className="text-4xl md:text-6xl font-extralight uppercase mb-20 tracking-tighter">
                    {categoryName || "Koleksiyon"} <span className="font-serif italic text-gray-400">Modelleri</span>
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {products.map((item) => (
                        <Link key={item.id} href={`/hizmetlerimiz/${categorySlug}/${item.id}`}>
                            <div className="group cursor-pointer">
                                <div className="relative aspect-square overflow-hidden bg-gray-200 mb-6">
                                    <img
                                        src={item.cover_image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <h3 className="text-xl font-light uppercase tracking-tight">{item.title}</h3>
                                <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest">Detayı İncele</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}