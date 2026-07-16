"use client";

import { useActionState } from "react";
import {
  cancelRequest,
  markRequestCompleted,
  rescheduleRequest,
  respondToRequest,
} from "@/app/actions/service-requests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RequestStatus } from "@/types/domain";

function ActionForm({
  action,
  label,
  variant = "primary",
}: {
  action: (state: { message?: string } | undefined, formData: FormData) => Promise<{ message?: string } | undefined>;
  label: string;
  variant?: "primary" | "secondary";
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="inline-flex flex-col items-start gap-1">
      <Button type="submit" variant={variant} disabled={pending}>
        {pending ? "Guardando…" : label}
      </Button>
      {state?.message && <p className="text-xs text-red-600">{state.message}</p>}
    </form>
  );
}

function ScheduleForm({
  action,
  label,
  variant = "primary",
}: {
  action: (
    state: { errors?: { scheduled_at?: string[] }; message?: string } | undefined,
    formData: FormData
  ) => Promise<{ errors?: { scheduled_at?: string[] }; message?: string } | undefined>;
  label: string;
  variant?: "primary" | "secondary";
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col items-start gap-1">
      <Input type="datetime-local" name="scheduled_at" required className="w-auto" />
      {state?.errors?.scheduled_at && (
        <p className="text-xs text-red-600">{state.errors.scheduled_at[0]}</p>
      )}
      <Button type="submit" variant={variant} disabled={pending}>
        {pending ? "Guardando…" : label}
      </Button>
      {state?.message && <p className="text-xs text-red-600">{state.message}</p>}
    </form>
  );
}

export function RequestActions({
  requestId,
  status,
  isClient,
  isProvider,
}: {
  requestId: string;
  status: RequestStatus;
  isClient: boolean;
  isProvider: boolean;
}) {
  const actions: React.ReactNode[] = [];

  if (isProvider && status === "pending") {
    actions.push(
      <ScheduleForm
        key="accept"
        action={respondToRequest.bind(null, requestId, "accepted")}
        label="Aceptar y agendar"
      />,
      <ActionForm
        key="decline"
        action={respondToRequest.bind(null, requestId, "declined")}
        label="Rechazar"
        variant="secondary"
      />
    );
  }

  if (isClient && status === "pending") {
    actions.push(
      <ActionForm
        key="cancel"
        action={cancelRequest.bind(null, requestId)}
        label="Cancelar solicitud"
        variant="secondary"
      />
    );
  }

  if ((isClient || isProvider) && status === "accepted") {
    actions.push(
      <ScheduleForm
        key="reschedule"
        action={rescheduleRequest.bind(null, requestId)}
        label="Reagendar"
        variant="secondary"
      />,
      <ActionForm
        key="complete"
        action={markRequestCompleted.bind(null, requestId)}
        label="Marcar como completado"
      />
    );
  }

  if (actions.length === 0) return null;

  return <div className="flex flex-wrap items-start gap-3">{actions}</div>;
}
