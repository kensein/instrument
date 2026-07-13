"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Equipment, EquipmentCategory, SpecRow } from "@/lib/types";
import { MAX_EQUIPMENT_IMAGES, normalizeSpecs } from "@/lib/types";
import { apiUrl, publicAsset } from "@/lib/paths";

const CATEGORIES: EquipmentCategory[] = [
  "Meteorologi",
  "Klimatologi",
  "Geofisika",
];

const defaultSpecRows: SpecRow[] = [
  { label: "Akurasi / Presisi", value: "" },
  { label: "Sumber Daya", value: "" },
  { label: "Dimensi", value: "" },
  { label: "Berat", value: "" },
  { label: "Suhu Operasi", value: "" },
  { label: "Output Data", value: "" },
];

type Props = {
  mode: "create" | "edit";
  initial?: Equipment;
};

export function EquipmentEditor({ mode, initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [id, setId] = useState(initial?.id ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState<EquipmentCategory>(
    initial?.category ?? "Meteorologi"
  );
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [specs, setSpecs] = useState<SpecRow[]>(() => {
    const normalized = normalizeSpecs(initial?.specs);
    return normalized.length > 0 ? normalized : defaultSpecRows;
  });
  const [images, setImages] = useState<string[]>(initial?.images ?? []);

  function updateSpecRow(index: number, field: keyof SpecRow, value: string) {
    setSpecs((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  }

  function addSpecRow() {
    setSpecs((prev) => [...prev, { label: "", value: "" }]);
  }

  function removeSpecRow(index: number) {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      id: id.trim().toUpperCase(),
      name: name.trim(),
      category,
      price: Number(price),
      description: description.trim(),
      specs: specs.filter((row) => row.label.trim() || row.value.trim()),
      images,
    };

    const res =
      mode === "create"
        ? await fetch(apiUrl("/equipment"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch(apiUrl(`/equipment/${initial!.id}`), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Gagal menyimpan");
      return;
    }

    const saved = (await res.json()) as Equipment;
    toast.success(mode === "create" ? "Alat ditambahkan" : "Perubahan disimpan");
    if (mode === "create") {
      router.push(`/admin/equipment/${saved.id}`);
    }
    router.refresh();
  }

  async function onUpload(files: FileList | null) {
    if (!files?.length || mode !== "edit" || !initial) return;
    if (images.length >= MAX_EQUIPMENT_IMAGES) {
      toast.error(`Maksimal ${MAX_EQUIPMENT_IMAGES} foto`);
      return;
    }

    setUploading(true);

    for (const file of Array.from(files)) {
      if (images.length >= MAX_EQUIPMENT_IMAGES) break;
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(apiUrl(`/equipment/${initial.id}/images`), {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || `Gagal upload ${file.name}`);
        continue;
      }
      const updated = (await res.json()) as Equipment;
      setImages(updated.images);
    }

    setUploading(false);
    toast.success("Upload selesai");
    router.refresh();
  }

  async function removeImage(path: string) {
    if (!initial) return;
    const res = await fetch(apiUrl(`/equipment/${initial.id}/images`), {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });
    if (!res.ok) {
      toast.error("Gagal menghapus foto");
      return;
    }
    const updated = (await res.json()) as Equipment;
    setImages(updated.images);
    toast.success("Foto dihapus");
    router.refresh();
  }

  async function reorderImages(next: string[]) {
    if (!initial) return;
    setImages(next);
    const res = await fetch(apiUrl(`/equipment/${initial.id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        category,
        price: Number(price),
        description,
        specs,
        images: next,
      }),
    });
    if (!res.ok) {
      toast.error("Gagal mengubah urutan foto");
      return;
    }
    router.refresh();
  }

  function moveImage(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    const tmp = next[index];
    next[index] = next[target];
    next[target] = tmp;
    void reorderImages(next);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Informasi Alat</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="id">ID Alat</Label>
            <Input
              id="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Contoh: M08"
              disabled={mode === "edit"}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <select
              id="category"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as EquipmentCategory)
              }
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Nama Alat</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Harga sewa / hari (Rp)</Label>
            <Input
              id="price"
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Deskripsi singkat</Label>
            <Textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Spesifikasi Teknis
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Isi parameter sesuai kriteria alat. Tambah atau hapus baris sesuai
              kebutuhan.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={addSpecRow}>
            <Plus />
            Tambah Parameter
          </Button>
        </div>

        <div className="mt-4 space-y-3">
          {specs.map((row, index) => (
            <div
              key={index}
              className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50/60 p-3 sm:grid-cols-[1fr_1.4fr_auto]"
            >
              <div className="space-y-1.5">
                <Label htmlFor={`spec-label-${index}`}>Parameter</Label>
                <Input
                  id={`spec-label-${index}`}
                  value={row.label}
                  placeholder="Contoh: Akurasi"
                  onChange={(e) =>
                    updateSpecRow(index, "label", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`spec-value-${index}`}>
                  Nilai / Keterangan
                </Label>
                <Input
                  id={`spec-value-${index}`}
                  value={row.value}
                  placeholder="Isi sesuai spesifikasi alat"
                  onChange={(e) =>
                    updateSpecRow(index, "value", e.target.value)
                  }
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={() => removeSpecRow(index)}
                  aria-label="Hapus parameter"
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
          {specs.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
              Belum ada parameter. Klik &quot;Tambah Parameter&quot; untuk
              menambah baris.
            </p>
          ) : null}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Foto Alat ({images.length}/{MAX_EQUIPMENT_IMAGES})
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Maksimal 10 foto (JPG/PNG/WEBP). Urutan menentukan slideshow.
            </p>
          </div>
          {mode === "edit" ? (
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800">
              {uploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}
              Upload Foto
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                disabled={uploading || images.length >= MAX_EQUIPMENT_IMAGES}
                onChange={(e) => onUpload(e.target.files)}
              />
            </label>
          ) : (
            <p className="text-xs text-slate-500">
              Simpan alat dulu, lalu upload foto di halaman edit.
            </p>
          )}
        </div>

        {images.length === 0 ? (
          <p className="mt-6 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            Belum ada foto. Placeholder visual akan ditampilkan di katalog.
          </p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((src, index) => (
              <div
                key={src}
                className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={publicAsset(src)}
                  alt={`Foto ${index + 1}`}
                  className="aspect-4/3 w-full object-cover"
                />
                <div className="flex items-center justify-between gap-2 p-2">
                  <span className="text-xs text-slate-500">#{index + 1}</span>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="outline"
                      disabled={index === 0}
                      onClick={() => moveImage(index, -1)}
                    >
                      <ArrowUp />
                    </Button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="outline"
                      disabled={index === images.length - 1}
                      onClick={() => moveImage(index, 1)}
                    >
                      <ArrowDown />
                    </Button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="destructive"
                      onClick={() => removeImage(src)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          disabled={saving}
          className="bg-amber-500 text-slate-900 hover:bg-amber-400"
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin" />
              Menyimpan...
            </>
          ) : mode === "create" ? (
            "Simpan Alat Baru"
          ) : (
            "Simpan Perubahan"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
      </div>
    </form>
  );
}
