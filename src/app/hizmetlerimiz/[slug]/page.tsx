import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function HizmetDetayPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;

    const query = `*[_type == "service" && slug.current == $slug][0]{
        title,
        desc,
        image,
        content
    }`;

    const service = await client.fetch(query, { slug });

    if (!service) return <div className="pt-40 text-center">Hizmet bulunamadı.</div>;

    return (
        <main className="min-h-screen bg-white pb-20">
            {/* Üst Kısım: Büyük Hero Görseli */}
            <section className="relative h-[70vh] w-full overflow-hidden bg-gray-100">
                <Image
                    src={urlFor(service.image).url()}
                    alt={service.title}
                    fill
                    priority
                    className="object-cover transition-transform duration-1000 hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20" /> {/* Görselin üzerine hafif bir koyuluk */}

                {/* Geri Dön Butonu */}
                <div className="absolute top-32 left-6 md:left-12 z-10">
                    <Link href="/hizmetlerimiz" className="group flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                        <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md group-hover:bg-white group-hover:text-black transition-all">
                            <ArrowLeft size={18} />
                        </div>
                        <span className="text-xs uppercase tracking-widest font-medium">Tüm Hizmetler</span>
                    </Link>
                </div>

                {/* Başlık Grubu */}
                <div className="absolute bottom-12 left-6 md:left-12">
                    <h1 className="text-5xl md:text-8xl font-extralight tracking-tighter text-white leading-none">
                        {service.title.split(' ')[0]} <br />
                        <span className="font-serif italic text-white/70 ml-12 md:ml-24">
                            {service.title.split(' ').slice(1).join(' ')}
                        </span>
                    </h1>
                </div>
            </section>

            {/* İçerik Kısmı */}
            <section className="max-w-7xl mx-auto px-6 mt-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* Sol Taraf: Özet ve Detaylar */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="space-y-4">
                            <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Hizmet Detayı</span>
                            <p className="text-xl text-black font-light leading-relaxed italic">
                                "{service.desc}"
                            </p>
                        </div>
                        <div className="h-[1px] w-full bg-gray-100" />
                        <div className="grid grid-cols-2 gap-8 text-[10px] uppercase tracking-widest font-bold text-gray-500">
                            <div>
                                <p className="mb-2 text-gray-300 font-medium italic">Kategori</p>
                                <p className="text-black">Özel Üretim</p>
                            </div>
                            <div>
                                <p className="mb-2 text-gray-300 font-medium italic">Teslimat</p>
                                <p className="text-black">15-30 İş Günü</p>
                            </div>
                        </div>
                    </div>

                    {/* Sağ Taraf: Ana Metin */}
                    <div className="lg:col-span-8">
                        <div className="prose prose-lg max-w-none 
                            prose-headings:font-light prose-headings:tracking-tight
                            prose-p:text-gray-500 prose-p:leading-relaxed
                            prose-strong:text-black prose-img:rounded-2xl">
                            {service.content ? (
                                <PortableText value={service.content} />
                            ) : (
                                <p>Detaylı içerik yakında eklenecektir...</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}