/**
 * Standalone Instrument API for production (port 8011).
 * Apache: ProxyPass /instrument/api → http://127.0.0.1:8011/
 *
 * Shares JSON store with the Next.js app under data/store/.
 */
import http from "node:http";
import fsSync from "node:fs";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function loadEnvFile(filePath) {
  try {
    const text = fsSync.readFileSync(filePath, "utf8");
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const i = line.indexOf("=");
      if (i < 1) continue;
      const key = line.slice(0, i).trim();
      let val = line.slice(i + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = val;
    }
  } catch {
    /* optional */
  }
}

loadEnvFile(path.join(ROOT, ".env.api"));
loadEnvFile(path.join(ROOT, ".env"));

const STORE_DIR = path.join(ROOT, "data", "store");
const EQUIPMENT_FILE = path.join(STORE_DIR, "equipment.json");
const BOOKINGS_FILE = path.join(STORE_DIR, "bookings.json");
const UPLOADS_DIR = path.join(ROOT, "public", "uploads", "equipment");

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 8011);
const CORS_ORIGIN = process.env.CORS_ORIGIN || "https://psimkg.bmkg.go.id";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "psimkg-admin";
const ADMIN_COOKIE = "psimkg_admin_session";
const SESSION = `psimkg-session:${ADMIN_PASSWORD}`;

async function ensureStore() {
  await fs.mkdir(STORE_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  try {
    await fs.access(EQUIPMENT_FILE);
  } catch {
    await fs.writeFile(EQUIPMENT_FILE, "[]", "utf8");
  }
  try {
    await fs.access(BOOKINGS_FILE);
  } catch {
    await fs.writeFile(BOOKINGS_FILE, "[]", "utf8");
  }
}

async function readJson(file, fallback) {
  await ensureStore();
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

async function writeJson(file, data) {
  await ensureStore();
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

function send(res, status, data, extraHeaders = {}) {
  const body = typeof data === "string" ? data : JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": CORS_ORIGIN,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    ...extraHeaders,
  });
  res.end(body);
}

function parseCookies(header = "") {
  return Object.fromEntries(
    header
      .split(";")
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => {
        const i = p.indexOf("=");
        return i === -1 ? [p, ""] : [p.slice(0, i), decodeURIComponent(p.slice(i + 1))];
      })
  );
}

