"use client";

import { useActionState, useState } from "react";
import { submitReport } from "@/app/actions/reports";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const REASON_LABELS: Record<string, string> = {
  unsafe_behavior: "Comportamiento inseguro",
  no_show: "No se presentó",
  harassment: "Acoso",
  fraud: "Fraude",
  other: "Otro",
};

export function ReportButton({
  reportedProviderId,
  requestId,
}: {
  reportedProviderId: string;
  requestId: string | null;
}) {
  const [open, setOpen] = useState(false);
  const action = submitReport.bind(null, reportedProviderId, requestId);
  const [state, formAction, pending] = useActionState(action, undefined);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-muted hover:text-red-600 hover:underline"
      >
        Reportar
      </button>
    );
  }

  if (state?.message && !state.errors) {
    return <p className="text-sm text-trust">{state.message}</p>;
  }

  return (
    <form
      action={formAction}
      className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-soft"
    >
      <p className="text-sm font-medium">Reportar a este prestador</p>

      <Select name="reason" defaultValue="" required>
        <option value="" disabled>
          Elige un motivo
        </option>
        {Object.entries(REASON_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
      {state?.errors?.reason && (
        <p className="text-xs text-red-600">{state.errors.reason[0]}</p>
      )}

      <Textarea name="details" placeholder="Cuéntanos qué pasó (opcional)" rows={3} />

      {state?.message && <p className="text-sm text-red-600">{state.message}</p>}

      <div className="flex gap-2">
        <Button type="submit" variant="secondary" disabled={pending}>
          {pending ? "Enviando…" : "Enviar reporte"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
