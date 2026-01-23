import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getRecursiveFiles(dirPath: string, arrayOfFiles: any[] = [], relativePath: string = "") {
    const files = fs.readdirSync(dirPath);

    files.forEach(function (file) {
        const fullPath = path.join(dirPath, file);
        const relPath = path.join(relativePath, file);

        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getRecursiveFiles(fullPath, arrayOfFiles, relPath);
        } else {
            const stats = fs.statSync(fullPath);
            const ext = path.extname(file).toLowerCase();
            arrayOfFiles.push({
                id: relPath, // Benzersiz ID için yol kullanıyoruz
                name: file,
                url: `/uploads/${relPath.replace(/\\/g, '/')}`,
                size: (stats.size / 1024).toFixed(1) + ' KB',
                date: stats.mtime.toLocaleDateString('tr-TR'),
                type: ext === '.pdf' ? 'pdf' : 'image',
                folder: relativePath || "Ana Dizin" // Klasör ismini belirler
            });
        }
    });

    return arrayOfFiles;
}

export async function GET() {
    try {
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        if (!fs.existsSync(uploadDir)) return NextResponse.json([]);
        const allMedia = getRecursiveFiles(uploadDir);
        return NextResponse.json(allMedia);
    } catch (error) {
        return NextResponse.json({ error: "Hata oluştu" }, { status: 500 });
    }
}