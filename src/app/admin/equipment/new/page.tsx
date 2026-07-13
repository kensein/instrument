import Link from "next/link";

import { EquipmentEditor } from "@/components/admin/equipment-editor";
import { Button } from "@/components/ui/button";

export default function NewEquipmentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Tambah Alat</h1>
          <p className="mt-1 text-sm text-slate-600">
            Lengkapi data alat baru untuk katalog sewa.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/equipment">Kembali</Link>
        </Button>
      </div>
      <EquipmentEditor mode="create" />
    </div>
  );
}
