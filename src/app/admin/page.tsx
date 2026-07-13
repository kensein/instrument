import Link from "next/link";
import { ClipboardList, Package, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getAllBookings, getAllEquipment } from "@/lib/store";
import { formatRupiah } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [equipment, bookings] = await Promise.all([
    getAllEquipment(),
    getAllBookings(),
  ]);

  const pending = bookings.filter((b) => b.status === "pending").length;
  const onProcess = bookings.filter((b) => b.status === "on_process").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard Admin</h1>
        <p className="mt-1 text-sm text-slate-600">
          Ringkasan katalog alat dan permohonan sewa.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Total Alat
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {equipment.length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Pending
          </p>
          <p className="mt-2 text-3xl font-semibold text-amber-600">{pending}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            On Process
          </p>
          <p className="mt-2 text-3xl font-semibold text-sky-700">{onProcess}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild className="bg-slate-900 hover:bg-slate-800">
          <Link href="/admin/equipment">
            <Package />
            Kelola Alat
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/equipment/new">
            <Plus />
            Tambah Alat
          </Link>
        </Button>
        <Button asChild className="bg-amber-500 text-slate-900 hover:bg-amber-400">
          <Link href="/admin/bookings">
            <ClipboardList />
            Permohonan Sewa
          </Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-3">
          <h2 className="font-medium text-slate-900">Alat terbaru di katalog</h2>
        </div>
        <ul className="divide-y divide-slate-100">
          {equipment.slice(0, 5).map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 px-5 py-3 text-sm"
            >
              <div>
                <p className="font-medium text-slate-900">{item.name}</p>
                <p className="text-slate-500">
                  {item.id} · {item.category} · {formatRupiah(item.price)}/hari
                </p>
              </div>
              <Link
                href={`/admin/equipment/${item.id}`}
                className="text-amber-700 hover:underline"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
