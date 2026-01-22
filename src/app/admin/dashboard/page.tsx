// admmin/dashboard
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Bell,
    Search,
    FileText,
    Image as ImageIcon,
    Users,
    ArrowUpRight,
    Plus
} from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "../Sidebar"; // Sidebar'ı içe aktar

export default function AdminDashboard() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        if (!token) router.push("/admin");
    }, [router]);

    return (
        <div className="min-h-screen bg-[#0F0F0F] text-white flex font-sans">

            {/* Ayırdığımız Sidebar Bileşeni */}
            <Sidebar />

            <main className="flex-1 flex flex-col">
                {/* Header */}

                <div className="p-12 space-y-12">
                    {/* Sayfa İçeriği (Karşılama, İstatistikler, Hızlı Aksiyonlar) */}
                    <br /><br />
                    <section>
                        <h1 className="text-4xl font-extralight tracking-tight mb-2">Yönetim Paneli</h1>
                        <p className="text-gray-500 text-sm italic font-serif">Hoş geldin. Bugün sistemi güncellemek için harika bir gün.</p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <StatCard title="Aktif Kataloglar" value="14" trend="+2 bu ay" icon={<FileText size={24} />} />
                        <StatCard title="Toplam Referans" value="128" trend="+12 bu ay" icon={<ImageIcon size={24} />} />
                        <StatCard title="Sistem Sağlığı" value="%99.9" trend="Optimal" icon={<Users size={24} />} />
                    </div>

                    <section className="space-y-6">
                        <h3 className="text-[10px] uppercase tracking-[0.4em] text-[#d9a066] font-semibold">Hızlı İşlemler</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <ActionButton title="Yeni Katalog Ekle" desc="PDF veya Görsel yükle" />
                            <ActionButton title="Referans Güncelle" desc="Logo ve isim düzenle" />
                            <ActionButton title="SEO Ayarları" desc="Google görünürlüğü" />
                            <ActionButton title="Medya Kütüphanesi" desc="Tüm dosyaları gör" />
                        </div>
                    </section>
                </div>
            </main >
        </div >
    );
}

// Yardımcı Bileşenler (StatCard ve ActionButton aynı kalıyor...)
function StatCard({ title, value, trend, icon }: any) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#121212] border border-white/5 p-8 rounded-2xl relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 p-6 text-white/5 group-hover:text-[#d9a066]/10 transition-colors">
                {icon}
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-4">{title}</p>
            <h3 className="text-4xl font-light mb-2">{value}</h3>
            <p className="text-[10px] text-[#d9a066] flex items-center gap-2 tracking-widest">
                <ArrowUpRight size={12} /> {trend}
            </p>
        </motion.div>
    );
}

function ActionButton({ title, desc }: any) {
    return (
        <button className="bg-white/5 border border-white/5 p-6 rounded-2xl text-left hover:bg-white/10 transition-all group relative overflow-hidden">
            <div className="absolute top-4 right-4 text-gray-600 group-hover:text-white transition-colors">
                <Plus size={18} />
            </div>
            <h4 className="text-sm font-medium mb-1 tracking-tight">{title}</h4>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">{desc}</p>
        </button>
    );
}