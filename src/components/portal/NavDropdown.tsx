"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import type { NavItem, NavMenu } from "@/config/navigation";
import { useTranslation } from "@/i18n/LanguageContext";

interface NavDropdownProps {
  menu: NavMenu;
  onNavigate?: () => void;
  mobile?: boolean;
  /** When true, highlight this menu (Instrument lives under Lainnya). */
  forceActive?: boolean;
}

function NavItemLink({
  item,
  className,
  onClick,
  desktop = false,
  active = false,
}: {
  item: NavItem;
  className: string;
  onClick?: () => void;
  desktop?: boolean;
  active?: boolean;
}) {
  const { t } = useTranslation();
  const labelClass = desktop
    ? `text-sm font-semibold ${active ? "text-bmkg-navy" : "text-bmkg-navy"}`
    : "font-medium";
  const descClass = desktop
    ? "mt-0.5 block text-xs leading-snug text-gray-500"
    : "mt-0.5 block text-xs text-gray-500";

  const inner = (
    <>
      <span className={labelClass}>{item.label}</span>
      {item.descriptionKey ? (
        <span className={descClass}>{t(item.descriptionKey)}</span>
      ) : null}
    </>
  );

  const merged = `${className} ${active ? "bg-bmkg-light" : ""}`;

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={merged}
        onClick={onClick}
      >
        {inner}
      </a>
    );
  }

  return (
    <a href={item.href} className={merged} onClick={onClick}>
      {inner}
    </a>
  );
}

export default function NavDropdown({
  menu,
  onNavigate,
  mobile = false,
  forceActive = false,
}: NavDropdownProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = forceActive;
  const menuLabel = t(menu.labelKey);

  if (mobile) {
    return (
      <div className="mb-2 border-b border-gray-100 pb-2">
        <div
          className={`flex w-full items-center rounded transition-colors ${
            active ? "bg-bmkg-light text-bmkg-navy" : "text-gray-800"
          }`}
        >
          <a
            href={menu.basePath}
            onClick={onNavigate}
            className="flex-1 rounded-l px-3 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            {menuLabel}
          </a>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="rounded-r px-3 py-2 hover:bg-gray-50"
            aria-expanded={open}
            aria-label={`${menuLabel} submenu`}
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>
        </div>
        {open ? (
          <div className="mt-1 space-y-1 pl-3">
            {menu.items.map((item) => (
              <NavItemLink
                key={item.href}
                item={item}
                active={item.href.startsWith("/instrument")}
                onClick={onNavigate}
                className="block rounded px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-bmkg-light"
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <a
        href={menu.basePath}
        className={`inline-flex items-center gap-1 whitespace-nowrap rounded px-3 py-2 text-sm font-medium transition-all duration-200 ${
          active || open
            ? "border-b-2 border-bmkg-accent bg-bmkg-light text-bmkg-navy"
            : "text-gray-700 hover:bg-bmkg-light hover:text-bmkg-navy"
        }`}
      >
        {menuLabel}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </a>
      <div
        className={`absolute top-full left-0 z-50 w-72 origin-top pt-1 transition-all duration-200 ${
          open
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-1 opacity-0"
        }`}
      >
        <div className="rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
          {menu.items.map((item) => (
            <NavItemLink
              key={item.href}
              item={item}
              desktop
              active={item.href.startsWith("/instrument")}
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              className="block px-4 py-2.5 transition-colors duration-150 hover:bg-bmkg-light"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
