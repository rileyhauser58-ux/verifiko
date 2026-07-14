import { notFound } from "next/navigation";
import {
  getProviderPublicProfileDTO,
  getProviderReviewsDTO,
  getUserReviewForProvider,
} from "@/lib/dto";
import { getCurrentUserProfile } from "@/lib/dal";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { ReviewForm } from "@/components/providers/review-form";
import { ReviewList } from "@/components/providers/review-list";

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
  const { id } = await params;
  const provider = await getProviderPublicProfileDTO(id);

  if (!provider) notFound();

  const [reviews, profile] = await Promise.all([
    getProviderReviewsDTO(id),
    getCurrentUserProfile(),
  ]);

  let canReview = false;
  if (profile && profile.id !== id) {
    const existingReview = await getUserReviewForProvider(id, profile.id);
    canReview = !existingReview;
  }

  const displayName = provider.business_name || provider.full_name;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar src={provider.avatar_url} name={displayName} size={64} />
          <div>
            <h1 className="text-2xl font-semibold">{displayName}</h1>
            <p className="text-sm text-muted">{provider.full_name}</p>
          </div>
        </div>
        {provider.verified && <Badge variant="verified">Verificado</Badge>}
      </div>

      <div className="mt-3">
        <StarRating rating={provider.avg_rating} reviewCount={provider.review_count} />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {provider.categories.map((c) => (
          <Badge key={c.id}>{c.name}</Badge>
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

      {provider.bio && <p className="mt-6 leading-relaxed">{provider.bio}</p>}

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">Reseñas</h2>

        {canReview && (
          <div className="mb-6">
            <ReviewForm providerId={id} />
          </div>
        )}

        <ReviewList reviews={reviews} />
      </section>
    </div>
  );
}
