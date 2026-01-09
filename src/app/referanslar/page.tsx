"use client";

import { client } from '@/sanity/lib/client'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { useEffect, useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ReferanslarPage() {
    const [references, setReferences] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const query = `*[_type == "clientReference"] | order(_createdAt desc)`
        client.fetch(query).then(data => {
            setReferences(data)
            setLoading(false)
        })
    }, [])

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current
            const scrollTo = direction === 'left' ? scrollLeft - 400 : scrollLeft + 400
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-16 h-[1px] bg-black animate-pulse"></div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-white text-[#1a1a1a]">
            {/* 1. MODERN HERO - MİMARİ TİPOGRAFİ */}
            <section className="pt-40 pb-24 px-6 border-b border-gray-50">
                <div className="max-w-7xl mx-auto">
                    <span className="text-xs uppercase tracking-[0.4em] text-gray-400 mb-4 block font-medium">Portfolyo & İşbirlikleri</span>
                    <h1 className="text-6xl md:text-8xl font-extralight tracking-tighter leading-[0.9]">
                        Güvenle İnşa Edilen <br />
                        <span className="font-serif italic text-gray-400">Estetik Bağlar.</span>
                    </h1>
                </div>
            </section>

            {/* 2. ASİMETRİK LOGO KAYDIRICI - GALERİ HAVASI */}
            <section className="py-20 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-sm uppercase tracking-widest font-bold">Referans Projeler</h2>
                        <div className="flex gap-2">
                            <button onClick={() => scroll('left')} className="p-3 border border-gray-100 rounded-full hover:bg-black hover:text-white transition-all"><ChevronLeft size={18} /></button>
                            <button onClick={() => scroll('right')} className="p-3 border border-gray-100 rounded-full hover:bg-black hover:text-white transition-all"><ChevronRight size={18} /></button>
                        </div>
                    </div>

                    <div
                        ref={scrollRef}
                        className="flex items-center gap-8 overflow-x-auto scrollbar-hide snap-x px-2 py-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {references.map((item, index) => (
                            <div
                                key={item._id}
                                className={`flex-shrink-0 transition-all duration-700 snap-center
                                    ${index % 2 === 0 ? 'w-72 h-48 mt-10' : 'w-80 h-56 mb-10'} 
                                    bg-white border border-gray-50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] 
                                    rounded-2xl flex items-center justify-center p-8 group hover:border-black`}
                            >
                                {item.logo ? (
                                    <div className="relative w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110">
                                        <Image src={urlFor(item.logo).url()} alt={item.name} fill className="object-contain" />
                                    </div>
                                ) : (
                                    <span className="text-sm font-bold tracking-tighter text-gray-300 uppercase">{item.name}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. ÖZGÜN ÜRETİM SÜRECİ - FLOATING DESIGN */}
            <section className="py-32 px-6 bg-[#fcfcfc]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                        {/* Sol Taraf - Sabit Başlık */}
                        <div className="lg:col-span-4 lg:sticky lg:top-40">
                            <h2 className="text-5xl font-extralight tracking-tighter mb-6">Fikir Nasıl <br /> Form Bulur?</h2>
                            <p className="text-gray-500 leading-relaxed text-sm">
                                Kayalı Design’da her süreç, bir hammaddenin ötesine geçerek yaşam alanınıza değer katan bir sanat eserine dönüşme hikayesidir.
                            </p>
                            <div className="mt-10 w-20 h-[1px] bg-black"></div>
                        </div>

                        {/* Sağ Taraf - Akışkan Adımlar */}
                        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
                            <NewStep
                                num="I"
                                title="Kürasyon & Analiz"
                                desc="Mekanınızın ihtiyaçlarını sadece ölçülerle değil, ruhuyla analiz ediyoruz."
                            />
                            <NewStep
                                num="II"
                                title="Materyal Seçkisi"
                                desc="Dokusuyla hikaye anlatan kumaşları ve en dayanıklı iskelet yapılarını seçiyoruz."
                                margin="mt-12"
                            />
                            <NewStep
                                num="III"
                                title="Hassas İşçilik"
                                desc="Usta ellerin dokunuşunu modern teknolojiyle harmanlayarak kusursuzlaştırıyoruz."
                            />
                            <NewStep
                                num="IV"
                                title="Final & Teslimat"
                                desc="Süreci sadece ürün teslimiyle değil, memnuniyetle noktalıyoruz."
                                margin="mt-12"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

// Bize Özgü Yeni Step Bileşeni
function NewStep({ num, title, desc, margin = "" }: { num: string, title: string, desc: string, margin?: string }) {
    return (
        <div className={`group flex flex-col p-8 bg-white border border-gray-50 rounded-3xl transition-all duration-500 hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.1)] ${margin}`}>
            <span className="text-3xl font-serif italic text-gray-200 mb-6 group-hover:text-black transition-colors">{num}</span>
            <h3 className="text-lg font-bold mb-4 tracking-tight">{title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
            <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Detayları Keşfet <ArrowRight size={12} />
            </div>
        </div>
    )
}