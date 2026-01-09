export const contactType = {
    name: 'contact',
    title: 'İletişim Bilgileri',
    type: 'document',
    fields: [
        {
            name: 'phones', // İsmini çoğul yaptık
            title: 'Telefon Numaraları',
            type: 'array',
            of: [{ type: 'string' }] // İçinde metin (numara) listesi tutacak
        },
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