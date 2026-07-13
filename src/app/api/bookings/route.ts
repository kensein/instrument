import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { createBooking, getAllBookings, getEquipmentById } from "@/lib/store";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const list = await getAllBookings();
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  const body = await request.json();
  const equipmentId = String(body.equipmentId || "");
  const equipment = await getEquipmentById(equipmentId);
  if (!equipment) {
    return NextResponse.json({ error: "Alat tidak ditemukan" }, { status: 404 });
  }

  const fullName = String(body.fullName || "").trim();
  const identityNumber = String(body.identityNumber || "").trim();
  const email = String(body.email || "").trim();
  const whatsapp = String(body.whatsapp || "").trim();
  const startDate = String(body.startDate || "");
  const endDate = String(body.endDate || "");
  const quantity = Number(body.quantity);
  const purpose = String(body.purpose || "").trim();

  if (
    fullName.length < 3 ||
    identityNumber.length < 8 ||
    !email.includes("@") ||
    whatsapp.length < 10 ||
    !startDate ||
    !endDate ||
    !Number.isFinite(quantity) ||
    quantity < 1 ||
    purpose.length < 20
  ) {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }

  if (new Date(endDate) < new Date(startDate)) {
    return NextResponse.json(
      { error: "Tanggal selesai harus setelah tanggal mulai" },
      { status: 400 }
    );
  }

  const booking = await createBooking({
    equipmentId: equipment.id,
    equipmentName: equipment.name,
    fullName,
    identityNumber,
    email,
    whatsapp,
    startDate,
    endDate,
    quantity,
    purpose,
  });

  return NextResponse.json(booking, { status: 201 });
}
