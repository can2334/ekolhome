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
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Content-Type": "application/json"
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
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return null;
            }

            const token = authHeader.replace("Bearer ", "").trim();

            try {
                const session = await env.EKOLHOME_DB.prepare(
                    "SELECT user_id FROM sessions WHERE id = ? LIMIT 1"
                ).bind(token).first();

                return session ? session.user_id : null;
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
                        await env.EKOLHOME_DB.prepare(
                            "INSERT INTO sessions (id, user_id) VALUES (?, ?)"
                        ).bind(newToken, user.id).run();
                        console.log("Yeni oturum oluşturuldu");
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

                    return new Response(
                        JSON.stringify({
                            success: true,
                            token: newToken,
                            user: {
                                id: user.id,
                                username: user.username
                            }
                        }),
                        { headers: corsHeaders }
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

            // Auth kontrolü (Login hariç tüm POST/PUT/DELETE işlemleri)
            let currentUserId = null;
            if (["POST", "PUT", "DELETE"].includes(method) && pathname !== "/api/login") {
                currentUserId = await checkAuth(request);
                if (!currentUserId) {
                    return new Response(
                        JSON.stringify({ error: "Yetkisiz Erişim - Geçerli token bulunamadı" }),
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
             * 2. KATALOG YÖNETİCİSİ
             */
            if (method === "GET" && pathname === "/api/catalog") {
                const { results } = await env.EKOLHOME_DB.prepare(
                    "SELECT * FROM catalog ORDER BY id DESC"
                ).all();
                return new Response(JSON.stringify(results || []), { headers: corsHeaders });
            }

            // Catalog Ekleme / Güncelleme
            if (method === "POST" && pathname === "/api/catalog/add") {
                const body = await request.json();
                // Frontend'den gelen season verisini de buraya ekledik
                const { title, pdf_url, season } = body;
                const finalPdfUrl = pdf_url.includes('?') ? pdf_url : `${pdf_url}?v=${Date.now()}`;
                try {
                    // INSERT OR REPLACE veya ON CONFLICT yapısı
                    await env.EKOLHOME_DB.prepare(`
      INSERT INTO catalog (id, title, pdf_url, season) 
      VALUES (1, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET 
        title = excluded.title, 
        pdf_url = excluded.pdf_url,
        season = excluded.season
    `)
                        .bind(title, pdf_url, season || "2025")
                        .run();

                    await logActivity(currentUserId, "UPDATE_CATALOG", clientDetails, null, body);

                    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
                } catch (error) {
                    return new Response(
                        JSON.stringify({ error: "Katalog güncellenemedi: " + error.message }),
                        { status: 500, headers: corsHeaders }
                    );
                }
            }

            // Catalog Güncelleme
            if (method === "POST" && pathname === "/api/catalog/update") {
                const body = await request.json();
                const { id, title, pdf_url } = body;

                const oldData = await env.EKOLHOME_DB.prepare(
                    "SELECT * FROM catalog WHERE id = ?"
                ).bind(id).first();

                await env.EKOLHOME_DB.prepare(
                    "UPDATE catalog SET title = ?, pdf_url = ? WHERE id = ?"
                ).bind(title, pdf_url, id).run();

                await logActivity(currentUserId, "UPDATE_CATALOG", clientDetails, oldData, body);

                return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
            }

            // Catalog Silme
            if (method === "POST" && pathname === "/api/catalog/delete") {
                const { id } = await request.json();

                const oldData = await env.EKOLHOME_DB.prepare(
                    "SELECT * FROM catalog WHERE id = ?"
                ).bind(id).first();

                await env.EKOLHOME_DB.prepare(
                    "DELETE FROM catalog WHERE id = ?"
                ).bind(id).run();

                await logActivity(currentUserId, "DELETE_CATALOG", clientDetails, oldData);

                return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
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

            if (method === "POST" && pathname === "/api/services/delete") {
                const { id } = await request.json();

                const oldData = await env.EKOLHOME_DB.prepare(
                    "SELECT * FROM services WHERE id = ?"
                ).bind(id).first();

                await env.EKOLHOME_DB.prepare(
                    "DELETE FROM services WHERE id = ?"
                ).bind(id).run();

                await logActivity(currentUserId, "DELETE_SERVICE", clientDetails, oldData);

                return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
            }
            // Worker içindeki API Upload kısmı - GÜNCEL VE HATASIZ
            if (method === "POST" && pathname === "/api/upload") {
                try {
                    const formData = await request.formData();
                    const file = formData.get("file");

                    if (!file) {
                        return new Response(JSON.stringify({ error: "Dosya seçilmedi" }), {
                            status: 400,
                            headers: corsHeaders
                        });
                    }

                    // 1. Dosya ismini güvenli ve benzersiz hale getirelim
                    // Boşlukları tire yapar, özel karakterleri temizler ve başına zaman damgası ekler
                    const safeFileName = `${Date.now()}-${file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '')}`;

                    // 2. DOSYAYI R2 KOVASINA GÖNDER (Sihirli dokunuş burası)
                    // env.MY_BUCKET, Cloudflare panelinde yaptığın 'Binding' ismidir.
                    await env.MY_BUCKET.put(safeFileName, file.stream(), {
                        httpMetadata: {
                            contentType: file.type || 'application/octet-stream',
                            // Tarayıcıda direkt açılması yerine indirilmesini istersen aşağıdaki satırı açabilirsin
                            // contentDisposition: `inline; filename="${safeFileName}"`,
                        }
                    });

                    // 3. R2'deki dosyaya erişmek için Public URL oluşturma
                    // ÖNEMLİ: R2 panelinde Settings -> "Public Development URL" kısmındaki linki buraya yapıştır!
                    // Örn: https://pub-6b4ddd94ae6c0bb8dcd10d45d057ad47.r2.dev
                    const publicR2BaseUrl = "https://pub-6b4ddd94ae6c0bb8dcd10d45d057ad47.r2.dev";
                    const fileUrl = `${publicR2BaseUrl}/${safeFileName}`;

                    // 4. Başarılı yanıtı döndür
                    return new Response(JSON.stringify({
                        success: true,
                        filePath: fileUrl, // Frontend artık bu linki alıp veritabanına kaydedecek
                        fileName: safeFileName
                    }), {
                        headers: {
                            ...corsHeaders,
                            "Content-Type": "application/json"
                        }
                    });

                } catch (error) {
                    console.error("R2 Upload Error:", error);
                    return new Response(JSON.stringify({
                        error: "Yükleme başarısız: " + error.message
                    }), {
                        status: 500,
                        headers: corsHeaders
                    });
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