"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Download } from "lucide-react";

declare global {
    interface Window {
        $: any;
        jQuery: any;
    }
}

export default function KatalogSayfasi() {
    const router = useRouter();
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const flipbookRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);
        const fetchKatalog = async () => {
            try {
                const res = await fetch(`https://ekolhome.smusa9883x.workers.dev/api/catalog`);
                const data = await res.json();
                if (data && data.length > 0) setPdfUrl(data[0].pdf_url);
            } catch (err) { console.error("Hata:", err); }
        };
        fetchKatalog();
    }, []);

    useEffect(() => {
        if (!isMounted || !pdfUrl) return;

        const loadScripts = async () => {
            if (!window.jQuery) {
                const jq = document.createElement("script");
                jq.src = "https://code.jquery.com/jquery-3.6.0.min.js";
                jq.async = false;
                document.head.appendChild(jq);
                await new Promise((resolve) => (jq.onload = resolve));
            }

            const df = document.createElement("script");
            df.src = "/dflip/js/dflip.min.js";
            df.async = false;
            document.head.appendChild(df);

            df.onload = () => {
                setTimeout(() => {
                    if (window.jQuery && flipbookRef.current) {
                        window.jQuery(flipbookRef.current).flipBook(pdfUrl, {
                            mode: 'fb',
                            layout: 3,
                            forceFit: true,
                            autoSize: true,
                            height: "auto",
                            theme: "light",
                            webWorkerPath: '/dflip/js/libs/pdf.worker.min.js',
                            controls: "all",
                            hideControls: "none",
                            mobileLayout: 1,
                            paddingTop: 10,
                            paddingBottom: 10
                        });
                    }
                }, 300);
            };
        };
        loadScripts();
    }, [isMounted, pdfUrl]);

    if (!isMounted) return null;

    return (
        <div className="fixed inset-0 bg-[#F8F8F8] z-[9999] flex flex-col font-sans overflow-hidden">
            <link rel="stylesheet" href="/dflip/css/dflip.min.css" />
            <link rel="stylesheet" href="/dflip/css/themify-icons.min.css" />

            {/* Float (Yüzen) Butonlar: Header yerine PDF'in üzerine binen şeffaf butonlar */}
            <div className="absolute top-4 left-4 z-[10001] flex gap-2">
                <button
                    onClick={() => router.push('/')}
                    className="p-3 bg-white/90 backdrop-blur shadow-lg rounded-full text-black hover:bg-[#d9a066] transition-all"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="absolute top-4 right-4 z-[10001]">
                <a
                    href={pdfUrl || "#"}
                    download
                    className="p-3 bg-white/90 backdrop-blur shadow-lg rounded-full text-black flex items-center justify-center"
                >
                    <Download size={20} />
                </a>
            </div>

            {/* Ana Alan: Tam ekran, header payı yok */}
            <main className="w-full h-full flex items-center justify-center p-0 sm:p-4 md:p-8">
                <div className="w-full h-full max-w-6xl flex items-center justify-center relative">
                    {!pdfUrl ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            <span className="text-[9px] font-bold tracking-widest text-black/40">YÜKLENİYOR</span>
                        </div>
                    ) : (
                        <div ref={flipbookRef} className="w-full h-full" id="df_book_container" />
                    )}
                </div>
            </main>

            <style dangerouslySetInnerHTML={{
                __html: `
                .df-container { background: transparent !important; }
                .df-ui-controls { 
                    background: rgba(255,255,255,0.8) !important; 
                    backdrop-filter: blur(15px);
                    border-top: 1px solid rgba(0,0,0,0.05) !important;
                    bottom: 0 !important;
                    height: 50px !important;
                }
                /* Mobilde PDF'in tam görünmesi için dFlip içindeki boşlukları sıfırlıyoruz */
                .df-book-wrapper { padding: 5px 0 !important; }
                .df-ui-btn { color: #333 !important; }
                @media (max-width: 768px) {
                    .df-ui-btn { width: 35px !important; }
                    .df-book-wrapper { margin: 0 !important; }
                }
            `}} />
        </div>
    );
}