"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Download, Share2 } from "lucide-react";

declare global {
    interface Window {
        $: any;
        jQuery: any;
    }
}

export default function TekKatalogSayfasi() {
    const router = useRouter();
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const flipbookRef = useRef<HTMLDivElement>(null);

    // 1. ADIM: Mount kontrolü ve Veriyi Çekme (İlk kataloğu al)
    useEffect(() => {
        setIsMounted(true);
        const fetchSingleCatalog = async () => {
            try {
                const res = await fetch(`https://ekolhome.smusa9883x.workers.dev/api/catalog`);
                const data = await res.json();

                // API'den gelen dizideki ilk elemanı (veya senin belirlediğin ID'li olanı) seç
                if (data && data.length > 0) {
                    // Eğer spesifik bir katalog olsun istersen data[0] yerine filter da yapabilirsin
                    setPdfUrl(data[0].pdf_url);
                }
            } catch (err) {
                console.error("Katalog yükleme hatası:", err);
            }
        };
        fetchSingleCatalog();
    }, []);

    // 2. ADIM: Scriptleri Sırayla Yükle ve Başlat
    useEffect(() => {
        if (!isMounted || !pdfUrl) return;

        const loadScripts = async () => {
            // Önce jQuery
            if (!window.jQuery) {
                const jq = document.createElement("script");
                jq.src = "https://code.jquery.com/jquery-3.6.0.min.js";
                jq.async = false;
                document.head.appendChild(jq);
                await new Promise((resolve) => (jq.onload = resolve));
            }

            // Sonra dFlip
            const df = document.createElement("script");
            df.src = "/dflip/js/dflip.min.js";
            df.async = false;
            document.head.appendChild(df);

            df.onload = () => {
                setTimeout(() => {
                    if (window.jQuery && flipbookRef.current) {
                        window.jQuery(flipbookRef.current).flipBook(pdfUrl, {
                            height: "85vh",
                            theme: 'dark',
                            displayMode: 'full',
                            webWorkerPath: '/dflip/js/libs/pdf.worker.min.js',
                            enableDownload: true,
                            soundEnable: true
                        });
                    }
                }, 300);
            };
        };

        loadScripts();
    }, [isMounted, pdfUrl]);

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col overflow-hidden font-sans">
            <link rel="stylesheet" href="/dflip/css/dflip.min.css" />
            <link rel="stylesheet" href="/dflip/css/themify-icons.min.css" />

            {/* Sade ve Şık Header */}
            <header className="h-20 bg-black/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-[100]">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.push('/')}
                        className="group flex items-center gap-2 text-gray-500 hover:text-white transition-all"
                    >
                        <div className="p-2 rounded-full border border-white/5 group-hover:border-[#d9a066] transition-colors">
                            <ChevronLeft size={20} />
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.3em] hidden sm:block">Anasayfa</span>
                    </button>
                    <div className="w-[1px] h-8 bg-white/10 hidden sm:block"></div>
                    <div>
                        <h1 className="text-white text-xs font-bold tracking-[0.4em] uppercase">Ekol Home</h1>
                        <p className="text-[9px] text-[#d9a066] uppercase tracking-[0.2em] mt-1">Resmi Koleksiyon</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <a
                        href={pdfUrl || "#"}
                        download
                        className="bg-[#d9a066] hover:bg-[#c8905a] text-black px-6 py-2.5 rounded-sm flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-[#d9a066]/10"
                    >
                        <Download size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:block">İndir</span>
                    </a>
                </div>
            </header>

            {/* Katalog Alanı */}
            <main className="flex-1 flex items-center justify-center p-4 bg-[#050505]">
                {!pdfUrl ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-2 border-[#d9a066] border-t-transparent rounded-full animate-spin" />
                        <span className="text-gray-500 text-[10px] tracking-[0.4em] uppercase animate-pulse">Yükleniyor</span>
                    </div>
                ) : (
                    <div
                        ref={flipbookRef}
                        className="w-full max-w-7xl h-[85vh]"
                        id="df_book_container"
                    />
                )}
            </main>

            {/* Özelleştirilmiş Flipbook Tasarımı */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .df-container { background: transparent !important; }
                .df-ui-controls { 
                    background: rgba(10,10,10,0.95) !important; 
                    backdrop-filter: blur(20px); 
                    border-top: 1px solid rgba(255,255,255,0.1); 
                    padding: 10px !important;
                }
                .df-ui-btn { 
                    color: #fff !important; 
                    background: transparent !important;
                }
                .df-ui-btn:hover { 
                    color: #d9a066 !important; 
                }
            `}} />
        </div>
    );
}