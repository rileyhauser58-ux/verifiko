"use client";

import { useActionState } from "react";
import { createServiceRequest } from "@/app/actions/service-requests";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ServiceRequestForm({ providerId }: { providerId: string }) {
  const action = createServiceRequest.bind(null, providerId);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
      <p className="text-sm font-medium">Solicitar este servicio</p>

      <Textarea
        name="message"
        placeholder="Cuéntale al prestador qué necesitas (mínimo 20 caracteres)"
        rows={3}
        required
        minLength={20}
      />
      {state?.errors?.message && (
        <p className="text-xs text-red-600">{state.errors.message[0]}</p>
      )}

      {state?.message && <p className="text-sm text-red-600">{state.message}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Enviando…" : "Enviar solicitud"}
      </Button>
    </form>
  );
}
