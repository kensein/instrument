"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { apiUrl } from "@/lib/paths";

export function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch(apiUrl("/auth/login"), { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
    >
      <LogOut className="size-3.5" />
      Keluar
    </button>
  );
}
