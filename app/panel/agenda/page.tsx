import Link from "next/link";
import { getCurrentUserProfile } from "@/lib/dal";
import {
  getClientServiceRequestsDTO,
  getProviderServiceRequestsDTO,
} from "@/lib/dto";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import type { ServiceRequestListItem } from "@/types/domain";

export const metadata = { title: "Mi agenda" };

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function dateHeader(date: Date) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (isSameDay(date, today)) return "Hoy";
  if (isSameDay(date, tomorrow)) return "Mañana";

  return date.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function groupByDate(requests: ServiceRequestListItem[]) {
  const groups: { header: string; items: ServiceRequestListItem[] }[] = [];

  for (const request of requests) {
    if (!request.scheduled_at) continue;
    const header = dateHeader(new Date(request.scheduled_at));
    const group = groups.find((g) => g.header === header);
    if (group) {
      group.items.push(request);
    } else {
      groups.push({ header, items: [request] });
    }
  }

  return groups;
}

export default async function AgendaPage() {
  const profile = await getCurrentUserProfile();
  if (!profile) return null;

  const requests =
    profile.role === "provider"
      ? await getProviderServiceRequestsDTO(profile.id)
      : await getClientServiceRequestsDTO(profile.id);

  const scheduled = requests
    .filter((r) => r.status === "accepted" && r.scheduled_at)
    .sort(
      (a, b) =>
        new Date(a.scheduled_at!).getTime() - new Date(b.scheduled_at!).getTime()
    );

  const groups = groupByDate(scheduled);

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold">
        {profile.role === "provider" ? "Mi agenda" : "Tus servicios agendados"}
      </h1>

      {groups.length === 0 ? (
        <p className="mt-6 text-sm text-muted">
          {profile.role === "provider"
            ? "No tienes trabajos agendados por ahora."
            : "No tienes servicios agendados por ahora."}
        </p>
      ) : (
        <div className="mt-6 space-y-8">
          {groups.map((group) => (
            <div key={group.header}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
                {group.header}
              </h2>
              <div className="space-y-3">
                {group.items.map((request) => (
                  <Link key={request.id} href={`/panel/solicitudes/${request.id}`}>
                    <Card className="transition-shadow hover:shadow-soft-hover">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={request.counterpart_avatar_url}
                            name={request.counterpart_name}
                            size={40}
                          />
                          <div>
                            <p className="font-medium">{request.counterpart_name}</p>
                            <p className="line-clamp-1 text-sm text-muted">
                              {request.message}
                            </p>
                          </div>
                        </div>
                        <p className="whitespace-nowrap text-sm font-medium text-trust">
                          {new Date(request.scheduled_at!).toLocaleTimeString("es-CL", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
