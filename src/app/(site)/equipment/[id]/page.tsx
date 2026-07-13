import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";

import { BookingForm } from "@/components/booking-form";
import { EquipmentImageSlider } from "@/components/equipment-image-slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getEquipmentById } from "@/lib/store";
import { formatRupiah } from "@/lib/format";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const equipment = await getEquipmentById(id);
  if (!equipment) {
    return { title: "Alat Tidak Ditemukan" };
  }
  return {
    title: `${equipment.name} | PSIMKG`,
    description: equipment.description,
  };
}

const categoryStyles: Record<string, string> = {
  Meteorologi: "border-sky-200 bg-sky-50 text-sky-800",
  Klimatologi: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Geofisika: "border-violet-200 bg-violet-50 text-violet-800",
};

export default async function EquipmentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const equipment = await getEquipmentById(id);

  if (!equipment) {
    notFound();
  }

  const specRows = equipment.specs;

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Button
          asChild
          variant="ghost"
          className="mb-6 -ml-2 text-slate-600 hover:text-slate-900"
        >
          <Link href="/">
            <ArrowLeft data-icon="inline-start" />
            Kembali ke Katalog
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <EquipmentImageSlider
            images={equipment.images}
            equipmentId={equipment.id}
            equipmentName={equipment.name}
          />

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={categoryStyles[equipment.category]}
              >
                {equipment.category}
              </Badge>
              <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 font-mono text-xs text-slate-500">
                ID: {equipment.id}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {equipment.name}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              {equipment.description}
            </p>

            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Tarif sewa harian
              </p>
              <p className="mt-1 text-3xl font-semibold text-slate-900">
                {formatRupiah(equipment.price)}
                <span className="ml-1 text-base font-normal text-slate-500">
                  / hari
                </span>
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                <CalendarDays className="size-4 text-amber-500" />
                Ketersediaan mengikuti jadwal operasional PSIMKG
              </p>
            </div>

            <div className="mt-6">
              <BookingForm equipment={equipment} />
            </div>
          </div>
        </div>

        <Separator className="my-10 bg-slate-200" />

        <section aria-labelledby="specs-heading">
          <h2
            id="specs-heading"
            className="text-xl font-semibold text-slate-900"
          >
            Spesifikasi Teknis
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Parameter teknis indikatif untuk perencanaan penggunaan di lapangan.
          </p>

          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="w-[220px] font-semibold text-slate-700">
                    Parameter
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Nilai / Keterangan
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {specRows.length > 0 ? (
                  specRows.map((row) => (
                    <TableRow key={`${row.label}-${row.value}`}>
                      <TableCell className="align-top font-medium text-slate-800">
                        {row.label}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {row.value}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="py-8 text-center text-slate-500"
                    >
                      Spesifikasi belum diisi.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </div>
  );
}
