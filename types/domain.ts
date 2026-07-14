export type UserRole = "client" | "provider";

export type Profile = {
  id: string;
  role: UserRole;
  full_name: string;
  avatar_url: string | null;
};

export type Category = {
  id: number;
  slug: string;
  name: string;
};

export type Comuna = {
  id: number;
  name: string;
  region: string;
};

export type ProviderCardData = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  business_name: string | null;
  bio: string | null;
  verified: boolean;
  avg_rating: number;
  review_count: number;
  categories: Category[];
  comunas: Comuna[];
};

export type ProviderPublicProfile = ProviderCardData & {
  years_experience: number | null;
};

export type Review = {
  id: string;
  provider_id: string;
  reviewer_id: string;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

export type ProviderSearchFilters = {
  categoria?: string;
  comuna?: string;
  q?: string;
};
