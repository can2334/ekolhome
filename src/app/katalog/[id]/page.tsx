"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowRight, ChevronLeft, ChevronRight,
    ZoomIn, ZoomOut, Home, Volume2, VolumeX, Download
} from "lucide-react";

// Tip tanımlamaları
interface CatalogItem {
    id: string | number;
    pdf_url: string;
    title?: string;
}

export default function KatalogDetay() {
    const { id } = useParams();
    const router = useRouter();
    const [pageImages, setPageImages] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [zoom, setZoom] = useState(1);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const [isFlipping, setIsFlipping] = useState(false);
    const [flipDir, setFlipDir] = useState<'next' | 'prev' | null>(null);

    // Touch & Mouse Drag State
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState(0);
    const [dragCurrent, setDragCurrent] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // PDF Render İşlemi
    useEffect(() => {
        const fetchAndRender = async () => {
            try {
                const res = await fetch(`https://ekolhome.smusa9883x.workers.dev/api/catalog`);
                const data: CatalogItem[] = await res.json();
                const found = data.find((item) => item.id.toString() === id);

                if (found) {
                    const pdfjs = await import('pdfjs-dist');
                    // Worker URL güncel ve güvenli bir CDN'den çekiliyor
                    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

                    const pdf = await pdfjs.getDocument(found.pdf_url).promise;
                    setTotalPages(pdf.numPages);

                    const images: string[] = [];
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const viewport = page.getViewport({ scale: 2.0 }); // Performans için 2.0 idealdir
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d', { alpha: false });

                        if (context) {
                            canvas.height = viewport.height;
                            canvas.width = viewport.width;
                            context.imageSmoothingEnabled = true;
                            context.imageSmoothingQuality = 'high';

                            await page.render({ canvasContext: context, viewport, canvas: canvas }).promise;

                            // Bellek dostu Blob kullanımı
                            const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.90));
                            if (blob) {
                                images.push(URL.createObjectURL(blob));
                            }
                        }
                    }
                    setPageImages(images);
                }
            } catch (err) {
                console.error('PDF yükleme hatası:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAndRender();

        // Temizlik: Oluşturulan URL'leri bellekten sil
        return () => pageImages.forEach(url => URL.revokeObjectURL(url));
    }, [id]);

    // Ses Efekti (Performans için useCallback içine alındı)
    const playFlipSound = useCallback(() => {
        if (!soundEnabled) return;
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;

        const audioCtx = new AudioCtx();
        const bufferSize = audioCtx.sampleRate * 0.3;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            const t = i / audioCtx.sampleRate;
            const envelope = Math.exp(-t * 10);
            data[i] = (Math.random() * 2 - 1) * envelope * 0.1;
        }

        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);

        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        source.start();
    }, [soundEnabled]);

    // Sayfa Çevirme Fonksiyonları
    const turnNext = useCallback(() => {
        if (currentPage < totalPages - 2 && !isFlipping) {
            setFlipDir('next');
            setIsFlipping(true);
            playFlipSound();
            setTimeout(() => {
                setCurrentPage(prev => prev + 2);
                setIsFlipping(false);
                setFlipDir(null);
            }, 600); // 800ms'den 600ms'ye çekildi, daha akıcı hissettirir
        }
    }, [currentPage, totalPages, isFlipping, playFlipSound]);

    const turnPrev = useCallback(() => {
        if (currentPage > 0 && !isFlipping) {
            setFlipDir('prev');
            setIsFlipping(true);
            playFlipSound();
            setTimeout(() => {
                setCurrentPage(prev => prev - 2);
                setIsFlipping(false);
                setFlipDir(null);
            }, 600);
        }
    }, [currentPage, isFlipping, playFlipSound]);

    // Sürükleme Mantığı
    const handleDragStart = (clientX: number) => {
        if (!isFlipping) {
            setIsDragging(true);
            setDragStart(clientX);
            setDragCurrent(clientX);
        }
    };

    const handleDragMove = (clientX: number) => {
        if (isDragging) setDragCurrent(clientX);
    };

    const handleDragEnd = () => {
        if (isDragging) {
            const delta = dragCurrent - dragStart;
            if (Math.abs(delta) > 100) {
                delta < 0 ? turnNext() : turnPrev();
            }
            setIsDragging(false);
        }
    };

    // Klavye Dinleyicisi
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') turnNext();
            if (e.key === 'ArrowLeft') turnPrev();
            if (e.key === 'Escape') setZoom(1);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [turnNext, turnPrev]);

    const dragProgress = isDragging ? Math.max(-100, Math.min(100, ((dragCurrent - dragStart) / 200) * 100)) : 0;

    if (loading) return (
        <div className="h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
            <div className="w-16 h-16 border-4 border-[#d9a066]/20 border-t-[#d9a066] rounded-full animate-spin mb-4" />
            <p className="tracking-widest uppercase text-sm animate-pulse text-gray-400">Katalog Hazırlanıyor...</p>
        </div>
    );

    return (
        <div className="h-screen w-full bg-[#0f0f0f] flex flex-col overflow-hidden select-none relative">

            {/* ÜST BAR */}
            <header className="h-16 bg-black/40 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-[200]">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ChevronLeft className="text-white" size={24} />
                    </button>
                    <h1 className="text-white text-[10px] tracking-[0.4em] font-bold uppercase">Digital Catalog</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 text-white/70 hover:text-white">
                        {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                    <button className="p-2 text-white/70 hover:text-white">
                        <Download size={20} />
                    </button>
                </div>
            </header>

            {/* ANA EKRAN */}
            <main
                className="flex-1 relative flex items-center justify-center p-4 md:p-10"
                style={{ perspective: '2500px' }}
                onMouseDown={(e) => handleDragStart(e.clientX)}
                onMouseMove={(e) => handleDragMove(e.clientX)}
                onMouseUp={handleDragEnd}
                onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
                onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
                onTouchEnd={handleDragEnd}
            >
                {/* Sayfa Sayacı */}
                <div className="absolute top-6 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] text-white/80 tracking-widest uppercase z-[100]">
                    {currentPage + 1} - {Math.min(currentPage + 2, totalPages)} / {totalPages}
                </div>

                {/* KİTAP GÖVDESİ */}
                <div
                    className="relative flex transition-transform duration-300 ease-out"
                    style={{
                        transform: `scale(${zoom})`,
                        transformStyle: 'preserve-3d',
                        cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                >
                    {/* SOL SAYFA */}
                    <div className="relative w-[40vw] max-w-[500px] aspect-[1/1.41] bg-white shadow-2xl rounded-l-md overflow-hidden z-10">
                        <img
                            src={pageImages[flipDir === 'prev' ? Math.max(0, currentPage - 2) : currentPage]}
                            className="w-full h-full object-cover"
                            alt="Left"
                        />
                        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />
                    </div>

                    {/* DÖNEN SAYFA (FLIP) */}
                    <div
                        className="absolute top-0 right-0 w-[40vw] max-w-[500px] h-full origin-left z-50 transition-transform"
                        style={{
                            transformStyle: 'preserve-3d',
                            transform: isDragging
                                ? `rotateY(${dragProgress * -1.8}deg)`
                                : isFlipping && flipDir === 'next' ? 'rotateY(-180deg)'
                                    : isFlipping && flipDir === 'prev' ? 'rotateY(0deg)'
                                        : flipDir === 'prev' ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                            transitionDuration: isDragging ? '0ms' : '600ms'
                        }}
                    >
                        {/* ÖN YÜZ */}
                        <div className="absolute inset-0 backface-hidden z-20 bg-white shadow-xl overflow-hidden rounded-r-md">
                            <img src={pageImages[currentPage + 1]} className="w-full h-full object-cover" alt="Flip Front" />
                            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/20 to-transparent" />
                        </div>
                        {/* ARKA YÜZ */}
                        <div
                            className="absolute inset-0 backface-hidden z-10 bg-white shadow-xl overflow-hidden rounded-l-md"
                            style={{ transform: 'rotateY(180deg)' }}
                        >
                            <img
                                src={pageImages[flipDir === 'next' ? currentPage + 2 : Math.max(0, currentPage - 1)]}
                                className="w-full h-full object-cover"
                                alt="Flip Back"
                            />
                            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/20 to-transparent" />
                        </div>
                    </div>

                    {/* SAĞ SAYFA */}
                    <div className="relative w-[40vw] max-w-[500px] aspect-[1/1.41] bg-white shadow-2xl rounded-r-md overflow-hidden z-0">
                        <img
                            src={pageImages[flipDir === 'next' ? Math.min(totalPages - 1, currentPage + 3) : currentPage + 1]}
                            className="w-full h-full object-cover"
                            alt="Right"
                        />
                        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
                    </div>
                </div>

                {/* NAVİGASYON OKLARI */}
                <button
                    onClick={turnPrev}
                    disabled={currentPage === 0}
                    className="absolute left-4 md:left-10 p-4 text-white/20 hover:text-white disabled:opacity-0 transition-all z-[150]"
                >
                    <ChevronLeft size={60} strokeWidth={1} />
                </button>
                <button
                    onClick={turnNext}
                    disabled={currentPage >= totalPages - 2}
                    className="absolute right-4 md:right-10 p-4 text-white/20 hover:text-white disabled:opacity-0 transition-all z-[150]"
                >
                    <ChevronRight size={60} strokeWidth={1} />
                </button>
            </main>

            {/* ALT PANEL */}
            <footer className="h-24 bg-black/60 backdrop-blur-xl border-t border-white/5 flex items-center justify-center gap-8 z-[200]">
                <button
                    onClick={turnPrev}
                    disabled={currentPage === 0}
                    className="hidden md:flex items-center gap-2 px-6 py-2 bg-white/5 rounded-full text-white/80 hover:bg-white/10 disabled:opacity-20 transition-all"
                >
                    <ChevronLeft size={18} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Geri</span>
                </button>

                <div className="flex items-center gap-2 bg-black/40 p-2 rounded-2xl border border-white/10">
                    <button onClick={() => setZoom(prev => Math.min(prev + 0.2, 2))} className="p-2 text-white/60 hover:text-white"><ZoomIn size={20} /></button>
                    <button onClick={() => setZoom(1)} className="p-2 text-white/60 hover:text-white"><Home size={20} /></button>
                    <button onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))} className="p-2 text-white/60 hover:text-white"><ZoomOut size={20} /></button>
                </div>

                <button
                    onClick={turnNext}
                    disabled={currentPage >= totalPages - 2}
                    className="flex items-center gap-4 px-8 py-3 bg-[#d9a066] text-black font-bold rounded-full hover:scale-105 active:scale-95 transition-all disabled:opacity-20"
                >
                    <span className="text-[10px] uppercase tracking-widest">Sonraki Sayfa</span>
                    <ArrowRight size={18} />
                </button>
            </footer>

            <style jsx global>{`
                .backface-hidden {
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                body { background-color: #0a0a0a; }
            `}</style>
        </div>
    );
}