import "server-only";
import { createClient } from "@/lib/supabase/server";
import type {
  Category,
  Comuna,
  ProviderCardData,
  ProviderPublicProfile,
  ProviderSearchFilters,
  Review,
} from "@/types/domain";

type ProviderRow = {
  id: string;
  business_name: string | null;
  bio: string | null;
  years_experience: number | null;
  verified: boolean;
  avg_rating: number;
  review_count: number;
  profiles: { full_name: string; avatar_url: string | null } | null;
  provider_categories: { categories: Category | null }[];
  provider_zones: { comunas: Comuna | null }[];
};

const PROVIDER_SELECT = `
  id,
  business_name,
  bio,
  years_experience,
  verified,
  avg_rating,
  review_count,
  profiles!inner ( full_name, avatar_url ),
  provider_categories ( categories ( id, slug, name ) ),
  provider_zones ( comunas ( id, name, region ) )
`;

function toProviderCard(row: ProviderRow): ProviderPublicProfile {
  return {
    id: row.id,
    full_name: row.profiles?.full_name ?? "",
    avatar_url: row.profiles?.avatar_url ?? null,
    business_name: row.business_name,
    bio: row.bio,
    verified: row.verified,
    avg_rating: row.avg_rating,
    review_count: row.review_count,
    years_experience: row.years_experience,
    categories: row.provider_categories
      .map((pc) => pc.categories)
      .filter((c): c is Category => c !== null),
    comunas: row.provider_zones
      .map((pz) => pz.comunas)
      .filter((c): c is Comuna => c !== null),
  };
}

// El volumen esperado en el MVP es bajo: se trae la lista completa de
// prestadores con perfil completo y se filtra en memoria, evitando la
// semántica de filtrar "embedded resources" anidados de PostgREST (filtrar
// ahí recorta las filas hijas devueltas, no solo la selección de filas).
// Si el directorio crece, mover este filtro a una función RPC en Postgres.
export async function searchProvidersDTO(
  filters: ProviderSearchFilters
): Promise<ProviderCardData[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("provider_profiles")
    .select(PROVIDER_SELECT)
    .not("bio", "is", null);

  if (error || !data) return [];

  let providers = (data as unknown as ProviderRow[]).map(toProviderCard);

  if (filters.categoria) {
    providers = providers.filter((p) =>
      p.categories.some((c) => c.slug === filters.categoria)
    );
  }

  if (filters.comuna) {
    providers = providers.filter((p) =>
      p.comunas.some((c) => c.name === filters.comuna)
    );
  }

  if (filters.q) {
    const q = filters.q.toLowerCase();
    providers = providers.filter(
      (p) =>
        p.full_name.toLowerCase().includes(q) ||
        p.business_name?.toLowerCase().includes(q) ||
        p.bio?.toLowerCase().includes(q)
    );
  }

  return providers.sort(
    (a, b) => b.avg_rating - a.avg_rating || b.review_count - a.review_count
  );
}

export async function getProviderPublicProfileDTO(
  id: string
): Promise<ProviderPublicProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("provider_profiles")
    .select(PROVIDER_SELECT)
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return toProviderCard(data as unknown as ProviderRow);
}

export async function getProviderReviewsDTO(
  providerId: string
): Promise<Review[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select(
      "id, provider_id, reviewer_id, rating, comment, created_at, profiles!inner(full_name)"
    )
    .eq("provider_id", providerId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (
    data as unknown as Array<{
      id: string;
      provider_id: string;
      reviewer_id: string;
      rating: number;
      comment: string | null;
      created_at: string;
      profiles: { full_name: string } | null;
    }>
  ).map((r) => ({
    id: r.id,
    provider_id: r.provider_id,
    reviewer_id: r.reviewer_id,
    reviewer_name: r.profiles?.full_name ?? "Usuario",
    rating: r.rating,
    comment: r.comment,
    created_at: r.created_at,
  }));
}

export async function getUserReviewForProvider(
  providerId: string,
  userId: string
) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("id")
    .eq("provider_id", providerId)
    .eq("reviewer_id", userId)
    .maybeSingle();

  return data;
}

export async function getAllCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("id, slug, name")
    .order("name");

  return data ?? [];
}

export async function getAllComunas(): Promise<Comuna[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("comunas")
    .select("id, name, region")
    .order("name");

  return data ?? [];
}
