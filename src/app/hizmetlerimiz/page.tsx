"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { client } from '@/sanity/lib/client'; // Sanity client'ını import et
import { urlFor } from '@/sanity/lib/image';  // Image helper'ını import et

// Interface tanımı (TypeScript kullanıyorsan)
interface Service {
    title: string;
    slug: { current: string };
    image: any;
    desc: string;
}

export default function HizmetlerimizPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Sanity'den veriyi çeken sorgu
        const fetchServices = async () => {
            const query = `*[_type == "service"] | order(order asc) {
                title,
                slug,
                image,
                desc
            }`;
            const data = await client.fetch(query);
            setServices(data);
            setLoading(false);
        };

        fetchServices();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;

    return (
        <main className="min-h-screen bg-white pt-32 pb-20 px-6">
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
                        EkolHome olarak, mobilyanın sadece bir eşya değil, mekanı tamamlayan bir ruh olduğuna inanıyoruz.
                    </p>
                </motion.div>
                <div className="w-full h-[1px] bg-gray-100 mt-12" />
            </section>

            <section className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-x-16 lg:gap-y-24">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.slug.current}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: index * 0.05 }}
                            className={`group cursor-pointer ${index % 3 === 1 ? 'lg:mt-16' : ''}`}
                        >
                            <Link href={`/hizmetlerimiz/${service.slug.current}`}>
                                <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 mb-6">
                                    <Image
                                        // Sanity Image Helper kullanımı
                                        src={urlFor(service.image).url()}
                                        alt={service.title}
                                        fill
                                        priority={index < 3}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105 grayscale-[50%] group-hover:grayscale-0"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 flex items-center justify-center">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 shadow-sm">
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
                                        <span className="text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-all duration-500">İncele</span>
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