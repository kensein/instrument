"use client";

import { useEffect, useState } from "react";
import { Clock, Phone } from "lucide-react";

import { useTranslation, type Locale } from "@/i18n/LanguageContext";

export default function TopBar() {
  const { t, locale } = useTranslation();
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const loc: Locale = locale;
      setTime(
        new Intl.DateTimeFormat(loc === "id" ? "id-ID" : "en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Jakarta",
          timeZoneName: "short",
        }).format(new Date())
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [locale]);

  return (
    <div className="border-b border-gray-100 bg-white text-[11px] text-gray-600">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-1.5 sm:px-6 lg:px-8">
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-bmkg-blue" />
          {t("topbar.swi")} {time}
        </span>
        <span className="flex items-center gap-1.5">
          <Phone className="h-3.5 w-3.5 text-bmkg-blue" />
          {t("topbar.org")}
        </span>
      </div>
    </div>
  );
}
