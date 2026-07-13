"use client";

import { MapPin, Phone, Mail } from "lucide-react";

import {
  footerContacts,
  footerLinks,
  socialLinks,
} from "@/config/footerLinks";
import { useTranslation } from "@/i18n/LanguageContext";
import { BASE_PATH } from "@/lib/paths";

export default function PortalFooter() {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto border-t border-[#334155] bg-[#0f172a] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-bold text-[#f6c453]">
              {t("footer.contact")}
            </h3>
            <div className="space-y-3 text-sm text-blue-50">
              <p className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#f6c453]" />
                <span>
                  {footerContacts.building}
                  <br />
                  {footerContacts.address}
                  <br />
                  {footerContacts.poBox}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-[#f6c453]" />
                <span>
                  {t("footer.tel")} {footerContacts.phone}
                  <br />
                  {t("footer.fax")} {footerContacts.fax}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-[#f6c453]" />
                <a
                  href={`mailto:${footerContacts.email}`}
                  className="hover:text-white hover:underline"
                >
                  {footerContacts.email}
                </a>
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${BASE_PATH}/bmkg-logo.png`}
                alt=""
                className="h-9 w-9 object-contain"
              />
              <div>
                <p className="font-bold text-white">PSIMKG</p>
                <p className="text-xs text-blue-200">{t("footer.tagline")}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-[#f6c453]">
              {t("footer.links")}
            </h3>
            <ul className="mb-8 space-y-2 text-sm text-blue-50">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white hover:underline"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <a
                      href={link.href}
                      className="hover:text-white hover:underline"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>

            <h3 className="mb-4 text-lg font-bold text-[#f6c453]">
              {t("footer.social")}
            </h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm transition-colors hover:bg-white/20"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-blue-300/30 pt-6 text-center text-xs text-blue-100/90">
          © {new Date().getFullYear()} — {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
}
