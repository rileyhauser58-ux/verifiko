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
  completed_jobs: number;
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
  request_id: string;
};

export type ProviderSearchFilters = {
  categoria?: string;
  comuna?: string;
  q?: string;
};

export type RequestStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "completed"
  | "cancelled";

export type ServiceRequestListItem = {
  id: string;
  status: RequestStatus;
  message: string;
  created_at: string;
  completed_at: string | null;
  scheduled_at: string | null;
  counterpart_id: string;
  counterpart_name: string;
  counterpart_avatar_url: string | null;
};

export type ServiceRequestDetail = {
  id: string;
  client_id: string;
  provider_id: string;
  status: RequestStatus;
  message: string;
  created_at: string;
  completed_at: string | null;
  scheduled_at: string | null;
  client_name: string;
  client_avatar_url: string | null;
  provider_name: string;
  provider_avatar_url: string | null;
};

export type ChatMessage = {
  id: string;
  request_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export type PendingItem = {
  type:
    | "pending_response"
    | "upcoming"
    | "incomplete_profile"
    | "unverified"
    | "unread_messages";
  label: string;
  href: string;
};

export type HistoryEntry = {
  counterpart_id: string;
  counterpart_name: string;
  counterpart_avatar_url: string | null;
  total_requests: number;
  completed_requests: number;
  last_interaction_at: string;
  last_request_id: string;
};

export type DocumentType = "id_card" | "selfie" | "background_check";
export type DocumentStatus = "pending" | "approved" | "rejected";

export type VerificationDocument = {
  document_type: DocumentType;
  status: DocumentStatus;
};

export type ProviderCertification = {
  id: string;
  title: string;
  issuer: string | null;
  file_url: string;
  created_at: string;
};

export type ReportReason =
  | "unsafe_behavior"
  | "no_show"
  | "harassment"
  | "fraud"
  | "other";

export type LocationShareInfo = {
  id: string;
  active: boolean;
  request_id: string;
};
