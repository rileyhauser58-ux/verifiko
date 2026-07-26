"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RequestResetForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, undefined);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">
          Correo
        </label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
        {state?.errors?.email && (
          <p className="text-xs text-red-600">{state.errors.email[0]}</p>
        )}
      </div>

      {state?.message && <p className="text-sm text-trust">{state.message}</p>}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Enviando…" : "Enviar link de recuperación"}
      </Button>

      <p className="text-center text-sm text-muted">
        <Link href="/ingresar" className="text-primary hover:underline">
          Volver a ingresar
        </Link>
      </p>
    </form>
  );
}
