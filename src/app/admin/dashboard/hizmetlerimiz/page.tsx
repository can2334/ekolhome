"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Loader2, Plus, Trash2, Edit3,
    Globe, Save, X, Image as ImageIcon,
    UploadCloud
} from "lucide-react";
import Sidebar from "../../Sidebar";

const API_URL = "https://ekolhome.smusa9883x.workers.dev/api/services";

export default function AdminHizmetler() {
    const router = useRouter();
    const [hizmetler, setHizmetler] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [form, setForm] = useState({
        id: null,
        title: "",
        slug: "",
        description: "",
        content: "",
        cover_image: "",
        extra_images: "",
        category: "Mobilya"
    });

    const fetchHizmetler = async () => {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setHizmetler(Array.isArray(data) ? data : []);
        } catch (error) { console.error(error); }
    };

    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        if (!token) router.push("/admin");
        fetchHizmetler();
    }, [router]);

    const handleFileUpload = async (file: File) => {
        if (!form.slug) {
            alert("Lütfen önce bir başlık girerek slug oluşmasını sağlayın!");
            return null;
        }
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", form.slug);

        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            setIsUploading(false);
            return data.url;
        } catch (err) {
            setIsUploading(false);
            alert("Dosya yüklenemedi!");
            return null;
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setIsModalOpen(false);
                resetForm();
                fetchHizmetler();
            }
        } catch (err) { alert("Kaydedilemedi!"); }
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bu koleksiyon silinsin mi?")) return;
        await fetch(`${API_URL}/delete`, {
            method: "POST",
            body: JSON.stringify({ id }),
        });
        fetchHizmetler();
    };

    const resetForm = () => {
        setForm({ id: null, title: "", slug: "", description: "", content: "", cover_image: "", extra_images: "", category: "Mobilya" });
    };

    const updateTitle = (val: string) => {
        const slug = val.toLowerCase().trim()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
        setForm({ ...form, title: val, slug: slug });
    };

    return (
        <div className="min-h-screen bg-[#0F0F0F] text-white flex font-sans overflow-hidden">
            <Sidebar />

            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0A0A0A]">
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-12 bg-[#0A0A0A]/80 backdrop-blur-xl z-30">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xs font-bold tracking-[0.4em] uppercase text-[#d9a066]">Koleksiyon Yönetimi</h1>
                        <span className="text-[10px] text-white/20">/</span>
                        <span className="text-[10px] text-white/40 uppercase tracking-widest">{hizmetler.length} Ürün</span>
                    </div>

                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="bg-[#d9a066] text-black text-[10px] font-bold px-6 py-3 rounded-full uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-[#d9a066]/10 flex items-center gap-2"
                    >
                        <Plus size={14} /> Yeni Koleksiyon Ekle
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-12 space-y-10">
                    <div className="grid grid-cols-1 gap-4 pb-20">
                        {hizmetler.map((item) => (
                            <div key={item.id} className="bg-[#121212] border border-white/5 p-5 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 hover:border-[#d9a066]/30 transition-all group">
                                <div className="flex items-center gap-6 flex-1">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0 flex items-center justify-center">
                                        {/* DÜZELTME: src="" hatasını önlemek için kontrol */}
                                        {item.cover_image ? (
                                            <img src={item.cover_image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                                        ) : (
                                            <ImageIcon className="text-white/10" size={24} />
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] text-[#d9a066] font-bold uppercase tracking-[0.2em]">{item.category}</span>
                                        <p className="text-sm font-medium text-white group-hover:text-[#d9a066] transition-colors uppercase tracking-tight">{item.title}</p>
                                        <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono">
                                            <span className="flex items-center gap-1"><Globe size={10} /> /{item.slug}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => { setForm(item); setIsModalOpen(true); }}
                                        className="p-4 bg-white/5 rounded-2xl hover:bg-[#d9a066] hover:text-black transition-all"
                                    >
                                        <Edit3 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-4 bg-white/5 rounded-2xl hover:bg-red-500/20 hover:text-red-500 transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-6">
                    <div className="bg-[#121212] border border-white/10 rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <form onSubmit={handleSave} className="p-12 space-y-10">
                            <div className="flex justify-between items-center border-b border-white/5 pb-8">
                                <div>
                                    <h2 className="text-[#d9a066] text-xs font-bold uppercase tracking-[0.4em]">{form.id ? "Koleksiyonu Düzenle" : "Yeni Kayıt Oluştur"}</h2>
                                    <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest">Ekol Home İçerik Yönetim Sistemi</p>
                                </div>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[10px] text-[#d9a066] font-bold tracking-widest uppercase">Koleksiyon Başlığı</label>
                                        <input
                                            value={form.title}
                                            onChange={e => updateTitle(e.target.value)}
                                            className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl outline-none focus:border-[#d9a066] text-sm uppercase tracking-tighter"
                                            placeholder="Modern Lüx Salon..."
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-3">
                                            <label className="text-[10px] text-[#d9a066] font-bold tracking-widest uppercase">Kategori</label>
                                            <select
                                                value={form.category}
                                                onChange={e => setForm({ ...form, category: e.target.value })}
                                                className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl outline-none focus:border-[#d9a066] text-xs text-white appearance-none"
                                            >
                                                <option className="bg-[#121212]" value="Mobilya">Mobilya</option>
                                                <option className="bg-[#121212]" value="İç Mimari">İç Mimari</option>
                                                <option className="bg-[#121212]" value="Özel Tasarım">Özel Tasarım</option>
                                                <option className="bg-[#121212]" value="Aksesuar">Aksesuar</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <label className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Slug (URL)</label>
                                            <div className="bg-white/5 border border-white/5 p-5 rounded-2xl text-[10px] font-mono text-gray-400 overflow-hidden truncate">
                                                /{form.slug}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <label className="text-[10px] text-[#d9a066] font-bold tracking-widest uppercase">Kısa Açıklama</label>
                                        <textarea
                                            value={form.description}
                                            onChange={e => setForm({ ...form, description: e.target.value })}
                                            className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl outline-none focus:border-[#d9a066] text-sm h-32 resize-none"
                                            placeholder="Liste ekranında görünecek kısa metin..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[10px] text-[#d9a066] font-bold tracking-widest uppercase">Kapak Görseli</label>
                                        <div className="relative group min-h-[160px] bg-white/[0.03] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center p-4 transition-all hover:border-[#d9a066]">
                                            {/* DÜZELTME: Modal içindeki kapak görseli kontrolü */}
                                            {form.cover_image && form.cover_image !== "" ? (
                                                <div className="relative w-full h-32">
                                                    <img src={form.cover_image} className="w-full h-full object-cover rounded-2xl" alt="Kapak Önizleme" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setForm({ ...form, cover_image: "" })}
                                                        className="absolute -top-2 -right-2 bg-red-500 p-1 rounded-full shadow-xl z-10"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <UploadCloud className="text-white/20 group-hover:text-[#d9a066] mb-2" size={32} />
                                                    <span className="text-[9px] text-white/40 uppercase font-bold">Kapak Fotoğrafı Yükle</span>
                                                    <input
                                                        type="file"
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        accept="image/*"
                                                        onChange={async (e) => {
                                                            if (e.target.files?.[0]) {
                                                                const url = await handleFileUpload(e.target.files[0]);
                                                                if (url) setForm({ ...form, cover_image: url });
                                                            }
                                                        }}
                                                    />
                                                </>
                                            )}
                                            {isUploading && <div className="absolute inset-0 bg-black/50 rounded-3xl flex items-center justify-center z-20"><Loader2 className="animate-spin text-[#d9a066]" /></div>}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <label className="text-[10px] text-[#d9a066] font-bold tracking-widest uppercase">Galeri Resimleri</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {form.extra_images.split(',').filter(Boolean).map((img, idx) => (
                                                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                                                    <img src={img} className="w-full h-full object-cover" alt={`Galeri ${idx}`} />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const arr = form.extra_images.split(',').filter(Boolean);
                                                            arr.splice(idx, 1);
                                                            setForm({ ...form, extra_images: arr.join(',') });
                                                        }}
                                                        className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                            <div className="relative aspect-square bg-white/5 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center hover:border-[#d9a066] transition-all group">
                                                <Plus className="text-white/20 group-hover:text-[#d9a066]" />
                                                <input
                                                    type="file"
                                                    multiple
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        if (e.target.files) {
                                                            const files = Array.from(e.target.files);
                                                            let newUrls = [...form.extra_images.split(',').filter(Boolean)];
                                                            for (const f of files) {
                                                                const url = await handleFileUpload(f);
                                                                if (url) newUrls.push(url);
                                                            }
                                                            setForm({ ...form, extra_images: newUrls.join(',') });
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <label className="text-[10px] text-[#d9a066] font-bold tracking-widest uppercase">Detaylı İçerik</label>
                                        <textarea
                                            value={form.content}
                                            onChange={e => setForm({ ...form, content: e.target.value })}
                                            className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl outline-none focus:border-[#d9a066] text-sm h-32 resize-none"
                                            placeholder="Sayfa içindeki tüm detaylı yazı..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || isUploading}
                                className="w-full bg-[#d9a066] text-black font-bold py-6 rounded-[2rem] uppercase tracking-[0.3em] text-xs hover:bg-white transition-all shadow-2xl shadow-[#d9a066]/20 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                {form.id ? "DEĞİŞİKLİKLERİ KAYDET" : "YENİ KOLEKSİYONU YAYINLA"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}