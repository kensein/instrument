"use client";

import { useMemo, useState } from "react";
import { CloudSun, Mountain, Thermometer, Layers } from "lucide-react";

import { EquipmentCard } from "@/components/equipment-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { categories, type CategoryFilter } from "@/data/equipment";
import type { Equipment } from "@/lib/types";

export function EquipmentCatalog({ equipments }: { equipments: Equipment[] }) {
  const [category, setCategory] = useState<CategoryFilter>("Semua");

  const counts = useMemo(() => {
    return {
      total: equipments.length,
      Meteorologi: equipments.filter((e) => e.category === "Meteorologi").length,
      Klimatologi: equipments.filter((e) => e.category === "Klimatologi").length,
      Geofisika: equipments.filter((e) => e.category === "Geofisika").length,
    };
  }, [equipments]);

  const filtered = useMemo(() => {
    if (category === "Semua") return equipments;
    return equipments.filter((item) => item.category === category);
  }, [category, equipments]);

  const stats = [
    {
      key: "Semua" as const,
      label: "Total Alat",
      value: counts.total,
      icon: Layers,
      tone: "border-slate-200 bg-white text-slate-900",
      iconTone: "bg-slate-900 text-amber-400",
    },
    {
      key: "Meteorologi" as const,
      label: "Meteorologi",
      value: counts.Meteorologi,
      icon: CloudSun,
      tone: "border-sky-200 bg-sky-50/80 text-sky-950",
      iconTone: "bg-sky-600 text-white",
    },
    {
      key: "Klimatologi" as const,
      label: "Klimatologi",
      value: counts.Klimatologi,
      icon: Thermometer,
      tone: "border-emerald-200 bg-emerald-50/80 text-emerald-950",
      iconTone: "bg-emerald-600 text-white",
    },
    {
      key: "Geofisika" as const,
      label: "Geofisika",
      value: counts.Geofisika,
      icon: Mountain,
      tone: "border-violet-200 bg-violet-50/80 text-violet-950",
      iconTone: "bg-violet-600 text-white",
    },
  ];

  return (
    <section id="katalog" className="scroll-mt-20">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Ringkasan Katalog
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Jumlah instrumen tersedia berdasarkan bidang keilmuan.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setCategory(item.key)}
              className={`rounded-xl border p-4 text-left shadow-sm transition-shadow hover:shadow-md ${item.tone} ${
                category === item.key ? "ring-2 ring-amber-400 ring-offset-2" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium tracking-wide uppercase opacity-70">
                    {item.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold tabular-nums">
                    {item.value}
                  </p>
                </div>
                <span
                  className={`flex size-10 items-center justify-center rounded-lg ${item.iconTone}`}
                >
                  <item.icon className="size-5" aria-hidden />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Daftar Peralatan
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Filter berdasarkan bidang keilmuan. Menampilkan {filtered.length}{" "}
            dari {equipments.length} alat.
          </p>
        </div>
      </div>

      <Tabs
        value={category}
        onValueChange={(value) => setCategory(value as CategoryFilter)}
        className="gap-6"
      >
        <TabsList
          variant="line"
          className="h-auto w-full flex-wrap justify-start gap-1 rounded-none border-b border-slate-200 bg-transparent p-0"
        >
          {categories.map((item) => (
            <TabsTrigger
              key={item}
              value={item}
              className="rounded-none border-b-2 border-transparent px-4 py-2.5 text-slate-600 data-[state=active]:border-amber-500 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
            >
              {item}
              <span className="ml-1.5 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                {item === "Semua"
                  ? counts.total
                  : counts[item as keyof typeof counts]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((item) => (
          <TabsContent key={item} value={item} className="mt-0">
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {(item === "Semua"
                ? equipments
                : equipments.filter((eq) => eq.category === item)
              ).map((equipment) => (
                <EquipmentCard key={equipment.id} equipment={equipment} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
