"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, FileText, Download, Image as ImageIcon } from "lucide-react";
// @ts-ignore
import { saveAs } from "file-saver";
import {
    Document as DocxDocument,
    Packer,
    Paragraph,
    Table,
    TableCell,
    TableRow,
    WidthType,
    ImageRun,
    TextRun,
    AlignmentType,
    VerticalAlign,
    ExternalHyperlink,
    BorderStyle
} from "docx";
import {
    Document as PDFDocument,
    Page,
    Text,
    View,
    StyleSheet,
    Image as PDFImage,
    Font,
    pdf,
    Link
} from "@react-pdf/renderer";

// Font Kaydı - Türkçe karakter desteği için önemlidir
Font.register({
    family: 'Roboto',
    fonts: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf' },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' }
    ]
});

const pdfStyles = StyleSheet.create({
    page: { padding: 30, backgroundColor: '#fff', fontSize: 10, fontFamily: 'Roboto' },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, borderBottomWidth: 2, borderBottomColor: '#EAB308', paddingBottom: 10 },
    headerLeft: { flex: 1 },
    logoContainer: { width: 80, height: 80, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 5 },
    logo: { width: 70, height: 70, objectFit: 'contain' },
    yellowHeader: { color: '#EAB308', fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
    firmInfo: { fontSize: 9, marginBottom: 2, fontWeight: 'bold' },
    linkText: { color: '#2563EB', fontSize: 7, textDecoration: 'none', marginBottom: 1 },
    clientSection: { marginTop: 10, marginBottom: 15, padding: 10, backgroundColor: '#F9FAFB', borderLeftWidth: 3, borderLeftColor: '#EAB308' },
    infoLine: { marginBottom: 4, fontSize: 10, fontWeight: 'bold' },
    table: { display: 'table' as any, width: '100%', borderWidth: 1, borderColor: '#000' },
    tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#000', minHeight: 90 },
    tableHeader: { backgroundColor: '#EAB308', minHeight: 30 },
    cell: { padding: 5, borderRightWidth: 1, borderColor: '#000', justifyContent: 'center', alignItems: 'center' },
    colImg: { width: '15%' },
    colDesc: { width: '45%', alignItems: 'flex-start', paddingLeft: 8 },
    colQty: { width: '10%' },
    colPrice: { width: '15%' },
    colTotal: { width: '15%', borderRightWidth: 0 },
    cellHeader: { fontSize: 10, fontWeight: 'bold', color: '#000' },
    cellDesc: { fontSize: 8, textAlign: 'left', lineHeight: 1.3 },
    imageWrapper: { width: 70, height: 70, justifyContent: 'center', alignItems: 'center', padding: 3 },
    image: { width: 64, height: 64, objectFit: 'cover' },
    footer: { marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    warning: { color: '#DC2626', fontWeight: 'bold', fontSize: 9 },
    totalBox: { backgroundColor: '#FEF3C7', borderWidth: 2, borderColor: '#EAB308', padding: 10, minWidth: 150 },
    totalAmount: { color: '#DC2626', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }
});

// PDF Bileşeni
const TeklifPDF = ({ items, clientName, total, topic, date, logo }: any) => {
    const pages = [];
    let itemsCopy = [...items];
    if (itemsCopy.length > 0) {
        pages.push(itemsCopy.splice(0, 5));
        while (itemsCopy.length > 0) {
            pages.push(itemsCopy.splice(0, 6));
        }
    }

    return (
        <PDFDocument>
            {pages.map((pageItems, index) => (
                <Page key={index} size="A4" style={pdfStyles.page}>
                    {index === 0 && (
                        <>
                            <View style={pdfStyles.headerRow}>
                                <View style={pdfStyles.headerLeft}>
                                    <Text style={pdfStyles.yellowHeader}>TEKLİF FORMU</Text>
                                    <Text style={pdfStyles.firmInfo}>FİRMA ADI: EKOL HOME MOBİLYA TEKSTİL TUR. TİC. LTD. ŞTİ.</Text>
                                    <Link style={pdfStyles.linkText} src="mailto:ekolkoltuktasarim@hotmail.com">E-MAİL: ekolkoltuktasarim@hotmail.com</Link>
                                    <Link style={pdfStyles.linkText} src="tel:+905465434242">TEL: +90 546 543 42 42</Link>
                                    <Text style={pdfStyles.linkText}>ADRES: YUKARI PAZARCI MAH. MİMAR SİNAN CAD. NO:5/1 MANAVGAT/ANTALYA</Text>
                                </View>
                                {logo && (
                                    <View style={pdfStyles.logoContainer}>
                                        <PDFImage src={logo} style={pdfStyles.logo} />
                                    </View>
                                )}
                            </View>
                            <View style={pdfStyles.clientSection}>
                                <Text style={pdfStyles.infoLine}>MÜŞTERİ: {(clientName || "").toUpperCase()}</Text>
                                <Text style={pdfStyles.infoLine}>KONU: {(topic || "").toUpperCase()}</Text>
                                <Text style={pdfStyles.infoLine}>TARİH: {new Date(date).toLocaleDateString('tr-TR')}</Text>
                            </View>
                        </>
                    )}

                    <View style={pdfStyles.table}>
                        <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
                            <View style={[pdfStyles.cell, pdfStyles.colImg]}><Text style={pdfStyles.cellHeader}>Ürün</Text></View>
                            <View style={[pdfStyles.cell, pdfStyles.colDesc]}><Text style={pdfStyles.cellHeader}>Açıklama</Text></View>
                            <View style={[pdfStyles.cell, pdfStyles.colQty]}><Text style={pdfStyles.cellHeader}>Miktar</Text></View>
                            <View style={[pdfStyles.cell, pdfStyles.colPrice]}><Text style={pdfStyles.cellHeader}>Fiyat</Text></View>
                            <View style={[pdfStyles.cell, pdfStyles.colTotal]}><Text style={pdfStyles.cellHeader}>Tutar</Text></View>
                        </View>
                        {pageItems.map((item, i) => (
                            <View key={i} style={pdfStyles.tableRow}>
                                <View style={[pdfStyles.cell, pdfStyles.colImg]}>
                                    {item.image && (
                                        <View style={pdfStyles.imageWrapper}>
                                            <PDFImage src={item.image} style={pdfStyles.image} />
                                        </View>
                                    )}
                                </View>
                                <View style={[pdfStyles.cell, pdfStyles.colDesc]}>
                                    <Text style={pdfStyles.cellDesc}>{item.description}</Text>
                                </View>
                                <View style={[pdfStyles.cell, pdfStyles.colQty]}><Text>{item.quantity}</Text></View>
                                <View style={[pdfStyles.cell, pdfStyles.colPrice]}><Text>{(item.unitPrice || 0).toLocaleString('tr-TR')} TL</Text></View>
                                <View style={[pdfStyles.cell, pdfStyles.colTotal]}><Text>{((item.quantity || 0) * (item.unitPrice || 0)).toLocaleString('tr-TR')} TL</Text></View>
                            </View>
                        ))}
                    </View>

                    {index === pages.length - 1 && (
                        <View style={pdfStyles.footer}>
                            <Text style={pdfStyles.warning}>NOT: FİYATLARIMIZA KDV DAHİL DEĞİLDİR!!</Text>
                            <View style={pdfStyles.totalBox}>
                                <Text style={{ fontSize: 8, textAlign: 'center', marginBottom: 5 }}>TOPLAM TUTAR</Text>
                                <Text style={pdfStyles.totalAmount}>{total.toLocaleString('tr-TR')} TL</Text>
                            </View>
                        </View>
                    )}
                </Page>
            ))}
        </PDFDocument>
    );
};

export default function AdminTeklifOlustur() {
    const router = useRouter();
    const [items, setItems] = useState<any[]>([{ id: Date.now(), description: "", quantity: 1, unitPrice: 0, image: null }]);
    const [clientName, setClientName] = useState("");
    const [topic, setTopic] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [logo, setLogo] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // TOKEN KONTROLÜ - Sayfa yüklendiğinde
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("admin_token");

            if (!token) {
                alert("Oturum bulunamadı. Lütfen giriş yapın.");
                router.push("/admin/login");
                return;
            }

            setIsAuthenticated(true);
        };

        checkAuth();
    }, [router]);

    // Varsayılan logoyu yükle
    useEffect(() => {
        if (!isAuthenticated) return;

        const loadDefaultLogo = async () => {
            try {
                const response = await fetch('/logo.png');
                if (response.ok) {
                    const blob = await response.blob();
                    const reader = new FileReader();
                    reader.onloadend = () => setLogo(reader.result as string);
                    reader.readAsDataURL(blob);
                }
            } catch (error) {
                console.log("Logo yüklenemedi, manuel yükleme beklenecek.");
            }
        };
        loadDefaultLogo();
    }, [isAuthenticated]);

    // LOGOUT FONKSİYONU - 401 durumunda kullanılacak
    const handleLogout = () => {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        alert("Oturum süresi doldu. Lütfen tekrar giriş yapın.");
        router.push("/admin/login");
    };

    // GÜVENLİ API İSTEĞİ - 401 kontrolü ile
    const secureApiRequest = async (endpoint: string, options: RequestInit = {}) => {
        const token = localStorage.getItem("admin_token");

        if (!token) {
            handleLogout();
            throw new Error("Token bulunamadı");
        }

        try {
            const response = await fetch(endpoint, {
                ...options,
                headers: {
                    ...options.headers,
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            // 401 Yetkisiz erişim - Otomatik logout
            if (response.status === 401) {
                handleLogout();
                throw new Error("Oturum süresi doldu");
            }

            return response;
        } catch (error) {
            console.error("API isteği hatası:", error);
            throw error;
        }
    };

    const handleLogoChange = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => setLogo(reader.result as string);
        if (file) reader.readAsDataURL(file);
    };

    const addRow = () => setItems([...items, { id: Date.now(), description: "", quantity: 1, unitPrice: 0, image: null }]);
    const removeRow = (id: number) => items.length > 1 && setItems(items.filter(i => i.id !== id));
    const updateItem = (id: number, field: string, value: any) => setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));

    const handleImageChange = (id: number, file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => updateItem(id, "image", reader.result);
        if (file) reader.readAsDataURL(file);
    };

    const toplamTutar = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

    const downloadPDF = async () => {
        const blob = await pdf(<TeklifPDF items={items} clientName={clientName} total={toplamTutar} topic={topic} date={date} logo={logo} />).toBlob();
        saveAs(blob, `Teklif_${clientName || 'Ekol_Home'}.pdf`);
    };

    const exportToWord = async () => {
        const tableRows = items.map(item => new TableRow({
            children: [
                new TableCell({
                    width: { size: 15, type: WidthType.PERCENTAGE },
                    children: item.image ? [new Paragraph({
                        children: [new ImageRun({
                            data: item.image.split(',')[1],
                            transformation: { width: 80, height: 80 },
                            type: 'png'
                        })],
                        alignment: AlignmentType.CENTER
                    })] : [],
                    verticalAlign: VerticalAlign.CENTER
                }),
                new TableCell({
                    width: { size: 45, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({
                        children: [new TextRun({ text: item.description || "", size: 18 })],
                        alignment: AlignmentType.LEFT
                    })],
                    verticalAlign: VerticalAlign.CENTER,
                    margins: { left: 100 }
                }),
                new TableCell({
                    width: { size: 10, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({
                        children: [new TextRun({ text: item.quantity.toString(), size: 20 })],
                        alignment: AlignmentType.CENTER
                    })],
                    verticalAlign: VerticalAlign.CENTER
                }),
                new TableCell({
                    width: { size: 15, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({
                        children: [new TextRun({ text: `${item.unitPrice.toLocaleString('tr-TR')} TL`, size: 20 })],
                        alignment: AlignmentType.CENTER
                    })],
                    verticalAlign: VerticalAlign.CENTER
                }),
                new TableCell({
                    width: { size: 15, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({
                        children: [new TextRun({ text: `${(item.quantity * item.unitPrice).toLocaleString('tr-TR')} TL`, size: 20, bold: true })],
                        alignment: AlignmentType.CENTER
                    })],
                    verticalAlign: VerticalAlign.CENTER
                }),
            ],
        }));

        const doc = new DocxDocument({
            sections: [{
                children: [
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { style: BorderStyle.NONE },
                            bottom: { style: BorderStyle.SINGLE, size: 24, color: "EAB308" },
                            left: { style: BorderStyle.NONE },
                            right: { style: BorderStyle.NONE },
                            insideHorizontal: { style: BorderStyle.NONE },
                            insideVertical: { style: BorderStyle.NONE }
                        },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: { size: 70, type: WidthType.PERCENTAGE },
                                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                                        children: [
                                            new Paragraph({ children: [new TextRun({ text: "TEKLİF FORMU", bold: true, size: 40, color: "EAB308" })] }),
                                            new Paragraph({ children: [new TextRun({ text: "FİRMA ADI: EKOL HOME MOBİLYA TEKSTİL TUR. TİC. LTD. ŞTİ.", bold: true, size: 18 })] }),
                                            new Paragraph({ children: [new ExternalHyperlink({ children: [new TextRun({ text: "E-MAİL: ekolkoltuktasarim@hotmail.com", color: "2563EB", size: 16 })], link: "mailto:ekolkoltuktasarim@hotmail.com" })] }),
                                            new Paragraph({ children: [new ExternalHyperlink({ children: [new TextRun({ text: "TEL: +90 546 543 42 42", color: "2563EB", size: 16 })], link: "tel:+905465434242" })] }),
                                            new Paragraph({ children: [new TextRun({ text: "ADRES: YUKARI PAZARCI MAH. MİMAR SİNAN CAD. NO:5/1 MANAVGAT/ANTALYA", size: 14 })] }),
                                        ]
                                    }),
                                    new TableCell({
                                        width: { size: 30, type: WidthType.PERCENTAGE },
                                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                                        children: logo ? [new Paragraph({
                                            children: [new ImageRun({
                                                data: logo.split(',')[1],
                                                transformation: { width: 90, height: 90 },
                                                type: 'png'
                                            })],
                                            alignment: AlignmentType.CENTER
                                        })] : [],
                                        verticalAlign: VerticalAlign.CENTER
                                    })
                                ]
                            })
                        ]
                    }),
                    new Paragraph({ text: "", spacing: { before: 200 } }),
                    new Paragraph({ children: [new TextRun({ text: `MÜŞTERİ: ${clientName.toUpperCase()}`, bold: true, size: 22 })] }),
                    new Paragraph({ children: [new TextRun({ text: `KONU: ${topic.toUpperCase()}`, size: 20 })] }),
                    new Paragraph({ children: [new TextRun({ text: `TARİH: ${new Date(date).toLocaleDateString('tr-TR')}`, size: 20 })], spacing: { after: 400 } }),
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        rows: [
                            new TableRow({
                                children: ["Ürün", "Açıklama", "Miktar", "Fiyat", "Tutar"].map(h => new TableCell({
                                    shading: { fill: "EAB308" },
                                    children: [new Paragraph({
                                        children: [new TextRun({ text: h, bold: true, color: "000000", size: 20 })],
                                        alignment: AlignmentType.CENTER
                                    })],
                                    verticalAlign: VerticalAlign.CENTER,
                                    margins: { top: 100, bottom: 100 }
                                }))
                            }),
                            ...tableRows
                        ],
                    }),
                    new Paragraph({ text: "", spacing: { before: 400 } }),
                    new Paragraph({ children: [new TextRun({ text: `TOPLAM TUTAR: ${toplamTutar.toLocaleString('tr-TR')} TL`, bold: true, size: 32, color: "DC2626" })], alignment: AlignmentType.RIGHT }),
                    new Paragraph({ children: [new TextRun({ text: "NOT: FİYATLARIMIZA KDV DAHİL DEĞİLDİR!!", bold: true, color: "DC2626", size: 20 })] })
                ],
            }],
        });
        const blob = await Packer.toBlob(doc);
        saveAs(blob, `Teklif_${clientName || 'Ekol_Home'}.docx`);
    };

    // Token yoksa loading göster
    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A] text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EAB308] mx-auto mb-4"></div>
                    <p className="text-sm text-white/40">Yetkilendiriliyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0A0A0A] text-white min-h-screen font-sans">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header / Actions */}
                <div className="flex flex-wrap justify-between items-center bg-[#121212] p-6 rounded-[2rem] border border-white/5 gap-4">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[#EAB308] text-sm font-bold tracking-widest uppercase">Ekol Home Panel</h1>
                        <label className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 text-[10px] cursor-pointer flex items-center gap-2 transition-colors">
                            <ImageIcon size={14} /> {logo ? "LOGO GÜNCELLE" : "LOGO EKLE"}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleLogoChange(e.target.files[0])} />
                        </label>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={exportToWord} className="bg-white/5 hover:bg-white/10 text-[10px] font-bold px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 transition-all active:scale-95">
                            <FileText size={14} /> WORD
                        </button>
                        <button onClick={downloadPDF} className="bg-[#EAB308] hover:bg-white text-black text-[10px] font-bold px-4 py-2 rounded-full flex items-center gap-2 transition-all active:scale-95">
                            <Download size={14} /> PDF
                        </button>
                    </div>
                </div>

                {/* Info Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#121212] p-4 rounded-3xl border border-white/5">
                        <label className="text-[10px] text-white/40 font-bold uppercase block mb-1">Müşteri</label>
                        <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full bg-transparent border-b border-white/10 p-2 outline-none focus:border-[#EAB308] transition-colors" placeholder="Örn: Granada Belek" />
                    </div>
                    <div className="bg-[#121212] p-4 rounded-3xl border border-white/5">
                        <label className="text-[10px] text-white/40 font-bold uppercase block mb-1">Konu</label>
                        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full bg-transparent border-b border-white/10 p-2 outline-none focus:border-[#EAB308] transition-colors" placeholder="Teklif Konusu" />
                    </div>
                    <div className="bg-[#121212] p-4 rounded-3xl border border-white/5">
                        <label className="text-[10px] text-white/40 font-bold uppercase block mb-1">Tarih</label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-transparent border-b border-white/10 p-2 outline-none focus:border-[#EAB308] transition-colors text-white" />
                    </div>
                </div>

                {/* Items Table */}
                <div className="bg-[#121212] rounded-[2rem] border border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-white/5 text-[10px] uppercase text-white/40">
                                <tr>
                                    <th className="p-4 text-left w-32">Görsel</th>
                                    <th className="p-4 text-left">Açıklama</th>
                                    <th className="p-4 w-24">Miktar</th>
                                    <th className="p-4 w-40">Birim Fiyat</th>
                                    <th className="p-4 w-10"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id} className="border-t border-white/5 group">
                                        <td className="p-4">
                                            <div className="w-20 h-20 bg-white/5 rounded-xl flex items-center justify-center overflow-hidden border border-white/10 relative group/img">
                                                {item.image ? (
                                                    <>
                                                        <img src={item.image} className="w-full h-full object-cover" alt="Ürün" />
                                                        <button
                                                            onClick={() => updateItem(item.id, "image", null)}
                                                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                                                        >
                                                            <Trash2 size={16} className="text-red-500" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <label className="cursor-pointer opacity-20 hover:opacity-100 flex flex-col items-center gap-1 transition-opacity">
                                                        <ImageIcon size={20} />
                                                        <span className="text-[8px]">Yükle</span>
                                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageChange(item.id, e.target.files[0])} />
                                                    </label>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <textarea
                                                value={item.description}
                                                onChange={(e) => updateItem(item.id, "description", e.target.value)}
                                                className="w-full bg-white/5 rounded-xl p-3 focus:ring-1 focus:ring-[#EAB308] text-sm resize-none outline-none border border-transparent focus:border-[#EAB308]"
                                                rows={3}
                                                placeholder="Ürün detaylarını buraya yazın..."
                                            />
                                        </td>
                                        <td className="p-4">
                                            <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", Math.max(0, Number(e.target.value)))} className="w-full bg-white/5 rounded-lg p-2 text-center border border-white/5 outline-none focus:border-[#EAB308]" />
                                        </td>
                                        <td className="p-4">
                                            <div className="relative">
                                                <input type="number" min="0" value={item.unitPrice} onChange={(e) => updateItem(item.id, "unitPrice", Math.max(0, Number(e.target.value)))} className="w-full bg-white/5 rounded-lg p-2 pr-8 text-right border border-white/5 outline-none focus:border-[#EAB308]" />
                                                <span className="absolute right-2 top-2 text-[10px] text-white/40">TL</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <button onClick={() => removeRow(item.id)} disabled={items.length === 1} className="text-white/20 hover:text-red-500 transition-colors disabled:opacity-0">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Actions & Total */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-20">
                    <button onClick={addRow} className="group bg-white/5 hover:bg-[#EAB308] hover:text-black px-8 py-4 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2">
                        <Plus size={16} className="transition-transform group-hover:rotate-90" /> Yeni Satır Ekle
                    </button>

                    <div className="bg-[#EAB308] p-6 rounded-[2.5rem] text-black min-w-[320px] shadow-2xl shadow-yellow-500/20">
                        <div className="flex justify-between items-center font-bold">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase opacity-70 leading-none mb-1">Genel Toplam</span>
                                <span className="text-[8px] opacity-60 font-normal italic">KDV Dahil Değildir</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-3xl tracking-tighter leading-none">{toplamTutar.toLocaleString('tr-TR')} TL</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}