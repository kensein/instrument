export type EquipmentCategory = "Meteorologi" | "Klimatologi" | "Geofisika";

export type SpecRow = {
  label: string;
  value: string;
};

/** Dynamic specification rows (admin can add/remove freely). */
export type EquipmentSpecs = SpecRow[];

export type Equipment = {
  id: string;
  category: EquipmentCategory;
  name: string;
  price: number;
  description: string;
  specs: EquipmentSpecs;
  images: string[];
};

export type BookingStatus =
  | "pending"
  | "on_process"
  | "selesai"
  | "cancel";

export type Booking = {
  id: string;
  equipmentId: string;
  equipmentName: string;
  fullName: string;
  identityNumber: string;
  email: string;
  whatsapp: string;
  startDate: string;
  endDate: string;
  quantity: number;
  purpose: string;
  status: BookingStatus;
  createdAt: string;
};

export const BOOKING_STATUSES: {
  value: BookingStatus;
  label: string;
}[] = [
  { value: "pending", label: "Pending" },
  { value: "on_process", label: "On Process" },
  { value: "selesai", label: "Selesai" },
  { value: "cancel", label: "Cancel" },
];

export const MAX_EQUIPMENT_IMAGES = 10;

const LEGACY_SPEC_LABELS: Record<string, string> = {
  accuracy: "Akurasi / Presisi",
  powerSupply: "Sumber Daya",
  dimensions: "Dimensi",
  weight: "Berat",
  operatingTemp: "Suhu Operasi",
  dataOutput: "Output Data",
  additional: "Keterangan Tambahan",
};

export function normalizeSpecs(specs: unknown): SpecRow[] {
  if (Array.isArray(specs)) {
    return specs
      .map((row) => ({
        label: String((row as SpecRow)?.label ?? "").trim(),
        value: String((row as SpecRow)?.value ?? "").trim(),
      }))
      .filter((row) => row.label || row.value);
  }

  if (specs && typeof specs === "object") {
    return Object.entries(specs as Record<string, string>)
      .filter(([, value]) => value != null && String(value).trim() !== "")
      .map(([key, value]) => ({
        label: LEGACY_SPEC_LABELS[key] || key,
        value: String(value),
      }));
  }

  return [];
}

export function normalizeEquipment(raw: Equipment): Equipment {
  return {
    ...raw,
    images: Array.isArray(raw.images) ? raw.images.map(String) : [],
    specs: normalizeSpecs(raw.specs),
  };
}
