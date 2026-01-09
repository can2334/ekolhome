import { defineType } from 'sanity'

export const serviceType = defineType({
    name: 'service',
    title: 'Hizmetlerimiz',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Hizmet Başlığı',
            type: 'string',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'slug',
            title: 'URL Uzantısı (Slug)',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'image',
            title: 'Hizmet Görseli',
            type: 'image',
            options: {
                hotspot: true, // Senin kodundaki object-cover'ın nereye odaklanacağını seçmeni sağlar
            },
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'desc',
            title: 'Kısa Açıklama',
            type: 'text',
            rows: 3,
            validation: (Rule) => Rule.max(200).warning('Kısa açıklama çok uzun olmamalı.'),
        },
        {
            name: 'order',
            title: 'Sıralama No',
            type: 'number',
            description: 'Sayfadaki diziliş sırası (1, 2, 3...)',
        },
        {
            name: 'content',
            title: 'Hizmet Detay İçeriği',
            type: 'array',
            of: [
                { type: 'block' }, // Normal yazı, başlıklar (H1, H2), listeler için
                { type: 'image' }  // Yazının içine resim eklemek istersen
            ]
        }
    ],
})