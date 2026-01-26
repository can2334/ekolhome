import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

/**
 * Hostinger Business Email SMTP yapılandırması.
 * DNS kayıtların (MX) bağlı olduğu için bu ayarlar doğrudan çalışacaktır.
 */

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, message } = body;

        // SMTP Sunucu Ayarları
        const transporter = nodemailer.createTransport({
            host: "smtp.hostinger.com",
            port: 465,
            secure: true, // Port 465 için SSL/TLS kullanımı zorunludur
            auth: {
                user: "info@ekolhome.com",
                pass: "mtd2515Mtd@" // Paylaştığın şifre eklendi
            },
        } as SMTPTransport.Options);

        // Gönderilecek Mail İçeriği
        const mailOptions = {
            from: `"Ekolhome Web Form" <info@ekolhome.com>`, // Gönderen olarak kendi kurumsal mailin
            to: "info@ekolhome.com", // Mesajın düşeceği kutu
            replyTo: email, // Outlook/Gmail'de "Yanıtla" deyince formu dolduran kişiye gider
            subject: `🏠 Ekolhome İletişim Formu: ${name}`,
            text: `İsim: ${name}\nE-posta: ${email}\n\nMesaj:\n${message}`,
            html: `
                <div style="font-family: sans-serif; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #d9a066; border-bottom: 2px solid #d9a066; padding-bottom: 10px;">Yeni İletişim Mesajı</h2>
                    <p><strong>Gönderen Adı:</strong> ${name}</p>
                    <p><strong>Kullanıcı E-postası:</strong> ${email}</p>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 10px;">
                        <strong>Mesaj:</strong><br/>
                        ${message.replace(/\n/g, '<br/>')}
                    </div>
                    <hr style="border: 0; border-top: 1px solid #eee; margin-top: 20px;" />
                    <small style="color: #888;">Bu mesaj Ekolhome web sitesi üzerinden gönderilmiştir.</small>
                </div>
            `,
        };

        // Maili Gönder
        await transporter.sendMail(mailOptions);

        return NextResponse.json(
            { success: true, message: "Mesaj başarıyla iletildi." },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("SMTP Gönderim Hatası:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Mail sunucusuna bağlanılamadı.",
                error: error.message
            },
            { status: 500 }
        );
    }
}