function isAdmin(req) {
  const cookies = parseCookies(req.headers.cookie);
  return cookies[ADMIN_COOKIE] === SESSION;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function readJsonBody(req) {
  const buf = await readBody(req);
  if (!buf.length) return {};
  return JSON.parse(buf.toString("utf8"));
}

function parseMultipart(buf, boundary) {
  const parts = [];
  const sep = Buffer.from(`--${boundary}`);
  let start = buf.indexOf(sep) + sep.length;
  while (start < buf.length) {
    if (buf[start] === 45 && buf[start + 1] === 45) break; // --
    if (buf[start] === 13) start += 2; // \r\n
    const next = buf.indexOf(sep, start);
    const slice = buf.subarray(start, next === -1 ? buf.length : next - 2);
    const headerEnd = slice.indexOf("\r\n\r\n");
    if (headerEnd !== -1) {
      const header = slice.subarray(0, headerEnd).toString("utf8");
      const content = slice.subarray(headerEnd + 4);
      const nameMatch = /name="([^"]+)"/.exec(header);
      const fileMatch = /filename="([^"]+)"/.exec(header);
      const typeMatch = /Content-Type:\s*([^\r\n]+)/i.exec(header);
      parts.push({
        name: nameMatch?.[1],
        filename: fileMatch?.[1],
        type: typeMatch?.[1]?.trim(),
        content,
      });
    }
    if (next === -1) break;
    start = next + sep.length;
  }
  return parts;
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "OPTIONS") {
      send(res, 204, "");
      return;
    }

    const url = new URL(req.url || "/", `http://${HOST}:${PORT}`);
    let pathname = url.pathname;
    // Accept both /equipment and /api/equipment
    if (pathname.startsWith("/api/")) pathname = pathname.slice(4);

    if (req.method === "POST" && pathname === "/auth/login") {
      const body = await readJsonBody(req);
      if (body.password !== ADMIN_PASSWORD) {
        send(res, 401, { error: "Password salah" });
        return;
      }
      send(res, 200, { success: true }, {
        "Set-Cookie": `${ADMIN_COOKIE}=${encodeURIComponent(SESSION)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`,
      });
      return;
    }

    if (req.method === "DELETE" && pathname === "/auth/login") {
      send(res, 200, { success: true }, {
        "Set-Cookie": `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
      });
      return;
    }

    if (req.method === "GET" && pathname === "/equipment") {
      send(res, 200, await readJson(EQUIPMENT_FILE, []));
      return;
    }

    if (req.method === "GET" && pathname.startsWith("/equipment/")) {
      const id = pathname.split("/")[2];
      if (pathname.endsWith("/images")) {
        send(res, 404, { error: "Not found" });
        return;
      }
      const list = await readJson(EQUIPMENT_FILE, []);
      const item = list.find((e) => e.id === id);
      if (!item) {
        send(res, 404, { error: "Tidak ditemukan" });
        return;
      }
      send(res, 200, item);
      return;
    }

    if (req.method === "POST" && pathname === "/bookings") {
      const body = await readJsonBody(req);
      const list = await readJson(EQUIPMENT_FILE, []);
      const equipment = list.find((e) => e.id === body.equipmentId);
      if (!equipment) {
        send(res, 404, { error: "Alat tidak ditemukan" });
        return;
      }
      const bookings = await readJson(BOOKINGS_FILE, []);
      const booking = {
        id: `B${Date.now()}`,
        equipmentId: equipment.id,
        equipmentName: equipment.name,
        fullName: String(body.fullName || "").trim(),
        identityNumber: String(body.identityNumber || "").trim(),
        email: String(body.email || "").trim(),
        whatsapp: String(body.whatsapp || "").trim(),
        startDate: String(body.startDate || ""),
        endDate: String(body.endDate || ""),
        quantity: Number(body.quantity),
        purpose: String(body.purpose || "").trim(),
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      bookings.unshift(booking);
      await writeJson(BOOKINGS_FILE, bookings);
      send(res, 201, booking);
      return;
    }

    if (!isAdmin(req)) {
      send(res, 401, { error: "Unauthorized" });
      return;
    }

    if (req.method === "GET" && pathname === "/bookings") {
      const bookings = await readJson(BOOKINGS_FILE, []);
      bookings.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      send(res, 200, bookings);
      return;
    }

    if (req.method === "PATCH" && pathname.startsWith("/bookings/")) {
      const id = pathname.split("/")[2];
      const body = await readJsonBody(req);
      const bookings = await readJson(BOOKINGS_FILE, []);
      const idx = bookings.findIndex((b) => b.id === id);
      if (idx < 0) {
        send(res, 404, { error: "Tidak ditemukan" });
        return;
      }
      bookings[idx] = { ...bookings[idx], status: body.status };
      await writeJson(BOOKINGS_FILE, bookings);
      send(res, 200, bookings[idx]);
      return;
    }

    if (req.method === "POST" && pathname === "/equipment") {
      const body = await readJsonBody(req);
      const list = await readJson(EQUIPMENT_FILE, []);
      const id = String(body.id || "").trim().toUpperCase();
      if (list.some((e) => e.id === id)) {
        send(res, 409, { error: `ID ${id} sudah digunakan` });
        return;
      }
      const equipment = {
        id,
        name: String(body.name || "").trim(),
        category: body.category,
        price: Number(body.price),
        description: String(body.description || "").trim(),
        specs: Array.isArray(body.specs) ? body.specs : [],
        images: [],
      };
      list.push(equipment);
      await writeJson(EQUIPMENT_FILE, list);
      send(res, 201, equipment);
      return;
    }

    if (req.method === "PUT" && pathname.startsWith("/equipment/")) {
      const id = pathname.split("/")[2];
      const body = await readJsonBody(req);
      const list = await readJson(EQUIPMENT_FILE, []);
      const idx = list.findIndex((e) => e.id === id);
      if (idx < 0) {
        send(res, 404, { error: "Tidak ditemukan" });
        return;
      }
      list[idx] = {
        ...list[idx],
        name: String(body.name ?? list[idx].name).trim(),
        category: body.category ?? list[idx].category,
        price: Number(body.price ?? list[idx].price),
        description: String(body.description ?? list[idx].description).trim(),
        specs: Array.isArray(body.specs) ? body.specs : list[idx].specs,
        images: Array.isArray(body.images)
          ? body.images.map(String).slice(0, 10)
          : list[idx].images,
      };
      await writeJson(EQUIPMENT_FILE, list);
      send(res, 200, list[idx]);
      return;
    }

    if (req.method === "DELETE" && pathname.startsWith("/equipment/")) {
      const parts = pathname.split("/").filter(Boolean);
      const id = parts[1];
      if (parts[2] === "images") {
        const body = await readJsonBody(req);
        const list = await readJson(EQUIPMENT_FILE, []);
        const idx = list.findIndex((e) => e.id === id);
        if (idx < 0) {
          send(res, 404, { error: "Tidak ditemukan" });
          return;
        }
        const imagePath = String(body.path || "");
        list[idx].images = (list[idx].images || []).filter((p) => p !== imagePath);
        const abs = path.join(ROOT, "public", imagePath.replace(/^\//, ""));
        try {
          await fs.unlink(abs);
        } catch {
          /* ignore */
        }
        await writeJson(EQUIPMENT_FILE, list);
        send(res, 200, list[idx]);
        return;
      }
      const list = await readJson(EQUIPMENT_FILE, []);
      const next = list.filter((e) => e.id !== id);
      await writeJson(EQUIPMENT_FILE, next);
      try {
        await fs.rm(path.join(UPLOADS_DIR, id), { recursive: true, force: true });
      } catch {
        /* ignore */
      }
      send(res, 200, { success: true });
      return;
    }

    if (req.method === "POST" && pathname.match(/^\/equipment\/[^/]+\/images$/)) {
      const id = pathname.split("/")[2];
      const list = await readJson(EQUIPMENT_FILE, []);
      const idx = list.findIndex((e) => e.id === id);
      if (idx < 0) {
        send(res, 404, { error: "Tidak ditemukan" });
        return;
      }
      if ((list[idx].images || []).length >= 10) {
        send(res, 400, { error: "Maksimal 10 foto per alat" });
        return;
      }
      const ctype = req.headers["content-type"] || "";
      const m = /boundary=(.+)$/i.exec(ctype);
      if (!m) {
        send(res, 400, { error: "Multipart required" });
        return;
      }
      const buf = await readBody(req);
      const parts = parseMultipart(buf, m[1]);
      const file = parts.find((p) => p.name === "file" && p.filename);
      if (!file) {
        send(res, 400, { error: "File tidak valid" });
        return;
      }
      const allowed = ["image/jpeg", "image/png", "image/webp"];
      if (!allowed.includes(file.type)) {
        send(res, 400, { error: "Hanya JPG, PNG, atau WEBP" });
        return;
      }
      const ext =
        file.type === "image/png"
          ? "png"
          : file.type === "image/webp"
            ? "webp"
            : "jpg";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const dir = path.join(UPLOADS_DIR, id);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(path.join(dir, filename), file.content);
      const publicPath = `/uploads/equipment/${id}/${filename}`;
      list[idx].images = [...(list[idx].images || []), publicPath].slice(0, 10);
      await writeJson(EQUIPMENT_FILE, list);
      send(res, 201, list[idx]);
      return;
    }

    send(res, 404, { error: "Not found" });
  } catch (err) {
    console.error(err);
    send(res, 500, { error: "Internal server error" });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Instrument API listening on http://${HOST}:${PORT}`);
});
