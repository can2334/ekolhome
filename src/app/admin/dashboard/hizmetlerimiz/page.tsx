"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Loader2, Plus, Trash2, Edit3,
    Save, X, Image as ImageIcon,
    UploadCloud, Link as LinkIcon,
    CheckCircle, AlertCircle, AlertTriangle
} from "lucide-react";

// --- AYARLAR ---
const API_URL = "https://ekolhome.smusa9883x.workers.dev/api/services";
const UPLOAD_API = "https://ekolhome.smusa9883x.workers.dev/api/upload";
const WORKER_AUTH_TOKEN = "s3nnzywalker_r2_secure_2026";

// Toast Notification Component
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'warning'; onClose: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <CheckCircle size={20} />,
        error: <AlertCircle size={20} />,
        warning: <AlertTriangle size={20} />
    };

    const colors = {
        success: 'bg-green-500/20 border-green-500/50 text-green-400',
        error: 'bg-red-500/20 border-red-500/50 text-red-400',
        warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
    };

    return (
        <div className={`fixed top-4 right-4 left-4 md:left-auto md:w-80 z-[200] ${colors[type]} border backdrop-blur-xl rounded-2xl p-4 flex items-center gap-3 shadow-2xl animate-in slide-in-from-top duration-300`}>
            {icons[type]}
            <span className="text-sm font-medium flex-1">{message}</span>
            <button onClick={onClose} className="hover:opacity-70 shrink-0">
                <X size={16} />
            </button>
        </div>
    );
}

// Delete Confirmation Modal
function DeleteModal({ isOpen, onClose, onConfirm, itemName }: any) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="bg-[#0F0F0F] border border-red-500/30 rounded-[2rem] p-6 md:p-8 max-w-sm w-full shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-red-500/20 rounded-2xl text-red-500">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">Emin misiniz?</h3>
                </div>
                <p className="text-white/60 text-sm mb-6 leading-relaxed">
                    <strong className="text-white">"{itemName}"</strong> kalıcı olarak silinecek. Bu işlem geri alınamaz.
                </p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl text-xs font-bold uppercase transition-all">İptal</button>
                    <button onClick={onConfirm} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl text-xs font-bold uppercase transition-all">Sil</button>
                </div>
            </div>
        </div>
    );
}

