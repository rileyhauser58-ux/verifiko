import Link from "next/link";
import { getCurrentUserProfile } from "@/lib/dal";
import {
  getClientServiceRequestsDTO,
  getProviderServiceRequestsDTO,
} from "@/lib/dto";
import { groupByCounterpart } from "@/lib/history";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Historial" };

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
