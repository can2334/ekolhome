"use client";

import React, { useEffect, useState } from 'react';
import { Instagram, Mail, Phone, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";

interface ContactData {
    id: number;
    address: string;
    phone: string;
    email: string;
    map_url: string;
}

const Footer = () => {
    const [contactInfo, setContactInfo] = useState<ContactData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const res = await fetch('https://ekolhome.smusa9883x.workers.dev/api/contact');
                const data = await res.json();

                if (data && data.length > 0) {
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
        <footer className="border-t border-neutral-100 px-6 md:px-12 py-16 bg-white relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#d9a066]/5 blur-[120px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 items-start">
                {/* Logo Bölümü */}
                <div className="space-y-6">
                    <div className="relative w-48 h-24 transform -translate-x-2">
                        <Image
                            src="/ekolhomelogo.png"
                            alt="Ekol Home Logo"
                            fill
                            sizes="200px"
                            className="object-contain"
                        />
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed max-w-xs uppercase tracking-[0.2em] font-medium">
                        Nesiller boyu süren tekstil ustalığı ve <br />
                        <span className="text-[#d9a066]">modern tasarım</span> anlayışıyla mekanlara imza atıyoruz.
                    </p>
                </div>

                {/* İletişim Bilgileri */}
                <div className="space-y-6 flex flex-col justify-start md:pt-4">
                    <div className="flex items-center gap-3">
                        <div className="h-[1px] w-8 bg-[#d9a066]" />
                        <span className="text-[10px] uppercase tracking-[0.3em] text-[#d9a066] font-bold">Hızlı Erişim</span>
                    </div>

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
                            </>
                        )}
                    </div>
                </div>

                {/* Sosyal Medya */}
                <div className="space-y-6 flex flex-col justify-start md:pt-4">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold">Sosyal Mimari</div>
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
                </div>
            </div>

            {/* Alt Bilgi */}
            <div className="max-w-7xl mx-auto mt-12 pt-10 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-8">

                {/* Sadece Adres Metni */}
                <div className="flex flex-col items-center md:items-start gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-800">
                        © 2026 Ekol Home Premium
                    </span>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 text-center md:text-left leading-relaxed max-w-sm">
                        {contactInfo?.address || "Yükleniyor..."}
                    </p>
                </div>

                <div className="flex items-center gap-8">
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black uppercase tracking-[0.6em] text-[#d9a066] mb-1">
                            Excellence
                        </span>
                        <span className="text-[7px] font-medium uppercase tracking-[0.3em] text-neutral-300">
                            Handcrafted in Turkey
                        </span>
                    </div>
                    <div className="hidden md:block w-[1px] h-8 bg-neutral-100"></div>
                    <div className="text-neutral-200">
                        <Sparkles size={16} strokeWidth={1} />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;