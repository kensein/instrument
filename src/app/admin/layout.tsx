import Image from "next/image";
import Link from "next/link";

import { AdminLogoutButton } from "@/components/admin/logout-button";
import { isAdminAuthenticated } from "@/lib/auth";
import { BASE_PATH } from "@/lib/paths";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/equipment", label: "Kelola Alat" },
  { href: "/admin/bookings", label: "Permohonan Sewa" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAdminAuthenticated();

  return (
    <div className="min-h-screen bg-slate-50">
      {authed ? (
        <header className="border-b border-slate-200 bg-slate-900 text-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Image
                src={`${BASE_PATH}/bmkg-logo.png`}
                alt="Logo PSIMKG"
                width={36}
                height={36}
                className="size-9 rounded-md bg-white object-contain p-0.5"
              />
              <div>
                <p className="text-sm font-semibold">Admin PSIMKG</p>
                <p className="text-xs text-slate-400">
                  Pusat Standardisasi Instrumen MKG
                </p>
              </div>
            </div>
            <nav className="flex flex-wrap items-center gap-1 text-sm">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-1.5 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/"
                className="rounded-md px-3 py-1.5 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
              >
                Lihat Katalog
              </Link>
              <AdminLogoutButton />
            </nav>
          </div>
        </header>
      ) : null}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
