import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types/domain";

export function UserMenu({ profile }: { profile: Profile | null }) {
  if (!profile) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/ingresar">
          <Button variant="ghost">Ingresar</Button>
        </Link>
        <Link href="/registro">
          <Button variant="primary">Crear cuenta</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="hidden items-center gap-4 text-sm font-medium sm:flex">
        <Link href="/panel/solicitudes" className="text-foreground/80 hover:text-primary">
          Solicitudes
        </Link>
        <Link href="/panel/agenda" className="text-foreground/80 hover:text-primary">
          Agenda
        </Link>
        <Link href="/panel/historial" className="text-foreground/80 hover:text-primary">
          Historial
        </Link>
      </div>
      <Link href="/panel" className="text-sm font-medium hover:text-primary">
        {profile.full_name || "Mi panel"}
      </Link>
      <form action={signOut}>
        <Button type="submit" variant="secondary">
          Cerrar sesión
        </Button>
      </form>
    </div>
  );
}
