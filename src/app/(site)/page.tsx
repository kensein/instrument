import { ShieldCheck, ClipboardList, Headphones } from "lucide-react";

import { EquipmentCatalog } from "@/components/equipment-catalog";
import { getAllEquipment } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const equipments = await getAllEquipment();

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-900">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 70% 20%, rgba(245,158,11,0.25), transparent), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(148,163,184,0.2), transparent)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <p className="text-sm font-medium tracking-wide text-amber-400 uppercase">
            Pusat Standardisasi Instrumen MKG
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Instrumen Meteorologi Klimatologi dan Geofisika
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Katalog resmi instrumen PSIMKG untuk standardisasi serta layanan
            peralatan meteorologi, klimatologi, dan geofisika. Mendukung
            kegiatan penelitian, pendidikan, dan operasional dengan proses
            pemesanan yang terverifikasi oleh tim pusat.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#katalog"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-amber-500 px-5 text-sm font-medium text-slate-900 transition-colors hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
            >
              Jelajahi Katalog
            </a>
            <a
              href="#kontak"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-600 bg-transparent px-5 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Hubungi Layanan
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            {
              icon: ShieldCheck,
              title: "Peralatan Terkalibrasi",
              desc: "Unit instrumen mengikuti prosedur standardisasi dan perawatan PSIMKG.",
            },
            {
              icon: ClipboardList,
              title: "Prosedur Formal",
              desc: "Pengajuan sewa tercatat dengan verifikasi identitas dan tujuan penggunaan.",
            },
            {
              icon: Headphones,
              title: "Dukungan Teknis",
              desc: "Konsultasi penggunaan dasar tersedia selama masa layanan sewa.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-amber-600">
                <item.icon className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-medium text-slate-900">{item.title}</p>
                <p className="mt-0.5 text-sm text-slate-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <EquipmentCatalog equipments={equipments} />
        </div>
      </section>
    </>
  );
}
