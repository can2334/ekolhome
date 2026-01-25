"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import Link from "next/link";

export default function About() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const textY = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const imageY = useTransform(scrollYProgress, [0, 1], [0, 150]);

    useEffect(() => {
        const lenis = new Lenis();
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }, []);

    return (
        <main ref={containerRef} className="bg-[#FAF9F6] text-[#1a1a1a] min-h-screen">

            {/* --- Section 1: Intro (Boşluklar Düzeltildi) --- */}
            {/* h-screen yerine min-h-[70vh] kullanarak mobildeki aşırı boşluğu engelledik */}
            <section className="min-h-[70vh] md:h-screen flex flex-col justify-start md:justify-center px-6 md:px-24 pt-24 md:pt-0">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col"
                >
                    <span className="text-[10px] uppercase tracking-[0.5em] text-gray-400 mb-6 block">
                        Ekol Home / Vizyonumuz
                    </span>

                    <h1 className="text-[14vw] md:text-[8vw] font-bold leading-[0.85] uppercase tracking-tighter mb-10">
                        Kumaşın <br />
                        <span className="italic font-serif font-thin ml-[5vw] text-[#d9a066]">Ruhuyla</span> <br />
                        Tanışın
                    </h1>
                </motion.div>

                <motion.div
                    style={{ y: typeof window !== 'undefined' && window.innerWidth > 768 ? textY : 0 }}
                    className="md:mt-20 self-start md:self-end max-w-xl"
                >
                    <p className="text-lg md:text-2xl leading-relaxed font-light border-l-2 border-[#d9a066] pl-6 md:border-none md:pl-0">
                        Ekol Home olarak, tekstili sadece bir malzeme değil, yaşam alanlarını dönüştüren bir
                        <span className="italic font-serif"> "hikaye anlatıcısı" </span> olarak görüyoruz.
                        40 yılı aşkın süredir her ilmeği tutkuyla atıyoruz.
                    </p>
                </motion.div>
            </section>

            {/* --- Section 2: Parallax Image --- */}
            <section className="relative h-[60vh] md:h-[120vh] overflow-hidden">
                <motion.div
                    style={{ y: imageY }}
                    className="w-full h-full grayscale brightness-90 shadow-2xl"
                >
                    <img
                        src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1500"
                        className="w-full h-full object-cover"
                        alt="Atölye"
                    />
                </motion.div>
            </section>

            {/* --- Section 3: Values --- */}
            <section className="py-32 md:py-60 px-6 md:px-24 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
                <div className="space-y-6">
                    <span className="text-4xl font-serif italic text-[#d9a066]">01.</span>
                    <h3 className="text-xs uppercase tracking-widest font-bold">Sürdürülebilirlik</h3>
                    <p className="text-[11px] md:text-sm text-gray-500 leading-relaxed uppercase tracking-wider">
                        Doğadan aldığımızı doğaya saygıyla sunuyoruz. Organik sertifikalı iplikler ve eko-dostu boyama teknikleri tek vazgeçilmezimiz.
                    </p>
                </div>
                <div className="space-y-6 md:mt-20">
                    <span className="text-4xl font-serif italic text-[#d9a066]">02.</span>
                    <h3 className="text-xs uppercase tracking-widest font-bold">Zanaatkarlık</h3>
                    <p className="text-[11px] md:text-sm text-gray-500 leading-relaxed uppercase tracking-wider">
                        Makinelerin ulaşamadığı hassasiyeti, usta ellerin dokunuşunda buluyoruz. Her ürün, elde son dokunuşunu alır.
                    </p>
                </div>
                <div className="space-y-6 md:mt-40">
                    <span className="text-4xl font-serif italic text-[#d9a066]">03.</span>
                    <h3 className="text-xs uppercase tracking-widest font-bold">İnovasyon</h3>
                    <p className="text-[11px] md:text-sm text-gray-500 leading-relaxed uppercase tracking-wider">
                        Geçmişin dokusunu, yarının teknolojisiyle harmanlıyoruz. Akıllı kumaşlar ve modern tasarımlar geliştiriyoruz.
                    </p>
                </div>
            </section>

            {/* --- Section 4: Call to Action --- */}
            <section className="h-[70vh] md:h-screen flex items-center justify-center bg-black text-white px-6">
                <div className="text-center space-y-12">
                    <h2 className="text-4xl md:text-7xl font-light tracking-tighter">Birlikte Yeni Hikayeler <br /> <span className="italic font-serif">Dokuyalım.</span></h2>
                    <Link href="/hizmetlerimiz">
                        <button className="border border-white/20 px-10 py-4 md:px-12 md:py-5 uppercase text-[10px] tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-500">
                            Hizmetlerimizi İnceleyin
                        </button>
                    </Link>
                </div>
            </section>
        </main>
    );
}