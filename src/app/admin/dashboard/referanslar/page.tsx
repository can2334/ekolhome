"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../Sidebar";
import { Trash2, Image as ImageIcon, Loader2, Plus, RefreshCw, Save, Edit3, X } from "lucide-react";

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

    const [formData, setFormData] = useState({
        id: null as number | null,
        name: "",
        logo_url: "",
        order_index: 0
    });

    const fetchReferences = async () => {
        setLoading(true);
        try {
            const res = await fetch(API_URL);
            const data = await res.json();

            // KRİTİK: Gelen veri dizi değilse (hata objesiyse) uygulamayı çökertme
            if (Array.isArray(data)) {
                setReferences(data);
            } else {
                console.error("API Hatası:", data);
                setReferences([]);
            }
        } catch (error) {
            console.error("Bağlantı Hatası:", error);
            setReferences([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchReferences(); }, []);

    const handleSave = async () => {
        if (!formData.name.trim() || !formData.logo_url.trim()) {
            return alert("Lütfen isim ve logo URL alanlarını doldurun.");
        }

        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error("Sunucu hatası oluştu.");

            alert(formData.id ? "Referans başarıyla güncellendi!" : "Yeni referans eklendi!");
            resetForm();
            fetchReferences();
        } catch (error: any) {
            alert(`Hata: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bu markayı silmek istediğinize emin misiniz?")) return;
        try {
            const res = await fetch(`${API_URL}/delete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (res.ok) fetchReferences();
        } catch (err) {
            alert("Silme işlemi başarısız!");
        }
    };

    const resetForm = () => {
        setFormData({ id: null, name: "", logo_url: "", order_index: 0 });
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col lg:flex-row font-sans">
            <Sidebar />
            <main className="flex-1 p-6 lg:p-12">

                {/* Üst Başlık */}
                <div className="flex justify-between items-center mb-10">
                    <div className="flex flex-col">
                        <h1 className="text-[#d9a066] text-xs font-bold tracking-[0.4em] uppercase">REFERANS YÖNETİMİ</h1>
                        <p className="text-gray-500 text-[10px] mt-1 tracking-widest">Sistemdeki tüm iş ortakları ve marka logoları.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                    {/* FORM ALANI */}
                    <section className="xl:col-span-5 bg-[#121212] rounded-[2rem] border border-white/5 p-8 h-fit">
                        <h2 className="text-[#d9a066] text-[10px] uppercase tracking-[0.3em] font-bold mb-8 flex items-center gap-2">
                            <RefreshCw size={12} className={saving ? "animate-spin" : ""} />
                            {formData.id ? "MARKAYI DÜZENLE" : "YENİ MARKA EKLE"}
                        </h2>

                        <div className="space-y-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] text-gray-500 ml-2 uppercase tracking-widest">Marka Adı</label>
                                <input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Örn: Ekol Mobilya"
                                    className="bg-white/[0.03] border border-white/10 p-4 rounded-xl outline-none text-sm text-white focus:border-[#d9a066]/50"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] text-gray-500 ml-2 uppercase tracking-widest">Logo Linki (URL)</label>
                                <input
                                    value={formData.logo_url}
                                    onChange={e => setFormData({ ...formData, logo_url: e.target.value })}
                                    placeholder="https://..."
                                    className="bg-white/[0.03] border border-white/10 p-4 rounded-xl outline-none text-sm text-white focus:border-[#d9a066]/50"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] text-gray-500 ml-2 uppercase tracking-widest">Görüntüleme Sırası</label>
                                <input
                                    type="number"
                                    value={formData.order_index}
                                    onChange={e => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                                    className="bg-white/[0.03] border border-white/10 p-4 rounded-xl outline-none text-sm text-white focus:border-[#d9a066]/50"
                                />
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full bg-[#d9a066] text-black font-bold py-5 rounded-xl text-[10px] tracking-[0.3em] hover:bg-white transition-all disabled:opacity-50 uppercase"
                            >
                                {saving ? "İŞLENİYOR..." : "DEĞİŞİKLİKLERİ KAYDET"}
                            </button>

                            {formData.id && (
                                <button onClick={resetForm} className="w-full text-center text-gray-500 text-[10px] tracking-widest uppercase hover:text-white">
                                    DÜZENLEMEYİ İPTAL ET
                                </button>
                            )}
                        </div>
                    </section>

                    {/* LİSTE ALANI */}
                    <section className="xl:col-span-7 bg-[#121212] rounded-[2rem] border border-white/5 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-[#d9a066] text-[10px] uppercase tracking-[0.3em] font-bold">KAYITLI MARKALAR ({references.length})</h2>
                            <button onClick={fetchReferences}><RefreshCw size={14} className={loading ? "animate-spin" : "text-gray-500"} /></button>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#d9a066]" /></div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3">
                                {references.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center overflow-hidden">
                                                <img src={item.logo_url} alt="" className="max-w-full max-h-full object-contain" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold uppercase tracking-wider">{item.name}</h3>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Sıra: {item.order_index}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => setFormData(item)} className="p-2 hover:text-[#d9a066] transition-colors"><Edit3 size={16} /></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-2 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}