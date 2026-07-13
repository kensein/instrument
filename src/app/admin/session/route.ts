import { NextResponse } from "next/server";

import {
  ADMIN_COOKIE,
  createSessionToken,
  verifyPassword,
} from "@/lib/auth-shared";

/** True when the public request is HTTPS (incl. behind Apache). */
function cookieSecure(request: Request) {
  const proto = request.headers.get("x-forwarded-proto");
  if (proto) return proto.split(",")[0]?.trim() === "https";
  try {
    return new URL(request.url).protocol === "https:";
  } catch {
    return process.env.NODE_ENV === "production";
  }
}

export async function POST(request: Request) {
  let password = "";
  try {
    const body = await request.json();
    password = String(body.password || "");
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "Password salah" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: cookieSecure(request),
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

export async function DELETE(request: Request) {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: cookieSecure(request),
    maxAge: 0,
  });
  return response;
}
