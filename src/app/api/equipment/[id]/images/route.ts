import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import {
  equipmentUploadDir,
  getEquipmentById,
  publicPathToAbsolute,
  toPublicImagePath,
  upsertEquipment,
} from "@/lib/store";
import { MAX_EQUIPMENT_IMAGES } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const equipment = await getEquipmentById(id);
  if (!equipment) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }

  if (equipment.images.length >= MAX_EQUIPMENT_IMAGES) {
    return NextResponse.json(
      { error: `Maksimal ${MAX_EQUIPMENT_IMAGES} foto per alat` },
      { status: 400 }
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File tidak valid" }, { status: 400 });
  }

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Hanya JPG, PNG, atau WEBP" },
      { status: 400 }
    );
  }

  const remaining = MAX_EQUIPMENT_IMAGES - equipment.images.length;
  if (remaining <= 0) {
    return NextResponse.json(
      { error: `Maksimal ${MAX_EQUIPMENT_IMAGES} foto` },
      { status: 400 }
    );
  }

  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const dir = equipmentUploadDir(id);
  await fs.mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, filename), buffer);

  const publicPath = toPublicImagePath(id, filename);
  equipment.images = [...equipment.images, publicPath].slice(
    0,
    MAX_EQUIPMENT_IMAGES
  );
  await upsertEquipment(equipment);

  return NextResponse.json(equipment, { status: 201 });
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const equipment = await getEquipmentById(id);
  if (!equipment) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }

  const body = await request.json();
  const imagePath = String(body.path || "");
  if (!equipment.images.includes(imagePath)) {
    return NextResponse.json({ error: "Foto tidak ditemukan" }, { status: 404 });
  }

  try {
    await fs.unlink(publicPathToAbsolute(imagePath));
  } catch {
    // file may already be gone
  }

  equipment.images = equipment.images.filter((img) => img !== imagePath);
  await upsertEquipment(equipment);
  return NextResponse.json(equipment);
}
