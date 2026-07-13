import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-4 py-24 text-center">
      <p className="text-sm font-medium text-amber-600">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">
        Alat tidak ditemukan
      </h1>
      <p className="mt-2 max-w-md text-sm text-slate-600">
        Peralatan yang Anda cari tidak tersedia dalam katalog layanan sewa.
      </p>
      <Button asChild className="mt-6 bg-slate-900 hover:bg-slate-800">
        <Link href="/">Kembali ke Katalog</Link>
      </Button>
    </div>
  );
}
