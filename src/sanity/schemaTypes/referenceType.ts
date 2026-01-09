// referenceType.ts
export const referenceType = {
    name: 'clientReference', // Eğer hala hata verirse burayı 'referanslar' yap
    title: 'Referanslar',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Firma/Müşteri Adı',
            type: 'string'
        },
        {
            name: 'slug',
            title: 'URL Uzantısı',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96
            }
        },
        {
            name: 'logo',
            title: 'Logo/Görsel',
            type: 'image'
        },
        {
            name: 'description',
            title: 'Yapılan İş Açıklaması',
            type: 'text'
        },
        {
            name: 'year',
            title: 'Yıl',
            type: 'string'
        }
    ]
}