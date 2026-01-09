"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import contactData from "../data/contactInfo.json";

// Senin Formspree linkin
const FORM_ENDPOINT = "https://formspree.io/f/mreezzkz";

export default function Contact() {
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("sending");

        const formData = new FormData(e.currentTarget);

        // Formspree'ye verileri gönderiyoruz
        try {
            const res = await fetch(FORM_ENDPOINT, {
                method: 'POST',
                body: formData, // Formspree doğrudan FormData kabul eder
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (res.ok) {
                setStatus("success");
                (e.target as HTMLFormElement).reset();
                setTimeout(() => setStatus("idle"), 5000);
            } else {
                setStatus("error");
            }
        } catch (err) {
            console.error("Formspree Hatası:", err);
            setStatus("error");
        }
    };

    return (
        <main className="bg-[#FAF9F6] text-[#1a1a1a] min-h-screen">
            <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid md:grid-cols-2 gap-16 items-start">

                    {/* Sol: İletişim Detayları */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-10"
                    >
                        <div>
                            <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] mb-4 border-b border-black/10 pb-2 inline-block">Adres</h3>
                            <p className="text-lg font-light leading-relaxed max-w-sm">{contactData.address}</p>
                        </div>
                        <div>
                            <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] mb-4 border-b border-black/10 pb-2 inline-block">Telefon</h3>
                            {contactData.phones.map((p, i) => <p key={i} className="text-lg font-light">{p}</p>)}
                        </div>
                        <div>
                            <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] mb-4 border-b border-black/10 pb-2 inline-block">E-Mail</h3>
                            <p className="text-lg font-light text-gray-600">{contactData.email}</p>
                        </div>
                    </motion.div>

                    {/* Sağ: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-8 border border-black/5 shadow-sm"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <input
                                    name="name"
                                    required
                                    placeholder="Adınız"
                                    className="w-full bg-[#f7f7f7] border-none px-4 py-4 text-xs outline-none focus:ring-1 focus:ring-black transition-all"
                                />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="E-Mail"
                                    className="w-full bg-[#f7f7f7] border-none px-4 py-4 text-xs outline-none focus:ring-1 focus:ring-black transition-all"
                                />
                                <textarea
                                    name="message"
                                    rows={4}
                                    required
                                    placeholder="Mesajınız"
                                    className="w-full bg-[#f7f7f7] border-none px-4 py-4 text-xs outline-none focus:ring-1 focus:ring-black transition-all resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={status === "sending"}
                                className="w-full bg-[#d9a066] hover:bg-black text-white py-4 text-[10px] uppercase tracking-[0.4em] font-medium transition-all duration-500 disabled:bg-gray-400"
                            >
                                {status === "sending" ? "GÖNDERİLİYOR..." : "GÖNDER"}
                            </button>

                            {status === "success" && <p className="text-[10px] text-green-600 text-center uppercase tracking-widest mt-4">Mesajınız başarıyla gönderildi!</p>}
                            {status === "error" && <p className="text-[10px] text-red-600 text-center uppercase tracking-widest mt-4">Bir sorun oluştu, lütfen tekrar deneyin.</p>}
                        </form>
                    </motion.div>
                </div>

                {/* Alt Kısım: Harita */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 w-full h-[450px] border border-black/5 overflow-hidden shadow-sm"
                >
                    <iframe src={contactData.mapUrl} className="w-full h-full" style={{ border: 0 }} allowFullScreen loading="lazy" />
                </motion.div>
            </div>
        </main>
    );
}