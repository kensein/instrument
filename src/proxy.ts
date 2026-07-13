import { NextRequest, NextResponse } from "next/server";

import { ADMIN_COOKIE, createSessionToken } from "@/lib/auth-shared";

/**
 * Per-request CSP with nonce so Next.js inline scripts run even behind the
 * PSIMKG portal / Cloudflare CSP (which injects a nonce and thus makes
 * 'unsafe-inline' ignored). Next reads the nonce from the request CSP header
 * and applies it to every framework/inline script automatically.
 */
function buildCsp(nonce: string, isDev: boolean) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ].join("; ");
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authExempt =
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/admin/session") ||
    pathname.startsWith("/api/auth/login");

  if (!authExempt && pathname.startsWith("/admin")) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!token || token !== createSessionToken()) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCsp(nonce, process.env.NODE_ENV === "development");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("content-security-policy", csp);
  return response;
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|favicon-32.png|favicon-48.png|apple-icon.png|bmkg-logo.png|uploads).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
