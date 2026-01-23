"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Sidebar from "../../Sidebar";
import { Trash2, ExternalLink, Image as ImageIcon, FileText, Loader2, UploadCloud } from "lucide-react";

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
    const [title, setTitle] = useState("");
    const [season, setSeason] = useState("");
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState({ active: false, percent: 0 });

    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    const fetchKatalogs = async () => {
        setLoading(true);
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("Kataloglar yüklenemedi");
            const data = await res.json();
            setKataloglar(data);
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchKatalogs(); }, []);

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (!res.ok || data.error) {
            throw new Error(data.error || "Dosya yükleme sunucu hatası");
        }

        // URL'nin başına mutlaka / ekliyoruz
        return data.filePath.startsWith('/') ? data.filePath : `/${data.filePath}`;
    };

    const handleSave = async () => {
        if (!title.trim() || !coverFile || !pdfFile) {
            return alert("Lütfen başlık, kapak fotoğrafı ve PDF dosyasını seçin.");
        }

        setUploading({ active: true, percent: 10 });

        try {
            // 1. Kapak Fotoğrafını Yükle
            setUploading({ active: true, percent: 20 });
            const coverPath = await uploadFile(coverFile);

            // 2. PDF Dosyasını Yükle
            setUploading({ active: true, percent: 50 });
            const pdfPath = await uploadFile(pdfFile);

            setUploading({ active: true, percent: 80 });

            // 3. Worker Veritabanına Kaydet
            const res = await fetch(`${API_URL}/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title.trim(),
                    season: season.trim() || "2025",
                    cover_image: coverPath,
                    pdf_url: pdfPath
                })
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || "Veritabanı kayıt hatası (500)");
            }

            setUploading({ active: true, percent: 100 });

            // Başarı Durumu
            setTimeout(() => {
                setUploading({ active: false, percent: 0 });
                setTitle(""); setSeason(""); setCoverFile(null); setPdfFile(null);
                alert("Katalog başarıyla kaydedildi!");
                fetchKatalogs();
            }, 500);

        } catch (error: any) {
            console.error("Kayıt Hatası:", error);
            alert(`Hata: ${error.message}`);
            setUploading({ active: false, percent: 0 });
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bu kataloğu silmek istediğinize emin misiniz?")) return;
        try {
            const res = await fetch(`${API_URL}/delete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            if (res.ok) fetchKatalogs();
            else alert("Silme işlemi başarısız.");
        } catch (error) {
            alert("Bağlantı hatası.");
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col lg:flex-row font-sans">
            <Sidebar />
            <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <div className="flex flex-col">
                        <h1 className="text-[#d9a066] text-xs font-bold tracking-[0.4em] uppercase">KATALOG YÖNETİMİ</h1>
                        <span className="text-gray-500 text-[10px] mt-1 tracking-widest">Yayınları buradan organize edebilirsiniz.</span>
                    </div>
                    <div className="w-10 h-10 bg-[#d9a066] rounded-full flex items-center justify-center text-black font-bold text-xs">EK</div>
                </div>

                {/* Yükleme Formu */}
                <section className="bg-[#121212] rounded-[2rem] border border-white/5 p-8 mb-12 relative overflow-hidden transition-all hover:border-white/10">
                    {uploading.active && (
                        <div className="absolute top-0 left-0 h-1 bg-[#d9a066] transition-all duration-500 shadow-[0_0_10px_#d9a066]" style={{ width: `${uploading.percent}%` }} />
                    )}

                    <h2 className="text-[#d9a066] text-[10px] uppercase tracking-[0.3em] font-bold mb-8 flex items-center gap-2">
                        {uploading.active ? <Loader2 className="animate-spin" size={12} /> : <UploadCloud size={12} />}
                        {uploading.active ? "YÜKLENİYOR..." : "YENİ YAYIN OLUŞTUR"}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Katalog Başlığı (Örn: Modern Koltuk)" className="bg-white/[0.03] border border-white/10 p-4 rounded-xl outline-none text-sm text-white focus:border-[#d9a066]/50 transition-all" />
                        <input value={season} onChange={e => setSeason(e.target.value)} placeholder="Sezon (Örn: 2025 Yaz)" className="bg-white/[0.03] border border-white/10 p-4 rounded-xl outline-none text-sm text-white focus:border-[#d9a066]/50 transition-all" />

                        <label className="flex items-center gap-3 bg-white/[0.03] border border-white/10 p-4 rounded-xl cursor-pointer hover:bg-white/5 transition-colors group">
                            <ImageIcon size={18} className="text-gray-500 group-hover:text-[#d9a066] transition-colors" />
                            <span className="text-xs text-gray-400 truncate">{coverFile ? coverFile.name : "Kapak Fotoğrafı"}</span>
                            <input type="file" accept="image/*" className="hidden" onChange={e => setCoverFile(e.target.files?.[0] || null)} />
                        </label>

                        <label className="flex items-center gap-3 bg-white/[0.03] border border-white/10 p-4 rounded-xl cursor-pointer hover:bg-white/5 transition-colors group">
                            <FileText size={18} className="text-gray-500 group-hover:text-[#d9a066] transition-colors" />
                            <span className="text-xs text-gray-400 truncate">{pdfFile ? pdfFile.name : "PDF Katalog"}</span>
                            <input type="file" accept=".pdf" className="hidden" onChange={e => setPdfFile(e.target.files?.[0] || null)} />
                        </label>

                        <button onClick={handleSave} disabled={uploading.active} className="md:col-span-2 xl:col-span-4 bg-[#d9a066] text-black font-bold py-4 rounded-xl text-[10px] tracking-widest hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase">
                            {uploading.active ? "YÜKLENİYOR - LÜTFEN BEKLEYİN" : "KATALOĞU SİSTEME EKLE"}
                        </button>
                    </div>
                </section>

                {/* Liste */}
                <section>
                    <h2 className="text-[#d9a066] text-[10px] uppercase tracking-[0.3em] font-bold mb-6 italic">AKTİF YAYINLAR</h2>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                            <Loader2 className="animate-spin text-[#d9a066] mb-4" />
                            <span className="text-[10px] tracking-widest uppercase">Veriler Çekiliyor...</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {kataloglar.length === 0 && <div className="text-gray-600 text-xs text-center py-10">Henüz kayıtlı katalog bulunmuyor.</div>}
                            {kataloglar.map((k) => (
                                <div key={k.id} className="bg-[#121212] border border-white/5 p-5 rounded-[1.5rem] flex items-center justify-between group hover:border-[#d9a066]/20 transition-all">
                                    <div className="flex items-center gap-6 overflow-hidden">
                                        <div className="w-14 h-16 bg-black rounded-xl overflow-hidden relative shrink-0 border border-white/5">
                                            <Image
                                                src={k.cover_image.startsWith('/') ? k.cover_image : `/${k.cover_image}`}
                                                alt={k.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                unoptimized
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[8px] font-black text-[#d9a066] bg-[#d9a066]/10 px-1.5 py-0.5 rounded uppercase tracking-tighter">{k.season}</span>
                                                <h3 className="text-sm font-bold text-white/90 uppercase">{k.title}</h3>
                                            </div>
                                            <p className="text-[10px] text-gray-600 truncate max-w-[150px] md:max-w-[300px]">{k.pdf_url}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <a
                                            href={k.pdf_url.startsWith('/') ? k.pdf_url : `/${k.pdf_url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-[#d9a066] hover:bg-white/10 transition-all"
                                            title="Görüntüle"
                                        >
                                            <ExternalLink size={16} />
                                        </a>
                                        <button
                                            onClick={() => handleDelete(k.id)}
                                            className="p-3 bg-white/5 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                            title="Sil"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}