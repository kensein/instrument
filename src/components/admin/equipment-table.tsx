"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Equipment } from "@/lib/types";
import { formatRupiah } from "@/lib/format";
import { apiUrl } from "@/lib/paths";

export function AdminEquipmentTable({
  initialData,
}: {
  initialData: Equipment[];
}) {
  const router = useRouter();

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus alat "${name}" (${id})?`)) return;
    const res = await fetch(apiUrl(`/equipment/${id}`), { method: "DELETE" });    if (!res.ok) {
      toast.error("Gagal menghapus alat");
      return;
    }
    toast.success("Alat dihapus");
    router.refresh();
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead>ID</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Harga/hari</TableHead>
            <TableHead>Foto</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialData.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-mono text-xs">{item.id}</TableCell>
              <TableCell className="font-medium text-slate-900">
                {item.name}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{item.category}</Badge>
              </TableCell>
              <TableCell>{formatRupiah(item.price)}</TableCell>
              <TableCell>{item.images.length}/10</TableCell>
              <TableCell className="space-x-2 text-right">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/equipment/${item.id}`}>Edit</Link>
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(item.id, item.name)}
                >
                  Hapus
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {initialData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-slate-500">
                Belum ada alat. Tambahkan alat baru.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  );
}
