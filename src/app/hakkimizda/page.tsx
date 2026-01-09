"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function About() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Parallax efektleri için değerler
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

            {/* --- Section 1: Intro (The Philosophy) --- */}
            <section className="h-screen flex flex-col justify-center px-8 md:px-24">
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] uppercase tracking-[0.5em] text-gray-400 mb-8"
                >
                    EkolHomeımız & Vizyonumuz
                </motion.span>

                <h1 className="text-[10vw] md:text-[8vw] font-bold leading-[0.9] uppercase tracking-tighter">
                    Kumaşın <br />
                    <span className="italic font-serif font-thin ml-[5vw]">Ruhuyla</span> <br />
                    Tanışın
                </h1>

                <motion.div
                    style={{ y: textY }}
                    className="mt-20 self-end max-w-xl"
                >
                    <p className="text-xl md:text-2xl leading-relaxed font-light">
                        Ekol Home olarak, tekstili sadece bir malzeme değil, yaşam alanlarını dönüştüren bir
                        <span className="italic font-serif"> "hikaye anlatıcısı" </span> olarak görüyoruz.
                        40 yılı aşkın süredir her ilmeği tutkuyla atıyoruz.
                    </p>
                </motion.div>
            </section>

            {/* --- Section 2: Visual Heritage (Parallax Image) --- */}
            <section className="relative h-[120vh] overflow-hidden flex items-center justify-center">
                <motion.div
                    style={{ y: imageY }}
                    className="w-[80vw] h-[100vh] grayscale brightness-90 shadow-2xl"
                >
                    <img
                        src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1500"
                        className="w-full h-full object-cover"
                        alt="Atölye EkolHomeımız"
                    />
                </motion.div>

                {/* Görsel üzerine binen yüzer yazılar */}
                <div className="absolute inset-0 flex flex-col justify-between p-12 pointer-events-none">
                    <h2 className="text-[15vw] font-bold text-white/10 uppercase select-none">Est. 1986</h2>
                    <h2 className="text-[15vw] font-bold text-white/10 uppercase self-end select-none">Istanbul</h2>
                </div>
            </section>

            {/* --- Section 3: Values (The Grid) --- */}
            <section className="py-60 px-8 md:px-24 grid grid-cols-1 md:grid-cols-3 gap-24">
                <div className="space-y-6">
                    <span className="text-4xl font-serif italic">01.</span>
                    <h3 className="text-xs uppercase tracking-widest font-bold">Sürdürülebilirlik</h3>
                    <p className="text-sm text-gray-500 leading-relaxed uppercase tracking-wider">
                        Doğadan aldığımızı doğaya saygıyla sunuyoruz. Organik sertifikalı iplikler ve eko-dostu boyama teknikleri tek vazgeçilmezimiz.
                    </p>
                </div>
                <div className="space-y-6 md:mt-20">
                    <span className="text-4xl font-serif italic">02.</span>
                    <h3 className="text-xs uppercase tracking-widest font-bold">Zanaatkarlık</h3>
                    <p className="text-sm text-gray-500 leading-relaxed uppercase tracking-wider">
                        Makinelerin ulaşamadığı hassasiyeti, usta ellerin dokunuşunda buluyoruz. Her ürün, elde son dokunuşunu alır.
                    </p>
                </div>
                <div className="space-y-6 md:mt-40">
                    <span className="text-4xl font-serif italic">03.</span>
                    <h3 className="text-xs uppercase tracking-widest font-bold">İnovasyon</h3>
                    <p className="text-sm text-gray-500 leading-relaxed uppercase tracking-wider">
                        Geçmişin dokusunu, yarının teknolojisiyle harmanlıyoruz. Akıllı kumaşlar ve modern tasarımlar geliştiriyoruz.
                    </p>
                </div>
            </section>

            {/* --- Section 4: Call to Action --- */}
            <section className="h-screen flex items-center justify-center bg-black text-white px-8">
                <div className="text-center space-y-12">
                    <h2 className="text-5xl md:text-7xl font-light tracking-tighter">Birlikte Yeni Hikayeler <br /> <span className="italic font-serif">Dokuyalım.</span></h2>
                    <button className="border border-white/20 px-12 py-5 uppercase text-[10px] tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-500">
                        Kataloğumuzu İnceleyin
                    </button>
                </div>
            </section>
        </main>
    );
}