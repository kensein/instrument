import type { ComponentType, SVGProps } from "react";

export const footerContacts = {
  building: "Gedung A Lantai 8",
  address: "Jl. Angkasa I No. 2. Kemayoran, Jakarta 10720",
  poBox: "P.O Box 3540 Jakarta",
  phone: "(021) 4246321 Ext. 1900",
  fax: "(021) 65866238",
  email: "psimkg@bmkg.go.id",
};

export const footerLinks = [
  { label: "JMG", href: "https://jmg.bmkg.go.id", external: true },
  { label: "P3DN", href: "/p3dn/", external: false },
  { label: "BMKG", href: "https://www.bmkg.go.id/", external: true },
];

type IconProps = SVGProps<SVGSVGElement>;

function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.2l.8-3H13V9c0-.6.4-1 1-1z" />
    </svg>
  );
}

function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
    </svg>
  );
}

function YoutubeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M23 7.5s-.2-1.6-.9-2.3c-.8-.9-1.7-.9-2.1-1C17.2 4 12 4 12 4s-5.2 0-7.9.2c-.5.1-1.3.1-2.1 1C1.2 5.9 1 7.5 1 7.5S.8 9.3.8 11.2v1.7c0 1.9.2 3.7.2 3.7s.2 1.6.9 2.3c.8.9 1.9.9 2.4 1 1.7.2 7.7.2 7.7.2s5.2 0 7.9-.2c.5-.1 1.3-.1 2.1-1 .7-.7.9-2.3.9-2.3s.2-1.8.2-3.7v-1.7c0-1.9-.2-3.7-.2-3.7zM9.8 14.6V8.9l5.5 2.9-5.5 2.8z" />
    </svg>
  );
}

export const socialLinks: {
  label: string;
  href: string;
  icon: ComponentType<IconProps>;
}[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/BMKGIndonesia",
    icon: FacebookIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/infobmkg/",
    icon: InstagramIcon,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/user/BMKGIndonesia",
    icon: YoutubeIcon,
  },
];
