"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Download } from "lucide-react";

declare global {
    interface Window {
        $: any;
        jQuery: any;
        DFLIP: any;
    }
}

export default function KatalogSayfasi() {
    const router = useRouter();
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const flipbookRef = useRef<HTMLDivElement>(null);
    const bookInstance = useRef<any>(null);

    useEffect(() => {
        setIsMounted(true);
        const fetchKatalog = async () => {
            try {
                // Cache engellemek için sonuna timestamp ekliyoruz
                const res = await fetch(`https://ekolhome.smusa9883x.workers.dev/api/catalog?t=${Date.now()}`);
                const data = await res.json();
                if (data && data.length > 0) {
                    setPdfUrl(data[0].pdf_url);
                }
            } catch (err) { console.error("Katalog yükleme hatası:", err); }
        };
        fetchKatalog();

        return () => {
            if (bookInstance.current && bookInstance.current.dispose) {
                bookInstance.current.dispose();
            }
        };
    }, []);

    useEffect(() => {
        if (!isMounted || !pdfUrl || !flipbookRef.current) return;

        const loadScripts = async () => {
            // 1. jQuery Yükle
            if (!window.jQuery) {
                const jq = document.createElement("script");
                jq.src = "https://code.jquery.com/jquery-3.6.0.min.js";
                jq.async = false;
                document.head.appendChild(jq);
                await new Promise((resolve) => (jq.onload = resolve));
            }

            // 2. dFlip Ayarları (Mobildeki hata için kritik!)
            // Script yüklenmeden önce ayarları global olarak tanımlıyoruz
            window.DFLIP = window.DFLIP || {};
            window.DFLIP.defaults = {
                webWorkerPath: '/dflip/js/libs/pdf.worker.min.js', // Dosyanın public klasöründe olduğundan emin ol
                disableFontFace: false // Mobilde karakter hatasını önler
            };

            // 3. dFlip Scriptini Yükle
            if (!window.jQuery.fn.flipBook) {
                const df = document.createElement("script");
                df.src = "/dflip/js/dflip.min.js";
                df.async = false;
                document.head.appendChild(df);
                await new Promise((resolve) => (df.onload = resolve));
            }

            // 4. Başlatma
            if (window.jQuery && flipbookRef.current) {
                // Sayfanın tamamen render olmasını bekle
                setTimeout(() => {
                    if (flipbookRef.current) {
                        // Mevcut varsa temizle
                        if (bookInstance.current) {
                            try { bookInstance.current.dispose(); } catch (e) { }
                        }

                        bookInstance.current = window.jQuery(flipbookRef.current).flipBook(pdfUrl, {
                            mode: 'fb', // Flipbook modu
                            layout: 3,
                            forceFit: true,
                            autoSize: true,
                            theme: "light",
                            // PDF.js worker ayarı mobilde hata vermemesi için şart
                            webWorkerPath: '/dflip/js/libs/pdf.worker.min.js',
                            controls: "all",
                            // Mobilde dokunmatik optimizasyonu
                            isMobile: true,
                            // Dosyaya erişim hatası için CORS'u atlatmaya çalışalım (Proxy gerektirebilir)
                            annotationLayer: false, // Hataları azaltmak için kapatıyoruz
                        });
                    }
                }, 800);
            }
        };

        loadScripts();
    }, [isMounted, pdfUrl]);

    if (!isMounted) return null;

    return (
        <div className="fixed inset-0 bg-[#F8F8F8] z-[9999] flex flex-col font-sans overflow-hidden">
            <link rel="stylesheet" href="/dflip/css/dflip.min.css" />
            <link rel="stylesheet" href="/dflip/css/themify-icons.min.css" />

            <div className="absolute top-4 left-4 z-[10001] flex gap-2">
                <button
                    onClick={() => router.push('/')}
                    className="p-3 bg-white/90 backdrop-blur shadow-lg rounded-full text-black hover:bg-[#d9a066] transition-all"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="absolute top-4 right-4 z-[10001]">
                {pdfUrl && (
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="p-3 bg-white/90 backdrop-blur shadow-lg rounded-full text-black flex items-center justify-center"
                    >
                        <Download size={20} />
                    </a>
                )}
            </div>

            <main className="w-full h-full flex items-center justify-center p-0 sm:p-4 md:p-8">
                <div className="w-full h-full max-w-6xl flex items-center justify-center relative">
                    {!pdfUrl ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            <span className="text-[9px] font-bold tracking-widest text-black/40 uppercase">Yükleniyor...</span>
                        </div>
                    ) : (
                        /* dFlip konteynırı */
                        <div ref={flipbookRef} className="w-full h-full" id="df_book_container"></div>
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
                .df-book-wrapper { padding: 5px 0 !important; }
                .df-ui-btn { color: #333 !important; }
                /* Mobilde kaydırma hatasını (Intervention) önlemek için */
                #df_book_container { touch-action: none; } 
                @media (max-width: 768px) {
                    .df-ui-btn { width: 35px !important; }
                    .df-book-wrapper { margin: 0 !important; }
                }
            `}} />
        </div>
    );
}