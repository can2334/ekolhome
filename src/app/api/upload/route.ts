import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) return NextResponse.json({ error: "Dosya seçilmedi" }, { status: 400 });

        const buffer = Buffer.from(await file.arrayBuffer());

        // 1. Dosya adını tamamen temizle (Küçük harfe çevir ve Türkçe karakterleri İngilizce yap)
        const safeFileName = file.name
            .toLowerCase() // Hepsini küçük harf yap (Büyük İ sorunu kalmaz)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Aksanları ve Türkçe karakterleri temizle
            .replace(/[^a-z0-9.]/g, "_"); // Harf, rakam ve nokta dışındaki her şeyi alt tire yap

        const filename = `${Date.now()}_${safeFileName}`;

        // 2. Yolu kesinleştir (Garantili root dizin)
        const uploadDir = path.join(process.cwd(), "public", "uploads");

        // 3. Klasör yoksa oluştur
        await mkdir(uploadDir, { recursive: true });

        // 4. Dosyayı fiziksel olarak yaz
        await writeFile(path.join(uploadDir, filename), buffer);

        // 5. URL döndür (Başına / koyarak)
        return NextResponse.json({ filePath: `/uploads/${filename}` });
    } catch (err) {
        console.error("Upload Error:", err);
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}