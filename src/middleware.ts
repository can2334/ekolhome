import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('admin_token');
    const { pathname } = request.nextUrl;

    // Eğer kullanıcı /admin altındaki bir sayfaya gitmeye çalışıyorsa
    if (pathname.startsWith('/admin')) {

        // SADECE giriş sayfasındaysa (src/app/admin/page.tsx) geçmesine izin ver
        if (pathname === '/admin') {
            return NextResponse.next();
        }

        // Eğer başka bir alt sayfaya gidiyorsa ve token yoksa, giriş sayfasına at
        if (!token) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
}