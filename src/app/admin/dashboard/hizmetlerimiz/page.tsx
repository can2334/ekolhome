"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Loader2, Plus, Trash2, Edit3,
    Save, X, Image as ImageIcon,
    UploadCloud, Link as LinkIcon
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
        category: "",
        status: "active"
    });

    // Token'ı hem useEffect hem de fonksiyonlarda kullanabilmek için
    const getAuthToken = () => localStorage.getItem("admin_token");

    const fetchHizmetler = async () => {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setHizmetler(Array.isArray(data) ? data : []);
        } catch (error) { console.error("Veri çekme hatası:", error); }
    };

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            router.push("/admin");
        } else {
            fetchHizmetler();
        }
    }, [router]);

    const handleFileUpload = async (file: File) => {
        if (!form.slug) {
            alert("Önce başlık girerek slug oluşmasını sağlayın!");
            return null;
        }
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", form.slug);

        try {
            const token = getAuthToken();
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": `Bearer ${token}` // Upload API'si de korumalıysa
                }
            });
            const data = await res.json();
            setIsUploading(false);
            return data.url;
        } catch (err) {
            setIsUploading(false);
            alert("Yükleme hatası!");
            return null;
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const token = getAuthToken(); // Token'ı al

        try {
            const res = await fetch(`${API_URL}/save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // İSTEDİĞİN KRİTİK EKLEME BURADA
                },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                setIsModalOpen(false);
                resetForm();
                fetchHizmetler();
            } else {
                const errData = await res.json();
                alert(`Hata: ${errData.message || "Kaydedilemedi"}`);
            }
        } catch (err) {
            alert("Sunucuyla bağlantı kurulamadı!");
        }
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Emin misiniz?")) return;
        const token = getAuthToken();

        try {
            await fetch(`${API_URL}/delete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Silme işlemi için de gerekli
                },
                body: JSON.stringify({ id }),
            });
            fetchHizmetler();
        } catch (error) {
            alert("Silme işlemi başarısız.");
        }
    };

    const resetForm = () => {
        setForm({
            id: null,
            title: "",
            slug: "",
            description: "",
            content: "",
            cover_image: "",
            extra_images: "",
            category: "",
            status: "active"
        });
    };

    const updateTitle = (val: string) => {
        const slug = val.toLowerCase().trim()
            .replace(/[ğĞ]/g, 'g').replace(/[üÜ]/g, 'u').replace(/[şŞ]/g, 's')
            .replace(/[ıİ]/g, 'i').replace(/[öÖ]/g, 'o').replace(/[çÇ]/g, 'c')
            .replace(/[^\w ]+/g, '').replace(/ +/g, '-');
        setForm({ ...form, title: val, slug: slug });
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col md:flex-row font-sans relative">
            <Sidebar />

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="sticky top-0 z-[50] w-full border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl shrink-0">
                    <div className="flex items-center justify-between p-4 md:p-6">
                        <div className="flex flex-col">
                            <h1 className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-[#d9a066]">
                                Koleksiyon
                            </h1>
                            <p className="text-[9px] text-white/30 uppercase tracking-widest">
                                {hizmetler.length} Kayıt
                            </p>
                        </div>

                        <button
                            type="button" // Formu tetiklememesi için
                            onClick={() => { resetForm(); setIsModalOpen(true); }}
                            className="bg-[#d9a066] text-black text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2"
                        >
                            <Plus size={14} />
                            <span className="hidden xs:inline">Yeni Ekle</span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="grid grid-cols-1 gap-3 pb-24">
                        {hizmetler.map((item) => (
                            <div key={item.id} className="bg-[#121212] border border-white/5 p-3 md:p-4 rounded-2xl flex items-center gap-3 md:gap-4 hover:border-[#d9a066]/40 transition-all group">
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden bg-white/5 shrink-0 border border-white/10">
                                    {item.cover_image ? <img src={item.cover_image} className="w-full h-full object-cover" alt="" /> : <ImageIcon className="m-auto mt-4 md:mt-5 opacity-10" size={20} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-[8px] md:text-[9px] text-[#d9a066] font-bold uppercase tracking-widest">{item.category}</span>
                                        <div className={`w-1 h-1 rounded-full ${item.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-white/20'}`}></div>
                                    </div>
                                    <h3 className="text-xs md:text-sm font-medium truncate uppercase tracking-tight">{item.title}</h3>
                                    <p className="text-[9px] text-white/20 font-mono truncate">/{item.slug}</p>
                                </div>
                                <div className="flex gap-1.5 md:gap-2">
                                    <button onClick={() => { setForm(item); setIsModalOpen(true); }} className="p-2.5 bg-white/5 rounded-xl hover:bg-[#d9a066] hover:text-black transition-colors">
                                        <Edit3 size={14} className="md:w-4 md:h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2.5 bg-white/5 rounded-xl hover:bg-red-500/20 hover:text-red-500 transition-colors">
                                        <Trash2 size={14} className="md:w-4 md:h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {hizmetler.length === 0 && (
                            <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[2rem]">
                                <p className="text-white/20 text-xs uppercase tracking-[0.2em]">Henüz koleksiyon eklenmemiş</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/95 backdrop-blur-md">
                    <div className="bg-[#0F0F0F] w-full max-w-4xl h-[100dvh] md:h-auto md:max-h-[90vh] overflow-hidden flex flex-col md:rounded-[2.5rem] border-t md:border border-white/10">

                        <div className="p-5 md:p-8 border-b border-white/5 flex items-center justify-between shrink-0">
                            <div>
                                <h2 className="text-[#d9a066] text-xs font-bold uppercase tracking-[0.2em]">{form.id ? "Düzenle" : "Yeni Kayıt"}</h2>
                                <p className="text-[9px] text-white/30 mt-1 uppercase">Koleksiyon detaylarını girin</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 md:p-10 space-y-6 md:space-y-8 pb-32 md:pb-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">

                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest ml-1">Başlık</label>
                                        <input
                                            value={form.title}
                                            onChange={e => updateTitle(e.target.value)}
                                            className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl focus:border-[#d9a066] outline-none transition-all text-sm"
                                            placeholder="Modern Koltuk Takımı" required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <LinkIcon size={12} /> Otomatik URL (Slug)
                                        </label>
                                        <input
                                            value={form.slug}
                                            readOnly
                                            className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl text-xs font-mono text-white/30 cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest ml-1">
                                            Kısa Açıklama
                                        </label>
                                        <textarea
                                            value={form.description}
                                            onChange={e => setForm({ ...form, description: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl h-24 resize-none outline-none focus:border-[#d9a066] transition-all text-sm"
                                            placeholder="Arama sonuçlarında görünecek kısa özet..."
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest ml-1">Kategori</label>
                                            <input
                                                type="text"
                                                value={form.category}
                                                onChange={e => setForm({ ...form, category: e.target.value })}
                                                placeholder="Kategori yazın..."
                                                className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl text-xs outline-none focus:border-[#d9a066] transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest ml-1">Durum</label>
                                            <select
                                                value={form.status}
                                                onChange={e => setForm({ ...form, status: e.target.value })}
                                                className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl text-xs outline-none"
                                            >
                                                <option value="active" className="bg-[#0F0F0F]">Yayında</option>
                                                <option value="passive" className="bg-[#0F0F0F]">Gizli</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest ml-1">Kapak Görseli</label>
                                        <div className="relative h-40 bg-white/[0.02] border-2 border-dashed border-white/10 rounded-3xl flex items-center justify-center overflow-hidden group">
                                            {form.cover_image ? (
                                                <>
                                                    <img src={form.cover_image} className="w-full h-full object-cover" alt="Kapak" />
                                                    <button type="button" onClick={() => setForm({ ...form, cover_image: "" })} className="absolute top-3 right-3 p-2 bg-red-500 rounded-full shadow-xl"><X size={14} /></button>
                                                </>
                                            ) : (
                                                <div className="text-center">
                                                    <UploadCloud className="mx-auto mb-2 text-white/10" size={32} />
                                                    <p className="text-[9px] uppercase tracking-widest text-white/20 font-bold">Resim Seç</p>
                                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={async e => {
                                                        const url = await handleFileUpload(e.target.files?.[0]!);
                                                        if (url) setForm({ ...form, cover_image: url });
                                                    }} />
                                                </div>
                                            )}
                                            {isUploading && <div className="absolute inset-0 bg-black/80 flex items-center justify-center"><Loader2 className="animate-spin text-[#d9a066]" /></div>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest ml-1">Galeri Resimleri</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {form.extra_images.split(',').filter(Boolean).map((img, idx) => (
                                                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                                                    <img src={img} className="w-full h-full object-cover" alt="" />
                                                    <button type="button" onClick={() => {
                                                        let arr = form.extra_images.split(',').filter(Boolean);
                                                        arr.splice(idx, 1);
                                                        setForm({ ...form, extra_images: arr.join(',') });
                                                    }} className="absolute inset-0 bg-red-600/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Trash2 size={12} /></button>
                                                </div>
                                            ))}
                                            <div className="aspect-square bg-white/5 border border-dashed border-white/10 rounded-xl flex items-center justify-center relative hover:bg-white/10 transition-colors">
                                                <Plus size={16} className="text-white/20" />
                                                <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={async e => {
                                                    const files = Array.from(e.target.files || []);
                                                    let urls = [...form.extra_images.split(',').filter(Boolean)];
                                                    for (const f of files) {
                                                        const url = await handleFileUpload(f);
                                                        if (url) urls.push(url);
                                                    }
                                                    setForm({ ...form, extra_images: urls.join(',') });
                                                }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 pt-4">
                                <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest ml-1">İçerik Detayı</label>
                                <textarea
                                    value={form.content}
                                    onChange={e => setForm({ ...form, content: e.target.value })}
                                    className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl h-40 resize-none outline-none focus:border-[#d9a066] text-sm"
                                    placeholder="Detaylı açıklama yazın..."
                                />
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={loading || isUploading}
                                    className="w-full bg-[#d9a066] text-black font-bold py-5 rounded-[2rem] uppercase tracking-[0.2em] text-[11px] hover:bg-white transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    {form.id ? "GÜNCELLEMEYİ KAYDET" : "KOLEKSİYONU YAYINLA"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-[#d9a066]/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
        </div>
    );
}