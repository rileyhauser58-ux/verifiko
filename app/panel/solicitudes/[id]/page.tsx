import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import {
  getRequestMessagesDTO,
  getReviewForRequestDTO,
  getServiceRequestDetailDTO,
} from "@/lib/dto";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { RequestStatusBadge } from "@/components/requests/request-status-badge";
import { RequestActions } from "@/components/requests/request-actions";
import { ChatThread } from "@/components/requests/chat-thread";
import { ReviewForm } from "@/components/providers/review-form";

export const metadata = { title: "Detalle de solicitud" };

type SolicitudPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SolicitudDetailPage({ params }: SolicitudPageProps) {
  const { id } = await params;
  const { user } = await verifySession();

  const request = await getServiceRequestDetailDTO(id);

  if (!request) notFound();

  const isClient = request.client_id === user.id;
  const isProvider = request.provider_id === user.id;

  if (!isClient && !isProvider) notFound();

  const chatAvailable = request.status === "accepted" || request.status === "completed";

  const [messages, existingReview] = await Promise.all([
    chatAvailable ? getRequestMessagesDTO(id) : Promise.resolve([]),
    isClient && request.status === "completed"
      ? getReviewForRequestDTO(id)
      : Promise.resolve(null),
  ]);

  const otherName = isClient ? request.provider_name : request.client_name;
  const otherAvatar = isClient ? request.provider_avatar_url : request.client_avatar_url;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar src={otherAvatar} name={otherName} size={48} />
            <div>
              <p className="font-semibold">{otherName}</p>
              <p className="text-xs text-muted">
                {new Date(request.created_at).toLocaleDateString("es-CL", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <RequestStatusBadge status={request.status} />
        </div>

        <p className="mt-4 text-sm leading-relaxed">{request.message}</p>

        {request.scheduled_at && (
          <p className="mt-3 text-sm font-medium text-trust">
            Agendado para{" "}
            {new Date(request.scheduled_at).toLocaleString("es-CL", {
              weekday: "long",
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}

        <div className="mt-5">
          <RequestActions
            requestId={request.id}
            status={request.status}
            isClient={isClient}
            isProvider={isProvider}
          />
        </div>
      </Card>

      {chatAvailable ? (
        <ChatThread
          requestId={request.id}
          initialMessages={messages}
          currentUserId={user.id}
          otherName={otherName}
        />
      ) : (
        <p className="text-sm text-muted">
          El chat estará disponible cuando el prestador acepte la solicitud.
        </p>
      )}

      {isClient && request.status === "completed" && !existingReview && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">Deja tu reseña</h2>
          <ReviewForm requestId={request.id} />
        </div>
      )}
    </div>
  );
}
