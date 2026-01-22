"use client";

import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, Sparkles, Award, Users, Clock } from 'lucide-react'
import { motion, useMotionValue, useSpring, animate } from 'framer-motion'

// MANUEL REFERANS VERİLERİ (Sanity yerine)
const REFERENCES_DATA = [
    { _id: '1', name: 'Zorlu Center', logo: '/images/references/zorlu.png' },
    { _id: '2', name: 'Hilton Hotels', logo: '/images/references/hilton.png' },
    { _id: '3', name: 'Rixos Premium', logo: '/images/references/rixos.png' },
    { _id: '4', name: 'Arkas Holding', logo: '/images/references/arkas.png' },
    { _id: '5', name: 'Folkart Towers', logo: '/images/references/folkart.png' },
    // Buraya dilediğin kadar ekleyebilirsin
];

export default function ReferanslarPage() {
    // Slider döngüsü için veriyi çoğaltıyoruz (eski mantıkla aynı)
    const [references] = useState<any[]>(Array(5).fill(REFERENCES_DATA).flat())
    const [loading, setLoading] = useState(false) // Manuel veri olduğu için loading kapalı
    const containerRef = useRef<HTMLDivElement>(null)
    const [constraints, setConstraints] = useState({ left: 0, right: 0 })

    const x = useMotionValue(0)
    const springX = useSpring(x, { stiffness: 200, damping: 25 })

    useEffect(() => {
        if (containerRef.current) {
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

    // Sanity'den veri gelmediği sürece loading ekranına gerek yok ama tasarımı korumak istersen durabilir.
    if (loading) return null;

    return (
        <main className="min-h-screen bg-white text-neutral-900 overflow-x-hidden">
            {/* HERO SECTION */}
            <section className="relative pt-32 md:pt-48 pb-20 md:pb-32 px-6 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-neutral-100 to-transparent rounded-full blur-3xl opacity-40" />
                    <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-neutral-100 to-transparent rounded-full blur-3xl opacity-40" />
                </div>

                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center md:text-left"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 text-white text-[10px] uppercase tracking-[0.3em] mb-8"
                        >
                            <Sparkles size={12} />
                            <span>Referanslar & İşbirlikleri</span>
                        </motion.div>

                        <h1 className="text-5xl md:text-[8rem] font-light tracking-[-0.02em] leading-[1.1] md:leading-[0.9] mb-8">
                            Güvenle İnşa Edilen
                            <br />
                            <span className="font-serif italic text-neutral-400">Estetik Bağlar</span>
                            <span className="text-neutral-900">.</span>
                        </h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-neutral-500 text-sm md:text-base leading-relaxed max-w-2xl"
                        >
                            Her proje, EkolHome'un titizliğinin ve estetik mükemmeliyetinin kanıtıdır.
                            Sektörün öncü markaları bize güveniyor.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="grid grid-cols-3 gap-6 md:gap-12 mt-12 md:mt-16 max-w-3xl"
                        >
                            <StatItem icon={<Award size={20} />} value="500+" label="Proje" />
                            <StatItem icon={<Users size={20} />} value="300+" label="Mutlu Müşteri" />
                            <StatItem icon={<Clock size={20} />} value="15+" label="Yıl Tecrübe" />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* DRAGGABLE SLIDER */}
            <section className="py-16 md:py-24 bg-gradient-to-b from-neutral-50 to-white relative select-none touch-pan-y">
                <div className="max-w-[1800px] mx-auto px-4 md:px-6">
                    <div className="flex justify-between items-center mb-10 md:mb-16">
                        <div>
                            <h2 className="text-xs md:text-sm uppercase tracking-[0.3em] font-semibold text-neutral-400 mb-2">Portfolyo</h2>
                            <p className="text-2xl md:text-4xl font-light tracking-tight">Referans Projelerimiz</p>
                        </div>
                        <div className="hidden md:flex gap-3">
                            <button
                                onClick={() => handleScroll('left')}
                                className="p-4 bg-white border border-neutral-200 rounded-full hover:bg-neutral-900 hover:text-white transition-all shadow-sm"
                            >
                                <ChevronLeft size={20} strokeWidth={1.5} />
                            </button>
                            <button
                                onClick={() => handleScroll('right')}
                                className="p-4 bg-white border border-neutral-200 rounded-full hover:bg-neutral-900 hover:text-white transition-all shadow-sm"
                            >
                                <ChevronRight size={20} strokeWidth={1.5} />
                            </button>
                        </div>
                    </div>

                    <div className="relative cursor-grab active:cursor-grabbing">
                        <motion.div
                            ref={containerRef}
                            style={{ x: springX }}
                            drag="x"
                            dragConstraints={constraints}
                            dragElastic={0.1}
                            onDragStart={(e) => e.preventDefault()}
                            className="flex gap-4 md:gap-8 py-8"
                        >
                            {references.map((item, idx) => (
                                <motion.div
                                    key={`${item._id}-${idx}`}
                                    whileHover={{ y: -10 }}
                                    className="flex-shrink-0 w-64 h-44 md:w-96 md:h-64 bg-white border border-neutral-100 shadow-xl rounded-[2.5rem] flex items-center justify-center p-6 md:p-10 relative overflow-hidden group select-none"
                                >
                                    <div className="absolute inset-0 bg-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

                                    {item.logo ? (
                                        <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-500 z-10 pointer-events-none">
                                            <Image
                                                src={item.logo}
                                                alt={item.name}
                                                fill
                                                className="object-contain"
                                                draggable={false}
                                                sizes="(max-width: 768px) 256px, 384px"
                                            />
                                        </div>
                                    ) : (
                                        <div className="relative z-10 text-center pointer-events-none">
                                            <span className="text-sm md:text-xl font-medium tracking-widest text-neutral-900 group-hover:text-white transition-colors duration-500 uppercase">
                                                {item.name}
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-neutral-900 group-hover:bg-white transition-colors duration-500 z-20" />
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
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 text-neutral-900 mb-3">{icon}</div>
            <div className="text-2xl md:text-3xl font-light tracking-tight text-neutral-900 mb-1">{value}</div>
            <div className="text-xs uppercase tracking-[0.2em] text-neutral-400">{label}</div>
        </div>
    )
}

function ProcessStep({ num, title, desc, delay }: { num: string, title: string, desc: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            whileHover={{ x: 8 }}
            className="group relative p-8 md:p-12 bg-gradient-to-br from-neutral-50 to-white border border-neutral-100 rounded-[2rem] transition-all duration-500 hover:shadow-2xl hover:border-neutral-200"
        >
            <div className="absolute top-8 right-8 text-6xl md:text-8xl font-light text-neutral-100 group-hover:text-neutral-200 transition-colors duration-500">{num}</div>
            <div className="relative z-10">
                <div className="w-12 h-[1px] bg-neutral-900 mb-6 group-hover:w-20 transition-all duration-500" />
                <h3 className="text-xl md:text-2xl font-medium mb-4 tracking-tight text-neutral-900">{title}</h3>
                <p className="text-sm md:text-base text-neutral-500 leading-relaxed max-w-md">{desc}</p>
            </div>
            <div className="absolute bottom-8 left-8 w-2 h-2 rounded-full bg-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
    )
}
