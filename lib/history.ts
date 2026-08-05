import type { HistoryEntry, ServiceRequestListItem } from "@/types/domain";

// Los items ya vienen ordenados desc por created_at desde las DTOs de
// solicitudes, así que el primer registro por contraparte es el más reciente.
export function groupByCounterpart(items: ServiceRequestListItem[]): HistoryEntry[] {
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
