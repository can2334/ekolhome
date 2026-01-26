"use client";

import React, { useEffect, useState } from 'react';
import { Instagram, Mail, Phone, ArrowUpRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";

// 1. Veri tipini tanımlıyoruz
interface ContactData {
    id: number;
    address: string;
    phone: string;
    email: string;
    map_url: string;
}

const Footer = () => {
    // 2. State'e bu tipi (veya null olabileceğini) belirtiyoruz
    const [contactInfo, setContactInfo] = useState<ContactData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const res = await fetch('https://ekolhome.smusa9883x.workers.dev/api/contact');
                const data = await res.json();

                if (data && data.length > 0) {
                    // Veriyi temizleyip state'e aktarıyoruz
                    const cleanData: ContactData = {
                        ...data[0],
                        phone: data[0].phone.replace(/[a-zA-Z]/g, '').trim(),
                        email: data[0].email.split('sads')[0].trim()
                    };
                    setContactInfo(cleanData);
                }
            } catch (err) {
                console.error("İletişim verileri çekilemedi:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchContact();
    }, []);

    return (
        <footer className="border-t border-neutral-100 px-6 md:px-12 py-20 bg-white relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#d9a066]/5 blur-[120px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16 md:gap-12">

                {/* Logo Bölümü */}
                <div className="space-y-8">
                    <div className="relative w-56 h-32 transform -translate-x-2">
                        <Image
                            src="/ekolhomelogo.png"
                            alt="EkolHome Logo"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed max-w-xs uppercase tracking-[0.2em] font-medium">
                        Nesiller boyu süren tekstil ustalığı ve <br />
                        <span className="text-[#d9a066]">modern tasarım</span> anlayışıyla mekanlara imza atıyoruz.
                    </p>
                </div>

                {/* İletişim Bilgileri */}
                <div className="space-y-6 flex flex-col justify-center">
                    <div className="flex items-center gap-3">
                        <div className="h-[1px] w-8 bg-[#d9a066]" />
                        <span className="text-[10px] uppercase tracking-[0.3em] text-[#d9a066] font-bold">Hızlı Erişim</span>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-4 text-sm font-light text-neutral-500">
                            {loading ? (
                                <Loader2 className="animate-spin text-[#d9a066] w-4 h-4" />
                            ) : (
                                <>
                                    <div className="flex items-start gap-3 group">
                                        <Mail size={16} className="text-[#d9a066]/60 mt-1" />
                                        <div className="flex flex-col">
                                            <span className="text-[9px] uppercase tracking-tighter text-neutral-400">E-Posta</span>
                                            <a href={`mailto:${contactInfo?.email}`} className="hover:text-[#d9a066] transition-all tracking-tight lowercase">
                                                {contactInfo?.email}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 group">
                                        <Phone size={16} className="text-[#d9a066]/60 mt-1" />
                                        <div className="flex flex-col">
                                            <span className="text-[9px] uppercase tracking-tighter text-neutral-400">Telefon</span>
                                            <a href={`tel:${contactInfo?.phone}`} className="hover:text-[#d9a066] transition-all tracking-tight">
                                                {contactInfo?.phone}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <Link href="/iletisim" className="text-[10px] uppercase tracking-widest text-neutral-600 hover:text-black flex items-center gap-1 transition-all">
                                            İletişim Formu <ArrowUpRight size={12} className="text-[#d9a066]" />
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sosyal Medya */}
                <div className="space-y-6 flex flex-col justify-center">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold">Sosyal Mimari</div>

                    <div className="flex flex-col gap-6">
                        <a
                            href="https://www.instagram.com/ekolhome_mobilya"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 text-sm font-light text-neutral-600 hover:text-black transition-all"
                        >
                            <div className="p-3 bg-neutral-50 rounded-xl group-hover:bg-[#d9a066]/10 transition-colors">
                                <Instagram size={20} className="text-neutral-400 group-hover:text-[#d9a066] transition-colors" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-widest text-neutral-400">Instagram</span>
                                <span className="text-sm font-medium tracking-tight">@ekolhome_mobilya</span>
                            </div>
                        </a>

                        <div className="pt-6 border-t border-neutral-100">
                            <div className="text-[9px] uppercase tracking-[0.4em] text-[#d9a066] font-extrabold italic">
                                Premium Textile Excellence
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alt Bilgi */}
            <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] uppercase tracking-[0.3em] text-neutral-400">
                <div className="text-center md:text-left leading-relaxed">
                    © 2026 EkolHome Tekstil. <br className="md:hidden" />
                    <span className="normal-case opacity-60 italic">{contactInfo?.address || "Yükleniyor..."}</span>
                </div>
                <div className="flex gap-6 items-center">
                    <a href="https://www.iubenda.com/privacy-policy/32672466" className="hover:text-[#d9a066] transition-colors">Gizlilik</a>
                    <a href="#" className="hover:text-[#d9a066] transition-colors">KVKK</a>
                    <span className="text-[8px] opacity-40 font-bold ml-4">Excellence</span>
                </div>
            </div>

            <Script id="iubenda-setup" strategy="afterInteractive">
                {`
                    (function (w,d) {var loader = function () {var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0]; s.src="https://cdn.iubenda.com/iubenda.js"; tag.parentNode.insertBefore(s,tag);}; if(w.addEventListener){w.addEventListener("load", loader, false);}else if(w.attachEvent){w.attachEvent("onload", loader);}else{w.onload = loader;}})(window, document);
                `}
            </Script>
        </footer>
    );
};

export default Footer;