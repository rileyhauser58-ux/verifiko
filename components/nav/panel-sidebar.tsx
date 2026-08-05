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
  { href: "/panel/certificaciones", label: "Certificaciones" },
  { href: "/panel/verificacion", label: "Verificación" },
];

export function PanelSidebar({
  role,
  requestsBadge = 0,
}: {
  role: UserRole;
  requestsBadge?: number;
}) {
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
            className={`shrink-0 flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-primary-tint text-primary-hover"
                : "text-foreground/70 hover:bg-primary-tint/60 hover:text-primary-hover"
            }`}
          >
            {link.label}
            {link.href === "/panel/solicitudes" && requestsBadge > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-trust px-1.5 text-xs font-semibold text-white">
                {requestsBadge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
