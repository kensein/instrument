import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CardImageSlideshow } from "@/components/card-image-slideshow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Equipment } from "@/lib/types";
import { formatRupiah } from "@/lib/format";

const categoryStyles: Record<Equipment["category"], string> = {
  Meteorologi: "border-sky-200 bg-sky-50 text-sky-800",
  Klimatologi: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Geofisika: "border-violet-200 bg-violet-50 text-violet-800",
};

type EquipmentCardProps = {
  equipment: Equipment;
};

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden border-slate-200/90 bg-white shadow-sm transition-shadow hover:shadow-md">
      <CardImageSlideshow images={equipment.images} name={equipment.name} />
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-2">
          <Badge
            variant="outline"
            className={categoryStyles[equipment.category]}
          >
            {equipment.category}
          </Badge>
          <span className="font-mono text-xs text-slate-400">{equipment.id}</span>
        </div>
        <div className="space-y-1.5">
          <CardTitle className="text-lg leading-snug text-slate-900">
            {equipment.name}
          </CardTitle>
          <CardDescription className="line-clamp-3 text-slate-600">
            {equipment.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="mt-auto">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Tarif sewa / hari
        </p>
        <p className="mt-1 text-xl font-semibold text-slate-900">
          {formatRupiah(equipment.price)}
        </p>
      </CardContent>
      <CardFooter>
        <Button
          asChild
          className="w-full bg-slate-900 text-white hover:bg-slate-800"
        >
          <Link href={`/equipment/${equipment.id}`}>
            Lihat Detail
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
