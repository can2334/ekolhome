"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// API ve Form Linkleri
const API_ENDPOINT = "https://ekolhome.smusa9883x.workers.dev/api/contact";
const FORM_ENDPOINT = "https://formspree.io/f/mdaeoaza";

interface ContactData {
    address: string;
    phone: string;
    email: string;
    map_url: string;
}

export default function Contact() {
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [contact, setContact] = useState<ContactData | null>(null);

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const res = await fetch(API_ENDPOINT);
                const data = await res.json();
                setContact(data[0]);
            } catch (err) {
                console.error("Veri çekme hatası:", err);
            }
        };
        fetchContact();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("sending");
        const formData = new FormData(e.currentTarget);

        try {
            const res = await fetch(FORM_ENDPOINT, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) {
                setStatus("success");
                (e.target as HTMLFormElement).reset();
                setTimeout(() => setStatus("idle"), 5000);
            } else {
                setStatus("error");
            }
        } catch (err) {
            setStatus("error");
        }
    };

    if (!contact) return (
        <div className="min-h-screen bg-white flex items-center justify-center text-[10px] tracking-[0.3em] uppercase opacity-50">
            Yükleniyor...
        </div>
    );

    return (
        <main className="bg-white text-black min-h-screen font-light selection:bg-[#d9a066] selection:text-white">

            {/* Üst Başlık: Boşluklar (pt-48'den pt-24'e) ciddi oranda azaltıldı */}
            <div className="pt-24 pb-12 max-w-[1400px] mx-auto px-6 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl"
                >
                    <h1 className="text-5xl md:text-7xl font-extralight tracking-tighter leading-tight mb-4 text-[#1a1a1a]">
                        BİZİMLE <br /> <span className="text-[#d9a066]">TANIŞIN.</span>
                    </h1>
                    <p className="text-gray-400 uppercase tracking-widest text-[10px]">
                        Ekolhome Mimarlık & Mobilya İletişim Hattı
                    </p>
                </motion.div>
            </div>

            {/* Bilgi ve Form Alanı: grid-cols-2 ve items-start ile form yukarı kilitlendi */}
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-10 items-start pb-16">

                {/* Sol: İletişim Detayları */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-10 py-2"
                >
                    <div className="group">
                        <span className="text-[10px] tracking-[0.5em] text-[#d9a066] uppercase font-bold block mb-3">Lokasyon</span>
                        <p className="text-xl md:text-2xl tracking-tight leading-snug font-extralight max-w-sm">
                            {contact.address}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="group">
                            <span className="text-[10px] tracking-[0.5em] text-[#d9a066] uppercase font-bold block mb-3">Telefon</span>
                            <div className="space-y-1">
                                {contact.phone?.split(",").map((p, i) => (
                                    <a key={i} href={`tel:${p}`} className="block text-lg hover:text-[#d9a066] transition-colors font-extralight">
                                        {p.trim()}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="group">
                            <span className="text-[10px] tracking-[0.5em] text-[#d9a066] uppercase font-bold block mb-3">E-Posta</span>
                            <a href={`mailto:${contact.email}`} className="text-lg hover:text-[#d9a066] transition-colors font-extralight block">
                                {contact.email}
                            </a>
                        </div>
                    </div>
                </motion.div>

                {/* Sağ: Form - Padding ve Margin değerleri daraltıldı */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-[#fcfcfc] p-8 md:p-10 rounded-[30px] border border-gray-100 shadow-sm"
                >
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="relative group">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-black font-semibold block mb-1">
                                İsim Soyisim
                            </label>
                            <input
                                name="name"
                                required
                                className="w-full bg-transparent border-b border-gray-200 py-2 outline-none focus:border-black transition-all text-base"
                            />
                        </div>

                        <div className="relative group">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-black font-semibold block mb-1">
                                E-Posta Adresi
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full bg-transparent border-b border-gray-200 py-2 outline-none focus:border-black transition-all text-base"
                            />
                        </div>

                        <div className="relative group">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-black font-semibold block mb-1">
                                Mesajınız
                            </label>
                            <textarea
                                name="message"
                                rows={2}
                                required
                                className="w-full bg-transparent border-b border-gray-200 py-2 outline-none focus:border-black transition-all text-base resize-none"
                            />
                        </div>

                        <div className="flex flex-col gap-4">
                            <button
                                type="submit"
                                disabled={status === "sending"}
                                className="group flex items-center gap-4 outline-none"
                            >
                                <div className="w-12 h-12 rounded-full border border-black group-hover:bg-black transition-all duration-500 flex items-center justify-center">
                                    <motion.svg
                                        width="16" height="16" viewBox="0 0 20 20" fill="none"
                                        className="group-hover:invert transition-all"
                                        whileHover={{ x: 3 }}
                                    >
                                        <path d="M5 10H15M15 10L10 5M15 10L10 15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </motion.svg>
                                </div>
                                <span className="text-[10px] uppercase tracking-[0.3em] font-black group-hover:text-[#d9a066] transition-colors">
                                    {status === "sending" ? "GÖNDERİLİYOR" : "MESAJI GÖNDER"}
                                </span>
                            </button>
                            {status === "success" && (
                                <p className="text-[9px] text-green-600 font-bold uppercase tracking-widest animate-pulse">
                                    ✓ Başarıyla iletildi.
                                </p>
                            )}
                        </div>
                    </form>
                </motion.div>
            </div>

            {/* Harita */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-20"
            >
                <div className="relative w-full h-[400px] md:h-[450px] rounded-[30px] border-[6px] border-white shadow-xl overflow-hidden">
                    {contact.map_url ? (
                        <iframe
                            src={contact.map_url}
                            className="w-full h-full border-none"
                            style={{ filter: "grayscale(0.1)" }}
                            allowFullScreen
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full bg-[#f8f8f8] flex items-center justify-center animate-pulse text-[10px] tracking-widest">
                            HARİTA YÜKLENİYOR...
                        </div>
                    )}
                </div>
            </motion.div>
        </main>
    );
}