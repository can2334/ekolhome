"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../Sidebar";
import { Trash2, FileText, Loader2, UploadCloud, RefreshCw } from "lucide-react";

interface KatalogItem {
    id: number;
    title: string;
    season: string;
    pdf_url: string;
}

const API_URL = "https://ekolhome.smusa9883x.workers.dev/api/catalog";

export default function AdminKatalog() {
    const [katalog, setKatalog] = useState<KatalogItem | null>(null);
    const [title, setTitle] = useState("");
    const [season, setSeason] = useState("");
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState({ active: false, percent: 0 });
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    const fetchKatalog = async () => {
        setLoading(true);
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            // Liste gelse bile biz ilkini (tek olanı) alıyoruz
            if (data && data.length > 0) {
                setKatalog(data[0]);
                setTitle(data[0].title);
                setSeason(data[0].season);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchKatalog(); }, []);

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error("Dosya yükleme hatası");
        return data.filePath.startsWith('/') ? data.filePath : `/${data.filePath}`;
    };

    const handleSave = async () => {
        if (!title.trim() || (!pdfFile && !katalog?.pdf_url)) {
            return alert("Lütfen başlık ve PDF dosyasını seçin.");
        }

        setUploading({ active: true, percent: 30 });

        try {
            let finalPdfPath = katalog?.pdf_url || "";

            // Eğer yeni bir dosya seçildiyse yükle
            if (pdfFile) {
                finalPdfPath = await uploadFile(pdfFile);
            }

            setUploading({ active: true, percent: 70 });

            // Worker'a gönder (Tek katalog olduğu için hep aynı ID'yi veya endpoint'i kullanıyoruz)
            const res = await fetch(`${API_URL}/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: 1, // Sabit ID
                    title: title.trim(),
                    season: season.trim() || "2025",
                    pdf_url: finalPdfPath
                })
            });

            if (!res.ok) throw new Error("Kaydedilemedi");

            setUploading({ active: true, percent: 100 });
            alert("Ana Katalog Güncellendi!");
            setPdfFile(null);
            fetchKatalog();
        } catch (error: any) {
            alert(`Hata: ${error.message}`);
        } finally {
            setUploading({ active: false, percent: 0 });
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col lg:flex-row font-sans">
            <Sidebar />
            <main className="flex-1 p-6 lg:p-12">
                <div className="flex justify-between items-center mb-10">
                    <div className="flex flex-col">
                        <h1 className="text-[#d9a066] text-xs font-bold tracking-[0.4em] uppercase">ANA KATALOG YÖNETİMİ</h1>
                        <p className="text-gray-500 text-[10px] mt-1 tracking-widest">Sistemde sadece bir aktif katalog bulunur.</p>
                    </div>
                </div>

                {/* Düzenleme Formu */}
                <section className="bg-[#121212] rounded-[2rem] border border-white/5 p-8 mb-8 relative overflow-hidden">
                    <h2 className="text-[#d9a066] text-[10px] uppercase tracking-[0.3em] font-bold mb-8 flex items-center gap-2">
                        <RefreshCw size={12} className={uploading.active ? "animate-spin" : ""} />
                        KATALOĞU GÜNCELLE
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] text-gray-500 ml-2 uppercase tracking-widest">Katalog Adı</label>
                            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Örn: Ekol Home 2025 Koleksiyonu" className="bg-white/[0.03] border border-white/10 p-4 rounded-xl outline-none text-sm text-white focus:border-[#d9a066]/50" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] text-gray-500 ml-2 uppercase tracking-widest">Sezon Bilgisi</label>
                            <input value={season} onChange={e => setSeason(e.target.value)} placeholder="Örn: 2025 Spring" className="bg-white/[0.03] border border-white/10 p-4 rounded-xl outline-none text-sm text-white focus:border-[#d9a066]/50" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-[10px] text-gray-500 ml-2 mb-2 block uppercase tracking-widest">PDF Dosyası</label>
                            <label className="flex items-center justify-center gap-3 bg-white/[0.03] border-2 border-dashed border-white/10 p-8 rounded-xl cursor-pointer hover:bg-white/5 hover:border-[#d9a066]/30 transition-all group">
                                <FileText size={24} className="text-gray-500 group-hover:text-[#d9a066]" />
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-300">{pdfFile ? pdfFile.name : "Yeni PDF seçmek için tıklayın veya sürükleyin"}</span>
                                    {katalog && !pdfFile && <span className="text-[10px] text-[#d9a066]/60 italic mt-1 flex items-center gap-1">Mevcut dosya: {katalog.pdf_url.split('/').pop()}</span>}
                                </div>
                                <input type="file" accept=".pdf" className="hidden" onChange={e => setPdfFile(e.target.files?.[0] || null)} />
                            </label>
                        </div>

                        <button onClick={handleSave} disabled={uploading.active} className="md:col-span-2 bg-[#d9a066] text-black font-bold py-5 rounded-xl text-[10px] tracking-[0.3em] hover:bg-white transition-all disabled:opacity-50 uppercase">
                            {uploading.active ? "SİSTEM GÜNCELLENİYOR..." : "DEĞİŞİKLİKLERİ KAYDET VE YAYINLA"}
                        </button>
                    </div>
                </section>

                {/* Mevcut Durum Kartı */}
                {!loading && katalog && (
                    <div className="bg-[#d9a066]/5 border border-[#d9a066]/20 p-6 rounded-[1.5rem] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#d9a066] rounded-full flex items-center justify-center text-black">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">{katalog.title}</h3>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{katalog.season} • Aktif Yayın</p>
                            </div>
                        </div>
                        <a href={katalog.pdf_url} target="_blank" className="text-[10px] border border-white/10 px-4 py-2 rounded-lg hover:bg-white hover:text-black transition-all tracking-widest uppercase font-bold">Önizle</a>
                    </div>
                )}
            </main>
        </div>
    );
}