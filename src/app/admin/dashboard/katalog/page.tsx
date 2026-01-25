"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, Loader2, UploadCloud, RefreshCw } from "lucide-react";

interface KatalogItem {
    id: number;
    title: string;
    season: string;
    pdf_url: string;
}

// --- AYARLAR (Hizmetler sayfanla aynı Worker'ı kullanıyoruz) ---
const API_URL = "https://ekolhome.smusa9883x.workers.dev/api/catalog";
const UPLOAD_API = "https://ekolhome.smusa9883x.workers.dev/api/upload"; // Dosyayı buraya basacağız
const WORKER_AUTH_TOKEN = "s3nnzywalker_r2_secure_2026";

export default function AdminKatalog() {
    const router = useRouter();
    const [katalog, setKatalog] = useState<KatalogItem | null>(null);
    const [title, setTitle] = useState("");
    const [season, setSeason] = useState("");
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState({ active: false, percent: 0 });
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    const getAuthToken = () => localStorage.getItem("admin_token");

    const fetchKatalog = async () => {
        setLoading(true);
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
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

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            router.push("/admin");
        } else {
            fetchKatalog();
        }
    }, [router]);

    // DOSYA YÜKLEME (Next.js API'yi aradan çıkardık, doğrudan Worker'a gidiyoruz)
    const uploadFile = async (file: File) => {
        const formData = new FormData();

        // R2'de tek bir katalog olacağı için ismini sabitliyoruz
        const renamedFile = new File([file], "EkolHome.pdf", { type: "application/pdf" });
        formData.append("file", renamedFile);

        const res = await fetch(UPLOAD_API, {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": `Bearer ${WORKER_AUTH_TOKEN}` // Senin Worker'ın beklediği token
            }
        });

        const textData = await res.text();
        let data;
        try {
            data = JSON.parse(textData);
        } catch (e) {
            throw new Error("Sunucudan geçersiz yanıt geldi (JSON değil).");
        }

        if (!res.ok) throw new Error(data.error || "Dosya yükleme hatası");

        // Worker'dan gelen filePath veya url'yi döndür
        return data.filePath || data.url || "";
    };

    // handleSave fonksiyonunu bu şekilde revize et
    const handleSave = async () => {
        // 1. Tarayıcıda saklanan admin token'ını al
        const token = localStorage.getItem("admin_token");

        if (!title.trim() || (!pdfFile && !katalog?.pdf_url)) {
            alert("Lütfen bir başlık girin ve PDF dosyası seçin.");
            return;
        }

        if (!token) {
            alert("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
            router.push("/admin");
            return;
        }

        setUploading({ active: true, percent: 30 });

        try {
            let finalPdfPath = katalog?.pdf_url || "";

            // Dosya yükleme kısmı (Eğer yeni dosya seçildiyse)
            if (pdfFile) {
                const uploadedPath = await uploadFile(pdfFile);
                const cleanPath = uploadedPath.split('?')[0];
                finalPdfPath = `${cleanPath}?v=${Date.now()}`;
            }

            setUploading({ active: true, percent: 70 });

            const payload = {
                id: 1,
                title: title.trim(),
                season: season.trim() || "2026",
                pdf_url: finalPdfPath
            };

            // --- HATA BURADAYDI: TOKEN GÖNDERİMİ ---
            const res = await fetch(`${API_URL}/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Başına 'Bearer ' eklediğinden ve token'ın varlığından emin ol
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            // Eğer Worker 401 dönüyorsa burada yakalarız
            if (res.status === 401) {
                throw new Error("Yetkisiz erişim! Admin token geçersiz.");
            }

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Veritabanı güncellenemedi.");
            }

            setKatalog({ ...payload, id: 1 });
            setUploading({ active: true, percent: 100 });
            alert("Ekol Home Kataloğu başarıyla güncellendi!");
            setPdfFile(null);

        } catch (error: any) {
            console.error("Hata Detayı:", error);
            alert(`İşlem başarısız: ${error.message}`);
        } finally {
            setUploading({ active: false, percent: 0 });
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col lg:flex-row font-sans relative">
            <main className="flex-1 p-6 lg:p-12 h-screen overflow-y-auto">
                <div className="flex justify-between items-center mb-10">
                    <div className="flex flex-col">
                        <h1 className="text-[#d9a066] text-xs font-bold tracking-[0.4em] uppercase">EKOL HOME KATALOG SİSTEMİ</h1>
                        <p className="text-gray-500 text-[10px] mt-1 tracking-widest uppercase">Direct R2 Storage Management</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="animate-spin text-[#d9a066]" size={32} />
                    </div>
                ) : (
                    <>
                        <section className="bg-[#121212] rounded-[2rem] border border-white/5 p-8 mb-8 relative overflow-hidden shadow-2xl">
                            <h2 className="text-[#d9a066] text-[10px] uppercase tracking-[0.3em] font-bold mb-8 flex items-center gap-2">
                                <RefreshCw size={12} className={uploading.active ? "animate-spin" : ""} />
                                YENİ KATALOG YAYINLA
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] text-white/40 ml-2 uppercase tracking-widest font-bold">Katalog Başlığı</label>
                                    <input
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="Ekol Home 2026 Koleksiyonu"
                                        className="bg-white/[0.03] border border-white/10 p-4 rounded-xl outline-none text-sm text-white focus:border-[#d9a066]/50 transition-all"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] text-white/40 ml-2 uppercase tracking-widest font-bold">Sezon Bilgisi</label>
                                    <input
                                        value={season}
                                        onChange={e => setSeason(e.target.value)}
                                        placeholder="2026 Spring / Summer"
                                        className="bg-white/[0.03] border border-white/10 p-4 rounded-xl outline-none text-sm text-white focus:border-[#d9a066]/50 transition-all"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="text-[10px] text-white/40 ml-2 mb-2 block uppercase tracking-widest font-bold">Katalog PDF (R2 Cloud)</label>
                                    <label className="flex items-center justify-center gap-3 bg-white/[0.03] border-2 border-dashed border-white/10 p-10 rounded-2xl cursor-pointer hover:bg-white/5 hover:border-[#d9a066]/30 transition-all group relative overflow-hidden">
                                        <UploadCloud size={24} className="text-white/20 group-hover:text-[#d9a066] transition-colors" />
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-300">{pdfFile ? pdfFile.name : "Yeni PDF sürükleyin veya seçin"}</span>
                                            {katalog && !pdfFile && (
                                                <span className="text-[9px] text-[#d9a066]/60 italic mt-1 uppercase tracking-tighter">
                                                    Mevcut katalog bulutta aktif.
                                                </span>
                                            )}
                                        </div>
                                        <input type="file" accept=".pdf" className="hidden" onChange={e => setPdfFile(e.target.files?.[0] || null)} />

                                        {uploading.active && (
                                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-md">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Loader2 className="animate-spin text-[#d9a066]" />
                                                    <span className="text-[10px] font-bold tracking-widest text-[#d9a066]">R2 GÜNCELLENİYOR %{uploading.percent}</span>
                                                </div>
                                            </div>
                                        )}
                                    </label>
                                </div>

                                <button
                                    onClick={handleSave}
                                    disabled={uploading.active}
                                    className="md:col-span-2 bg-[#d9a066] text-black font-extrabold py-5 rounded-2xl text-[11px] tracking-[0.3em] hover:bg-white transition-all disabled:opacity-50 shadow-xl uppercase"
                                >
                                    {uploading.active ? "BULUT İŞLENİYOR..." : "DEĞİŞİKLİKLERİ R2 ÜZERİNDE YAYINLA"}
                                </button>
                            </div>
                        </section>

                        {katalog && (
                            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#d9a066]/10 border border-[#d9a066]/20 rounded-2xl flex items-center justify-center text-[#d9a066]">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">{katalog.title}</h3>
                                            <span className="bg-[#d9a066]/20 text-[#d9a066] text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">BULUTTA CANLI</span>
                                        </div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">{katalog.season} Sezonu</p>
                                    </div>
                                </div>
                                <a
                                    href={katalog.pdf_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full md:w-auto text-[10px] border border-white/10 px-6 py-3 rounded-xl hover:bg-white hover:text-black transition-all tracking-[0.2em] uppercase font-bold text-center"
                                >
                                    R2 ÜZERİNDEKİ DOSYAYI GÖR
                                </a>
                            </div>
                        )}
                    </>
                )}
            </main>
            <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-[#d9a066]/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
        </div>
    );
}