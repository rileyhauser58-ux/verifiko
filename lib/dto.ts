import "server-only";
import { createClient } from "@/lib/supabase/server";
import type {
  Category,
  ChatMessage,
  Comuna,
  LocationShareInfo,
  PendingItem,
  ProviderCardData,
  ProviderPublicProfile,
  ProviderSearchFilters,
  RequestStatus,
  Review,
  ServiceRequestDetail,
  ServiceRequestListItem,
  VerificationDocument,
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
    completed_jobs: 0,
    years_experience: row.years_experience,
    categories: row.provider_categories
      .map((pc) => pc.categories)
      .filter((c): c is Category => c !== null),
    comunas: row.provider_zones
      .map((pz) => pz.comunas)
      .filter((c): c is Comuna => c !== null),
  };
}

// service_requests solo es legible por sus dos participantes (RLS), así
// que un visitante público no puede contarlas directamente — se usa una
// función de Postgres (SECURITY DEFINER) que expone solo el número, nunca
// las filas. Volumen esperado bajo en el MVP: se calcula al leer, sin
// denormalizar en una columna.
async function getCompletedJobsCount(providerId: string): Promise<number> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_completed_jobs_count", {
    target_provider_id: providerId,
  });

  return data ?? 0;
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

  const counts = await Promise.all(
    providers.map((p) => getCompletedJobsCount(p.id))
  );
  providers.forEach((p, i) => {
    p.completed_jobs = counts[i];
  });

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

  const provider = toProviderCard(data as unknown as ProviderRow);
  provider.completed_jobs = await getCompletedJobsCount(id);
  return provider;
}

export async function getProviderReviewsDTO(
  providerId: string
): Promise<Review[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select(
      "id, provider_id, reviewer_id, rating, comment, created_at, request_id, profiles!inner(full_name)"
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
      request_id: string;
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
    request_id: r.request_id,
  }));
}

type ClientRequestRow = {
  id: string;
  status: RequestStatus;
  message: string;
  created_at: string;
  completed_at: string | null;
  scheduled_at: string | null;
  provider_id: string;
  provider_profiles: {
    business_name: string | null;
    profiles: { full_name: string; avatar_url: string | null } | null;
  } | null;
};

type ProviderRequestRow = {
  id: string;
  status: RequestStatus;
  message: string;
  created_at: string;
  completed_at: string | null;
  scheduled_at: string | null;
  client_id: string;
  profiles: { full_name: string; avatar_url: string | null } | null;
};

type RequestDetailRow = {
  id: string;
  client_id: string;
  provider_id: string;
  status: RequestStatus;
  message: string;
  created_at: string;
  completed_at: string | null;
  scheduled_at: string | null;
  profiles: { full_name: string; avatar_url: string | null } | null;
  provider_profiles: {
    business_name: string | null;
    profiles: { full_name: string; avatar_url: string | null } | null;
  } | null;
};

export async function getClientServiceRequestsDTO(
  clientId: string
): Promise<ServiceRequestListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("service_requests")
    .select(
      `
      id, status, message, created_at, completed_at, scheduled_at, provider_id,
      provider_profiles!inner ( business_name, profiles!inner ( full_name, avatar_url ) )
    `
    )
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (data as unknown as ClientRequestRow[]).map((r) => ({
    id: r.id,
    status: r.status,
    message: r.message,
    created_at: r.created_at,
    completed_at: r.completed_at,
    scheduled_at: r.scheduled_at,
    counterpart_id: r.provider_id,
    counterpart_name:
      r.provider_profiles?.business_name ??
      r.provider_profiles?.profiles?.full_name ??
      "Prestador",
    counterpart_avatar_url: r.provider_profiles?.profiles?.avatar_url ?? null,
  }));
}

export async function getProviderServiceRequestsDTO(
  providerId: string
): Promise<ServiceRequestListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("service_requests")
    .select(
      `
      id, status, message, created_at, completed_at, scheduled_at, client_id,
      profiles!inner ( full_name, avatar_url )
    `
    )
    .eq("provider_id", providerId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (data as unknown as ProviderRequestRow[]).map((r) => ({
    id: r.id,
    status: r.status,
    message: r.message,
    created_at: r.created_at,
    completed_at: r.completed_at,
    scheduled_at: r.scheduled_at,
    counterpart_id: r.client_id,
    counterpart_name: r.profiles?.full_name ?? "Cliente",
    counterpart_avatar_url: r.profiles?.avatar_url ?? null,
  }));
}

export async function getServiceRequestDetailDTO(
  requestId: string
): Promise<ServiceRequestDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("service_requests")
    .select(
      `
      id, client_id, provider_id, status, message, created_at, completed_at, scheduled_at,
      profiles!inner ( full_name, avatar_url ),
      provider_profiles!inner ( business_name, profiles!inner ( full_name, avatar_url ) )
    `
    )
    .eq("id", requestId)
    .single();

  if (error || !data) return null;
  const row = data as unknown as RequestDetailRow;

  return {
    id: row.id,
    client_id: row.client_id,
    provider_id: row.provider_id,
    status: row.status,
    message: row.message,
    created_at: row.created_at,
    completed_at: row.completed_at,
    scheduled_at: row.scheduled_at,
    client_name: row.profiles?.full_name ?? "Cliente",
    client_avatar_url: row.profiles?.avatar_url ?? null,
    provider_name:
      row.provider_profiles?.business_name ??
      row.provider_profiles?.profiles?.full_name ??
      "Prestador",
    provider_avatar_url: row.provider_profiles?.profiles?.avatar_url ?? null,
  };
}

