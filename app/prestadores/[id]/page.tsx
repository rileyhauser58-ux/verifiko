import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getActiveRequestDTO,
  getProviderCertificationsDTO,
  getProviderPublicProfileDTO,
  getProviderReviewsDTO,
} from "@/lib/dto";
import { getCurrentUserProfile, verifySession } from "@/lib/dal";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/ui/category-icon";
import { StarRating } from "@/components/ui/star-rating";
import { CertificationBadges } from "@/components/providers/certification-badges";
import { EmergencyButton } from "@/components/providers/emergency-button";
import { ReportButton } from "@/components/providers/report-button";
import { ReviewList } from "@/components/providers/review-list";
import { ServiceRequestForm } from "@/components/requests/service-request-form";

type ProviderPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ProviderPageProps) {
  const { id } = await params;
  const provider = await getProviderPublicProfileDTO(id);

  if (!provider) return { title: "Prestador no encontrado" };

  const displayName = provider.business_name || provider.full_name;
  const categoryNames = provider.categories.map((c) => c.name).join(", ");
  const zoneNames = provider.comunas.map((c) => c.name).join(", ");

  return {
    title: `${displayName} — ${categoryNames}`,
    description:
      provider.bio ??
      `${displayName} ofrece servicios de ${categoryNames}${zoneNames ? ` en ${zoneNames}` : ""}.`,
  };
}

export default async function ProviderProfilePage({ params }: ProviderPageProps) {
  await verifySession();
  const { id } = await params;
  const provider = await getProviderPublicProfileDTO(id);

  if (!provider) notFound();

  const [reviews, profile, certifications] = await Promise.all([
    getProviderReviewsDTO(id),
    getCurrentUserProfile(),
    getProviderCertificationsDTO(id),
  ]);

  const activeRequest =
    profile && profile.id !== id ? await getActiveRequestDTO(profile.id, id) : null;

  const displayName = provider.business_name || provider.full_name;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar src={provider.avatar_url} name={displayName} size={64} />
          <div>
            <h1 className="font-serif text-2xl font-semibold">{displayName}</h1>
            <p className="text-sm text-muted">{provider.full_name}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {provider.verified && <Badge variant="verified">Verificado</Badge>}
          {profile && profile.id !== id && (
            <div className="flex items-center gap-2">
              <ReportButton reportedProviderId={id} requestId={null} />
              {profile.role === "client" && (
                <EmergencyButton reportedProviderId={id} requestId={null} />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
        <StarRating rating={provider.avg_rating} reviewCount={provider.review_count} />
        {provider.completed_jobs > 0 && (
          <span className="text-sm text-muted">
            · {provider.completed_jobs}{" "}
            {provider.completed_jobs === 1 ? "trabajo completado" : "trabajos completados"}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {provider.categories.map((c) => (
          <Badge key={c.id}>
            <CategoryIcon slug={c.slug} className="h-3.5 w-3.5" />
            {c.name}
          </Badge>
        ))}
      </div>

      {provider.comunas.length > 0 && (
        <p className="mt-3 text-sm text-muted">
          Atiende en {provider.comunas.map((c) => c.name).join(", ")}
        </p>
      )}

      {provider.years_experience !== null && (
        <p className="mt-1 text-sm text-muted">
          {provider.years_experience}{" "}
          {provider.years_experience === 1 ? "año" : "años"} de experiencia
        </p>
      )}

      <CertificationBadges certifications={certifications} />

      {provider.bio && <p className="mt-6 leading-relaxed">{provider.bio}</p>}

      {profile && profile.id !== id && (
        <div className="mt-6">
          {activeRequest ? (
            <Link href={`/panel/solicitudes/${activeRequest.id}`}>
              <Button variant="secondary">Ver solicitud enviada</Button>
            </Link>
          ) : (
            <ServiceRequestForm providerId={id} />
          )}
        </div>
      )}

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">Reseñas</h2>
        <ReviewList reviews={reviews} />
      </section>
    </div>
  );
}
