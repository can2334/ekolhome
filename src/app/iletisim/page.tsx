"use client";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contact() {
    return (
        <main className="bg-[#FAF9F6] text-[#1a1a1a]">
            <Navbar />

            {/* --- Header Section --- */}
            <section className="pt-40 pb-20 px-6 md:px-12">
                <div className="max-w-6xl mx-auto">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] uppercase tracking-[0.5em] text-gray-400 block mb-6"
                    >
                        Bize Ulaşın
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-[12vw] md:text-[8vw] font-light leading-none tracking-tighter"
                    >
                        Yeni Bir <br />
                        <span className="italic font-serif text-gray-400">Başlangıç</span>
                    </motion.h1>
                </div>
            </section>

            {/* --- Content Section --- */}
            <section className="pb-32 px-6 md:px-12">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20">

                    {/* Sol: İletişim Bilgileri */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-12"
                    >
                        <div className="space-y-8">
                            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-md">
                                Atölyemizi ziyaret etmek veya projeleriniz için özel çözümlerimizi görüşmek üzere sizi bekliyoruz.
                            </p>
                        </div>

                        <div className="grid gap-8">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center shrink-0">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Adres</h4>
                                    <p className="text-sm font-light">Tekstil Merkezi, No:42 <br />Nişantaşı, İstanbul</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center shrink-0">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Telefon</h4>
                                    <p className="text-sm font-light">+90 (212) 555 00 00</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center shrink-0">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">E-Posta</h4>
                                    <p className="text-sm font-light">hello@ekolhome.studio</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Sağ: Modern Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white p-8 md:p-12 shadow-sm border border-black/[0.02]"
                    >
                        <form className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-gray-400">Adınız</label>
                                    <input type="text" className="w-full bg-transparent border-b border-gray-200 py-2 focus:border-black outline-none transition-colors font-light" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-gray-400">E-Posta</label>
                                    <input type="email" className="w-full bg-transparent border-b border-gray-200 py-2 focus:border-black outline-none transition-colors font-light" placeholder="john@example.com" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-gray-400">Konu</label>
                                <select className="w-full bg-transparent border-b border-gray-200 py-2 focus:border-black outline-none transition-colors font-light appearance-none">
                                    <option>Özel Proje Talebi</option>
                                    <option>Toptan Satış</option>
                                    <option>Genel Bilgi</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-gray-400">Mesajınız</label>
                                <textarea rows={4} className="w-full bg-transparent border-b border-gray-200 py-2 focus:border-black outline-none transition-colors font-light resize-none" placeholder="Hayalinizdeki projeden bahsedin..." />
                            </div>

                            <button className="w-full py-5 bg-black text-white text-[10px] uppercase tracking-[0.3em] hover:bg-gray-800 transition-all duration-500 overflow-hidden group relative">
                                <span className="relative z-10">Gönder</span>
                                <div className="absolute inset-0 bg-gray-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </button>
                        </form>
                    </motion.div>

                </div>
            </section>

            {/* --- Map Placeholder / Visual --- */}
            <section className="h-[50vh] bg-gray-200 grayscale contrast-125 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1500"
                    className="w-full h-full object-cover opacity-50"
                    alt="Istanbul Location"
                />
            </section>

            <Footer />
        </main>
    );
}