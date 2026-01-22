import Image from 'next/image';
import { Download, Eye } from 'lucide-react';

// MANUEL VERİ YAPISI (Sanity yerine)
const KATALOGLAR = [
    {
        title: "2024 Özel Koleksiyon",
        slug: "2024-ozel-koleksiyon",
        // Görselleri public/images/katalog/ içine koyabilirsin
        coverImage: "/images/katalog/kapak-1.jpg", 
        // PDF'leri public/pdf/ içine koyabilirsin
        pdfUrl: "/pdf/ekolhome-2024-koleksiyon.pdf"
    },
    {
        title: "Modern Yaşam Serisi",
        slug: "modern-yasam-serisi",
        coverImage: "/images/katalog/kapak-2.jpg",
        pdfUrl: "/pdf/ekolhome-modern-yasam.pdf"
    }
];

export default function KatalogPage() {
    return (
        <main className="min-h-screen bg-[#F9F9F9] pt-40 pb-20 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Başlık Bölümü */}
                <header className="text-center mb-24">
                    <h2 className="text-[11px] uppercase tracking-[0.5em] text-gray-400 mb-4 font-bold">EkolHome Koleksiyonları</h2>
                    <h1 className="text-5xl md:text-7xl font-extralight tracking-tighter text-black mb-8">
                        Dijital <span className="font-serif italic text-gray-500">Katalog</span>
                    </h1>
                    <div className="w-16 h-[1px] bg-black mx-auto"></div>
                </header>

                {/* Katalog Listesi */}
                <div className="space-y-32">
                    {KATALOGLAR.map((item, index) => (
                        <section 
                            key={item.slug} 
                            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
                        >
                            {/* Katalog Kapağı */}
                            <div className="w-full md:w-1/2 relative group">
                                <div className="relative aspect-[3/4] overflow-hidden shadow-[30px_30px_60px_-15px_rgba(0,0,0,0.3)] bg-white">
                                    <Image
                                        src={item.coverImage}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    {/* Overlay Hover */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                        <a
                                            href={`${item.pdfUrl}#toolbar=0`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-white text-black px-8 py-4 text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-gray-200 transition-all"
                                        >
                                            <Eye size={16} /> Hemen İncele
                                        </a>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-black/10 z-10"></div>
                            </div>

                            {/* Katalog Bilgisi */}
                            <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Sezon 2024/25</span>
                                <h3 className="text-4xl font-light text-black tracking-tight leading-tight">
                                    {item.title} <br />
                                    <span className="text-xl text-gray-400">Tasarım & Uygulama Kataloğu</span>
                                </h3>
                                <p className="text-gray-500 font-light leading-relaxed max-w-md mx-auto md:mx-0">
                                    Zanaatkar dokunuşların ve modern estetiğin bir araya geldiği özel koleksiyonumuzu detaylıca inceleyin.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                                    <a
                                        href={item.pdfUrl}
                                        download
                                        className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold border-b border-black pb-2 hover:text-gray-500 hover:border-gray-500 transition-all"
                                    >
                                        <Download size={14} /> PDF Olarak İndir
                                    </a>
                                </div>
                            </div>
                        </section>
                    ))}
                </div>

                {/* Alt Bilgi */}
                <footer className="mt-40 pt-20 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-400 font-light italic">
                        Basılı katalog talepleriniz için lütfen <a href="/iletisim" className="text-black border-b border-black">merkez ofisimizle</a> iletişime geçiniz.
                    </p>
                </footer>
            </div>
        </main>
    );
}