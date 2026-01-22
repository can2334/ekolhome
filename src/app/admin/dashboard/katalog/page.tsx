"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Sidebar from "../../Sidebar";
import { Trash2, ExternalLink, Image as ImageIcon, FileText, Loader2 } from "lucide-react";

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
            const data = await res.json();
            setKataloglar(data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchKatalogs(); }, []);

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        // Next.js API route'una istek atıyoruz
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        // Gelen yolun başında / olduğundan emin oluyoruz (örneğin: /uploads/abc.pdf)
        return data.filePath.startsWith('/') ? data.filePath : `/${data.filePath}`;
    };

    const handleSave = async () => {
        if (!title || !coverFile || !pdfFile) return alert("Lütfen başlık ve dosyaları seçin.");
        setUploading({ active: true, percent: 10 });
        try {
            setUploading({ active: true, percent: 30 });
            const coverPath = await uploadFile(coverFile);
            setUploading({ active: true, percent: 60 });
            const pdfPath = await uploadFile(pdfFile);
            setUploading({ active: true, percent: 90 });

            const res = await fetch(`${API_URL}/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    season: season || "2024/25",
                    cover_image: coverPath,
                    pdf_url: pdfPath
                })
            });

            if (res.ok) {
                setUploading({ active: true, percent: 100 });
                setTimeout(() => {
                    setUploading({ active: false, percent: 0 });
                    setTitle(""); setSeason(""); setCoverFile(null); setPdfFile(null);
                    fetchKatalogs();
                }, 1000);
            }
        } catch (error) {
            console.error(error);
            alert("Dosya yükleme veya kayıt işlemi başarısız.");
            setUploading({ active: false, percent: 0 });
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Silmek istediğinize emin misiniz?")) return;
        await fetch(`${API_URL}/delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });
        fetchKatalogs();
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col lg:flex-row font-sans">
            <Sidebar />
            <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-[#d9a066] text-xs font-bold tracking-[0.4em] uppercase">KATALOG YÖNETİMİ</h1>
                    <div className="w-10 h-10 bg-[#d9a066] rounded-full flex items-center justify-center text-black font-bold text-xs uppercase">AD</div>
                </div>

                <section className="bg-[#121212] rounded-[2rem] border border-white/5 p-8 mb-12 relative overflow-hidden">
                    {uploading.active && (
                        <div className="absolute top-0 left-0 h-1 bg-[#d9a066] transition-all duration-500" style={{ width: `${uploading.percent}%` }} />
                    )}
                    <h2 className="text-[#d9a066] text-[10px] uppercase tracking-[0.3em] font-bold mb-8">
                        {uploading.active ? "YÜKLENİYOR..." : "YENİ YAYIN OLUŞTUR"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Katalog Başlığı" className="bg-white/[0.03] border border-white/10 p-4 rounded-xl outline-none text-sm text-white" />
                        <input value={season} onChange={e => setSeason(e.target.value)} placeholder="Sezon (2025)" className="bg-white/[0.03] border border-white/10 p-4 rounded-xl outline-none text-sm text-white" />

                        <label className="flex items-center gap-3 bg-white/[0.03] border border-white/10 p-4 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                            <ImageIcon size={18} className="text-gray-500" />
                            <span className="text-xs text-gray-400 truncate">{coverFile ? coverFile.name : "Kapak Seç"}</span>
                            <input type="file" accept="image/*" className="hidden" onChange={e => setCoverFile(e.target.files?.[0] || null)} />
                        </label>

                        <label className="flex items-center gap-3 bg-white/[0.03] border border-white/10 p-4 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                            <FileText size={18} className="text-gray-500" />
                            <span className="text-xs text-gray-400 truncate">{pdfFile ? pdfFile.name : "PDF Seç"}</span>
                            <input type="file" accept=".pdf" className="hidden" onChange={e => setPdfFile(e.target.files?.[0] || null)} />
                        </label>

                        <button onClick={handleSave} disabled={uploading.active} className="md:col-span-2 xl:col-span-4 bg-[#d9a066] text-black font-bold py-4 rounded-xl text-[10px] tracking-widest hover:bg-white transition-all disabled:opacity-50">
                            {uploading.active ? "İŞLENİYOR..." : "SİSTEME KAYDET"}
                        </button>
                    </div>
                </section>

                <section>
                    <h2 className="text-[#d9a066] text-[10px] uppercase tracking-[0.3em] font-bold mb-6 italic">KAYITLI YAYINLAR</h2>
                    {loading ? (
                        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#d9a066]" /></div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {kataloglar.map((k) => (
                                <div key={k.id} className="bg-[#121212] border border-white/5 p-5 rounded-[1.5rem] flex items-center justify-between group">
                                    <div className="flex items-center gap-6 overflow-hidden">
                                        <div className="w-14 h-16 bg-black rounded-xl overflow-hidden relative shrink-0">
                                            {/* cover_image başına / eklenerek public klasöründen okunması sağlandı */}
                                            <Image
                                                src={k.cover_image.startsWith('/') ? k.cover_image : `/${k.cover_image}`}
                                                alt={k.title}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[9px] font-black text-[#d9a066] bg-[#d9a066]/10 px-1.5 py-0.5 rounded uppercase">{k.season}</span>
                                                <h3 className="text-sm font-bold text-white/90 uppercase">{k.title}</h3>
                                            </div>
                                            <p className="text-[10px] text-gray-600 truncate max-w-[200px]">{k.pdf_url}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {/* download özelliği eklendi ve yol kontrolü yapıldı */}
                                        <a
                                            href={k.pdf_url.startsWith('/') ? k.pdf_url : `/${k.pdf_url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-[#d9a066]"
                                        >
                                            <ExternalLink size={16} />
                                        </a>
                                        <button onClick={() => handleDelete(k.id)} className="p-3 bg-white/5 rounded-xl text-gray-500 hover:text-red-500"><Trash2 size={16} /></button>
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