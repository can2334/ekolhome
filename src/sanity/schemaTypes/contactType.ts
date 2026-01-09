export const contactType = {
    name: 'contact',
    title: 'İletişim Bilgileri',
    type: 'document',
    fields: [
        { name: 'phone', title: 'Telefon No', type: 'string' },
        { name: 'email', title: 'E-posta Adresi', type: 'email' },
        { name: 'address', title: 'Adres', type: 'text' },
        {
            name: 'mapUrl',
            title: 'Google Maps Embed Linki',
            type: 'url',
            description: 'Google Haritalar -> Paylaş -> Harita Yerleştir kısmındaki iframe içindeki src linkini buraya yapıştırın.'
        },
    ],
}