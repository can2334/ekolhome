"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const HIZMETLER = [
    { title: "Oturma Grubu", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070", slug: "oturma-grubu", desc: "Yaşam alanlarınıza konfor ve estetiği bir arada sunan özel tasarımlar." },
    { title: "Kanepe Döşemeleri", image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2070", slug: "kanepe-dosemeleri", desc: "Eski mobilyalarınıza hayat veren, modern ve klasik kumaş seçenekleri." },
    { title: "Tekli Koltuk", image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1964", slug: "tekli-koltuk", desc: "Köşenizde size özel bir dünya yaratan ergonomik ve şık berjerler." },
    { title: "Sandalye", image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1974", slug: "sandalye", desc: "Yemek odalarından ofislere kadar her mekana uygun oturma çözümleri." },
    { title: "Ofis Dekorasyonu", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069", slug: "ofis-dekorasyonu", desc: "Profesyonel çalışma alanları için ilham verici ve prestijli tasarımlar." },
    { title: "Puflar & Bench", image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=2070", slug: "puflar-ve-bench", desc: "Mekanın tamamlayıcı parçaları; fonksiyonel ve dekoratif detaylar." },
    { title: "Yatak Başlığı", image: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?q=80&w=2070", slug: "yatak-basligi", desc: "Yatak odanıza lüks bir otel konforu ve şıklığı katan dokunuşlar." },
    { title: "Kırlent & Şezlong Minderi", image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070", slug: "kirlent-ve-sezlong-minderi", desc: "Dış mekan ve dekorasyonda konforu artıran yumuşak detaylar." },
];

export default function HizmetlerimizPage() {
    return (
        <main className="min-h-screen bg-white pt-32 pb-20 px-6">
            {/* Üst Başlık Alanı */}
            <section className="max-w-7xl mx-auto mb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-8"
                >
                    <div className="max-w-2xl">
                        <span className="text-xs uppercase tracking-[0.4em] text-gray-400 mb-4 block font-medium">Uzmanlık Alanlarımız</span>
                        <h1 className="text-5xl md:text-7xl font-extralight tracking-tighter leading-tight text-black">
                            Zanaatın <br />
                            <span className="font-serif italic text-gray-400">Modern Formu.</span>
                        </h1>
                    </div>
                    <p className="text-gray-500 max-w-sm text-sm leading-relaxed mb-2">
                        EkolHome olarak, mobilyanın sadece bir eşya değil, mekanı tamamlayan bir ruh olduğuna inanıyoruz. Sekiz farklı kategoride uzman zanaatkarlarımızla hizmetinizdeyiz.
                    </p>
                </motion.div>
                <div className="w-full h-[1px] bg-gray-100 mt-12" />
            </section>

            {/* Asimetrik Grid Galeri */}
            <section className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-x-16 lg:gap-y-24">
                    {HIZMETLER.map((service, index) => (
                        <motion.div
                            key={service.slug}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`group cursor-pointer ${index % 3 === 1 ? 'lg:mt-16' : ''}`} // Asimetrik görünüm için orta sütunu aşağı kaydırır
                        >
                            <Link href={`/hizmetlerimiz/${service.slug}`}>
                                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 mb-6">
                                    <Image
                                        src={service.image}
                                        alt={service.title}
                                        fill
                                        className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 grayscale-[50%] group-hover:grayscale-0"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500">
                                            <ArrowUpRight className="text-black" size={20} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xl font-light tracking-tight text-black flex items-center justify-between">
                                        {service.title}
                                        <span className="text-[10px] text-gray-300 font-mono">0{index + 1}</span>
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                                        {service.desc}
                                    </p>
                                    <div className="pt-4 flex items-center gap-2">
                                        <div className="h-[1px] w-0 group-hover:w-8 bg-black transition-all duration-500" />
                                        <span className="text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-all duration-500">Koleksiyonu Gör</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>
        </main>
    );
}