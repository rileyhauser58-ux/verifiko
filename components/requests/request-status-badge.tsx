import type { RequestStatus } from "@/types/domain";

const LABELS: Record<RequestStatus, string> = {
  pending: "Pendiente",
  accepted: "Aceptada",
  declined: "Rechazada",
  completed: "Completada",
  cancelled: "Cancelada",
};

const STYLES: Record<RequestStatus, string> = {
  pending: "bg-primary-tint text-primary-hover",
  accepted: "bg-trust-tint text-trust",
  completed: "bg-trust-tint text-trust",
  declined: "bg-border/60 text-muted",
  cancelled: "bg-border/60 text-muted",
};

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
