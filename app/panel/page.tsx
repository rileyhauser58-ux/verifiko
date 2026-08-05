import Link from "next/link";
import { getCurrentUserProfile } from "@/lib/dal";
import {
  getClientPendingItemsDTO,
  getClientServiceRequestsDTO,
  getProviderPendingItemsDTO,
  getProviderPublicProfileDTO,
} from "@/lib/dto";
import { groupByCounterpart } from "@/lib/history";
import { AvatarUpload } from "@/components/providers/avatar-upload";
import { PendingItems } from "@/components/panel/pending-items";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CategoryIcon } from "@/components/ui/category-icon";
import { StarRating } from "@/components/ui/star-rating";

export const metadata = { title: "Mi panel" };

const RECENT_PROVIDERS_LIMIT = 3;

export default async function PanelPage() {
  const profile = await getCurrentUserProfile();

  if (!profile) return null;

  const [pendingItems, providerProfile, clientRequests] = await Promise.all([
    profile.role === "provider"
      ? getProviderPendingItemsDTO(profile.id)
      : getClientPendingItemsDTO(profile.id),
    profile.role === "provider"
      ? getProviderPublicProfileDTO(profile.id)
      : Promise.resolve(null),
    profile.role === "client"
      ? getClientServiceRequestsDTO(profile.id)
      : Promise.resolve([]),
  ]);

  const recentProviders = groupByCounterpart(clientRequests).slice(
    0,
    RECENT_PROVIDERS_LIMIT
  );

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
        <>
          {recentProviders.length > 0 && (
            <Card className="mt-6">
              <h2 className="font-semibold">Tus prestadores</h2>
              <p className="mt-1 text-sm text-muted">
                Gente con la que ya trabajaste — rápido de volver a contactar.
              </p>
              <div className="mt-4 space-y-3">
                {recentProviders.map((entry) => (
                  <div
                    key={entry.counterpart_id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={entry.counterpart_avatar_url}
                        name={entry.counterpart_name}
                        size={40}
                      />
                      <div>
                        <p className="text-sm font-medium">{entry.counterpart_name}</p>
                        <p className="text-xs text-muted">
                          {entry.completed_requests}{" "}
                          {entry.completed_requests === 1 ? "trabajo" : "trabajos"}{" "}
                          completado{entry.completed_requests === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>
                    <Link href={`/prestadores/${entry.counterpart_id}`}>
                      <Button variant="secondary">Ver perfil</Button>
                    </Link>
                  </div>
                ))}
              </div>
              <Link
                href="/panel/historial"
                className="mt-4 inline-block text-sm text-primary hover:underline"
              >
                Ver todo tu historial →
              </Link>
            </Card>
          )}

          <Card className="mt-6">
            <h2 className="font-semibold">Encuentra un prestador</h2>
            <p className="mt-1 text-sm text-muted">
              Busca gasfiters, electricistas y más cerca de ti.
            </p>
            <Link href="/buscar" className="mt-4 inline-block">
              <Button>Buscar prestadores</Button>
            </Link>
          </Card>
        </>
      )}
    </div>
  );
}
