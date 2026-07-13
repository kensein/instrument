"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateId } from "@/lib/format";
import {
  BOOKING_STATUSES,
  type Booking,
  type BookingStatus,
} from "@/lib/types";
import { apiUrl } from "@/lib/paths";

const statusStyles: Record<BookingStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  on_process: "border-sky-200 bg-sky-50 text-sky-800",
  selesai: "border-emerald-200 bg-emerald-50 text-emerald-800",
  cancel: "border-red-200 bg-red-50 text-red-800",
};

export function BookingsTable({ initialData }: { initialData: Booking[] }) {
  const [rows, setRows] = useState(initialData);

  async function updateStatus(id: string, status: BookingStatus) {
    const res = await fetch(apiUrl(`/bookings/${id}`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      toast.error("Gagal memperbarui status");
      return;
    }
    const updated = (await res.json()) as Booking;
    setRows((prev) => prev.map((row) => (row.id === id ? updated : row)));
    toast.success("Status diperbarui");
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead>Tanggal</TableHead>
            <TableHead>Pemohon</TableHead>
            <TableHead>Alat</TableHead>
            <TableHead>Periode</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="whitespace-nowrap text-xs text-slate-500">
                {formatDateId(new Date(row.createdAt))}
                <div className="font-mono text-[10px]">{row.id}</div>
              </TableCell>
              <TableCell>
                <p className="font-medium text-slate-900">{row.fullName}</p>
                <p className="text-xs text-slate-500">{row.email}</p>
                <p className="text-xs text-slate-500">{row.whatsapp}</p>
                <p className="text-xs text-slate-400">NIK/NIP: {row.identityNumber}</p>
              </TableCell>
              <TableCell>
                <p className="font-medium text-slate-900">{row.equipmentName}</p>
                <p className="font-mono text-xs text-slate-500">
                  {row.equipmentId}
                </p>
                <p className="mt-1 max-w-xs text-xs text-slate-500 line-clamp-2">
                  {row.purpose}
                </p>
              </TableCell>
              <TableCell className="whitespace-nowrap text-xs">
                {formatDateId(new Date(row.startDate))}
                <br />– {formatDateId(new Date(row.endDate))}
              </TableCell>
              <TableCell>{row.quantity}</TableCell>
              <TableCell>
                <div className="space-y-2">
                  <Badge
                    variant="outline"
                    className={statusStyles[row.status]}
                  >
                    {BOOKING_STATUSES.find((s) => s.value === row.status)?.label}
                  </Badge>
                  <select
                    className="block h-8 w-full min-w-36 rounded-md border border-slate-200 bg-white px-2 text-xs"
                    value={row.status}
                    onChange={(e) =>
                      updateStatus(row.id, e.target.value as BookingStatus)
                    }
                  >
                    {BOOKING_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-slate-500">
                Belum ada permohonan sewa.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  );
}
