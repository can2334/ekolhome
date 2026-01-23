import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const folderName = formData.get("folder") as string || "genel";

        if (!file) return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Klasör yolunu oluştur: public/uploads/hizmetler/slug-adi
        const uploadDir = path.join(process.cwd(), "public/uploads/hizmetler", folderName);

        // Klasör yoksa oluştur (recursive: true sayesinde iç içe klasör açabilir)
        await mkdir(uploadDir, { recursive: true });

        // Dosya ismini temizle ve benzersiz yap
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const filePath = path.join(uploadDir, fileName);

        await writeFile(filePath, buffer);

        // Frontend'in erişeceği URL'i dön (Next.js public klasörünü / kökünden sunar)
        return NextResponse.json({ url: `/uploads/hizmetler/${folderName}/${fileName}` });
    } catch (error) {
        console.error("Yükleme hatası:", error);
        return NextResponse.json({ error: "Dosya yüklenirken bir hata oluştu" }, { status: 500 });
    }
}