import { NextResponse } from "next/server";

import {
  ADMIN_COOKIE,
  createSessionToken,
  verifyPassword,
} from "@/lib/auth-shared";

export async function POST(request: Request) {
  const body = await request.json();
  const password = String(body.password || "");

  if (!verifyPassword(password)) {
    return NextResponse.json(
      { error: "Password salah" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
