import Link from "next/link";
import { getCurrentUserProfile } from "@/lib/dal";
import {
  getClientPendingItemsDTO,
  getProviderPendingItemsDTO,
} from "@/lib/dto";
import { AvatarUpload } from "@/components/providers/avatar-upload";
import { PendingItems } from "@/components/panel/pending-items";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Mi panel" };

export default async function PanelPage() {
  const profile = await getCurrentUserProfile();

  if (!profile) return null;

  const pendingItems =
    profile.role === "provider"
      ? await getProviderPendingItemsDTO(profile.id)
      : await getClientPendingItemsDTO(profile.id);

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold">Hola, {profile.full_name}</h1>

      <div className="mt-6">
        <AvatarUpload
          userId={profile.id}
          fullName={profile.full_name}
          currentAvatarUrl={profile.avatar_url}
        />
      </div>

      <div className="mt-6">
        <PendingItems items={pendingItems} />
      </div>

      {profile.role === "provider" ? (
        <Card className="mt-6">
          <h2 className="font-semibold">Consigue más clientes</h2>
          <p className="mt-1 text-sm text-muted">
            Un perfil completo, con tus rubros, comunas y la insignia de
            verificado, genera mucha más confianza — y más solicitudes.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/panel/perfil">
              <Button>Completa tu perfil</Button>
            </Link>
            <Link href="/panel/verificacion">
              <Button variant="secondary">Verifica tu identidad</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <Card className="mt-6">
          <h2 className="font-semibold">Encuentra un prestador</h2>
          <p className="mt-1 text-sm text-muted">
            Busca gasfiters, electricistas y más cerca de ti.
          </p>
          <Link href="/buscar" className="mt-4 inline-block">
            <Button>Buscar prestadores</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
