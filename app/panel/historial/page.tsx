import Link from "next/link";
import { getCurrentUserProfile } from "@/lib/dal";
import {
  getClientServiceRequestsDTO,
  getProviderServiceRequestsDTO,
} from "@/lib/dto";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import type { HistoryEntry, ServiceRequestListItem } from "@/types/domain";

export const metadata = { title: "Historial" };

// Los items ya vienen ordenados desc por created_at desde las DTOs de
// solicitudes, así que el primer registro por contraparte es el más reciente.
function groupByCounterpart(items: ServiceRequestListItem[]): HistoryEntry[] {
  const map = new Map<string, HistoryEntry>();

  for (const item of items) {
    const existing = map.get(item.counterpart_id);

    if (existing) {
      existing.total_requests += 1;
      if (item.status === "completed") existing.completed_requests += 1;
    } else {
      map.set(item.counterpart_id, {
        counterpart_id: item.counterpart_id,
        counterpart_name: item.counterpart_name,
        counterpart_avatar_url: item.counterpart_avatar_url,
        total_requests: 1,
        completed_requests: item.status === "completed" ? 1 : 0,
        last_interaction_at: item.created_at,
        last_request_id: item.id,
      });
    }
  }

  return Array.from(map.values()).sort(
    (a, b) =>
      new Date(b.last_interaction_at).getTime() -
      new Date(a.last_interaction_at).getTime()
  );
}

export default async function HistorialPage() {
  const profile = await getCurrentUserProfile();
  if (!profile) return null;

  const requests =
    profile.role === "provider"
      ? await getProviderServiceRequestsDTO(profile.id)
      : await getClientServiceRequestsDTO(profile.id);

  const history = groupByCounterpart(requests);

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold">
        {profile.role === "provider" ? "Historial de clientes" : "Historial de prestadores"}
      </h1>

      {history.length === 0 ? (
        <p className="mt-6 text-sm text-muted">
          Todavía no tienes historial con nadie.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {history.map((entry) => (
            <Link
              key={entry.counterpart_id}
              href={`/panel/solicitudes/${entry.last_request_id}`}
            >
              <Card className="transition-shadow hover:shadow-soft-hover">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={entry.counterpart_avatar_url}
                      name={entry.counterpart_name}
                      size={40}
                    />
                    <div>
                      <p className="font-medium">{entry.counterpart_name}</p>
                      <p className="text-sm text-muted">
                        {entry.total_requests}{" "}
                        {entry.total_requests === 1 ? "solicitud" : "solicitudes"} ·{" "}
                        {entry.completed_requests} completada
                        {entry.completed_requests === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                  <p className="whitespace-nowrap text-xs text-muted">
                    Última vez{" "}
                    {new Date(entry.last_interaction_at).toLocaleDateString("es-CL", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
