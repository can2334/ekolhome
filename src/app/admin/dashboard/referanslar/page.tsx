"use client";

import { useState, useEffect, useMemo } from "react";
import { Trash2, Loader2, RefreshCw, Edit3, PlusCircle, Search } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface ReferenceItem {
    id: number;
    name: string;
    logo_url: string;
    order_index: number;
}

const API_URL = "https://ekolhome.smusa9883x.workers.dev/api/references";

export default function AdminReferanslar() {
    const [references, setReferences] = useState<ReferenceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [formData, setFormData] = useState({
        id: null as number | null,
        name: "",
        logo_url: "",
        order_index: 1
    });

    const filteredReferences = useMemo(() => {
        return references.filter(ref =>
            ref.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [references, searchTerm]);

    const fetchReferences = async () => {
        setLoading(true);
        const token = localStorage.getItem("admin_token");
        try {
            const res = await fetch(API_URL, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.status === 401) return toast.error("Oturum süreniz dolmuş!");

            if (Array.isArray(data)) {
                const sortedData = data.sort((a, b) => a.order_index - b.order_index);
                setReferences(sortedData);

                if (data.length > 0 && formData.id === null) {
                    const maxOrder = Math.max(...data.map(item => item.order_index));
                    setFormData(prev => ({ ...prev, order_index: maxOrder + 1 }));
                }
            }
        } catch (error) {
            toast.error("Veriler yüklenemedi.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchReferences(); }, []);

    const handleSave = async () => {
        const token = localStorage.getItem("admin_token");
        if (!token) return toast.error("Lütfen önce giriş yapın!");
        if (!formData.name.trim() || !formData.logo_url.trim()) return toast.error("Eksik alanları doldurun.");

        setSaving(true);
        const loadToast = toast.loading("Kaydediliyor...");
        try {
            const res = await fetch(`${API_URL}/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error("İşlem başarısız.");
            toast.success(formData.id ? "Güncellendi!" : "Eklendi!", { id: loadToast });
            resetForm();
            fetchReferences();
        } catch (error: any) {
            toast.error(error.message, { id: loadToast });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        const token = localStorage.getItem("admin_token");
        if (!confirm("Silmek istediğinize emin misiniz?")) return;
        const loadToast = toast.loading("Siliniyor...");
        try {
            const res = await fetch(`${API_URL}/delete`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                toast.success("Silindi!", { id: loadToast });
                fetchReferences();
            }
        } catch (err) {
            toast.error("Hata oluştu.", { id: loadToast });
        }
    };

    const resetForm = () => {
        const maxOrder = references.length > 0 ? Math.max(...references.map(item => item.order_index)) : 0;
        setFormData({ id: null, name: "", logo_url: "", order_index: maxOrder + 1 });
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col lg:flex-row font-sans overflow-x-hidden">
            <Toaster position="top-right" />

            <main className="flex-1 p-4 sm:p-6 lg:p-12 w-full max-w-full overflow-hidden">
                <div className="flex flex-col mb-8 mt-14 lg:mt-0">
                    <h1 className="text-[#d9a066] text-xs font-bold tracking-[0.4em] uppercase">REFERANS YÖNETİMİ</h1>
                    <p className="text-gray-500 text-[10px] mt-1 tracking-widest uppercase">Mobil ve Web uyumlu yönetim paneli.</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 items-start">

                    {/* SOL FORM - Mobilde sticky özelliği kaldırıldı, z-index sorunu çözüldü */}
                    <section className="xl:col-span-4 bg-[#121212] rounded-[1.5rem] lg:rounded-[2rem] border border-white/5 p-5 sm:p-8 xl:sticky xl:top-8 z-10">
                        <h2 className="text-[#d9a066] text-[10px] uppercase tracking-[0.3em] font-bold mb-6 flex items-center gap-2">
                            {formData.id ? <Edit3 size={12} /> : <PlusCircle size={12} />}
                            {formData.id ? "KAYDI DÜZENLE" : "YENİ KAYIT ÖNERİSİ"}
                        </h2>
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[9px] text-gray-500 uppercase ml-1">Marka/Otel Adı</label>
                                <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Örn: Ekol Hotel" className="w-full bg-white/[0.03] border border-white/10 p-3.5 sm:p-4 rounded-xl outline-none text-white focus:border-[#d9a066]/50 transition-all text-sm" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[9px] text-gray-500 uppercase ml-1">Logo URL</label>
                                <input value={formData.logo_url} onChange={e => setFormData({ ...formData, logo_url: e.target.value })} placeholder="https://..." className="w-full bg-white/[0.03] border border-white/10 p-3.5 sm:p-4 rounded-xl outline-none text-white focus:border-[#d9a066]/50 transition-all text-sm" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[9px] text-[#d9a066] uppercase ml-1 font-bold">Görüntüleme Sırası</label>
                                <input type="number" value={formData.order_index} onChange={e => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })} className="w-full bg-[#d9a066]/10 border border-[#d9a066]/30 p-3.5 sm:p-4 rounded-xl outline-none text-[#d9a066] font-bold text-lg" />
                            </div>
                            <button onClick={handleSave} disabled={saving} className="w-full bg-[#d9a066] text-black font-bold py-4 rounded-xl text-[10px] tracking-[0.2em] hover:bg-white active:scale-95 transition-all uppercase shadow-lg shadow-[#d9a066]/10">
                                {saving ? "İŞLENİYOR..." : (formData.id ? "GÜNCELLE" : "SIRAYA EKLE")}
                            </button>
                            {formData.id && <button onClick={resetForm} className="w-full text-gray-500 text-[10px] uppercase tracking-widest hover:text-white pt-2">Yeni Kayda Dön</button>}
                        </div>
                    </section>

                    {/* SAĞ LİSTE */}
                    <section className="xl:col-span-8 bg-[#121212] rounded-[1.5rem] lg:rounded-[2rem] border border-white/5 p-5 sm:p-8 overflow-hidden">
                        <div className="flex flex-col gap-6 mb-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-[#d9a066] text-[10px] uppercase tracking-[0.3em] font-bold">MEVCUT SIRALAMA</h2>
                                <button onClick={fetchReferences} className="p-2 hover:bg-white/5 rounded-full transition-all active:rotate-180 duration-500">
                                    <RefreshCw size={14} className={loading ? "animate-spin" : "text-gray-500"} />
                                </button>
                            </div>

                            {/* ARAMA ÇUBUĞU - Mobilde tam genişlik, şık tasarım */}
                            <div className="relative group w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#d9a066] transition-colors" size={16} />
                                <input
                                    type="text"
                                    placeholder="Otel veya marka ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/10 py-3 pl-12 pr-4 rounded-xl text-sm outline-none focus:border-[#d9a066]/50 focus:bg-white/[0.06] transition-all placeholder:text-gray-600"
                                />
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#d9a066]" /></div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                {filteredReferences.map((item) => (
                                    <div key={item.id} className={`flex flex-col sm:flex-row items-center justify-between p-4 gap-4 rounded-2xl border transition-all duration-300 ${formData.id === item.id ? 'bg-[#d9a066]/15 border-[#d9a066]' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'}`}>
                                        <div className="flex items-center gap-4 w-full sm:w-auto">
                                            <div className="flex-shrink-0 flex items-center justify-center min-w-[36px] h-[36px] rounded-lg bg-[#d9a066] text-black font-black text-xs shadow-lg shadow-[#d9a066]/20 ring-2 ring-black">
                                                {item.order_index}
                                            </div>
                                            <div className="flex-shrink-0 w-11 h-11 bg-white rounded-lg p-1 flex items-center justify-center">
                                                <img src={item.logo_url} alt="" className="max-w-full max-h-full object-contain" />
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="text-sm font-bold uppercase tracking-wider truncate">{item.name}</span>
                                                <span className="text-[8px] text-gray-600 tracking-tighter">REF-ID: {item.id}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 w-full sm:w-auto justify-end border-t border-white/5 pt-3 sm:border-0 sm:pt-0">
                                            <button onClick={() => setFormData(item)} className="flex-1 sm:flex-none p-2.5 bg-white/5 hover:bg-[#d9a066] rounded-xl transition-all group flex justify-center items-center gap-2">
                                                <Edit3 size={16} className="text-gray-400 group-hover:text-black" />
                                                <span className="text-[10px] font-bold sm:hidden text-gray-400 group-hover:text-black uppercase">Düzenle</span>
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="flex-1 sm:flex-none p-2.5 bg-white/5 hover:bg-red-500 rounded-xl transition-all group flex justify-center items-center gap-2">
                                                <Trash2 size={16} className="text-gray-400 group-hover:text-white" />
                                                <span className="text-[10px] font-bold sm:hidden text-gray-400 group-hover:text-white uppercase">Sil</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {filteredReferences.length === 0 && (
                                    <div className="text-center py-20 text-gray-600 uppercase text-[10px] tracking-[0.5em]">
                                        Eşleşen sonuç yok
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}