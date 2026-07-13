import { NextRequest, NextResponse } from "next/server";

import { ADMIN_COOKIE, createSessionToken } from "@/lib/auth-shared";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/admin/session") ||
    pathname.startsWith("/api/auth/login")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    const expected = createSessionToken();
    if (!token || token !== expected) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (
    pathname.startsWith("/api/equipment") &&
    request.method !== "GET"
  ) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    const expected = createSessionToken();
    if (!token || token !== expected) {
      // Let route handlers also check; allow through for clearer JSON errors
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/equipment/:path*", "/api/bookings/:path*"],
};
