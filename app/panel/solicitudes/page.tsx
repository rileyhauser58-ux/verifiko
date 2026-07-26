import Link from "next/link";
import { getCurrentUserProfile } from "@/lib/dal";
import {
  getClientServiceRequestsDTO,
  getProviderServiceRequestsDTO,
} from "@/lib/dto";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { RequestStatusBadge } from "@/components/requests/request-status-badge";

export const metadata = { title: "Mis solicitudes" };

export default async function SolicitudesPage() {
  const profile = await getCurrentUserProfile();
  if (!profile) return null;

  const requests =
    profile.role === "provider"
      ? await getProviderServiceRequestsDTO(profile.id)
      : await getClientServiceRequestsDTO(profile.id);

  return (
    <div>
      <h1 className="text-2xl font-semibold">
        {profile.role === "provider" ? "Solicitudes recibidas" : "Mis solicitudes"}
      </h1>

      {requests.length === 0 ? (
        <p className="mt-6 text-sm text-muted">
          {profile.role === "provider"
            ? "Todavía no has recibido solicitudes."
            : "Todavía no has enviado ninguna solicitud."}
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {requests.map((request) => (
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
                  <RequestStatusBadge status={request.status} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
