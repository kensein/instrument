import type { Equipment, EquipmentCategory } from "@/lib/types";

export type {
  Equipment,
  EquipmentCategory,
  EquipmentSpecs,
  SpecRow,
} from "@/lib/types";

export const categories = [
  "Semua",
  "Meteorologi",
  "Klimatologi",
  "Geofisika",
] as const;

export type CategoryFilter = (typeof categories)[number];

export function filterEquipments(
  list: Equipment[],
  category: CategoryFilter
): Equipment[] {
  if (category === "Semua") return list;
  return list.filter((item) => item.category === category);
}
