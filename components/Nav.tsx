"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProfile } from "./AuthGate";

const links = [
  { href: "/", label: "Home" },
  { href: "/pescata", label: "La mia pescata" },
];

export default function Nav() {
  const path = usePathname();
  const { profile } = useProfile();
  const all = profile.is_admin ? [...links, { href: "/admin", label: "Admin" }] : links;
  return (
    <nav className="nav">
      <Link href="/profilo" className={`me ${path === "/profilo" ? "active" : ""}`} aria-label="Profilo" title="Profilo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
        </svg>
      </Link>
      {all.map((l) => (
        <Link key={l.href} href={l.href} className={path === l.href ? "active" : ""}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
