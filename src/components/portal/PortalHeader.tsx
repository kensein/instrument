"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

import LanguageSwitcher from "@/components/portal/LanguageSwitcher";
import NavDropdown from "@/components/portal/NavDropdown";
import TopBar from "@/components/portal/TopBar";
import { navMenus, tentangLink } from "@/config/navigation";
import { useTranslation } from "@/i18n/LanguageContext";
import { BASE_PATH } from "@/lib/paths";

export default function PortalHeader() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMobile = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
      <TopBar />
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 items-center justify-between gap-2 py-3">
            <a
              href="/"
              className="flex min-w-0 shrink-0 items-center gap-3"
              onClick={closeMobile}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${BASE_PATH}/bmkg-logo.png`}
                alt="BMKG"
                className="h-10 w-10 shrink-0 object-contain"
              />
              <div className="hidden min-w-0 leading-tight sm:block">
                <span className="block text-lg font-bold text-bmkg-navy">
                  {t("header.siteName")}
                </span>
                <span className="block max-w-[200px] truncate text-[10px] text-gray-600 lg:text-xs xl:max-w-md">
                  {t("header.tagline")}
                </span>
              </div>
            </a>

            <nav className="hidden flex-wrap items-center justify-end gap-0.5 xl:flex">
              {navMenus.map((menu) => (
                <NavDropdown
                  key={menu.id}
                  menu={menu}
                  forceActive={menu.id === "lainnya"}
                />
              ))}
              <a
                href={tentangLink.href}
                className="whitespace-nowrap rounded px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-bmkg-light hover:text-bmkg-navy"
              >
                {t(tentangLink.labelKey)}
              </a>
              <LanguageSwitcher className="ml-2" />
            </nav>

            <div className="flex shrink-0 items-center gap-2 xl:hidden">
              <LanguageSwitcher />
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-bmkg-navy"
                aria-label={t("header.menu")}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen ? (
          <nav className="max-h-[70vh] overflow-y-auto border-t border-gray-200 bg-white px-4 py-3 xl:hidden">
            {navMenus.map((menu) => (
              <NavDropdown
                key={menu.id}
                menu={menu}
                mobile
                forceActive={menu.id === "lainnya"}
                onNavigate={closeMobile}
              />
            ))}
            <a
              href={tentangLink.href}
              onClick={closeMobile}
              className="mt-2 block rounded px-3 py-2 text-sm font-medium text-gray-700"
            >
              {t(tentangLink.labelKey)}
            </a>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
