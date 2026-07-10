import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.SESSION_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host');
  const isAdminSubdomain = hostname?.startsWith('admin.');

  let targetPathname = url.pathname;
  let isRewriting = false;

  if (isAdminSubdomain && !url.pathname.startsWith('/admin')) {
    targetPathname = `/admin${url.pathname === '/' ? '' : url.pathname}`;
    isRewriting = true;
  }

  const isAccessingAdmin = targetPathname.startsWith('/admin');
  const isPublicAdminRoute = targetPathname === '/admin/login' || targetPathname === '/admin/registro-temporal' || targetPathname === '/login' || targetPathname === '/registro-temporal';

  // Usa `admin_session` si tratas de acceder a /admin, si no, usa `client_session` si hiciéramos protección pública a futuro
  const sessionCookieName = isAccessingAdmin ? "admin_session" : "client_session";

  if (isAccessingAdmin && !isPublicAdminRoute) {
    if (!secretKey) {
      url.pathname = isAdminSubdomain ? '/login' : '/admin/login';
      return NextResponse.redirect(url);
    }

    const sessionCookie = request.cookies.get(sessionCookieName)?.value;

    let redirectToLogin = false;

    if (!sessionCookie) {
      redirectToLogin = true;
    } else {
      try {
        const { payload } = await jwtVerify(sessionCookie, key, { algorithms: ["HS256"] });
        if (payload.role !== "ADMIN") {
          redirectToLogin = true;
        }
      } catch {
        redirectToLogin = true;
      }
    }

    if (redirectToLogin) {
      // Si el cliente usa el subdominio admin., redireccionar a /login será re-escrito a /admin/login internamente
      // Pero mejor redirigir exactamente a /admin/login si es localhost:3000
      url.pathname = isAdminSubdomain ? '/login' : '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  if (isRewriting) {
    url.pathname = targetPathname;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
