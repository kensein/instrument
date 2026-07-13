import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { updateBookingStatus } from "@/lib/store";
import type { BookingStatus } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

const STATUSES: BookingStatus[] = [
  "pending",
  "on_process",
  "selesai",
  "cancel",
];

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const status = body.status as BookingStatus;

  if (!STATUSES.includes(status)) {
    return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
  }

  const booking = await updateBookingStatus(id, status);
  if (!booking) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(booking);
}
