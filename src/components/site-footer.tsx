import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer
      id="kontak"
      className="mt-auto border-t border-slate-200 bg-slate-900 text-slate-300"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/bmkg-logo.png"
              alt="Logo PSIMKG"
              width={40}
              height={40}
              className="size-10 rounded-md bg-white object-contain p-0.5"
            />
            <div>
              <p className="font-semibold text-white">PSIMKG</p>
              <p className="text-xs text-slate-400">
                Pusat Standardisasi Instrumen MKG
              </p>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-slate-400">
            Pusat yang mengelola standardisasi serta layanan instrumen
            meteorologi, klimatologi, dan geofisika untuk mendukung penelitian,
            pendidikan, dan operasional.
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-semibold text-white">Tautan</p>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="transition-colors hover:text-amber-400">
                Beranda / Katalog
              </Link>
            </li>
            <li>
              <Link
                href="/admin"
                className="transition-colors hover:text-amber-400"
              >
                Admin
              </Link>
            </li>
            <li>
              <a
                href="https://www.bmkg.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-amber-400"
              >
                Portal Induk BMKG
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-semibold text-white">Kontak Layanan</p>
          <ul className="space-y-3 text-slate-400">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-amber-500" />
              <span>
                Jl. Angkasa I No. 2, Kemayoran, Jakarta Pusat 10610
              </span>
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-amber-500" />
              <span>(021) 4246321</span>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0 text-amber-500" />
              <span>psimkg@bmkg.go.id</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} PSIMKG — Pusat Standardisasi Instrumen
            MKG. Hak cipta dilindungi.
          </p>
          <p>Katalog instrumen — data dapat diperbarui melalui admin.</p>
        </div>
      </div>
    </footer>
  );
}
