import { defineType, defineField } from 'sanity'

export const katalogType = defineType({
    name: 'katalog',
    title: 'Kataloglar',
    type: 'document',
    fields: [
        defineField({ name: 'title', title: 'Katalog Adı', type: 'string' }),
        defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }),
        defineField({ name: 'coverImage', title: 'Kapak Görseli', type: 'image' }),
        defineField({ name: 'pdfFile', title: 'PDF Dosyası', type: 'file' }),
    ],
})