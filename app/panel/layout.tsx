import { type ReactNode } from "react";
import { getCurrentUserProfile, verifySession } from "@/lib/dal";
import {
  getClientPendingItemsDTO,
  getProviderPendingItemsDTO,
} from "@/lib/dto";
import { PanelSidebar } from "@/components/nav/panel-sidebar";

const REQUEST_ITEM_TYPES = new Set([
  "pending_response",
  "upcoming",
  "awaiting_review",
]);

export default async function PanelLayout({ children }: { children: ReactNode }) {
  // Defensa en profundidad: proxy.ts ya redirige de forma optimista, pero
  // el límite de seguridad real de esta sección es este verifySession().
  await verifySession();
  const profile = await getCurrentUserProfile();

  const pendingItems = profile
    ? profile.role === "provider"
      ? await getProviderPendingItemsDTO(profile.id)
      : await getClientPendingItemsDTO(profile.id)
    : [];

  const requestsNeedingAttention = pendingItems.filter((item) =>
    REQUEST_ITEM_TYPES.has(item.type)
  ).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-8 sm:flex-row">
        <PanelSidebar
          role={profile?.role ?? "client"}
          requestsBadge={requestsNeedingAttention}
        />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
