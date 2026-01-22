"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, MapPin, Phone, Mail, Trash2, Edit3, Globe, Save, X, ExternalLink } from "lucide-react";
import Sidebar from "../../Sidebar";

const API_BASE = "https://ekolhome.smusa9883x.workers.dev/api/contact";

export default function AdminIletisim() {
    const router = useRouter();
    const [contacts, setContacts] = useState<any[]>([]);
    const [form, setForm] = useState({ id: null, address: "", phone: "", email: "", map_url: "" });
    const [loading, setLoading] = useState(false);

    const fetchContacts = async () => {
        try {
            const res = await fetch(API_BASE);
            const data = await res.json();
            setContacts(Array.isArray(data) ? data : []);
        } catch (error) { console.error(error); }
    };

    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        if (!token) router.push("/admin");
        fetchContacts();
    }, [router]);

    const handleSave = async () => {
        setLoading(true);
        const endpoint = form.id ? `${API_BASE}/update` : `${API_BASE}/add`;
        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                setForm({ id: null, address: "", phone: "", email: "", map_url: "" });
                fetchContacts();
            }
        } catch (error) { alert("Hata!"); }
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Silinsin mi?")) return;
        await fetch(`${API_BASE}/delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });
        fetchContacts();
    };

    return (
        <div className="min-h-screen bg-[#0F0F0F] text-white flex font-sans overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0A0A0A]">
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-12 bg-[#0A0A0A]/80 backdrop-blur-xl z-30">
                    <h1 className="text-xs font-bold tracking-[0.4em] uppercase text-[#d9a066]">İletişim Yönetimi</h1>
                    <div className="h-10 w-10 rounded-full bg-[#d9a066] flex items-center justify-center text-[10px] text-black font-bold">AD</div>
                </header>

                <div className="flex-1 overflow-y-auto p-12 space-y-10">
                    {/* --- ÜST FORM ALANI --- */}
                    <div className="bg-[#121212] rounded-[2.5rem] border border-white/5 p-10 shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                            {/* Adres ve İletişim */}
                            <div className="space-y-6 lg:col-span-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[10px] text-[#d9a066] font-bold tracking-widest uppercase">Mağaza Adresi</label>
                                        <textarea
                                            value={form.address}
                                            onChange={e => setForm({ ...form, address: e.target.value })}
                                            className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl outline-none focus:border-[#d9a066] h-32 resize-none text-sm leading-relaxed"
                                            placeholder="Adres detayları..."
                                        />
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex flex-col gap-3">
                                            <label className="text-[10px] text-[#d9a066] font-bold tracking-widest uppercase">Telefon</label>
                                            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="bg-white/[0.03] border border-white/10 p-4 rounded-xl outline-none focus:border-[#d9a066] text-sm" placeholder="+90..." />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <label className="text-[10px] text-[#d9a066] font-bold tracking-widest uppercase">E-Posta</label>
                                            <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-white/[0.03] border border-white/10 p-4 rounded-xl outline-none focus:border-[#d9a066] text-sm" placeholder="info@..." />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-[10px] text-[#d9a066] font-bold tracking-widest uppercase">Harita Paylaşım Linki (src)</label>
                                    <input value={form.map_url} onChange={e => setForm({ ...form, map_url: e.target.value })} className="bg-white/[0.03] border border-white/10 p-4 rounded-xl outline-none focus:border-[#d9a066] text-[10px] font-mono text-gray-500" placeholder="https://www.google.com/maps/embed?..." />
                                </div>
                            </div>

                            {/* Harita Önizleme Kutusu */}
                            <div className="flex flex-col gap-4">
                                <label className="text-[10px] text-gray-500 font-bold tracking-widest uppercase text-center">Harita Önizleme</label>
                                <div className="flex-1 min-h-[250px] bg-black rounded-3xl border border-white/5 overflow-hidden relative group">
                                    {form.map_url ? (
                                        <iframe
                                            src={form.map_url}
                                            className="w-full h-full grayscale-[0.5] opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                                            loading="lazy"
                                        ></iframe>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-700 gap-4">
                                            <Globe size={40} strokeWidth={1} />
                                            <span className="text-[10px] uppercase tracking-[0.2em]">Harita URL'si Bekleniyor</span>
                                        </div>
                                    )}
                                </div>
                                <button onClick={handleSave} disabled={loading} className="w-full bg-[#d9a066] text-black font-bold py-5 rounded-2xl uppercase tracking-widest text-[11px] hover:bg-white transition-all shadow-xl shadow-[#d9a066]/10">
                                    {loading ? "GÜNCELLENİYOR..." : form.id ? "DEĞİŞİKLİKLERİ KAYDET" : "YENİ KONUM EKLE"}
                                </button>
                                {form.id && <button onClick={() => setForm({ id: null, address: "", phone: "", email: "", map_url: "" })} className="text-[10px] text-gray-500 hover:text-white uppercase transition-all">İptal</button>}
                            </div>
                        </div>
                    </div>

                    {/* --- ALT LİSTE ALANI --- */}
                    <div className="space-y-6 pb-20">
                        <h2 className="text-[10px] text-[#d9a066] uppercase tracking-[0.4em] font-bold">MEVCUT KONUMLAR</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {contacts.map((item) => (
                                <div key={item.id} className="bg-[#121212] border border-white/5 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 hover:border-[#d9a066]/30 transition-all">
                                    <div className="flex items-start gap-5 flex-1">
                                        <div className="p-4 bg-white/5 rounded-2xl text-[#d9a066]"><MapPin size={20} /></div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-300 font-medium leading-relaxed">{item.address}</p>
                                            <div className="flex gap-4 text-[11px] text-gray-500">
                                                <span className="flex items-center gap-1"><Phone size={12} /> {item.phone}</span>
                                                <span className="flex items-center gap-1"><Mail size={12} /> {item.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">

                                        <button onClick={() => setForm(item)} className="p-3 bg-white/5 rounded-xl hover:bg-blue-500/20 hover:text-blue-400 transition-all"><Edit3 size={18} /></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-3 bg-white/5 rounded-xl hover:bg-red-500/20 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main >
        </div >
    );
}