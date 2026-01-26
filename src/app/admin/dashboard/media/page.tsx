"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import {
    Image as ImageIcon, Upload, Trash2, Search, ExternalLink,
    RefreshCw, FileText, Folder, ChevronLeft, X, Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Yapılandırma
const WORKER_URL = "https://ekolhome.smusa9883x.workers.dev";
const AUTH_TOKEN = "s3nnzywalker_r2_secure_2026";

interface MediaFile {
    id: string;
    name: string;
    folder: string;
    url: string;
    size: string;
    type: 'image' | 'pdf';
}

export default function MediaPanel() {
    const [allFiles, setAllFiles] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPath, setCurrentPath] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchMedia = async () => {
        try {
            setLoading(true);
            const res = await fetch(WORKER_URL, {
                headers: { "Authorization": `Bearer ${AUTH_TOKEN}` }
            });
            if (!res.ok) throw new Error("Worker yanıt vermedi");
            const data = await res.json();
            if (Array.isArray(data)) setAllFiles(data);
        } catch (error) {
            console.error("Medya yükleme hatası:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMedia(); }, []);

    const { currentFolders, currentItems } = useMemo(() => {
        if (searchQuery) {
            return {
                currentFolders: [] as string[],
                currentItems: allFiles.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
            };
        }
        const folders = new Set<string>();
        const items: MediaFile[] = [];
        allFiles.forEach(file => {
            const folderName = file.folder || "";
            if (currentPath === "") {
                if (folderName === "" || folderName === "Ana Dizin") items.push(file);
                else folders.add(folderName.split("/")[0]);
            } else {
                if (folderName === currentPath) items.push(file);
                else if (folderName.startsWith(currentPath + "/")) {
                    const relative = folderName.replace(currentPath + "/", "");
                    folders.add(currentPath + "/" + relative.split("/")[0]);
                }
            }
        });
        return { currentFolders: Array.from(folders), currentItems: items };
    }, [allFiles, currentPath, searchQuery]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("file", file);
            formData.append("path", currentPath);
            const res = await fetch(WORKER_URL, {
                method: "POST",
                headers: { "Authorization": `Bearer ${AUTH_TOKEN}` },
                body: formData
            });
            if (res.ok) {
                await fetchMedia();
            } else {
                const err = await res.json();
                alert("Hata: " + (err.error || "Yüklenemedi"));
            }
        } catch (error) {
            alert("Worker bağlantı hatası!");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Kalıcı olarak silinsin mi?")) return;
        try {
            const res = await fetch(`${WORKER_URL}?id=${encodeURIComponent(id)}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${AUTH_TOKEN}` }
            });
            if (res.ok) fetchMedia();
        } catch (error) {
            console.error("Silme hatası:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#050505] text-white flex flex-col font-sans tracking-tight overflow-hidden select-none">
            {/* HEADER - Mobil Uyumlu */}
            <header className="z-50 bg-black/80 backdrop-blur-2xl border-b border-white/5 px-4 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    {currentPath !== "" && (
                        <button onClick={() => {
                            const parts = currentPath.split("/");
                            parts.pop();
                            setCurrentPath(parts.join("/"));
                        }} className="p-1.5 hover:bg-white/10 rounded-full shrink-0">
                            <ChevronLeft size={20} className="text-amber-500" />
                        </button>
                    )}
                    <h2 className="text-xs md:text-sm font-bold truncate uppercase flex items-center gap-2">
                        <ImageIcon className="text-amber-500 shrink-0" size={16} />
                        <span className="truncate">{currentPath === "" ? "KÜTÜPHANE" : currentPath.split("/").pop()}</span>
                    </h2>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-4">
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="bg-amber-500 text-black px-3 py-1.5 rounded-full text-[10px] font-black hover:bg-amber-400 disabled:opacity-50 transition-all flex items-center gap-1.5"
                    >
                        {uploading ? <RefreshCw className="animate-spin" size={12} /> : <Upload size={12} />}
                        <span>{uploading ? "..." : "YÜKLE"}</span>
                    </button>
                </div>
            </header>

            {/* ARAMA */}
            <div className="px-4 py-2 bg-black/40 border-b border-white/5">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <input
                        type="text"
                        placeholder="DOSYA ARA..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[10px] focus:outline-none focus:border-amber-500/50 uppercase"
                    />
                </div>
            </div>

            {/* İÇERİK - 2 Sütun Mobil, 8 Sütun PC */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full opacity-30">
                        <RefreshCw className="animate-spin text-amber-500 mb-2" size={32} />
                        <span className="text-[10px] font-bold">VERİLER ÇEKİLİYOR</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        {currentFolders.map((folder) => (
                            <div
                                key={folder}
                                onClick={() => setCurrentPath(folder)}
                                className="group bg-white/5 border border-white/5 rounded-2xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-amber-500/10 hover:border-amber-500/20 transition-all"
                            >
                                <Folder size={32} className="text-amber-500 mb-2" />
                                <span className="text-[9px] font-bold text-gray-400 truncate w-full px-3 text-center uppercase">{folder.split("/").pop()}</span>
                            </div>
                        ))}

                        {currentItems.map((file) => (
                            <MediaItem
                                key={file.id}
                                file={file}
                                onPreview={() => setSelectedFile(file)}
                                onDelete={() => handleDelete(file.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* TAM EKRAN ÖNİZLEME MODALI */}
            <AnimatePresence>
                {selectedFile && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/fb backdrop-blur-xl flex flex-col"
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50">
                            <span className="text-[10px] font-bold truncate max-w-[200px]">{selectedFile.name}</span>
                            <div className="flex items-center gap-4">
                                <a href={selectedFile.url} download target="_blank" className="p-2 hover:bg-white/10 rounded-full">
                                    <Download size={20} />
                                </a>
                                <button onClick={() => setSelectedFile(null)} className="p-2 bg-white/10 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Image */}
                        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
                            {selectedFile.type === 'pdf' ? (
                                <iframe src={selectedFile.url} className="w-full h-full rounded-lg bg-white" />
                            ) : (
                                <motion.img
                                    initial={{ scale: 0.9, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    src={selectedFile.url}
                                    className="max-w-full max-h-full object-contain rounded shadow-2xl"
                                />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function MediaItem({ file, onPreview, onDelete }: any) {
    const isPdf = file.type === 'pdf';
    return (
        <div
            onClick={onPreview}
            className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden aspect-square cursor-pointer hover:border-amber-500/50 transition-all"
        >
            {isPdf ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-red-500/5">
                    <FileText size={28} className="text-red-500/40 mb-1" />
                    <span className="text-[8px] text-red-500/60 font-bold">PDF</span>
                </div>
            ) : (
                <img src={file.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            )}

            {/* Alt Bilgi Barı */}
            <div className="absolute inset-x-0 bottom-0 bg-black/80 backdrop-blur-md p-2 translate-y-full group-hover:translate-y-0 transition-transform flex items-center justify-between">
                <span className="text-[8px] font-bold truncate flex-1 mr-2 uppercase">{file.name}</span>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="p-1.5 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                >
                    <Trash2 size={10} />
                </button>
            </div>
        </div>
    );
}