export async function getRequestMessagesDTO(
  requestId: string
): Promise<ChatMessage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("id, request_id, sender_id, body, created_at")
    .eq("request_id", requestId)
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  return data as unknown as ChatMessage[];
}

export async function getActiveRequestDTO(
  requesterId: string,
  providerId: string
): Promise<{ id: string; status: RequestStatus } | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("service_requests")
    .select("id, status")
    .eq("client_id", requesterId)
    .eq("provider_id", providerId)
    .in("status", ["pending", "accepted"])
    .maybeSingle();

  return data as unknown as { id: string; status: RequestStatus } | null;
}

export async function getReviewForRequestDTO(requestId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("id")
    .eq("request_id", requestId)
    .maybeSingle();

  return data;
}

const UPCOMING_WINDOW_MS = 48 * 60 * 60 * 1000;

export async function getProviderPendingItemsDTO(
  providerId: string
): Promise<PendingItem[]> {
  const supabase = await createClient();

  const [{ data }, { data: providerData }] = await Promise.all([
    supabase
      .from("service_requests")
      .select("id, status, scheduled_at, profiles!inner(full_name)")
      .eq("provider_id", providerId)
      .in("status", ["pending", "accepted"]),
    supabase
      .from("provider_profiles")
      .select("bio, verified, provider_categories(category_id), provider_zones(comuna_id)")
      .eq("id", providerId)
      .maybeSingle(),
  ]);

  const items: PendingItem[] = [];

  const provider = providerData as unknown as {
    bio: string | null;
    verified: boolean;
    provider_categories: { category_id: number }[];
    provider_zones: { comuna_id: number }[];
  } | null;

  const profileIncomplete =
    !provider ||
    !provider.bio ||
    provider.provider_categories.length === 0 ||
    provider.provider_zones.length === 0;

  if (profileIncomplete) {
    items.push({
      type: "incomplete_profile",
      label:
        "Completa tu perfil para generar más confianza y conseguir clientes",
      href: "/panel/perfil",
    });
  } else if (!provider.verified) {
    items.push({
      type: "unverified",
      label: "Verifica tu identidad para destacar en las búsquedas",
      href: "/panel/verificacion",
    });
  }

  if (!data) return items;

  const rows = data as unknown as Array<{
    id: string;
    status: string;
    scheduled_at: string | null;
    profiles: { full_name: string } | null;
  }>;

  const pendingCount = rows.filter((r) => r.status === "pending").length;
  if (pendingCount > 0) {
    items.push({
      type: "pending_response",
      label: `Tienes ${pendingCount} ${pendingCount === 1 ? "solicitud" : "solicitudes"} esperando tu respuesta`,
      href: "/panel/solicitudes",
    });
  }

  const soon = Date.now() + UPCOMING_WINDOW_MS;
  for (const r of rows) {
    if (
      r.status === "accepted" &&
      r.scheduled_at &&
      new Date(r.scheduled_at).getTime() <= soon
    ) {
      items.push({
        type: "upcoming",
        label: `Trabajo agendado con ${r.profiles?.full_name ?? "un cliente"}`,
        href: `/panel/solicitudes/${r.id}`,
      });
    }
  }

  return items;
}

export async function getClientPendingItemsDTO(
  clientId: string
): Promise<PendingItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("service_requests")
    .select(
      `
      id, status, scheduled_at,
      provider_profiles!inner ( business_name, profiles!inner ( full_name ) ),
      reviews ( id )
    `
    )
    .eq("client_id", clientId)
    .in("status", ["accepted", "completed"]);

  if (!data) return [];

  const rows = data as unknown as Array<{
    id: string;
    status: string;
    scheduled_at: string | null;
    provider_profiles: {
      business_name: string | null;
      profiles: { full_name: string } | null;
    } | null;
    reviews: { id: string }[];
  }>;

  const items: PendingItem[] = [];
  const soon = Date.now() + UPCOMING_WINDOW_MS;

  for (const r of rows) {
    const name =
      r.provider_profiles?.business_name ??
      r.provider_profiles?.profiles?.full_name ??
      "un prestador";

    if (
      r.status === "accepted" &&
      r.scheduled_at &&
      new Date(r.scheduled_at).getTime() <= soon
    ) {
      items.push({
        type: "upcoming",
        label: `Trabajo agendado con ${name}`,
        href: `/panel/solicitudes/${r.id}`,
      });
    }

    if (r.status === "completed" && r.reviews.length === 0) {
      items.push({
        type: "awaiting_review",
        label: `Deja tu reseña para ${name}`,
        href: `/panel/solicitudes/${r.id}`,
      });
    }
  }

  return items;
}

// Documentos de verificación: solo el propio prestador los puede leer
// (RLS los restringe), se usan en /panel/verificacion.
export async function getVerificationDocumentsDTO(
  providerId: string
): Promise<VerificationDocument[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("verification_documents")
    .select("document_type, status")
    .eq("provider_id", providerId);

  return data ?? [];
}

// Única DTO de la app pensada para una página SIN sesión: el token en sí
// es la credencial de acceso (patrón de "capability URL").
export async function getLocationShareDTO(
  shareToken: string
): Promise<LocationShareInfo | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("location_shares")
    .select("id, active, request_id")
    .eq("share_token", shareToken)
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

