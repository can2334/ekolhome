"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";

const WhatsAppChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");

    const phoneNumber = "905465434242";

    const handleSendMessage = () => {
        const cleanMessage = message || "Merhaba!";
        const encodedMessage = encodeURIComponent(cleanMessage);

        // Cihazın mobil olup olmadığını kontrol ediyoruz
        const isMobile = /iPhone|Android/i.test(navigator.userAgent);

        let whatsappUrl = "";

        if (isMobile) {
            // Mobildeysen direkt uygulamayı tetikleyen wa.me linki
            whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        } else {
            // Masaüstündeysen profesyonel WhatsApp Web linki
            whatsappUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
        }

        window.open(whatsappUrl, '_blank');

        // Gönderdikten sonra formu temizle ve kapat
        setMessage("");
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[999] font-sans text-black">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-[350px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
                    >
                        {/* Header */}
                        <div className="bg-[#075E54] p-4 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <img
                                        src="/ekolhome.png"
                                        className="w-10 h-10 rounded-full border-2 border-white/20 object-cover"
                                        alt="Destek"
                                    />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#075E54]"></div>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm leading-none">EkolHome Destek</p>
                                    <p className="text-[10px] text-white/80 mt-1">Çevrimiçi</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors text-white">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chat Body */}
                        <div className="h-[300px] bg-[#E5DDD5] p-4 overflow-y-auto flex flex-col gap-2"
                            style={{
                                backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
                                backgroundSize: "400px"
                            }}>
                            <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] self-start">
                                <p className="text-[10px] text-green-700 font-bold mb-1 uppercase">Destek Ekibi</p>
                                <p className="text-xs leading-relaxed text-gray-800">Sizin için buradayız! Size nasıl yardımcı olabilirim?</p>
                                <p className="text-[9px] text-gray-400 text-right mt-1">Az önce</p>
                            </div>
                        </div>

                        {/* Yazma Alanı */}
                        <div className="p-3 bg-white flex items-center gap-2 border-t border-gray-50">
                            <input
                                type="text"
                                placeholder="Mesajınızı yazın..."
                                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-green-500 transition-all text-black"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button
                                onClick={handleSendMessage}
                                className="bg-[#25D366] text-white p-2.5 rounded-full hover:bg-[#128C7E] transition-all active:scale-90 flex items-center justify-center"
                            >
                                <Send size={18} fill="currentColor" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sağ Alttaki Buton */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 group ml-auto focus:outline-none"
            >
                <AnimatePresence>
                    {!isOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="bg-white text-black px-4 py-2 rounded-full shadow-lg text-sm font-medium border border-gray-100"
                        >
                            Bize yazın
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="bg-[#25D366] p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:rotate-12">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                </div>
            </button>
        </div>
    );
};

export default WhatsAppChat;