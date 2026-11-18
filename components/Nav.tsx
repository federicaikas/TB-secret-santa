"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, type ReactNode } from "react";
import { useProfile } from "./AuthGate";

// Icone piene con trama a punto maglia (V ripetute), come il font display.
const Icon = ({ children }: { children: ReactNode }) => {
  const id = "knit" + useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <pattern id={id} width="3.6" height="3.6" patternUnits="userSpaceOnUse">
          <path d="M0.3 0.5 1.8 3 3.3 0.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </pattern>
      </defs>
      <g fill="currentColor" fillOpacity="0.28">{children}</g>
      <g fill={`url(#${id})`}>{children}</g>
    </svg>
  );
};

const links = [
  { href: "/", label: "Home", icon: <Icon><path fillRule="evenodd" d="M6.5 5h11A3.5 3.5 0 0 1 21 8.5v9a3.5 3.5 0 0 1-3.5 3.5h-11A3.5 3.5 0 0 1 3 17.5v-9A3.5 3.5 0 0 1 6.5 5ZM4.5 10.2h15v1.6h-15Z" /><rect x="7" y="2.5" width="2.2" height="4" rx="1.1" /><rect x="14.8" y="2.5" width="2.2" height="4" rx="1.1" /></Icon> },
  { href: "/pescata", label: "Pescata", icon: <Icon><path d="M4 9h16v3.2H4Z" /><path d="M5.5 13.5h13V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20Z" /><path d="M11 9h2v12.5h-2Z" fillOpacity="0.5" /><path d="M12 8.6C10.4 4.4 6.4 4.3 6.7 6.6 6.9 8.2 9.6 8.6 12 8.6Zm0 0c1.6-4.2 5.6-4.3 5.3-2-.2 1.6-2.9 2-5.3 2Z" /></Icon> },
];
const admin = { href: "/admin", label: "Admin", icon: <Icon><path fillRule="evenodd" d="M12 2.5 4.5 5.5v6c0 4.5 3 7.7 7.5 9.5 4.5-1.8 7.5-5 7.5-9.5v-6ZM8.2 12.3l1.4-1.4 1.8 1.8 3.9-3.9 1.4 1.4-5.3 5.3Z" /></Icon> };
const me = { href: "/profilo", label: "Utente", icon: <Icon><circle cx="12" cy="8" r="4.2" /><path d="M3.8 21c0-4.4 3.6-7 8.2-7s8.2 2.6 8.2 7Z" /></Icon> };

// Tab bar attaccata al bordo in basso; la fascia fair-isle e il suo bordo superiore.
export default function Nav() {
  const path = usePathname();
  const { profile } = useProfile();
  const all = profile.is_admin ? [...links, admin, me] : [...links, me];
  return (
    <nav className="nav" aria-label="Navigazione principale">
      {all.map((l) => (
        <Link key={l.href} href={l.href} className={path === l.href ? "active" : ""} aria-current={path === l.href ? "page" : undefined}>
          {l.icon}
          <span>{l.label}</span>
        </Link>
      ))}
    </nav>
  );
}
