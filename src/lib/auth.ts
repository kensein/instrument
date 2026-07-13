import { cookies } from "next/headers";

import {
  ADMIN_COOKIE,
  createSessionToken,
  verifyPassword,
} from "@/lib/auth-shared";

export {
  ADMIN_COOKIE,
  createSessionToken,
  verifyPassword,
} from "@/lib/auth-shared";

export async function isAdminAuthenticated() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  return token === createSessionToken();
}

export async function requireAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    throw new Error("UNAUTHORIZED");
  }
}
