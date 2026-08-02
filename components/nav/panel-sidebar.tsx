"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@/types/domain";

const CLIENT_LINKS = [
  { href: "/panel", label: "Resumen" },
  { href: "/buscar", label: "Buscar prestadores" },
  { href: "/panel/solicitudes", label: "Solicitudes" },
  { href: "/panel/agenda", label: "Agenda" },
  { href: "/panel/historial", label: "Historial" },
];

const PROVIDER_LINKS = [
  { href: "/panel", label: "Resumen" },
  { href: "/panel/solicitudes", label: "Solicitudes" },
  { href: "/panel/agenda", label: "Agenda" },
  { href: "/panel/historial", label: "Historial" },
  { href: "/panel/perfil", label: "Mi perfil" },
  { href: "/panel/verificacion", label: "Verificación" },
];

export function PanelSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const links = role === "provider" ? PROVIDER_LINKS : CLIENT_LINKS;

  return (
    <nav className="flex gap-1 overflow-x-auto pb-1 sm:w-48 sm:shrink-0 sm:flex-col sm:overflow-visible sm:pb-0">
      {links.map((link) => {
        const active =
          link.href === "/panel"
            ? pathname === "/panel"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-primary-tint text-primary-hover"
                : "text-foreground/70 hover:bg-primary-tint/60 hover:text-primary-hover"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
