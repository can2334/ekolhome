import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';

// Next.js 15+ sürümlerinde params bir Promise'dir
export default async function HizmetDetayPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    // 1. Önce params'ı await ediyoruz
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    // 2. Sorguyu yaparken değişkeni (slug) ikinci parametre olarak objeyle gönderiyoruz
    const query = `*[_type == "service" && slug.current == $slug][0]{
        title,
        desc,
        image,
        content
    }`;

    const service = await client.fetch(query, { slug: slug }); // Buradaki { slug } çok kritik!

    if (!service) {
        return <div className="pt-40 text-center">Hizmet bulunamadı.</div>;
    }

    return (
        <main className="pt-40 px-6 max-w-4xl mx-auto min-h-screen bg-white text-black">
            <h1 className="text-5xl font-light mb-8">{service.title}</h1>

            {/* İçerik Kısmı */}
            <div className="prose prose-lg max-w-none">
                {service.content ? (
                    <PortableText value={service.content} />
                ) : (
                    <p>{service.desc}</p>
                )}
            </div>
        </main>
    );
}