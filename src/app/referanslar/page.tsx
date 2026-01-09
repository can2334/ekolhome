"use client";

import { client } from '@/sanity/lib/client'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { useEffect, useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, Sparkles, Award, Users, Clock } from 'lucide-react'
import { motion, useMotionValue, useSpring, animate } from 'framer-motion'

export default function ReferanslarPage() {
    const [references, setReferences] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const x = useMotionValue(0)
    const springX = useSpring(x, { stiffness: 200, damping: 25 })

    useEffect(() => {
        const query = `*[_type == "clientReference"] | order(_createdAt desc)`
        client.fetch(query).then(data => {
            setReferences(Array(10).fill(data).flat())
            setLoading(false)
        })
    }, [])

    const handleScroll = (direction: 'left' | 'right') => {
        const moveAmount = window.innerWidth < 768 ? 250 : 400
        const currentX = x.get()
        const targetX = direction === 'left' ? currentX + moveAmount : currentX - moveAmount

        animate(x, targetX, {
            type: "spring",
            stiffness: 200,
            damping: 25
        })
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-2 border-neutral-200 border-t-black rounded-full mx-auto mb-4"
                    />
                    <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">EkolHome</p>
                </motion.div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-white text-neutral-900 overflow-x-hidden">
            {/* HERO SECTION - Ultra Modern */}
            <section className="relative pt-32 md:pt-48 pb-20 md:pb-32 px-6 overflow-hidden">
                {/* Animated Background Elements */}
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
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 text-white text-[10px] uppercase tracking-[0.3em] mb-8"
                        >
                            <Sparkles size={12} />
                            <span>Referanslar & İşbirlikleri</span>
                        </motion.div>

                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-[8rem] font-light tracking-[-0.02em] leading-[1.1] md:leading-[0.9] mb-8">
                            Güvenle İnşa Edilen
                            <br />
                            <span className="font-serif italic text-neutral-400">Estetik Bağlar</span>
                            <span className="text-neutral-900">.</span>
                        </h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-neutral-500 text-sm md:text-base leading-relaxed max-w-2xl"
                        >
                            Her proje, EkolHome'un titizliğinin ve estetik mükemmeliyetinin kanıtıdır.
                            Sektörün öncü markaları bize güveniyor.
                        </motion.p>

                        {/* Stats */}
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

            {/* DRAGGABLE SLIDER - Premium Design */}
            <section className="py-16 md:py-24 bg-gradient-to-b from-neutral-50 to-white relative select-none touch-pan-y">
                <div className="max-w-[1800px] mx-auto px-4 md:px-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-10 md:mb-16">
                        <div>
                            <h2 className="text-xs md:text-sm uppercase tracking-[0.3em] font-semibold text-neutral-400 mb-2">
                                Portfolyo
                            </h2>
                            <p className="text-2xl md:text-4xl font-light tracking-tight">
                                Referans Projelerimiz
                            </p>
                        </div>

                        <div className="hidden md:flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleScroll('left')}
                                className="p-4 bg-white border border-neutral-200 rounded-full hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all shadow-sm"
                            >
                                <ChevronLeft size={20} strokeWidth={1.5} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleScroll('right')}
                                className="p-4 bg-white border border-neutral-200 rounded-full hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all shadow-sm"
                            >
                                <ChevronRight size={20} strokeWidth={1.5} />
                            </motion.button>
                        </div>
                    </div>

                    {/* Slider */}
                    <div className="relative cursor-grab active:cursor-grabbing overflow-hidden">
                        <motion.div
                            ref={containerRef}
                            style={{ x: springX }}
                            drag="x"
                            dragConstraints={{ left: -5000, right: 5000 }}
                            dragElastic={0.05}
                            className="flex gap-4 md:gap-6 py-8"
                        >
                            {references.map((item, idx) => (
                                <motion.div
                                    key={`${item._id}-${idx}`}
                                    onHoverStart={() => setHoveredIndex(idx)}
                                    onHoverEnd={() => setHoveredIndex(null)}
                                    whileHover={{ y: -8 }}
                                    className="flex-shrink-0 w-56 h-40 md:w-80 md:h-56 bg-white border border-neutral-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-3xl flex items-center justify-center p-8 md:p-12 relative overflow-hidden group"
                                >
                                    {/* Hover Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Content */}
                                    {item.logo ? (
                                        <div className="relative w-full h-full transform group-hover:scale-110 transition-transform duration-500 z-10">
                                            <Image
                                                src={urlFor(item.logo).url()}
                                                alt={item.name}
                                                fill
                                                priority={idx < 15}
                                                sizes="(max-width: 768px) 224px, 320px"
                                                className="object-contain transition-all duration-500 group-hover:brightness-0 group-hover:invert"
                                            />
                                        </div>
                                    ) : (
                                        <div className="relative z-10">
                                            <span className="text-sm md:text-lg font-semibold tracking-tight text-neutral-900 group-hover:text-white transition-colors duration-500 uppercase">
                                                {item.name}
                                            </span>
                                        </div>
                                    )}

                                    {/* Corner Accent */}
                                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-neutral-900 group-hover:bg-white transition-colors duration-500" />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Mobile scroll indicator */}
                    <div className="md:hidden flex justify-center mt-8 gap-2">
                        <div className="w-12 h-1 bg-neutral-900 rounded-full" />
                        <div className="w-12 h-1 bg-neutral-200 rounded-full" />
                        <div className="w-12 h-1 bg-neutral-200 rounded-full" />
                    </div>
                </div>
            </section>

            {/* SÜREÇ BÖLÜMÜ - Refined */}
            <section className="py-24 md:py-40 px-6 bg-white relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.02]">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }} />
                </div>

                <div className="max-w-7xl mx-auto relative">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-start">
                        {/* Left Column - Sticky */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-5 lg:sticky lg:top-32"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-600 text-[10px] uppercase tracking-[0.3em] mb-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 animate-pulse" />
                                <span>Süreç</span>
                            </div>

                            <h2 className="text-4xl md:text-6xl font-light tracking-[-0.01em] mb-6 leading-tight">
                                Fikir Nasıl
                                <br />
                                <span className="font-serif italic text-neutral-400">Form Bulur</span>?
                            </h2>

                            <div className="w-16 h-[1px] bg-neutral-900 mb-8" />

                            <p className="text-neutral-500 leading-relaxed text-sm md:text-base mb-8">
                                EkolHome'da her süreç, bir hammaddenin ötesine geçerek yaşam alanınıza
                                değer katan bir sanat eserine dönüşme hikayesidir.
                            </p>

                            <motion.div
                                whileHover={{ x: 5 }}
                                className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900 cursor-pointer"
                            >
                                <span>Tüm Süreci Keşfet</span>
                                <ChevronRight size={16} />
                            </motion.div>
                        </motion.div>

                        {/* Right Column - Steps */}
                        <div className="lg:col-span-7 grid grid-cols-1 gap-8">
                            <ProcessStep
                                num="01"
                                title="Kürasyon & Analiz"
                                desc="Mekanınızın ihtiyaçlarını sadece ölçülerle değil, ruhuyla analiz ediyoruz. Her detay özenle değerlendiriliyor."
                                delay={0.1}
                            />
                            <ProcessStep
                                num="02"
                                title="Materyal Seçkisi"
                                desc="Dokusuyla hikaye anlatan kumaşları ve en dayanıklı iskelet yapılarını özenle seçiyoruz."
                                delay={0.2}
                            />
                            <ProcessStep
                                num="03"
                                title="Hassas İşçilik"
                                desc="Usta ellerin dokunuşunu modern teknolojiyle harmanlayarak kusursuzlaştırıyoruz."
                                delay={0.3}
                            />
                            <ProcessStep
                                num="04"
                                title="Final & Teslimat"
                                desc="Süreci sadece ürün teslimiyle değil, mükemmel memnuniyetle noktalıyoruz."
                                delay={0.4}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-24 md:py-32 px-6 bg-neutral-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-neutral-700 rounded-full blur-3xl opacity-20" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6">
                            Projeniz için <span className="font-serif italic">mükemmel</span> çözümler
                        </h2>
                        <p className="text-neutral-400 text-sm md:text-base mb-10">
                            EkolHome ile hayalinizdeki mekanı yaratın
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-white text-neutral-900 rounded-full font-medium text-sm hover:shadow-2xl transition-all"
                        >
                            İletişime Geçin
                        </motion.button>
                    </motion.div>
                </div>
            </section>
        </main>
    )
}

function StatItem({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
    return (
        <div className="text-center md:text-left">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 text-neutral-900 mb-3">
                {icon}
            </div>
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
            className="group relative p-8 md:p-10 bg-gradient-to-br from-neutral-50 to-white border border-neutral-100 rounded-3xl transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:border-neutral-200"
        >
            {/* Number */}
            <div className="absolute top-8 right-8 text-6xl md:text-7xl font-light text-neutral-100 group-hover:text-neutral-900 transition-colors duration-500">
                {num}
            </div>

            {/* Content */}
            <div className="relative z-10">
                <div className="w-12 h-[1px] bg-neutral-900 mb-6 group-hover:w-20 transition-all duration-500" />
                <h3 className="text-xl md:text-2xl font-medium mb-4 tracking-tight text-neutral-900">
                    {title}
                </h3>
                <p className="text-sm md:text-base text-neutral-500 leading-relaxed">
                    {desc}
                </p>
            </div>

            {/* Corner Accent */}
            <div className="absolute bottom-8 left-8 w-2 h-2 rounded-full bg-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
    )
}