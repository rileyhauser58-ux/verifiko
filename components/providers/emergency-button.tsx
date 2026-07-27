"use client";

import { useState } from "react";
import { triggerEmergencyAlert } from "@/app/actions/reports";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const EMERGENCY_NUMBERS = [
  { label: "Carabineros", number: "133" },
  { label: "Ambulancia (SAMU)", number: "131" },
  { label: "Bomberos", number: "132" },
];

export function EmergencyButton({
  reportedProviderId,
  requestId,
}: {
  reportedProviderId: string;
  requestId: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSend() {
    setPending(true);
    const result = await triggerEmergencyAlert(reportedProviderId, requestId, details);
    setPending(false);
    setMessage(result.message);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
      >
        🚨 Emergencia
      </button>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/40">
      <p className="text-sm font-semibold text-red-700 dark:text-red-400">
        Si estás en peligro ahora mismo, llama directo:
      </p>

      <div className="flex flex-wrap gap-2">
        {EMERGENCY_NUMBERS.map((item) => (
          <a
            key={item.number}
            href={`tel:${item.number}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
          >
            {item.label}: {item.number}
          </a>
        ))}
      </div>

      <div className="border-t border-red-200 pt-3 dark:border-red-900/50">
        <p className="text-xs text-red-700 dark:text-red-400">
          También puedes avisarle de inmediato a nuestro equipo:
        </p>
        <Textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="¿Qué está pasando? (opcional)"
          rows={2}
          className="mt-2"
        />
        <div className="mt-2 flex items-center gap-2">
          <Button type="button" onClick={handleSend} disabled={pending}>
            {pending ? "Enviando…" : "Notificar al equipo ahora"}
          </Button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-xs text-muted hover:underline"
          >
            Cerrar
          </button>
        </div>
        {message && <p className="mt-2 text-sm text-red-700 dark:text-red-400">{message}</p>}
      </div>
    </div>
  );
}
