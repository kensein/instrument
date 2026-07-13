import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { buildEquipmentPayload } from "@/lib/equipment-payload";
import {
  getAllEquipment,
  getEquipmentById,
  upsertEquipment,
} from "@/lib/store";
import type { Equipment, EquipmentCategory } from "@/lib/types";

const CATEGORIES: EquipmentCategory[] = [
  "Meteorologi",
  "Klimatologi",
  "Geofisika",
];

export async function GET() {
  const list = await getAllEquipment();
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const id = String(body.id || "").trim().toUpperCase();
  const payload = buildEquipmentPayload(body);

  if (
    !id ||
    !payload.name ||
    !CATEGORIES.includes(payload.category) ||
    !Number.isFinite(payload.price)
  ) {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }

  const existing = await getEquipmentById(id);
  if (existing) {
    return NextResponse.json(
      { error: `ID ${id} sudah digunakan` },
      { status: 409 }
    );
  }

  const equipment: Equipment = {
    id,
    ...payload,
    images: [],
  };

  await upsertEquipment(equipment);
  return NextResponse.json(equipment, { status: 201 });
}
