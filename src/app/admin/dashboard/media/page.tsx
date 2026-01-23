"use client";

import { useEffect, useState, useMemo } from "react";
import {
    Image as ImageIcon, Upload, Trash2, Search, ExternalLink,
    Grid, List, X, RefreshCw, FileText, Folder, ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../../Sidebar";

export default function MediaPanel() {
    const [allFiles, setAllFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPath, setCurrentPath] = useState<string>(""); // "" ana dizin demektir
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const fetchMedia = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/media");
            const data = await res.json();
            if (Array.isArray(data)) setAllFiles(data);
        } catch (error) {
            console.error("Medya yükleme hatası:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMedia(); }, []);

    // Mevcut dizindeki klasörleri ve dosyaları ayıkla
    const { currentFolders, currentItems } = useMemo(() => {
        // Eğer arama yapılıyorsa dizin mantığını boşver, her şeyi göster
        if (searchQuery) {
            return {
                currentFolders: [],
                currentItems: allFiles.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
            };
        }

        // Sadece bulunduğumuz klasörün bir alt seviyesini filtrele
        const itemsInPath = allFiles.filter(file => {
            if (currentPath === "") {
                return !file.folder.includes("/"); // Ana dizindekiler
            }
            return file.folder === currentPath || file.folder.startsWith(currentPath + "/");
        });

        // Bu seviyedeki benzersiz klasörleri bul
        const folders = new Set<string>();
        const items: any[] = [];

        allFiles.forEach(file => {
            const folderName = file.folder;

            if (currentPath === "") {
                // Ana dizindeyiz, ilk seviye klasörleri al
                const firstPart = folderName.split("/")[0];
                if (firstPart && firstPart !== "Ana Dizin") folders.add(firstPart);
                if (!folderName || folderName === "Ana Dizin") items.push(file);
            } else if (folderName.startsWith(currentPath + "/")) {
                // Bir klasörün içindeyiz, onun alt klasörlerini al
                const relativePath = folderName.replace(currentPath + "/", "");
                const nextPart = relativePath.split("/")[0];
                if (nextPart) folders.add(currentPath + "/" + nextPart);
            } else if (folderName === currentPath) {
                // Klasörün içindeki direkt dosyalar
                items.push(file);
            }
        });

        return {
            currentFolders: Array.from(folders),
            currentItems: items
        };
    }, [allFiles, currentPath, searchQuery]);

    const goBack = () => {
        const parts = currentPath.split("/");
        parts.pop();
        setCurrentPath(parts.join("/"));
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row font-sans uppercase tracking-tight">
            <Sidebar />
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-2xl border-b border-white/5 shrink-0 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {currentPath !== "" && (
                            <button onClick={goBack} className="p-2 hover:bg-white/10 rounded-full transition-all">
                                <ChevronLeft size={20} className="text-amber-500" />
                            </button>
                        )}
                        <h2 className="text-xl font-light tracking-tighter flex items-center gap-2">
                            <ImageIcon className="text-amber-500" size={20} />
                            {currentPath === "" ? "MEDYA KÜTÜPHANESİ" : currentPath.split("/").pop()}
                        </h2>
                    </div>
                    <button className="bg-amber-500 text-black px-4 py-2 rounded-xl text-[10px] font-bold hover:bg-amber-400 transition-all flex items-center gap-2">
                        <Upload size={16} /> YÜKLE
                    </button>
                </header>

                {/* Toolbar */}
                <div className="p-6 border-b border-white/5 bg-white/[0.01] flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text" placeholder="DOSYA VEYA KLASÖR ARA..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs focus:border-amber-500/50 outline-none transition-all"
                            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                        <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-amber-500 text-black" : "text-gray-500"}`}><Grid size={16} /></button>
                        <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg ${viewMode === "list" ? "bg-amber-500 text-black" : "text-gray-500"}`}><List size={16} /></button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10">
                    {loading ? (
                        <div className="flex items-center justify-center h-64"><RefreshCw className="animate-spin text-amber-500" /></div>
                    ) : (
                        <div className={viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6" : "space-y-2"}>
                            {/* Önce Klasörleri Göster */}
                            {currentFolders.map(folder => (
                                <div
                                    key={folder}
                                    onClick={() => setCurrentPath(folder)}
                                    className="group relative bg-amber-500/5 border border-white/5 rounded-2xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-amber-500/10 hover:border-amber-500/30 transition-all"
                                >
                                    <Folder size={48} className="text-amber-500 mb-2 opacity-80 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-bold text-gray-300 text-center px-2 truncate w-full">
                                        {folder.split("/").pop()}
                                    </span>
                                </div>
                            ))}

                            {/* Sonra Dosyaları Göster */}
                            {currentItems.map((file) => (
                                <MediaItem key={file.id} file={file} viewMode={viewMode} onPreview={() => setSelectedImage(file.url)} />
                            ))}

                            {currentFolders.length === 0 && currentItems.length === 0 && (
                                <div className="col-span-full text-center py-20 text-gray-500 text-xs tracking-widest">
                                    BU KLASÖR BOŞ
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Modal - Preview */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-10"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button className="absolute top-10 right-10 text-white hover:text-amber-500"><X size={32} /></button>
                        <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} src={selectedImage} className="max-w-full max-h-full rounded-2xl border border-white/10" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// MediaItem bileşeni aynı kalabilir (önceki cevaptaki gibi)
function MediaItem({ file, viewMode, onPreview }: any) {
    const isPdf = file.type === 'pdf';
    // ... (Önceki MediaItem kodun buraya gelecek)
    return (
        <motion.div whileHover={{ y: -5 }} className="group relative bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden aspect-square cursor-pointer">
            {isPdf ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-red-500/5">
                    <FileText size={32} className="text-red-500 mb-2" />
                    <span className="text-[8px] text-gray-500 px-2 text-center">{file.name}</span>
                </div>
            ) : (
                <img src={file.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                <p className="text-[9px] font-bold truncate mb-1">{file.name}</p>
                <div className="flex items-center justify-between">
                    <span className="text-[8px] text-gray-400">{file.size}</span>
                    <div className="flex gap-2">
                        {!isPdf && <button onClick={(e) => { e.stopPropagation(); onPreview(); }} className="p-1.5 bg-white/10 rounded-lg hover:bg-amber-500 hover:text-black"><ExternalLink size={12} /></button>}
                        <button className="p-1.5 bg-white/10 rounded-lg hover:bg-red-500"><Trash2 size={12} /></button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}