"use client";
import { useState, useEffect } from "react";

const API_URL = "https://ekolhome.smusa9883x.workers.dev/api/contact/update";
const GET_URL = "https://ekolhome.smusa9883x.workers.dev/api/contact";

export default function AdminIletisim() {
    const [form, setForm] = useState({ id: 1, address: "", phone: "", email: "", map_url: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(GET_URL).then(res => res.json()).then(json => {
            if(json[0]) setForm(json[0]);
        });
    }, []);

    const handleUpdate = async () => {
        setLoading(true);
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });
        
        if (res.ok) {
            alert("Ekolhome bilgileri başarıyla güncellendi!");
        } else {
            alert("Bir hata oluştu.");
        }
        setLoading(false);
    };

    return (
        <div className="p-10 bg-[#0F0F0F] min-h-screen text-white">
            <h1 className="text-3xl font-extralight mb-10 tracking-widest uppercase">İletişim Ayarları</h1>
            <div className="max-w-3xl space-y-6 bg-[#151515] p-8 rounded-3xl border border-white/5">
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest">Adres Bilgisi</label>
                    <textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-[#d9a066] h-32" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest">Telefonlar (Virgülle ayır)</label>
                    <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest">Google Harita URL (iframe src)</label>
                    <input value={form.map_url} onChange={e => setForm({...form, map_url: e.target.value})} className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none text-xs" />
                </div>
                <button 
                    onClick={handleUpdate} 
                    disabled={loading}
                    className="w-full bg-[#d9a066] text-black font-bold py-5 rounded-2xl uppercase tracking-[0.3em] text-[11px] hover:bg-white transition-all"
                >
                    {loading ? "GÜNCELLENİYOR..." : "SİSTEMİ GÜNCELLE"}
                </button>
            </div>
        </div>
    );
}