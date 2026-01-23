"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import {
    ArrowRight, ChevronLeft, ChevronRight,
    ZoomIn, ZoomOut, Grid, Home, Maximize2, Volume2, VolumeX, Download
} from "lucide-react";

export default function KatalogDetay() {
    const { id } = useParams();
    const [pageImages, setPageImages] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [zoom, setZoom] = useState(1);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const [isFlipping, setIsFlipping] = useState(false);
    const [flipDir, setFlipDir] = useState<'next' | 'prev' | null>(null);

    // Touch & Mouse Drag
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState(0);
    const [dragCurrent, setDragCurrent] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchAndRender = async () => {
            try {
                const res = await fetch(`https://ekolhome.smusa9883x.workers.dev/api/catalog`);
                const data = await res.json();
                const found = data.find((item: any) => item.id.toString() === id);

                if (found) {
                    const pdfjs = await import('pdfjs-dist');
                    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
                    const pdf = await pdfjs.getDocument(found.pdf_url).promise;
                    setTotalPages(pdf.numPages);

                    const images: string[] = [];
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        // Yüksek kalite için scale artırıldı
                        const viewport = page.getViewport({ scale: 2.5 });
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d', { alpha: false });

                        if (context) {
                            canvas.height = viewport.height;
                            canvas.width = viewport.width;

                            // Daha iyi render kalitesi için
                            context.imageSmoothingEnabled = true;
                            context.imageSmoothingQuality = 'high';

                            await page.render({
                                canvasContext: context,
                                viewport,
                                canvas
                            }).promise;

                            // WebP kalitesi artırıldı
                            images.push(canvas.toDataURL('image/webp', 0.95));
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
    }, [id]);

    // Gerçekçi sayfa sesi
    const playFlipSound = () => {
        if (!soundEnabled) return;
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

        const bufferSize = audioCtx.sampleRate * 0.35;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            const t = i / audioCtx.sampleRate;
            const envelope = Math.exp(-t * 9);
            const noise = (Math.random() * 2 - 1) * envelope * 0.12;
            const crackle = Math.sin(t * 1200 * Math.random()) * envelope * 0.08;
            data[i] = noise + crackle;
        }

        const noiseSource = audioCtx.createBufferSource();
        noiseSource.buffer = buffer;

        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(55, audioCtx.currentTime + 0.25);

        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);

        noiseSource.connect(gainNode);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        noiseSource.start();
        oscillator.start();
        noiseSource.stop(audioCtx.currentTime + 0.35);
        oscillator.stop(audioCtx.currentTime + 0.25);
    };

    const turnNext = () => {
        if (currentPage < totalPages - 2 && !isFlipping) {
            setFlipDir('next');
            setIsFlipping(true);
            playFlipSound();
            setTimeout(() => {
                setCurrentPage(prev => prev + 2);
                setIsFlipping(false);
                setFlipDir(null);
            }, 800);
        }
    };

    const turnPrev = () => {
        if (currentPage > 0 && !isFlipping) {
            setFlipDir('prev');
            setIsFlipping(true);
            playFlipSound();
            setTimeout(() => {
                setCurrentPage(prev => prev - 2);
                setIsFlipping(false);
                setFlipDir(null);
            }, 800);
        }
    };

    // Mouse & Touch handlers
    const handleDragStart = (clientX: number) => {
        if (!isFlipping) {
            setIsDragging(true);
            setDragStart(clientX);
            setDragCurrent(clientX);
        }
    };

    const handleDragMove = (clientX: number) => {
        if (isDragging) {
            setDragCurrent(clientX);
        }
    };

    const handleDragEnd = () => {
        if (isDragging) {
            const delta = dragCurrent - dragStart;
            const threshold = 80;

            if (Math.abs(delta) > threshold) {
                if (delta < 0) {
                    // Sola kaydırma = İleri git
                    turnNext();
                } else {
                    // Sağa kaydırma = Geri git
                    turnPrev();
                }
            }

            setIsDragging(false);
            setDragStart(0);
            setDragCurrent(0);
        }
    };

    // Mouse events
    const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX);
    const onMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX);
    const onMouseUp = () => handleDragEnd();

    // Touch events
    const onTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX);
    const onTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX);
    const onTouchEnd = () => handleDragEnd();

    // Klavye kontrolleri
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') turnNext();
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') turnPrev();
            if (e.key === 'Home') setCurrentPage(0);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentPage, totalPages, isFlipping]);

    // Drag progress hesaplama
    const getDragProgress = () => {
        if (!isDragging) return 0;
        const delta = dragCurrent - dragStart;
        return Math.max(-100, Math.min(100, (delta / 150) * 100));
    };

    const dragProgress = getDragProgress();

    if (loading) return (
        <div className="h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] flex flex-col items-center justify-center text-white">
            <div className="relative mb-6">
                <div className="w-20 h-20 border-4 border-[#d9a066]/30 border-t-[#d9a066] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-white/10 border-t-white/30 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
            </div>
            <p className="text-lg font-light tracking-[0.4em] uppercase animate-pulse">Yükleniyor</p>
            <p className="text-xs text-gray-500 mt-2">PDF sayfaları işleniyor...</p>
        </div>
    );

    return (
        <div className="h-screen w-full bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] flex flex-col overflow-hidden select-none">

            {/* ÜST NAVİGASYON */}
            <div className="absolute top-0 left-0 right-0 z-[100] bg-black/50 backdrop-blur-xl border-b border-white/10 h-16 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="p-2 rounded-xl hover:bg-white/10 transition-all text-gray-400 hover:text-white"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-white text-[10px] tracking-[0.3em] font-bold uppercase">Katalog Görüntüleyici</span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                        title={soundEnabled ? "Sesi Kapat" : "Sesi Aç"}
                    >
                        {soundEnabled ? <Volume2 size={18} className="text-white/80" /> : <VolumeX size={18} className="text-white/80" />}
                    </button>
                    <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                        <Download size={18} className="text-white/80" />
                    </button>
                </div>
            </div>

            {/* SAYFA GÖSTERGESİ */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[100] bg-black/70 backdrop-blur-xl px-8 py-3 rounded-full border border-white/20 shadow-2xl">
                <span className="text-white text-[11px] tracking-[0.3em] font-black uppercase">
                    SAYFA {currentPage + 1}-{Math.min(currentPage + 2, totalPages)} / {totalPages}
                </span>
            </div>

            <div
                ref={containerRef}
                className="flex-1 relative flex items-center justify-center"
                style={{ perspective: '3000px' }}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={() => setIsDragging(false)}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >

                {/* Sol Navigasyon */}
                <button
                    onClick={turnPrev}
                    disabled={currentPage === 0}
                    className={`absolute left-8 z-[110] text-white/20 hover:text-white transition-all p-4 rounded-full hover:bg-white/5 ${currentPage === 0 && 'opacity-0 pointer-events-none'}`}
                >
                    <ChevronLeft size={48} strokeWidth={1.5} />
                </button>

                {/* KİTAP SİSTEMİ */}
                <div
                    className="relative flex shadow-[0_70px_140px_rgba(0,0,0,0.9)]"
                    style={{
                        transform: `scale(${zoom})`,
                        transformStyle: 'preserve-3d',
                        cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                >
                    {/* Alttan gölge */}
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[85%] h-10 bg-black/60 blur-3xl rounded-full"></div>

                    {/* SOL SAYFA (Statik alt tabaka) */}
                    <div className="relative w-[42vw] max-w-[550px] aspect-[1/1.414] bg-white overflow-hidden z-10 shadow-2xl rounded-l-sm">
                        <img
                            src={pageImages[flipDir === 'prev' ? currentPage - 2 : currentPage]}
                            className="w-full h-full object-cover pointer-events-none"
                            style={{
                                imageRendering: 'auto',
                                filter: 'contrast(1.02) saturate(1.05)'
                            } as any}
                            alt="Sol Sayfa"
                            draggable={false}
                        />
                        {/* Sağ kenar gölgesi */}
                        <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-black/25 via-black/8 to-transparent pointer-events-none"></div>
                        {/* Sol kenar gölgesi */}
                        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/10 to-transparent pointer-events-none"></div>

                        {/* Sayfa numarası */}
                        <div className="absolute bottom-6 left-6 text-gray-500 text-sm font-serif bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
                            {currentPage + 1}
                        </div>
                    </div>

                    {/* ORTA SIRTI */}
                    <div className="w-[3px] h-full bg-gradient-to-b from-gray-500 via-gray-600 to-gray-500 z-[60] shadow-inner relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
                    </div>

                    {/* DÖNEN YAPRAK */}
                    <div
                        className="absolute top-0 right-[3px] w-[42vw] max-w-[550px] h-full origin-left z-50"
                        style={{
                            transformStyle: 'preserve-3d',
                            transition: isFlipping
                                ? 'transform 800ms cubic-bezier(0.645, 0.045, 0.355, 1)'
                                : isDragging
                                    ? 'none'
                                    : 'transform 300ms ease-out',
                            transform: isDragging
                                ? `rotateY(${dragProgress * -1.8}deg)`
                                : isFlipping && flipDir === 'next'
                                    ? 'rotateY(-180deg)'
                                    : isFlipping && flipDir === 'prev'
                                        ? 'rotateY(0deg)'
                                        : flipDir === 'prev'
                                            ? 'rotateY(-180deg)'
                                            : 'rotateY(0deg)',
                            pointerEvents: 'none'
                        }}
                    >
                        {/* Yaprağın Önü */}
                        <div className="absolute inset-0 z-20 bg-white shadow-[-15px_0_40px_rgba(0,0,0,0.3)] rounded-r-sm overflow-hidden" style={{ backfaceVisibility: 'hidden' } as any}>
                            <img
                                src={pageImages[currentPage + 1]}
                                className="w-full h-full object-cover"
                                style={{
                                    imageRendering: 'auto',
                                    filter: 'contrast(1.02) saturate(1.05)'
                                } as any}
                                alt="Ön"
                                draggable={false}
                            />
                            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/25 via-black/8 to-transparent"></div>
                            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/10 to-transparent"></div>

                            {/* Sayfa numarası */}
                            <div className="absolute bottom-6 right-6 text-gray-500 text-sm font-serif bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
                                {currentPage + 2}
                            </div>
                        </div>

                        {/* Yaprağın Arkası */}
                        <div
                            className="absolute inset-0 z-10 bg-white rounded-r-sm overflow-hidden"
                            style={{
                                backfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)'
                            } as any}
                        >
                            <img
                                src={pageImages[flipDir === 'next' ? currentPage + 2 : currentPage - 1]}
                                className="w-full h-full object-cover"
                                style={{
                                    imageRendering: 'auto',
                                    filter: 'contrast(1.02) saturate(1.05)'
                                } as any}
                                alt="Arka"
                                draggable={false}
                            />
                            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/25 via-black/8 to-transparent"></div>
                            <div className="absolute inset-0 bg-black/5"></div>
                        </div>
                    </div>

                    {/* SAĞ SAYFA (Statik alt tabaka) */}
                    <div className="relative w-[42vw] max-w-[550px] aspect-[1/1.414] bg-white overflow-hidden z-0 shadow-2xl rounded-r-sm">
                        <img
                            src={pageImages[flipDir === 'next' ? currentPage + 3 : currentPage + 1]}
                            className="w-full h-full object-cover pointer-events-none"
                            style={{
                                imageRendering: 'auto',
                                filter: 'contrast(1.02) saturate(1.05)'
                            } as any}
                            alt="Sağ Sayfa"
                            draggable={false}
                        />
                        {/* Sol kenar gölgesi */}
                        <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-black/25 via-black/8 to-transparent pointer-events-none"></div>
                        {/* Sağ kenar gölgesi */}
                        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/10 to-transparent pointer-events-none"></div>

                        {/* Sayfa numarası */}
                        {currentPage + 2 < totalPages && (
                            <div className="absolute bottom-6 right-6 text-gray-500 text-sm font-serif bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
                                {currentPage + 3}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sağ Navigasyon */}
                <button
                    onClick={turnNext}
                    disabled={currentPage >= totalPages - 2}
                    className={`absolute right-8 z-[110] text-white/20 hover:text-white transition-all p-4 rounded-full hover:bg-white/5 ${currentPage >= totalPages - 2 && 'opacity-0 pointer-events-none'}`}
                >
                    <ChevronRight size={48} strokeWidth={1.5} />
                </button>

                {/* Swipe İpucu */}
                {!isDragging && !isFlipping && currentPage === 0 && (
                    <div className="absolute bottom-32 left-1/2 -translate-x-1/2 animate-bounce">
                        <p className="text-white/40 text-xs flex items-center gap-2">
                            <span className="text-lg">👆</span>
                            Kaydırarak sayfa çevirin
                        </p>
                    </div>
                )}
            </div>

            {/* ALT KONTROL PANELİ */}
            <div className="h-24 bg-black/90 backdrop-blur-2xl border-t border-white/10 flex items-center justify-center gap-6 px-10 z-[150]">
                <button
                    onClick={turnPrev}
                    disabled={currentPage === 0}
                    className="flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white/80 px-8 py-3 rounded-xl border border-white/10 transition-all active:scale-95 group disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Önceki</span>
                </button>

                <div className="h-10 w-[1px] bg-white/10"></div>

                <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
                    <button
                        onClick={() => setZoom(prev => Math.min(prev + 0.15, 1.8))}
                        className="p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                        title="Yakınlaştır"
                    >
                        <ZoomIn size={20} />
                    </button>
                    <button
                        onClick={() => setZoom(1)}
                        className="p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                        title="Sıfırla"
                    >
                        <Home size={20} />
                    </button>
                    <button
                        onClick={() => setZoom(prev => Math.max(prev - 0.15, 0.6))}
                        className="p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                        title="Uzaklaştır"
                    >
                        <ZoomOut size={20} />
                    </button>
                </div>

                <div className="h-10 w-[1px] bg-white/10"></div>

                <button
                    onClick={turnNext}
                    disabled={currentPage >= totalPages - 2}
                    className="flex items-center gap-4 bg-gradient-to-r from-[#d9a066] to-[#c8905a] hover:from-[#c8905a] hover:to-[#b8804a] text-white px-10 py-3 rounded-xl transition-all shadow-[0_10px_30px_rgba(217,160,102,0.4)] active:scale-95 group disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <span className="text-[10px] font-black uppercase tracking-widest">Sonraki Sayfa</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <style jsx global>{`
                .backface-hidden { 
                    backface-visibility: hidden; 
                    -webkit-backface-visibility: hidden; 
                }
                * {
                    -webkit-touch-callout: none;
                    -webkit-user-select: none;
                }
            `}</style>
        </div>
    );
}