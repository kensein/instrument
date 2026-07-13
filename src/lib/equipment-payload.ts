import type { EquipmentCategory, SpecRow } from "@/lib/types";
import { normalizeSpecs } from "@/lib/types";

function parseSpecs(input: unknown): SpecRow[] {
  return normalizeSpecs(input).filter((row) => row.label && row.value);
}

export function buildEquipmentPayload(body: {
  id?: string;
  name?: string;
  category?: EquipmentCategory;
  price?: number;
  description?: string;
  specs?: unknown;
  images?: unknown;
  existingImages?: string[];
}) {
  return {
    name: String(body.name || "").trim(),
    category: body.category as EquipmentCategory,
    price: Number(body.price),
    description: String(body.description || "").trim(),
    specs: parseSpecs(body.specs),
    images: Array.isArray(body.images)
      ? body.images.map(String).slice(0, 10)
      : (body.existingImages ?? []),
  };
}
