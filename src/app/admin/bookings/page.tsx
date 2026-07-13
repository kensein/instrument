import { BookingsTable } from "@/components/admin/bookings-table";
import { getAllBookings } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const bookings = await getAllBookings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Historis Permohonan Sewa
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Data dari form publik. Perbarui status menjadi Pending, On Process,
          Selesai, atau Cancel.
        </p>
        <ul className="mt-3 space-y-1 rounded-lg border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 shadow-sm">
          <li>
            <span className="font-semibold text-amber-700">Pending</span> —
            permohonan baru masuk, menunggu ditinjau admin.
          </li>
          <li>
            <span className="font-semibold text-sky-700">On Process</span> —
            sedang diproses / disiapkan.
          </li>
          <li>
            <span className="font-semibold text-emerald-700">Selesai</span> —
            penyewaan selesai.
          </li>
          <li>
            <span className="font-semibold text-red-700">Cancel</span> —
            permohonan dibatalkan.
          </li>
        </ul>
      </div>
      <BookingsTable initialData={bookings} />
    </div>
  );
}