export default function AdminHizmetler() {
    const router = useRouter();
    const [hizmetler, setHizmetler] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; item: any } | null>(null);

    const [form, setForm] = useState({
        id: null, title: "", slug: "", description: "",
        content: "", cover_image: "", extra_images: "",
        category: "", status: "active"
    });

    const getAuthToken = () => localStorage.getItem("admin_token");

    const fetchHizmetler = async () => {
        const token = getAuthToken();
        try {
            const res = await fetch(API_URL, { headers: { "Authorization": `Bearer ${token}` } });
            const data = await res.json();
            setHizmetler(Array.isArray(data) ? data : []);
        } catch (error) {
            setToast({ message: "Veriler yüklenemedi", type: "error" });
        }
    };

    useEffect(() => {
        const token = getAuthToken();
        if (!token) router.push("/admin");
        else fetchHizmetler();
    }, [router]);

    // TEKLİ DOSYA YÜKLEME FONKSİYONU (HIZLANDIRILMIŞ)
    const handleFileUpload = async (file: File) => {
        if (!file) return null;
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch(UPLOAD_API, {
                method: "POST",
                body: formData,
                headers: { "Authorization": `Bearer ${WORKER_AUTH_TOKEN}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error();
            return data.filePath;
        } catch {
            return null;
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token = getAuthToken();
        try {
            const res = await fetch(`${API_URL}/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setIsModalOpen(false);
                setForm({ id: null, title: "", slug: "", description: "", content: "", cover_image: "", extra_images: "", category: "", status: "active" });
                fetchHizmetler();
                setToast({ message: "Başarıyla kaydedildi", type: "success" });
            }
        } catch {
            setToast({ message: "Hata oluştu", type: "error" });
        }
        setLoading(false);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal?.item) return;
        const token = getAuthToken();
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/delete`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ id: deleteModal.item.id }),
            });
            if (res.ok) {
                setToast({ message: "Silindi", type: "success" });
                fetchHizmetler();
            }
        } finally {
            setLoading(false);
            setDeleteModal(null);
        }
    };

    const updateTitle = (val: string) => {
        const slug = val.toLowerCase().trim()
            .replace(/[ğĞ]/g, 'g').replace(/[üÜ]/g, 'u').replace(/[şŞ]/g, 's')
            .replace(/[ıİ]/g, 'i').replace(/[öÖ]/g, 'o').replace(/[çÇ]/g, 'c')
            .replace(/[^\w ]+/g, '').replace(/ +/g, '-');
        setForm({ ...form, title: val, slug: slug });
    };

    return (
        <div className="min-h-[100dvh] bg-[#0A0A0A] text-white flex flex-col font-sans selection:bg-[#d9a066] selection:text-black">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            <DeleteModal isOpen={deleteModal?.isOpen} onClose={() => setDeleteModal(null)} onConfirm={handleDeleteConfirm} itemName={deleteModal?.item?.title} />

            {/* Header */}
            <header className="sticky top-0 z-[100] w-full border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl shrink-0">
                <div className="flex items-center justify-between px-6 py-5 md:py-8 max-w-7xl mx-auto w-full">
                    <div className="flex flex-col">
                        <h1 className="text-[10px] font-black tracking-[0.4em] uppercase text-[#d9a066]">Koleksiyon Yönetimi</h1>
                        <p className="text-[9px] text-white/30 uppercase tracking-widest mt-1">{hizmetler.length} Ürün Mevcut</p>
                    </div>

                    <button onClick={() => { setForm({ id: null, title: "", slug: "", description: "", content: "", cover_image: "", extra_images: "", category: "", status: "active" }); setIsModalOpen(true); }}
                        className="hidden md:flex bg-[#d9a066] text-black text-[10px] font-bold px-6 py-3 rounded-full uppercase tracking-widest hover:scale-105 active:scale-95 transition-all items-center gap-2 shadow-xl shadow-[#d9a066]/10">
                        <Plus size={14} /> Yeni Ekle
                    </button>
                </div>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-28 md:pb-10">
                    {hizmetler.map((item) => (
                        <div key={item.id} className="bg-[#121212] border border-white/5 p-4 rounded-3xl flex items-center gap-4 hover:border-[#d9a066]/40 transition-all group">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/5 shrink-0 border border-white/10">
                                {item.cover_image ? <img src={item.cover_image} className="w-full h-full object-cover" alt="" /> : <ImageIcon className="m-auto mt-5 opacity-10" size={24} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[8px] text-[#d9a066] font-bold uppercase tracking-widest">{item.category}</span>
                                    <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-white/20'}`}></div>
                                </div>
                                <h3 className="text-xs font-bold truncate uppercase tracking-tight text-white/90">{item.title}</h3>
                                <p className="text-[9px] text-white/20 font-mono truncate mt-0.5">/{item.slug}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => { setForm(item); setIsModalOpen(true); }} className="p-3 bg-white/5 rounded-2xl hover:bg-[#d9a066] hover:text-black transition-colors">
                                    <Edit3 size={16} />
                                </button>
                                <button onClick={() => setDeleteModal({ isOpen: true, item })} className="p-3 bg-white/5 rounded-2xl hover:bg-red-500/20 hover:text-red-500 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <button
                onClick={() => { setForm({ id: null, title: "", slug: "", description: "", content: "", cover_image: "", extra_images: "", category: "", status: "active" }); setIsModalOpen(true); }}
                className="md:hidden fixed bottom-6 right-6 z-[110] bg-[#d9a066] text-black p-5 rounded-[2rem] shadow-2xl shadow-[#d9a066]/40 active:scale-90 transition-transform">
                <Plus size={24} strokeWidth={3} />
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 z-[150] flex items-end md:items-center justify-center bg-black/95 md:backdrop-blur-xl">
                    <div className="bg-[#0F0F0F] w-full max-w-4xl h-[92dvh] md:h-auto md:max-h-[85vh] overflow-hidden flex flex-col rounded-t-[3rem] md:rounded-[3rem] border-t border-white/10 shadow-2xl">
                        <div className="p-6 md:p-10 border-b border-white/5 flex items-center justify-between shrink-0">
                            <div>
                                <h2 className="text-[#d9a066] text-xs font-black uppercase tracking-[0.3em]">{form.id ? "Detayları Düzenle" : "Yeni Koleksiyon Oluştur"}</h2>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 pb-32">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest ml-1">Başlık</label>
                                        <input value={form.title} onChange={e => updateTitle(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 p-5 rounded-[1.5rem] focus:border-[#d9a066] outline-none transition-all text-sm placeholder:text-white/10" placeholder="Örn: Viyana Koltuk Takımı" required />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest ml-1 flex items-center gap-2">URL (Otomatik)</label>
                                        <input value={form.slug} readOnly className="w-full bg-black/40 border border-white/5 p-5 rounded-[1.5rem] text-xs font-mono text-white/20 cursor-not-allowed" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest ml-1">Kategori</label>
                                            <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 p-5 rounded-[1.5rem] text-sm outline-none focus:border-[#d9a066]" placeholder="Koltuk" required />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest ml-1">Durum</label>
                                            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 p-5 rounded-[1.5rem] text-sm outline-none">
                                                <option value="active" className="bg-[#0F0F0F]">Yayında</option>
                                                <option value="passive" className="bg-[#0F0F0F]">Arşivle</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest ml-1">Kapak Görseli</label>
                                        <div className="relative h-48 bg-white/[0.02] border-2 border-dashed border-white/10 rounded-[2rem] flex items-center justify-center overflow-hidden group">
                                            {form.cover_image ? (
                                                <>
                                                    <img src={form.cover_image} className="w-full h-full object-cover" alt="" />
                                                    <button type="button" onClick={() => setForm({ ...form, cover_image: "" })} className="absolute top-4 right-4 p-2 bg-red-500 rounded-full shadow-xl hover:scale-110 transition-all z-10"><X size={14} /></button>
                                                </>
                                            ) : (
                                                <div className="text-center p-6">
                                                    <UploadCloud className="mx-auto mb-3 text-white/10" size={40} />
                                                    <p className="text-[9px] uppercase tracking-[0.2em] text-white/20 font-bold">Resim Yükle</p>
                                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" disabled={isUploading} onChange={async e => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            setIsUploading(true);
                                                            const url = await handleFileUpload(file);
                                                            setIsUploading(false);
                                                            if (url) {
                                                                setForm({ ...form, cover_image: url });
                                                                setToast({ message: "Kapak yüklendi", type: "success" });
                                                            } else {
                                                                setToast({ message: "Hata oluştu", type: "error" });
                                                            }
                                                        }
                                                    }} />
                                                </div>
                                            )}
                                            {isUploading && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"><Loader2 className="animate-spin text-[#d9a066]" /></div>}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest ml-1">Galeri</label>
                                        <div className="grid grid-cols-4 gap-3">
                                            {form.extra_images.split(',').filter(Boolean).map((img, idx) => (
                                                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group">
                                                    <img src={img} className="w-full h-full object-cover" alt="" />
                                                    <button type="button" onClick={() => {
                                                        let arr = form.extra_images.split(',').filter(Boolean);
                                                        arr.splice(idx, 1);
                                                        setForm({ ...form, extra_images: arr.join(',') });
                                                    }} className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><X size={16} /></button>
                                                </div>
                                            ))}
                                            <div className="aspect-square bg-white/5 border border-dashed border-white/10 rounded-2xl flex items-center justify-center relative hover:bg-white/10 transition-colors">
                                                {isUploading ? <Loader2 className="animate-spin text-[#d9a066]" size={20} /> : <Plus size={20} className="text-white/20" />}
                                                <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" disabled={isUploading} onChange={async e => {
                                                    const files = Array.from(e.target.files || []);
                                                    if (files.length === 0) return;

                                                    setIsUploading(true);

                                                    // PARALEL YÜKLEME: Tüm dosyaları aynı anda gönderir
                                                    try {
                                                        const uploadPromises = files.map(file => handleFileUpload(file));
                                                        const results = await Promise.all(uploadPromises);

                                                        const validUrls = results.filter(url => url !== null);
                                                        let currentUrls = [...form.extra_images.split(',').filter(Boolean)];

                                                        setForm({ ...form, extra_images: [...currentUrls, ...validUrls].join(',') });
                                                        setToast({ message: `${validUrls.length} fotoğraf yüklendi`, type: "success" });
                                                    } catch (err) {
                                                        setToast({ message: "Yükleme sırasında hata oluştu", type: "error" });
                                                    } finally {
                                                        setIsUploading(false);
                                                    }
                                                }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest ml-1">Kısa Açıklama</label>
                                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 p-5 rounded-[1.5rem] h-24 resize-none outline-none focus:border-[#d9a066] text-sm" placeholder="Liste görünümünde görünecek özet bilgi..." required />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest ml-1">İçerik Detayı</label>
                                <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 p-5 rounded-[1.5rem] h-48 resize-none outline-none focus:border-[#d9a066] text-sm" placeholder="Ürün hakkında detaylı bilgiler, teknik özellikler vb..." />
                            </div>
                        </form>

                        <div className="p-6 md:p-10 bg-[#0F0F0F] border-t border-white/5 shrink-0 fixed bottom-0 left-0 right-0 md:relative">
                            <button type="submit" onClick={handleSave} disabled={loading || isUploading}
                                className="w-full bg-[#d9a066] text-black font-black py-5 rounded-[2rem] uppercase tracking-[0.3em] text-[11px] hover:bg-white transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50">
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                {form.id ? "DEĞİŞİKLİKLERİ KAYDET" : "YENİ ÜRÜNÜ YAYINLA"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}