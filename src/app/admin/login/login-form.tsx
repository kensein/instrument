"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BASE_PATH } from "@/lib/paths";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Hit Next.js (port 3011) — not /instrument/api which Apache proxies to :8011
      const res = await fetch(`${BASE_PATH}/admin/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Password salah. Coba lagi.");
        return;
      }
      router.push(next.startsWith("/") ? next : "/admin");
      router.refresh();
    } catch {
      setError("Gagal menghubungi server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Login Admin</h1>
        <p className="mt-1 text-sm text-slate-600">
          Masuk ke panel admin PSIMKG untuk mengelola katalog instrumen dan
          permohonan sewa.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password admin"
              autoFocus
              required
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Memverifikasi...
              </>
            ) : (
              "Masuk"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
