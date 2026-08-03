import Link from "next/link";
import { getCurrentUserProfile } from "@/lib/dal";
import {
  getClientPendingItemsDTO,
  getProviderPendingItemsDTO,
  getProviderPublicProfileDTO,
} from "@/lib/dto";
import { AvatarUpload } from "@/components/providers/avatar-upload";
import { PendingItems } from "@/components/panel/pending-items";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CategoryIcon } from "@/components/ui/category-icon";
import { StarRating } from "@/components/ui/star-rating";

export const metadata = { title: "Mi panel" };

export default async function PanelPage() {
  const profile = await getCurrentUserProfile();

  if (!profile) return null;

  const [pendingItems, providerProfile] = await Promise.all([
    profile.role === "provider"
      ? getProviderPendingItemsDTO(profile.id)
      : getClientPendingItemsDTO(profile.id),
    profile.role === "provider"
      ? getProviderPublicProfileDTO(profile.id)
      : Promise.resolve(null),
  ]);

  const profileComplete =
    !!providerProfile &&
    !!providerProfile.bio &&
    (providerProfile.categories ?? []).length > 0 &&
    (providerProfile.comunas ?? []).length > 0;

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
        <>
          {providerProfile && (
            <Card className="mt-6">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold">Tu perfil</h2>
                {providerProfile.verified && <Badge variant="verified">Verificado</Badge>}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                <StarRating
                  rating={providerProfile.avg_rating}
                  reviewCount={providerProfile.review_count}
                  size="sm"
                />
                {providerProfile.completed_jobs > 0 && (
                  <span className="text-xs text-muted">
                    · {providerProfile.completed_jobs}{" "}
                    {providerProfile.completed_jobs === 1 ? "trabajo" : "trabajos"}
                  </span>
                )}
              </div>

              {providerProfile.bio && (
                <p className="mt-3 line-clamp-2 text-sm text-muted">
                  {providerProfile.bio}
                </p>
              )}

              {(providerProfile.categories ?? []).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {providerProfile.categories.map((c) => (
                    <Badge key={c.id}>
                      <CategoryIcon slug={c.slug} className="h-3.5 w-3.5" />
                      {c.name}
                    </Badge>
                  ))}
                </div>
              )}

              {(providerProfile.comunas ?? []).length > 0 && (
                <p className="mt-3 text-xs text-muted">
                  Atiende en {providerProfile.comunas.map((c) => c.name).join(", ")}
                </p>
              )}

              <Link href={`/prestadores/${profile.id}`} className="mt-4 inline-block">
                <Button variant="secondary">Ver mi perfil público</Button>
              </Link>
            </Card>
          )}

          {!profileComplete ? (
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
            !providerProfile?.verified && (
              <Card className="mt-6">
                <h2 className="font-semibold">Un último paso</h2>
                <p className="mt-1 text-sm text-muted">
                  Tu perfil ya está completo. Verifica tu identidad con tu
                  carnet (RUT) para conseguir la insignia de verificado y
                  generar aún más confianza.
                </p>
                <Link href="/panel/verificacion" className="mt-4 inline-block">
                  <Button>Verifica tu identidad</Button>
                </Link>
              </Card>
            )
          )}
        </>
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
