import Link from "next/link";
import { notFound } from "next/navigation";

import { EquipmentEditor } from "@/components/admin/equipment-editor";
import { Button } from "@/components/ui/button";
import { getEquipmentById } from "@/lib/store";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditEquipmentPage({ params }: Props) {
  const { id } = await params;
  const equipment = await getEquipmentById(id);
  if (!equipment) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Edit Alat — {equipment.name}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Ubah data, spesifikasi, dan foto (maks. 10).
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/equipment/${equipment.id}`} target="_blank">
              Lihat Publik
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/equipment">Kembali</Link>
          </Button>
        </div>
      </div>
      <EquipmentEditor mode="edit" initial={equipment} />
    </div>
  );
}
