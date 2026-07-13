import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { buildEquipmentPayload } from "@/lib/equipment-payload";
import {
  deleteEquipment,
  getEquipmentById,
  upsertEquipment,
} from "@/lib/store";
import type { Equipment, EquipmentCategory } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

const CATEGORIES: EquipmentCategory[] = [
  "Meteorologi",
  "Klimatologi",
  "Geofisika",
];

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const equipment = await getEquipmentById(id);
  if (!equipment) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json(equipment);
}

export async function PUT(request: Request, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getEquipmentById(id);
  if (!existing) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }

  const body = await request.json();
  const payload = buildEquipmentPayload({
    ...body,
    name: body.name ?? existing.name,
    category: body.category ?? existing.category,
    price: body.price ?? existing.price,
    description: body.description ?? existing.description,
    specs: body.specs ?? existing.specs,
    existingImages: existing.images,
  });

  if (
    !payload.name ||
    !CATEGORIES.includes(payload.category) ||
    !Number.isFinite(payload.price)
  ) {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }

  const equipment: Equipment = {
    id: existing.id,
    ...payload,
  };

  await upsertEquipment(equipment);
  return NextResponse.json(equipment);
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const ok = await deleteEquipment(id);
  if (!ok) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
