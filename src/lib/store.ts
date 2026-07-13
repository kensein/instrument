import { promises as fs } from "fs";
import path from "path";

import { seedEquipments } from "@/data/equipment-seed";
import type { Booking, Equipment } from "@/lib/types";
import { normalizeEquipment } from "@/lib/types";

const ROOT = process.cwd();
const STORE_DIR = path.join(ROOT, "data", "store");
const EQUIPMENT_FILE = path.join(STORE_DIR, "equipment.json");
const BOOKINGS_FILE = path.join(STORE_DIR, "bookings.json");
export const UPLOADS_DIR = path.join(ROOT, "public", "uploads", "equipment");

async function ensureStore() {
  await fs.mkdir(STORE_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });

  try {
    await fs.access(EQUIPMENT_FILE);
  } catch {
    await fs.writeFile(
      EQUIPMENT_FILE,
      JSON.stringify(seedEquipments, null, 2),
      "utf8"
    );
  }

  try {
    await fs.access(BOOKINGS_FILE);
  } catch {
    await fs.writeFile(BOOKINGS_FILE, "[]", "utf8");
  }
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  await ensureStore();
  const raw = await fs.readFile(file, "utf8");
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T) {
  await ensureStore();
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

export async function getAllEquipment(): Promise<Equipment[]> {
  const list = await readJson<Equipment[]>(EQUIPMENT_FILE, []);
  const normalized = list.map(normalizeEquipment);
  const needsMigrate =
    JSON.stringify(list) !== JSON.stringify(normalized);
  if (needsMigrate && list.length > 0) {
    await writeJson(EQUIPMENT_FILE, normalized);
  }
  return normalized;
}

export async function getEquipmentById(
  id: string
): Promise<Equipment | undefined> {
  const list = await getAllEquipment();
  return list.find((item) => item.id === id);
}

export async function saveAllEquipment(list: Equipment[]) {
  await writeJson(EQUIPMENT_FILE, list);
}

export async function upsertEquipment(equipment: Equipment) {
  const list = await getAllEquipment();
  const index = list.findIndex((item) => item.id === equipment.id);
  if (index >= 0) {
    list[index] = equipment;
  } else {
    list.push(equipment);
  }
  await saveAllEquipment(list);
  return equipment;
}

export async function deleteEquipment(id: string) {
  const list = await getAllEquipment();
  const next = list.filter((item) => item.id !== id);
  await saveAllEquipment(next);

  const dir = path.join(UPLOADS_DIR, id);
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch {
    // ignore missing folder
  }

  return next.length < list.length;
}

export async function getAllBookings(): Promise<Booking[]> {
  const list = await readJson<Booking[]>(BOOKINGS_FILE, []);
  return list.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createBooking(
  input: Omit<Booking, "id" | "status" | "createdAt">
) {
  const list = await getAllBookings();
  const booking: Booking = {
    ...input,
    id: `B${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  list.unshift(booking);
  await writeJson(BOOKINGS_FILE, list);
  return booking;
}

export async function updateBookingStatus(
  id: string,
  status: Booking["status"]
) {
  const list = await getAllBookings();
  const index = list.findIndex((item) => item.id === id);
  if (index < 0) return null;
  list[index] = { ...list[index], status };
  await writeJson(BOOKINGS_FILE, list);
  return list[index];
}

export function equipmentUploadDir(equipmentId: string) {
  return path.join(UPLOADS_DIR, equipmentId);
}

export function toPublicImagePath(equipmentId: string, filename: string) {
  return `/uploads/equipment/${equipmentId}/${filename}`;
}

export function publicPathToAbsolute(publicPath: string) {
  return path.join(ROOT, "public", publicPath.replace(/^\//, ""));
}
