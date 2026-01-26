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
    const springX = useSpring(x, { stiffness: 150, damping: 25 })

    useEffect(() => {
        const fetchReferences = async () => {
            try {
                const res = await fetch('https://ekolhome.smusa9883x.workers.dev/api/references');
                const data = await res.json();
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
        const moveAmount = window.innerWidth < 768 ? 320 : 480
        const currentX = x.get()
        let targetX = direction === 'left' ? currentX + moveAmount : currentX - moveAmount
        targetX = Math.max(constraints.left, Math.min(0, targetX))

        animate(x, targetX, {
            type: "spring",
            stiffness: 150,
            damping: 25
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="animate-spin text-[#d9a066]" size={40} />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#fdfdfd] text-neutral-900 overflow-x-hidden">
            {/* HERO SECTION */}
            <section className="relative pt-32 md:pt-48 pb-20 md:pb-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#d9a066] to-[#b08b5c] text-white text-[10px] uppercase tracking-[0.3em] mb-8 shadow-lg shadow-[#d9a066]/20">
                            <Sparkles size={12} />
                            <span>Referanslar & İşbirlikleri</span>
                        </div>
                        <h1 className="text-5xl md:text-[8rem] font-light tracking-[-0.02em] leading-[1.1] md:leading-[0.9] mb-8">
                            Güvenle İnşa Edilen <br />
                            <span className="font-serif italic text-[#d9a066]">Renkli Bağlar</span>.
                        </h1>
                        <div className="grid grid-cols-3 gap-6 md:gap-12 mt-12 max-w-3xl border-t border-neutral-100 pt-10">
                            <StatItem icon={<Award size={24} className="text-[#d9a066]" />} value="500+" label="Proje" />
                            <StatItem icon={<Users size={24} className="text-[#d9a066]" />} value="300+" label="Müşteri" />
                            <StatItem icon={<Clock size={24} className="text-[#d9a066]" />} value="15+" label="Yıl Deneyim" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* DRAGGABLE SLIDER - RENKLİ VERSİYON */}
            <section className="py-16 md:py-24 bg-gradient-to-b from-white to-[#f9f9f9] relative select-none">
                <div className="max-w-[1800px] mx-auto px-4 md:px-6">
                    <div className="flex justify-between items-center mb-10 md:mb-16">
                        <div className="border-l-4 border-[#d9a066] pl-6">
                            <h2 className="text-xs md:text-sm uppercase tracking-[0.3em] font-bold text-[#d9a066] mb-2">Kurumsal Portfolyo</h2>
                            <p className="text-2xl md:text-5xl font-light tracking-tight text-neutral-800">Referans Projelerimiz</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => handleScroll('left')} className="p-4 bg-white border border-neutral-200 rounded-full hover:bg-[#d9a066] hover:text-white hover:border-[#d9a066] transition-all shadow-md active:scale-95"><ChevronLeft size={20} /></button>
                            <button onClick={() => handleScroll('right')} className="p-4 bg-white border border-neutral-200 rounded-full hover:bg-[#d9a066] hover:text-white hover:border-[#d9a066] transition-all shadow-md active:scale-95"><ChevronRight size={20} /></button>
                        </div>
                    </div>

                    <div className="relative cursor-grab active:cursor-grabbing">
                        <motion.div
                            ref={containerRef}
                            style={{ x: springX }}
                            drag="x"
                            dragConstraints={constraints}
                            className="flex gap-6 md:gap-10 py-10"
                        >
                            {references.map((item, idx) => (
                                <motion.div
                                    key={`${item.id}-${idx}`}
                                    whileHover={{ y: -15, scale: 1.02 }}
                                    className="flex-shrink-0 w-72 h-48 md:w-[450px] md:h-72 bg-white border border-neutral-100 shadow-[0_15px_40px_rgba(0,0,0,0.06)] rounded-[2rem] md:rounded-[3rem] flex items-center justify-center p-8 md:p-14 relative overflow-hidden group transition-all duration-500 hover:shadow-[#d9a066]/10"
                                >
                                    {/* Arka Plandaki Hafif Renkli Parlama */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#d9a066]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {item.logo_url ? (
                                        <div className="relative w-full h-full transform transition-all duration-700 z-10">
                                            <Image
                                                src={item.logo_url}
                                                alt={item.name}
                                                fill
                                                sizes="(max-width: 768px) 280px, 450px"
                                                // Grayscale filtresi kaldırıldı, görseller artık kendi renklerinde!
                                                className="object-contain drop-shadow-sm group-hover:drop-shadow-md transition-all"
                                                draggable={false}
                                            />
                                        </div>
                                    ) : (
                                        <span className="relative z-10 text-xl md:text-2xl font-semibold text-neutral-800 group-hover:text-[#d9a066] transition-colors uppercase tracking-widest">
                                            {item.name}
                                        </span>
                                    )}

                                    {/* Alt dekoratif çizgi */}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-[#d9a066] group-hover:w-1/3 transition-all duration-500 rounded-full" />
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
        <div className="text-center md:text-left flex flex-col items-center md:items-start group">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#d9a066]/10 mb-4 group-hover:bg-[#d9a066] group-hover:text-white transition-all duration-300">
                {icon}
            </div>
            <div className="text-3xl md:text-4xl font-light text-neutral-900">{value}</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#d9a066] font-bold mt-1">{label}</div>
        </div>
    )
}