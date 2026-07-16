import type { RequestStatus } from "@/types/domain";

const LABELS: Record<RequestStatus, string> = {
  pending: "Pendiente",
  accepted: "Aceptada",
  declined: "Rechazada",
  completed: "Completada",
  cancelled: "Cancelada",
};

const STYLES: Record<RequestStatus, string> = {
  pending: "bg-primary/10 text-primary",
  accepted: "bg-trust/10 text-trust",
  completed: "bg-trust/10 text-trust",
  declined: "bg-black/5 text-muted dark:bg-white/10",
  cancelled: "bg-black/5 text-muted dark:bg-white/10",
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
