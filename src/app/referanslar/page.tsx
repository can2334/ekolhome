"use client"; // Kaydırma özelliği için client component olmalı

import { client } from '@/sanity/lib/client'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import { useEffect, useState } from 'react'

// Swiper stilleri
import 'swiper/css'
import 'swiper/css/navigation'

export default function ReferanslarPage() {
    const [references, setReferences] = useState<any[]>([])

    useEffect(() => {
        const query = `*[_type == "clientReference"] | order(_createdAt desc)`
        client.fetch(query).then(data => setReferences(data))
    }, [])

    return (
        <main className="min-h-screen bg-[#F9F9F9] text-black py-20">
            <div className="container mx-auto px-4">
                <h1 className="text-[8vw] md:text-[5vw] font-light tracking-tighter mb-20 text-center uppercase">
                    Referanslar<span className="italic font-serif text-gray-400">ımız</span>
                </h1>

                {/* Slider Alanı */}
                <div className="relative group px-12">
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={50}
                        slidesPerView={2}
                        navigation={true}
                        autoplay={{ delay: 3000 }}
                        breakpoints={{
                            640: { slidesPerView: 3 },
                            1024: { slidesPerView: 5 },
                        }}
                        className="mySwiper !py-10"
                    >
                        {references.map((item) => (
                            <SwiperSlide key={item._id} className="flex items-center justify-center">
                                <div className="flex flex-col items-center justify-center grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-500 transform hover:scale-110">
                                    {item.logo && (
                                        <div className="relative w-40 h-24 mb-4">
                                            <Image
                                                src={urlFor(item.logo).url()}
                                                alt={item.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    )}
                                    <span className="text-[10px] tracking-widest text-gray-500 uppercase font-semibold">
                                        {item.name}
                                    </span>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Alt Kısım: Detaylı Liste (Opsiyonel) */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 border-t border-gray-200 pt-20">
                    {references.map((item) => (
                        <div key={item._id} className="group">
                            <span className="text-[10px] text-gray-400 font-bold tracking-[0.3em]">{item.year}</span>
                            <h3 className="text-xl font-medium mt-2 group-hover:text-gray-400 transition-colors uppercase italic">{item.name}</h3>
                            <p className="text-sm text-gray-500 mt-4 leading-relaxed font-light">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ok butonlarını özelleştirmek için küçük bir CSS */}
            <style jsx global>{`
                .swiper-button-next, .swiper-button-prev {
                    color: #ccc !important;
                    transform: scale(0.5);
                    transition: all 0.3s;
                }
                .swiper-button-next:hover, .swiper-button-prev:hover {
                    color: #000 !important;
                }
            `}</style>
        </main>
    )
}