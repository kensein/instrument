"use client";

import { useTranslation } from "@/i18n/LanguageContext";

export default function LanguageSwitcher({
  className = "",
}: {
  className?: string;
}) {
  const { locale, setLocale, t } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === "id" ? "en" : "id")}
      className={`inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-bmkg-navy transition-all duration-200 hover:border-bmkg-blue/30 hover:bg-bmkg-light hover:shadow-sm ${className}`}
      aria-label={t("lang.switch")}
      title={t("lang.switch")}
    >
      <span className={locale === "id" ? "text-bmkg-navy" : "text-gray-400"}>
        {t("lang.id")}
      </span>
      <span className="text-gray-300">|</span>
      <span className={locale === "en" ? "text-bmkg-navy" : "text-gray-400"}>
        {t("lang.en")}
      </span>
    </button>
  );
}
