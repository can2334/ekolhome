"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, User, ArrowRight, ShieldCheck, Loader2, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Frontend validasyon
        if (!username.trim() || !password.trim()) {
            setError("Kullanıcı adı ve şifre boş olamaz");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("https://ekolhome.smusa9883x.workers.dev/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username.trim(),
                    password: password.trim()
                }),
            });

            // Response'u JSON olarak parse et
            const data = await response.json();

            // Başarılı giriş kontrolü
            if (response.ok && data.success && data.token) {
                // Token'ı localStorage'a kaydet
                localStorage.setItem("admin_token", data.token);

                // Kullanıcı bilgilerini kaydet (opsiyonel)
                if (data.user) {
                    localStorage.setItem("admin_user", JSON.stringify(data.user));
                }

                // Dashboard'a yönlendir
                router.push("/admin/dashboard");
            } else {
                // Worker'dan gelen hata mesajını göster
                setError(data.error || "Kimlik bilgileri hatalı");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Arka Plan Dekoratif Elementler */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#d9a066]/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[440px] z-10"
            >
                {/* Logo Bölümü */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-4xl font-extralight tracking-[0.3em] uppercase text-white mb-2">
                            Ekol<span className="font-serif italic text-[#d9a066]">home</span>
                        </h1>
                        <p className="text-[9px] tracking-[0.5em] text-gray-500 uppercase font-medium">
                            Internal Management Suite
                        </p>
                    </motion.div>
                </div>

                {/* Ana Kart */}
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#d9a066] to-[#555] rounded-2xl opacity-20 group-hover:opacity-30 transition duration-1000"></div>

                    <div className="relative bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
                        <form onSubmit={handleLogin} className="space-y-8">
                            <div className="space-y-6">
                                {/* Kullanıcı Adı Input */}
                                <div className="group/input">
                                    <div className="flex justify-between items-center mb-2 px-1">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-400 group-focus-within/input:text-[#d9a066] transition-colors">
                                            Yönetici Adı
                                        </label>
                                        <User size={12} className="text-gray-600 group-focus-within/input:text-[#d9a066]" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        disabled={isLoading}
                                        className="w-full bg-white/5 border border-white/5 px-4 py-4 rounded-xl text-sm text-white outline-none focus:bg-white/10 focus:border-[#d9a066]/50 transition-all placeholder:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="Kullanıcı adınız..."
                                        autoComplete="username"
                                    />
                                </div>

                                {/* Şifre Input */}
                                <div className="group/input">
                                    <div className="flex justify-between items-center mb-2 px-1">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-400 group-focus-within/input:text-[#d9a066] transition-colors">
                                            Güvenlik Şifresi
                                        </label>
                                        <Lock size={12} className="text-gray-600 group-focus-within/input:text-[#d9a066]" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                        className="w-full bg-white/5 border border-white/5 px-4 py-4 rounded-xl text-sm text-white outline-none focus:bg-white/10 focus:border-[#d9a066]/50 transition-all placeholder:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                    />
                                </div>
                            </div>

                            {/* Hata Mesajı */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-red-500/10 border border-red-500/20 py-3 px-4 rounded-lg"
                                    >
                                        <p className="text-[11px] text-red-400 text-center tracking-wide flex items-center justify-center gap-2">
                                            <AlertCircle size={14} /> {error}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Login Butonu */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="relative w-full overflow-hidden group/btn disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <div className="absolute inset-0 bg-[#d9a066] transition-transform duration-500 group-hover/btn:scale-105"></div>
                                <div className="relative bg-black text-white m-[1px] py-4 rounded-[14px] flex items-center justify-center gap-3 group-hover/btn:bg-transparent transition-colors duration-500">
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin text-[#d9a066]" />
                                            <span className="text-[11px] uppercase tracking-[0.4em] font-semibold">
                                                Kontrol Ediliyor...
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-[11px] uppercase tracking-[0.4em] font-semibold">
                                                Erişim İste
                                            </span>
                                            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </div>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Alt Bilgilendirme */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-10 flex flex-col items-center gap-4"
                >
                    <div className="flex items-center gap-6 opacity-20">
                        <div className="h-[1px] w-12 bg-white"></div>
                        <ShieldCheck size={20} className="text-white" />
                        <div className="h-[1px] w-12 bg-white"></div>
                    </div>
                    <p className="text-[9px] text-gray-600 tracking-[0.2em] text-center leading-relaxed">
                        BU ALAN SADECE YETKİLİ PERSONEL İÇİNDİR.<br />
                        TÜM ERİŞİM KAYITLARI LOGLANMAKTADIR.
                    </p>
                </motion.div>
            </motion.div>
        </main>
    );
}