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
    <div className="flex items-center gap-3">
      <Link href="/panel" className="text-sm font-medium hover:underline">
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
