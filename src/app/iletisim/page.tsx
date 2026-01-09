"use client";
import { useState, useEffect } from "react"; // Veri çekmek için useEffect ekledik
import { motion } from "framer-motion";
import { client } from "@/sanity/lib/client"; // Sanity client yolunu kontrol et

// Senin Formspree linkin
const FORM_ENDPOINT = "https://formspree.io/f/mreezzkz";

// Sanity'den gelecek verinin tipi
interface ContactData {
    phone: string;
    email: string;
    address: string;
    mapUrl: string;
}

export default function Contact() {
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [contact, setContact] = useState<ContactData | null>(null);

    // Sanity'den verileri çekiyoruz
    // Sanity'den verileri çekiyoruz
    useEffect(() => {
        const fetchContact = async () => {
            const query = `*[_type == "contact"][0]{
            phone,
            email,
            address,
            mapUrl 
        }`;
            const data = await client.fetch(query);
            setContact(data);
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
            console.error("Formspree Hatası:", err);
            setStatus("error");
        }
    };

    // Veri yüklenene kadar boş dönmesin diye ufak bir kontrol
    if (!contact) return <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">Yükleniyor...</div>;

    return (
        <main className="bg-[#FAF9F6] text-[#1a1a1a] min-h-screen">
            <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid md:grid-cols-2 gap-16 items-start">

                    {/* Sol: İletişim Detayları (SANITY'DEN GELENLER) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-10"
                    >
                        <div>
                            <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] mb-4 border-b border-black/10 pb-2 inline-block">Adres</h3>
                            <p className="text-lg font-light leading-relaxed max-w-sm">{contact.address}</p>
                        </div>
                        <div>
                            <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] mb-4 border-b border-black/10 pb-2 inline-block">Telefon</h3>
                            <p className="text-lg font-light">{contact.phone}</p>
                        </div>
                        <div>
                            <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] mb-4 border-b border-black/10 pb-2 inline-block">E-Mail</h3>
                            <p className="text-lg font-light text-gray-600">{contact.email}</p>
                        </div>
                    </motion.div>

                    {/* Sağ: Form (Değişmedi) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-8 border border-black/5 shadow-sm"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <input name="name" required placeholder="Adınız" className="w-full bg-[#f7f7f7] border-none px-4 py-4 text-xs outline-none focus:ring-1 focus:ring-black transition-all" />
                                <input name="email" type="email" required placeholder="E-Mail" className="w-full bg-[#f7f7f7] border-none px-4 py-4 text-xs outline-none focus:ring-1 focus:ring-black transition-all" />
                                <textarea name="message" rows={4} required placeholder="Mesajınız" className="w-full bg-[#f7f7f7] border-none px-4 py-4 text-xs outline-none focus:ring-1 focus:ring-black transition-all resize-none" />
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

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 w-full h-[450px] border border-black/5 overflow-hidden shadow-sm"
                >
                    {contact.mapUrl ? (
                        <iframe
                            src={contact.mapUrl}
                            className="w-full h-full"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                            Harita linki henüz eklenmedi.
                        </div>
                    )}
                </motion.div>
            </div>
        </main>
    );
}