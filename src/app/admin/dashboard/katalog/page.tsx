"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Sidebar from "../../Sidebar";
import { Plus, Trash2, BookOpen, ExternalLink, Image as ImageIcon, FileText, CheckCircle2 } from "lucide-react";

interface KatalogItem {
    id: number;
    title: string;
    season: string;
    cover_image: string;
    pdf_url: string;
}

const API_URL = "https://ekolhome.smusa9883x.workers.dev/api/catalog";

export default function AdminKatalog() {
    const [kataloglar, setKataloglar] = useState<KatalogItem[]>([]);
    const [newKatalog, setNewKatalog] = useState({ title: "", season: "", cover_image: "", pdf_url: "" });
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then((data: KatalogItem[]) => {
                setKataloglar(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Bu kataloğu silmek istediğinize emin misiniz?")) return;
        try {
            const res = await fetch(`https://ekolhome.smusa9883x.workers.dev/api/catalog/delete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });

            if (res.ok) {
                setKataloglar(prev => prev.filter(k => k.id !== id));
            }
        } catch (error) {
            alert("Bağlantı hatası.");
        }
    };

    const handleAdd = async () => {
        if (!newKatalog.title || !newKatalog.cover_image || !newKatalog.pdf_url)
            return alert("Lütfen tüm alanları doldurun.");

        setAdding(true);
        const formattedKatalog = {
            ...newKatalog,
            cover_image: newKatalog.cover_image.startsWith('http') || newKatalog.cover_image.startsWith('/')
                ? newKatalog.cover_image
                : `/uploads/${newKatalog.cover_image}`,
            pdf_url: newKatalog.pdf_url.startsWith('http') || newKatalog.pdf_url.startsWith('/')
                ? newKatalog.pdf_url
                : `/uploads/${newKatalog.pdf_url}`
        };

        try {
            const res = await fetch(`${API_URL}/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formattedKatalog)
            });

            if (res.ok) {
                window.location.reload();
            }
        } catch (error) {
            alert("Ekleme sırasında bir hata oluştu.");
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F0F0F] text-white flex font-sans overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0A0A0A]">
                {/* Header Bölümü */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-12 bg-[#0A0A0A]/80 backdrop-blur-xl z-30">
                    <div className="flex flex-col">
                        <h1 className="text-xs font-bold tracking-[0.4em] uppercase text-[#d9a066]">Katalog Sistemi</h1>
                        <span className="text-[9px] text-gray-600 uppercase tracking-widest mt-1">Dijital Yayın Yönetimi</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <p className="text-[10px] text-gray-400 font-medium">Toplam Yayın</p>
                            <p className="text-xs font-bold text-[#d9a066]">{kataloglar.length} Katalog</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-[#d9a066] flex items-center justify-center text-[10px] text-black font-bold ring-4 ring-[#d9a066]/10">AD</div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar">
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">

                        {/* SOL TARAF: FORM VE ÖNİZLEME */}
                        <div className="xl:col-span-5 space-y-8">
                            <div className="bg-[#121212] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#d9a066]/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>

                                <h2 className="text-[#d9a066] text-[10px] uppercase tracking-[0.3em] font-bold mb-8 flex items-center gap-3">
                                    <div className="w-6 h-[1px] bg-[#d9a066]/30"></div>
                                    YENİ YAYIN OLUŞTUR
                                </h2>

                                <div className="space-y-5">
                                    <div className="group/input">
                                        <label className="text-[9px] text-gray-500 uppercase tracking-widest ml-1 mb-2 block font-semibold">Katalog İsmi</label>
                                        <input
                                            placeholder="Örn: Minimalist Serisi 2026"
                                            className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-2xl outline-none focus:border-[#d9a066] focus:bg-white/[0.04] transition-all text-sm"
                                            onChange={e => setNewKatalog({ ...newKatalog, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[9px] text-gray-500 uppercase tracking-widest ml-1 mb-2 block font-semibold">Sezon</label>
                                            <input
                                                placeholder="2025/26"
                                                className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-2xl outline-none focus:border-[#d9a066] text-sm"
                                                onChange={e => setNewKatalog({ ...newKatalog, season: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col justify-end">
                                            <div className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${newKatalog.pdf_url ? 'border-green-500/30 bg-green-500/5' : 'border-white/5 bg-white/[0.01]'}`}>
                                                <FileText size={16} className={newKatalog.pdf_url ? 'text-green-500' : 'text-gray-600'} />
                                                <input
                                                    placeholder="PDF URL"
                                                    className="bg-transparent border-none outline-none text-[10px] w-full"
                                                    onChange={e => setNewKatalog({ ...newKatalog, pdf_url: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[9px] text-gray-500 uppercase tracking-widest ml-1 mb-2 block font-semibold">Kapak Görseli (URL veya Dosya Adı)</label>
                                        <div className="relative group/url">
                                            <input
                                                placeholder="gorsel.jpg"
                                                className="w-full bg-white/[0.02] border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-[#d9a066] text-sm font-mono"
                                                onChange={e => setNewKatalog({ ...newKatalog, cover_image: e.target.value })}
                                            />
                                            <ImageIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/url:text-[#d9a066] transition-colors" />
                                        </div>
                                    </div>

                                    {/* Önizleme Kartı */}
                                    <div className="mt-8 p-4 rounded-3xl bg-black/40 border border-white/5 aspect-[4/3] relative overflow-hidden group/preview">
                                        {newKatalog.cover_image ? (
                                            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                                                <img
                                                    src={newKatalog.cover_image.startsWith('http') ? newKatalog.cover_image : `/uploads/${newKatalog.cover_image}`}
                                                    className="w-full h-full object-cover"
                                                    alt="Preview"
                                                    onError={(e) => (e.currentTarget.src = "https://placehold.co/400x600?text=Görsel+Bulunamadı&bg=111&fc=fff")}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                                                <div className="absolute bottom-4 left-4">
                                                    <p className="text-[10px] text-[#d9a066] font-bold uppercase tracking-widest">{newKatalog.season || "SEZON"}</p>
                                                    <h4 className="text-sm font-bold uppercase">{newKatalog.title || "KATALOG BAŞLIĞI"}</h4>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 gap-3 italic">
                                                <ImageIcon size={40} strokeWidth={1} />
                                                <span className="text-[10px] uppercase tracking-widest font-medium text-center">Görsel adresi girildiğinde<br />önizleme burada görünecek</span>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleAdd}
                                        disabled={adding}
                                        className="w-full bg-[#d9a066] text-black font-bold py-5 rounded-2xl uppercase tracking-[0.2em] text-[11px] hover:bg-white transition-all shadow-xl shadow-[#d9a066]/10 flex items-center justify-center gap-3 active:scale-[0.98]"
                                    >
                                        {adding ? "YAYINLANIYOR..." : <><Plus size={16} strokeWidth={3} /> KATALOĞU SİSTEME EKLE</>}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* SAĞ TARAF: LİSTELEME */}
                        <div className="xl:col-span-7 space-y-6 pb-20">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-[10px] text-[#d9a066] uppercase tracking-[0.4em] font-bold">MEVCUT YAYINLAR</h2>
                                <span className="text-[10px] text-gray-600 font-mono tracking-tighter">API: /v1/catalog/list</span>
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-white/5 animate-pulse rounded-3xl"></div>)}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {kataloglar.map((k) => (
                                        <div key={k.id} className="bg-[#121212] border border-white/5 p-4 rounded-[2rem] flex items-center gap-5 hover:border-[#d9a066]/30 transition-all group/card">
                                            <div className="w-20 h-24 bg-black rounded-2xl overflow-hidden relative shadow-lg shrink-0 border border-white/5">
                                                {k.cover_image ? (
                                                    <Image
                                                        src={k.cover_image}
                                                        alt={k.title}
                                                        fill
                                                        className="object-cover group-hover/card:scale-110 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-800"><BookOpen size={24} /></div>
                                                )}
                                                <div className="absolute inset-0 bg-black/40 group-hover/card:bg-transparent transition-colors"></div>
                                            </div>

                                            <div className="flex-1 min-w-0 space-y-1">
                                                <p className="text-[9px] text-[#d9a066] font-bold tracking-widest uppercase">{k.season}</p>
                                                <h3 className="text-xs font-bold uppercase truncate pr-4">{k.title}</h3>
                                                <div className="flex items-center gap-2 pt-2">
                                                    <a
                                                        href={k.pdf_url}
                                                        target="_blank"
                                                        className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                                                        title="PDF'i Görüntüle"
                                                    >
                                                        <ExternalLink size={14} />
                                                    </a>
                                                    <div className="w-px h-3 bg-white/10 mx-1"></div>
                                                    <button
                                                        onClick={() => handleDelete(k.id)}
                                                        className="p-2 bg-white/5 rounded-lg text-gray-600 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                                        title="Kataloğu Sil"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}