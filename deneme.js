export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const method = request.method;

        // Pathname temizliği
        let pathname = url.pathname;
        if (pathname.endsWith("/") && pathname.length > 1) {
            pathname = pathname.slice(0, -1);
        }

        const corsHeaders = {
            "Access-Control-Allow-Origin": "*", // Tüm dünyadan erişime izin ver
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, Range", // Range iPhone için kritik!
            "Access-Control-Expose-Headers": "Content-Length, Content-Range",
        };

        // CORS Preflight
        if (method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        /**
         * CİHAZ VE KONUM YAKALAMA
         */
        const getClientDetails = (req) => {
            const ua = req.headers.get("user-agent") || "";
            let device = "Desktop";
            if (/mobile/i.test(ua)) device = "Mobile";
            else if (/tablet|ipad/i.test(ua)) device = "Tablet";

            return {
                ip: req.headers.get("cf-connecting-ip") || "0.0.0.0",
                city: req.cf?.city || "Bilinmiyor",
                country: req.cf?.country || "Bilinmiyor",
                device: device,
                ua: ua
            };
        };

        /**
         * GÜVENLİK KONTROLÜ
         */
        const checkAuth = async (req) => {
            const authHeader = req.headers.get("Authorization");
            if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

            const token = authHeader.replace("Bearer ", "").trim();

            try {
                // Sadece süresi geçmemiş (expires_at > şu an) olan oturumu getir
                const now = new Date().toISOString();
                const session = await env.EKOLHOME_DB.prepare(
                    "SELECT user_id FROM sessions WHERE id = ? AND expires_at > ? LIMIT 1"
                ).bind(token, now).first();

                // Eğer session bulunduysa, her işlemde süreyi 30 dk daha uzatmak istersen (Rolling Session):
                if (session) {
                    const newExpiry = new Date(Date.now() + 30 * 60 * 1000).toISOString();
                    await env.EKOLHOME_DB.prepare(
                        "UPDATE sessions SET expires_at = ? WHERE id = ?"
                    ).bind(newExpiry, token).run();

                    return session.user_id;
                }

                return null;
            } catch (e) {
                console.error("Auth hatası:", e.message);
                return null;
            }
        };

        /**
         * LOGLAMA FONKSİYONU
         */
        const logActivity = async (userId, action, details, oldData = null, newData = null) => {
            try {
                await env.EKOLHOME_DB.prepare(`
          INSERT INTO audit_logs (user_id, action, ip_address, city, device_type, user_agent, old_data, new_data)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
                    userId || 0,
                    action,
                    details.ip,
                    details.city,
                    details.device,
                    details.ua,
                    oldData ? JSON.stringify(oldData) : null,
                    newData ? JSON.stringify(newData) : null
                ).run();
            } catch (e) {
                console.error("Log hatası:", e.message);
            }
        };

        /**
         * R2 DOSYA SİLME FONKSİYONU - YENİ EKLENEN
         */
        const deleteFromR2 = async (fileUrl) => {
            if (!fileUrl || typeof fileUrl !== 'string') return;
            try {
                // URL'den sadece dosya adını çeker (Örn: "172...-resim.jpg")
                const urlObj = new URL(fileUrl);
                const fileName = urlObj.pathname.startsWith('/')
                    ? urlObj.pathname.substring(1)
                    : urlObj.pathname;

                await env.MY_BUCKET.delete(fileName);
                console.log("R2'den başarıyla silindi:", fileName);
            } catch (e) {
                console.error("R2 silme hatası (Dosya: " + fileUrl + "):", e.message);
            }
        };

        try {
            const clientDetails = getClientDetails(request);

            /**
             * DEBUG ENDPOINT - İLK SIRA ÖNEMLİ!
             */
            if (method === "GET" && pathname === "/api/debug") {
                try {
                    const checks = {
                        database_connected: !!env.EKOLHOME_DB,
                        timestamp: new Date().toISOString(),
                        tables: {}
                    };

                    if (env.EKOLHOME_DB) {
                        // Users tablosu kontrolü
                        try {
                            const userCount = await env.EKOLHOME_DB.prepare(
                                "SELECT COUNT(*) as count FROM users"
                            ).first();
                            checks.tables.users = { exists: true, count: userCount?.count || 0 };

                            // İlk kullanıcıyı da göster (şifre hariç)
                            const firstUser = await env.EKOLHOME_DB.prepare(
                                "SELECT id, username, created_at FROM users LIMIT 1"
                            ).first();
                            checks.tables.users.sample = firstUser;
                        } catch (e) {
                            checks.tables.users = { exists: false, error: e.message };
                        }

                        // Sessions tablosu kontrolü
                        try {
                            const sessionCount = await env.EKOLHOME_DB.prepare(
                                "SELECT COUNT(*) as count FROM sessions"
                            ).first();
                            checks.tables.sessions = { exists: true, count: sessionCount?.count || 0 };
                        } catch (e) {
                            checks.tables.sessions = { exists: false, error: e.message };
                        }

                        // Audit logs tablosu kontrolü
                        try {
                            const logCount = await env.EKOLHOME_DB.prepare(
                                "SELECT COUNT(*) as count FROM audit_logs"
                            ).first();
                            checks.tables.audit_logs = { exists: true, count: logCount?.count || 0 };
                        } catch (e) {
                            checks.tables.audit_logs = { exists: false, error: e.message };
                        }
                    }

                    return new Response(JSON.stringify(checks, null, 2), {
                        headers: corsHeaders
                    });
                } catch (error) {
                    return new Response(JSON.stringify({
                        error: "Debug hatası",
                        message: error.message,
                        stack: error.stack
                    }), {
                        status: 500,
                        headers: corsHeaders
                    });
                }
            }

            /**
             * 0. LOGIN - TAM DEBUG VERSİYON
             */
            if (pathname === "/api/login") {
                if (method !== "POST") {
                    return new Response(
                        JSON.stringify({
                            error: `Login işlemi için POST metodu gereklidir. Kullandığınız method: ${method}`
                        }),
                        { status: 405, headers: corsHeaders }
                    );
                }

                try {
                    console.log("=== LOGIN İSTEĞİ BAŞLADI ===");

                    // Request body'yi parse et
                    let body;
                    try {
                        body = await request.json();
                        console.log("Body parsed:", { username: body.username, hasPassword: !!body.password });
                    } catch (parseError) {
                        console.error("JSON parse hatası:", parseError.message);
                        return new Response(
                            JSON.stringify({ error: "Geçersiz JSON formatı" }),
                            { status: 400, headers: corsHeaders }
                        );
                    }

                    const { username, password } = body;

                    // Validasyon
                    if (!username || !password) {
                        console.log("Validasyon hatası: eksik bilgi");
                        return new Response(
                            JSON.stringify({ error: "Kullanıcı adı ve şifre gereklidir" }),
                            { status: 400, headers: corsHeaders }
                        );
                    }

                    // Database kontrolü
                    if (!env.EKOLHOME_DB) {
                        console.error("KRITIK: Database bağlantısı yok!");
                        return new Response(
                            JSON.stringify({ error: "Database bağlantısı kurulamadı" }),
                            { status: 500, headers: corsHeaders }
                        );
                    }

                    console.log("Database bağlantısı OK");

                    // Kullanıcı sorgusu
                    let user;
                    try {
                        console.log("Kullanıcı sorgulanıyor:", username);
                        user = await env.EKOLHOME_DB.prepare(
                            "SELECT id, username FROM users WHERE username = ? AND password = ?"
                        ).bind(username, password).first();
                        console.log("Sorgu sonucu:", user ? "Kullanıcı bulundu" : "Kullanıcı bulunamadı");
                    } catch (dbError) {
                        console.error("Database sorgu hatası:", dbError.message, dbError.stack);
                        return new Response(
                            JSON.stringify({
                                error: "Veritabanı hatası",
                                details: dbError.message
                            }),
                            { status: 500, headers: corsHeaders }
                        );
                    }

                    if (!user) {
                        console.log("Login başarısız: hatalı bilgiler");
                        try {
                            await logActivity(null, "LOGIN_FAILED", clientDetails);
                        } catch (logError) {
                            console.error("Log hatası (göz ardı edildi):", logError.message);
                        }

                        return new Response(
                            JSON.stringify({ error: "Hatalı kullanıcı adı veya şifre" }),
                            { status: 401, headers: corsHeaders }
                        );
                    }

                    console.log("Kullanıcı doğrulandı, token oluşturuluyor");

                    // Yeni token oluştur
                    const newToken = crypto.randomUUID();
                    console.log("Token oluşturuldu");

                    // Eski oturumları temizle
                    try {
                        await env.EKOLHOME_DB.prepare(
                            "DELETE FROM sessions WHERE user_id = ?"
                        ).bind(user.id).run();
                        console.log("Eski oturumlar temizlendi");
                    } catch (deleteError) {
                        console.error("Session silme hatası (göz ardı edildi):", deleteError.message);
                    }

                    // Yeni oturum oluştur
                    try {
                        const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // Şu an + 30 dk
                        await env.EKOLHOME_DB.prepare(
                            "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)"
                        ).bind(newToken, user.id, expiresAt).run();
                        console.log("Yeni oturum oluşturuldu, bitiş:", expiresAt);
                    } catch (insertError) {
                        console.error("Session oluşturma hatası:", insertError.message);
                        return new Response(
                            JSON.stringify({
                                error: "Oturum oluşturulamadı",
                                details: insertError.message
                            }),
                            { status: 500, headers: corsHeaders }
                        );
                    }

                    // Login başarılı - log at
                    try {
                        await logActivity(user.id, "LOGIN_SUCCESS", clientDetails);
                        console.log("Login başarılı log kaydedildi");
                    } catch (logError) {
                        console.error("Log hatası (göz ardı edildi):", logError.message);
                    }

                    console.log("=== LOGIN BAŞARILI ===");

                    // 30 dakika (1800 saniye) geçerli olacak cookie
                    const cookieValue = `admin_token=${newToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=1800`;

                    return new Response(
                        JSON.stringify({
                            success: true,
                            token: newToken,
                            user: {
                                id: user.id,
                                username: user.username
                            }
                        }),
                        {
                            headers: {
                                ...corsHeaders,
                                "Content-Type": "application/json",
                                "Set-Cookie": cookieValue
                            }
                        }
                    );

                } catch (error) {
                    console.error("LOGIN GENEL HATASI:", error.message);
                    console.error("Stack:", error.stack);
                    return new Response(
                        JSON.stringify({
                            error: "Login işlemi sırasında beklenmeyen hata",
                            message: error.message,
                            stack: error.stack
                        }),
                        { status: 500, headers: corsHeaders }
                    );
                }
            }

            let currentUserId = null;
            const authHeader = request.headers.get("Authorization");
            const token = authHeader ? authHeader.replace("Bearer ", "").trim() : null;

            // Senaryo A: Eğer bizim özel R2 şifremiz geldiyse kapıyı aç
            if (token === "s3nnzywalker_r2_secure_2026") {
                currentUserId = "r2_admin";
            }
            // Senaryo B: Eğer login olmuş bir kullanıcıysa DB'den kontrol et
            else if (token) {
                currentUserId = await checkAuth(request);
            }

            // Güvenlik Duvarı: Login hariç tüm veri işlemlerinde (POST/PUT/DELETE) yetki yoksa durdur
            if (["POST", "PUT", "DELETE"].includes(method) && pathname !== "/api/login") {
                if (!currentUserId) {
                    return new Response(
                        JSON.stringify({ error: "Yetkisiz Erişim - Lütfen geçerli bir token gönderin." }),
                        { status: 401, headers: corsHeaders }
                    );
                }
            }

            /**
             * 1. İLETİŞİM BİLGİLERİ
             */
            if (method === "GET" && pathname === "/api/contact") {
                const { results } = await env.EKOLHOME_DB.prepare(
                    "SELECT * FROM contact_info"
                ).all();
                return new Response(JSON.stringify(results || []), { headers: corsHeaders });
            }

            if (method === "POST" && pathname === "/api/contact/update") {
                const body = await request.json();
                const { id, address, phone, email, map_url } = body;
                const contactId = id || 1;

                const oldData = await env.EKOLHOME_DB.prepare(
                    "SELECT * FROM contact_info WHERE id = ?"
                ).bind(contactId).first();

                await env.EKOLHOME_DB.prepare(
                    "UPDATE contact_info SET address = ?, phone = ?, email = ?, map_url = ? WHERE id = ?"
                ).bind(address, phone, email, map_url, contactId).run();

                await logActivity(currentUserId, "UPDATE_CONTACT", clientDetails, oldData, body);

                return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
            }

            /**
 * 2. KATALOG YÖNETİCİSİ - EKOL HOME MOBİLYA
 */

            // Katalog Listeleme
            if (method === "GET" && pathname === "/api/catalog") {
                const { results } = await env.EKOLHOME_DB.prepare(
                    "SELECT * FROM catalog ORDER BY id DESC"
                ).all();
                return new Response(JSON.stringify(results || []), { headers: corsHeaders });
            }

            // Katalog Ekleme / Güncelleme (Tek Dosya Üzerinden: EkolHome.pdf)
            if (method === "POST" && pathname === "/api/catalog/add") {
                try {
                    const body = await request.json();
                    // pdf_url gelmiyorsa biz manuel R2 linkini oluşturuyoruz
                    // Örn: https://pub-xxx.r2.dev/EkolHome.pdf
                    const { title, season, pdf_url } = body;

                    // Ekol Home için dosya adını sabitleyebiliriz veya gelen URL'yi kullanabiliriz
                    const finalPdfUrl = pdf_url || `https://assets.ekolhome.com/EkolHome.pdf`;

                    await env.EKOLHOME_DB.prepare(`
            INSERT INTO catalog (id, title, pdf_url, season) 
            VALUES (1, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET 
                title = excluded.title, 
                pdf_url = excluded.pdf_url,
                season = excluded.season
        `)
                        .bind(title || "Ekol Home Güncel Katalog", finalPdfUrl, season || "2026")
                        .run();

                    await logActivity(currentUserId, "UPDATE_CATALOG", clientDetails, null, { title, pdf_url: finalPdfUrl });

                    return new Response(JSON.stringify({ success: true, url: finalPdfUrl }), { headers: corsHeaders });
                } catch (error) {
                    return new Response(
                        JSON.stringify({ error: "Katalog güncellenirken hata oluştu: " + error.message }),
                        { status: 500, headers: corsHeaders }
                    );
                }
            }

            // Katalog Silme (Hem DB hem R2)
            if (method === "POST" && pathname === "/api/catalog/delete") {
                try {
                    const { id } = await request.json();

                    // 1. Önce URL'yi al ki R2'den neyi sileceğimizi bilelim
                    const item = await env.EKOLHOME_DB.prepare(
                        "SELECT pdf_url FROM catalog WHERE id = ?"
                    ).bind(id).first();

                    if (item?.pdf_url) {
                        // R2'den temizleme (Helper fonksiyonunun tanımlı olduğunu varsayıyoruz)
                        // Not: deleteFromR2 fonksiyonun dosya yolunu (key) düzgün ayıklamalı
                        await deleteFromR2(item.pdf_url);
                    }

                    // 2. DB'den sil
                    await env.EKOLHOME_DB.prepare("DELETE FROM catalog WHERE id = ?").bind(id).run();

                    await logActivity(currentUserId, "DELETE_CATALOG", clientDetails, item);

                    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
                } catch (error) {
                    return new Response(
                        JSON.stringify({ error: "Silme işlemi başarısız: " + error.message }),
                        { status: 500, headers: corsHeaders }
                    );
                }
            }

            /**
             * 3. REFERANSLAR
             */
            if (method === "GET" && pathname === "/api/references") {
                const { results } = await env.EKOLHOME_DB.prepare(
                    "SELECT * FROM company_references ORDER BY order_index ASC"
                ).all();
                return new Response(JSON.stringify(results || []), { headers: corsHeaders });
            }

            if (method === "POST" && pathname === "/api/references/save") {
                const body = await request.json();
                const { id, name, logo_url, order_index } = body;

                if (id) {
                    const oldData = await env.EKOLHOME_DB.prepare(
                        "SELECT * FROM company_references WHERE id = ?"
                    ).bind(id).first();

                    await env.EKOLHOME_DB.prepare(
                        "UPDATE company_references SET name = ?, logo_url = ?, order_index = ? WHERE id = ?"
                    ).bind(name, logo_url, order_index || 0, id).run();

                    await logActivity(currentUserId, "UPDATE_REFERENCE", clientDetails, oldData, body);
                } else {
                    await env.EKOLHOME_DB.prepare(
                        "INSERT INTO company_references (name, logo_url, order_index) VALUES (?, ?, ?)"
                    ).bind(name, logo_url, order_index || 0).run();

                    await logActivity(currentUserId, "ADD_REFERENCE", clientDetails, null, body);
                }

                return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
            }

            if (method === "POST" && pathname === "/api/references/delete") {
                const { id } = await request.json();

                const oldData = await env.EKOLHOME_DB.prepare(
                    "SELECT * FROM company_references WHERE id = ?"
                ).bind(id).first();

                await env.EKOLHOME_DB.prepare(
                    "DELETE FROM company_references WHERE id = ?"
                ).bind(id).run();

                await logActivity(currentUserId, "DELETE_REFERENCE", clientDetails, oldData);

                return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
            }

            /**
             * 4. HİZMETLERİMİZ
             */
            if (method === "GET" && pathname === "/api/services") {
                const { results } = await env.EKOLHOME_DB.prepare(
                    "SELECT * FROM services ORDER BY id DESC"
                ).all();
                return new Response(JSON.stringify(results || []), { headers: corsHeaders });
            }

            // Tek bir servisi slug'a göre getir
            if (method === "GET" && pathname.startsWith("/api/services/")) {
                const slug = pathname.replace("/api/services/", "");
                const service = await env.EKOLHOME_DB.prepare(
                    "SELECT * FROM services WHERE slug = ? LIMIT 1"
                ).bind(slug).first();

                if (!service) {
                    return new Response(
                        JSON.stringify({ error: "Servis bulunamadı" }),
                        { status: 404, headers: corsHeaders }
                    );
                }

                return new Response(JSON.stringify(service), { headers: corsHeaders });
            }

            if (method === "POST" && pathname === "/api/services/save") {
                const body = await request.json();
                const { id, title, description, content, cover_image, extra_images, category } = body;
                const slug = body.slug || title.toLowerCase().trim()
                    .replace(/[^\w\sğüşıöçĞÜŞİÖÇ]/g, '')
                    .replace(/\s+/g, '-');

                if (id) {
                    const oldData = await env.EKOLHOME_DB.prepare(
                        "SELECT * FROM services WHERE id = ?"
                    ).bind(id).first();

                    await env.EKOLHOME_DB.prepare(
                        "UPDATE services SET title = ?, slug = ?, description = ?, content = ?, cover_image = ?, extra_images = ?, category = ? WHERE id = ?"
                    ).bind(title, slug, description, content, cover_image, extra_images, category, id).run();

                    await logActivity(currentUserId, "UPDATE_SERVICE", clientDetails, oldData, body);
                } else {
                    await env.EKOLHOME_DB.prepare(
                        "INSERT INTO services (title, slug, description, content, cover_image, extra_images, category) VALUES (?, ?, ?, ?, ?, ?, ?)"
                    ).bind(title, slug, description, content, cover_image, extra_images, category).run();

                    await logActivity(currentUserId, "ADD_SERVICE", clientDetails, null, body);
                }

                return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
            }

            // Service Silme - R2'DEN DE SİL (COVER + EXTRA IMAGES)
            if (method === "POST" && pathname === "/api/services/delete") {
                const { id } = await request.json();

                const service = await env.EKOLHOME_DB.prepare(
                    "SELECT cover_image, extra_images FROM services WHERE id = ?"
                ).bind(id).first();

                if (service) {
                    // 1. Kapak fotoğrafını sil
                    if (service.cover_image) {
                        await deleteFromR2(service.cover_image);
                    }

                    // 2. Ekstra fotoğrafları sil
                    if (service.extra_images) {
                        try {
                            // Eğer DB'de JSON array olarak tutuyorsan:
                            const extraImages = JSON.parse(service.extra_images);
                            if (Array.isArray(extraImages)) {
                                for (const imgUrl of extraImages) {
                                    await deleteFromR2(imgUrl);
                                }
                            }
                        } catch (e) {
                            // Eğer DB'de virgülle ayrılmış string olarak tutuyorsan (senin dediğin yöntem):
                            const extraImages = service.extra_images.split(',');
                            for (const imgUrl of extraImages) {
                                if (imgUrl.trim()) await deleteFromR2(imgUrl.trim());
                            }
                        }
                    }
                }

                // 3. Veritabanından kaydı sil
                await env.EKOLHOME_DB.prepare("DELETE FROM services WHERE id = ?").bind(id).run();

                return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
            }
            if (pathname === "/api/upload" && method === "POST") {
                try {
                    const formData = await request.formData();
                    const file = formData.get("file");

                    if (!file) return new Response(JSON.stringify({ error: "Dosya yok" }), { status: 400, headers: corsHeaders });

                    const safeFileName = `${Date.now()}-${file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '')}`;
                    const arrayBuffer = await file.arrayBuffer();

                    // R2'ye yükle (MY_BUCKET)
                    await env.MY_BUCKET.put(safeFileName, arrayBuffer, {
                        httpMetadata: { contentType: file.type || 'image/jpeg' }
                    });

                    // R2 Public URL oluştur
                    // MY_BUCKET için public domain: https://pub-1f503f0efc3249b0aaf61031d2b041c2.r2.dev
                    const fileUrl = `https://cdn.ekolhome.com/${safeFileName}`;
                    return new Response(JSON.stringify({
                        success: true,
                        filePath: fileUrl
                    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

                } catch (e) {
                    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
                }
            }
            // 404 - Rota Bulunamadı
            return new Response(
                JSON.stringify({
                    error: "Rota Bulunamadı",
                    method: method,
                    path: pathname,
                    availableRoutes: [
                        "GET /api/debug",
                        "POST /api/login",
                        "GET /api/contact",
                        "GET /api/references",
                        "GET /api/services"
                    ]
                }),
                { status: 404, headers: corsHeaders }
            );

        } catch (error) {
            console.error("GENEL SERVER HATASI:", error.message);
            console.error("Stack:", error.stack);
            return new Response(
                JSON.stringify({
                    error: "Sunucu hatası",
                    message: error.message,
                    stack: error.stack
                }),
                { status: 500, headers: corsHeaders }
            );
        }
    }
};