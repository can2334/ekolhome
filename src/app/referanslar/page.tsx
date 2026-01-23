"use client";

import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, Sparkles, Award, Users, Clock, Loader2 } from 'lucide-react'
import { motion, useMotionValue, useSpring, animate } from 'framer-motion'

export default function ReferanslarPage() {
    const [references, setReferences] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const containerRef = useRef<HTMLDivElement>(null)
    const [constraints, setConstraints] = useState({ left: 0, right: 0 })

    const x = useMotionValue(0)
    const springX = useSpring(x, { stiffness: 200, damping: 25 })

    // WORKER'DAN VERİ ÇEKME
    useEffect(() => {
        const fetchReferences = async () => {
            try {
                const res = await fetch('https://ekolhome.smusa9883x.workers.dev/api/references');
                const data = await res.json();

                // Slider döngüsü için veriyi çoğaltıyoruz
                if (data && data.length > 0) {
                    setReferences(Array(5).fill(data).flat());
                }
            } catch (err) {
                console.error("Referanslar yüklenemedi:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReferences();
    }, []);

    useEffect(() => {
        if (containerRef.current && references.length > 0) {
            const scrollWidth = containerRef.current.scrollWidth
            const offsetWidth = containerRef.current.offsetWidth
            setConstraints({ left: -(scrollWidth - offsetWidth), right: 0 })
        }
    }, [references])

    const handleScroll = (direction: 'left' | 'right') => {
        const moveAmount = window.innerWidth < 768 ? 300 : 450
        const currentX = x.get()
        let targetX = direction === 'left' ? currentX + moveAmount : currentX - moveAmount
        targetX = Math.max(constraints.left, Math.min(0, targetX))

        animate(x, targetX, {
            type: "spring",
            stiffness: 200,
            damping: 25
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="animate-spin text-neutral-900" size={40} />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white text-neutral-900 overflow-x-hidden">
            {/* HERO SECTION - (Aynı Tasarım) */}
            <section className="relative pt-32 md:pt-48 pb-20 md:pb-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 text-white text-[10px] uppercase tracking-[0.3em] mb-8">
                            <Sparkles size={12} />
                            <span>Referanslar & İşbirlikleri</span>
                        </div>
                        <h1 className="text-5xl md:text-[8rem] font-light tracking-[-0.02em] leading-[1.1] md:leading-[0.9] mb-8">
                            Güvenle İnşa Edilen <br />
                            <span className="font-serif italic text-neutral-400">Estetik Bağlar</span>.
                        </h1>
                        <div className="grid grid-cols-3 gap-6 md:gap-12 mt-12 max-w-3xl">
                            <StatItem icon={<Award size={20} />} value="500+" label="Proje" />
                            <StatItem icon={<Users size={20} />} value="300+" label="Mutlu Müşteri" />
                            <StatItem icon={<Clock size={20} />} value="15+" label="Yıl Tecrübe" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* DRAGGABLE SLIDER */}
            <section className="py-16 md:py-24 bg-gradient-to-b from-neutral-50 to-white relative select-none">
                <div className="max-w-[1800px] mx-auto px-4 md:px-6">
                    <div className="flex justify-between items-center mb-10 md:mb-16">
                        <div>
                            <h2 className="text-xs md:text-sm uppercase tracking-[0.3em] font-semibold text-neutral-400 mb-2">Portfolyo</h2>
                            <p className="text-2xl md:text-4xl font-light tracking-tight">Referans Projelerimiz</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => handleScroll('left')} className="p-4 bg-white border border-neutral-200 rounded-full hover:bg-neutral-900 hover:text-white transition-all"><ChevronLeft size={20} /></button>
                            <button onClick={() => handleScroll('right')} className="p-4 bg-white border border-neutral-200 rounded-full hover:bg-neutral-900 hover:text-white transition-all"><ChevronRight size={20} /></button>
                        </div>
                    </div>

                    <div className="relative cursor-grab active:cursor-grabbing">
                        <motion.div
                            ref={containerRef}
                            style={{ x: springX }}
                            drag="x"
                            dragConstraints={constraints}
                            className="flex gap-4 md:gap-8 py-8"
                        >
                            {references.map((item, idx) => (
                                <motion.div
                                    key={`${item.id}-${idx}`}
                                    whileHover={{ y: -10 }}
                                    className="flex-shrink-0 w-64 h-44 md:w-96 md:h-64 bg-white border border-neutral-100 shadow-xl rounded-[2.5rem] flex items-center justify-center p-6 md:p-10 relative overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {item.logo_url ? (
                                        <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-500 z-10">
                                            <Image
                                                src={item.logo_url}
                                                alt={item.name}
                                                fill
                                                className="object-contain"
                                                draggable={false}
                                            />
                                        </div>
                                    ) : (
                                        <span className="relative z-10 text-xl font-medium text-neutral-900 group-hover:text-white transition-colors uppercase">
                                            {item.name}
                                        </span>
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    )
}

function StatItem({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
    return (
        <div className="text-center md:text-left">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 mb-3">{icon}</div>
            <div className="text-2xl md:text-3xl font-light text-neutral-900">{value}</div>
            <div className="text-xs uppercase tracking-widest text-neutral-400">{label}</div>
        </div>
    )
}