import React from 'react';
import { Instagram, Mail, Phone, ArrowUpRight } from "lucide-react";
import Link from "next/link";
const Footer = () => {
    return (
        <footer className="border-t border-black/10 px-6 md:px-12 py-16 bg-white">
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
                {/* Logo ve Tanıtım */}
                <div className="space-y-4">
                    <div className="text-2xl font-light tracking-tighter">
                        EKOL<span className="font-thin italic lowercase">home</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed max-w-xs uppercase tracking-wider">
                        Nesiller boyu süren tekstil ustalığı ve modern tasarım anlayışı.
                    </p>
                </div>


                {/* İletişim Bilgileri */}
                <div className="space-y-4">
                    {/* Başlığa Link ve İkon Ekledik */}
                    <Link
                        href="/iletisim"
                        className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors"
                    >
                        İletişim
                        <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>

                    <div className="space-y-3 text-sm font-light text-gray-600">
                        {/* Mail Kısmı */}
                        <a
                            href="mailto:info@ekolhometekstil.com"
                            className="flex items-center gap-3 hover:text-black hover:italic transition-all"
                        >
                            <Mail size={14} className="text-gray-400" />
                            <span>info@ekolhometekstil.com</span>
                        </a>

                        {/* Telefon Kısmı */}
                        <a
                            href="tel:+905343214765"
                            className="flex items-center gap-3 hover:text-black hover:italic transition-all"
                        >
                            <Phone size={14} className="text-gray-400" />
                            <span>+90 534 321 47 65</span>
                        </a>
                    </div>
                </div>


                {/* Sosyal Medya */}
                <div className="space-y-4">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Takip Edin</div>
                    <div className="flex gap-6 items-center">
                        <a
                            href="https://www.instagram.com/ekolhome" // Buraya kendi linkini yazarsın
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 text-sm font-light hover:text-black transition-all"
                        >
                            <Instagram size={18} className="text-gray-400 group-hover:text-black transition-colors" />
                            <span className="group-hover:italic">Instagram</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Alt Bilgi ve Yasal Haklar */}
            <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-gray-400">
                <div>© 2026 EkolHome Tekstil. Tüm hakları saklıdır.</div>
                <div className="flex gap-8">
                    <a href="#" className="hover:text-black transition-colors">Gizlilik Politikası</a>
                    <a href="#" className="hover:text-black transition-colors">Kullanım Koşulları</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;