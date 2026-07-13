/** Path embed / URL eksternal — disalin dari portal PSIMKG */
export const SQES_URL = "http://103.169.3.72:2108";
export const JMG_URL = "https://jmg.bmkg.go.id";

export type NavItem = {
  label: string;
  href: string;
  descriptionKey?: string;
  external?: boolean;
};

export type NavMenu = {
  id: "meteorologi" | "klimatologi" | "geofisika" | "lainnya";
  labelKey: string;
  basePath: string;
  items: NavItem[];
};

/**
 * Same-origin paths for Apache → portal (:3001) or sibling apps.
 * Instrument is a separate app; use plain <a href> (not Next Link) for these.
 */
export const navMenus: NavMenu[] = [
  {
    id: "meteorologi",
    labelKey: "nav.meteorologi",
    basePath: "/meteorologi",
    items: [
      {
        label: "InaNWP",
        href: "/meteorologi/inanwp",
        descriptionKey: "nav.desc.inanwp",
      },
      {
        label: "InaRason",
        href: "/meteorologi/inarason",
        descriptionKey: "nav.desc.inarason",
      },
      {
        label: "Otomatisasi",
        href: "/meteorologi/otomatisasi",
        descriptionKey: "nav.desc.otomatisasi",
      },
    ],
  },
  {
    id: "klimatologi",
    labelKey: "nav.klimatologi",
    basePath: "/klimatologi",
    items: [
      {
        label: "InaRCM",
        href: "/klimatologi/inarcm",
        descriptionKey: "nav.desc.inarcm",
      },
      {
        label: "InaWMS",
        href: "/klimatologi/inawms",
        descriptionKey: "nav.desc.inawms",
      },
      {
        label: "InaAQM",
        href: "/klimatologi/inaaqm",
        descriptionKey: "nav.desc.inaaqm",
      },
      {
        label: "Tropical Glaciers Papua",
        href: "https://sites.google.com/bmkg.go.id/glaciers",
        descriptionKey: "nav.desc.glaciers",
        external: true,
      },
    ],
  },
  {
    id: "geofisika",
    labelKey: "nav.geofisika",
    basePath: "/geofisika",
    items: [
      {
        label: "SQES",
        href: SQES_URL,
        descriptionKey: "nav.desc.sqes",
        external: true,
      },
    ],
  },
  {
    id: "lainnya",
    labelKey: "nav.lainnya",
    basePath: "/lainnya",
    items: [
      {
        label: "Instrument",
        href: "/instrument/",
        descriptionKey: "nav.desc.instrument",
      },
      {
        label: "JMG",
        href: "/lainnya/jmg",
        descriptionKey: "nav.desc.jmg",
      },
      {
        label: "P3DN",
        href: "/p3dn/",
        descriptionKey: "nav.desc.p3dn",
      },
      {
        label: "PSIIDN",
        href: "/psiidn/",
        descriptionKey: "nav.desc.psiidn",
      },
      {
        label: "SMILE",
        href: "http://202.90.199.129:8080/smile/",
        descriptionKey: "nav.desc.smile",
        external: true,
      },
    ],
  },
];

export const tentangLink = { labelKey: "nav.about", href: "/tentang" };
