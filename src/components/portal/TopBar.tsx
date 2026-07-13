"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { Clock, Phone } from "lucide-react";

import { useTranslation, type Locale } from "@/i18n/LanguageContext";

function formatJakartaTime(locale: Locale) {
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Jakarta",
    timeZoneName: "short",
  }).format(new Date());
}

const CLOCK_SCRIPT = `
(function () {
  var el = document.getElementById("psimkg-swi-clock");
  if (!el || el.getAttribute("data-react-clock") === "1") return;
  function tick() {
    var node = document.getElementById("psimkg-swi-clock");
    if (!node || node.getAttribute("data-react-clock") === "1") return;
    var loc = document.documentElement.lang === "en" ? "en-GB" : "id-ID";
    node.textContent = new Intl.DateTimeFormat(loc, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Jakarta",
      timeZoneName: "short"
    }).format(new Date());
  }
  tick();
  setInterval(tick, 1000);
})();
`;

export default function TopBar() {
  const { t, locale } = useTranslation();
  const [time, setTime] = useState("");

  useEffect(() => {
    let alive = true;
    const tick = () => {
      if (!alive) return;
      const formatted = formatJakartaTime(locale);
      setTime(formatted);
      const el = document.getElementById("psimkg-swi-clock");
      if (el) {
        el.setAttribute("data-react-clock", "1");
        el.textContent = formatted;
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, [locale]);

  return (
    <div className="border-b border-gray-100 bg-white text-[11px] text-gray-600">
      <Script id="psimkg-swi-clock-script" strategy="afterInteractive">
        {CLOCK_SCRIPT}
      </Script>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-1.5 sm:px-6 lg:px-8">
        <span className="flex min-w-0 flex-wrap items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 shrink-0 text-bmkg-blue" aria-hidden />
          <span>
            {t("topbar.swi")}{" "}
            <span id="psimkg-swi-clock" suppressHydrationWarning>
              {time}
            </span>
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <Phone className="h-3.5 w-3.5 shrink-0 text-bmkg-blue" aria-hidden />
          {t("topbar.org")}
        </span>
      </div>
    </div>
  );
}
