import Link from "next/link";
import { Plus } from "lucide-react";

import { AdminEquipmentTable } from "@/components/admin/equipment-table";
import { Button } from "@/components/ui/button";
import { getAllEquipment } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminEquipmentPage() {
  const equipment = await getAllEquipment();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Kelola Alat</h1>
          <p className="mt-1 text-sm text-slate-600">
            Tambah, ubah, atau hapus peralatan di katalog sewa.
          </p>
        </div>
        <Button asChild className="bg-amber-500 text-slate-900 hover:bg-amber-400">
          <Link href="/admin/equipment/new">
            <Plus />
            Tambah Alat
          </Link>
        </Button>
      </div>

      <AdminEquipmentTable initialData={equipment} />
    </div>
  );
}
