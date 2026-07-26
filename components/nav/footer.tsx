import Link from "next/link";
import { LogoMark } from "@/components/nav/logo";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted sm:flex-row">
        <p className="flex items-center gap-2">
          <LogoMark size={18} />© {new Date().getFullYear()} TodoServicios
        </p>
        <div className="flex items-center gap-4">
          <Link href="/terminos" className="hover:text-primary">
            Términos y Condiciones
          </Link>
          <Link href="/privacidad" className="hover:text-primary">
            Política de Privacidad
          </Link>
        </div>
      </div>
    </footer>
  );
}
