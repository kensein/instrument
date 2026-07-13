import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <Image
            src="/brand/bmkg-logo.png"
            alt="Logo PSIMKG"
            width={40}
            height={40}
            className="size-10 object-contain"
            priority
          />
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-wide text-slate-900 sm:text-base">
              PSIMKG
            </span>
            <span className="hidden text-xs text-slate-500 sm:block">
              Pusat Standardisasi Instrumen MKG
            </span>
          </span>
        </Link>
      </div>
    </header>
  );
}
