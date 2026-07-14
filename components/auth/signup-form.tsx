"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUp } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { UserRole } from "@/types/domain";

export function SignupForm() {
  const [state, action, pending] = useActionState(signUp, undefined);
  const [role, setRole] = useState<UserRole>("client");

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1">
        <span className="text-sm font-medium">Quiero…</span>
        <div className="grid grid-cols-2 gap-2">
          <label
            className={`cursor-pointer rounded-md border px-3 py-2 text-center text-sm transition-colors ${
              role === "client"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border"
            }`}
          >
            <input
              type="radio"
              name="role"
              value="client"
              checked={role === "client"}
              onChange={() => setRole("client")}
              className="sr-only"
            />
            Contratar un servicio
          </label>
          <label
            className={`cursor-pointer rounded-md border px-3 py-2 text-center text-sm transition-colors ${
              role === "provider"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border"
            }`}
          >
            <input
              type="radio"
              name="role"
              value="provider"
              checked={role === "provider"}
              onChange={() => setRole("provider")}
              className="sr-only"
            />
            Ofrecer un servicio
          </label>
        </div>
        {state?.errors?.role && (
          <p className="text-xs text-red-600">{state.errors.role[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="full_name" className="text-sm font-medium">
          Nombre completo
        </label>
        <Input id="full_name" name="full_name" required autoComplete="name" />
        {state?.errors?.full_name && (
          <p className="text-xs text-red-600">{state.errors.full_name[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">
          Correo
        </label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
        {state?.errors?.email && (
          <p className="text-xs text-red-600">{state.errors.email[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium">
          Contraseña
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
        />
        {state?.errors?.password && (
          <p className="text-xs text-red-600">{state.errors.password[0]}</p>
        )}
      </div>

      {state?.message && (
        <p className="text-sm text-trust">{state.message}</p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creando cuenta…" : "Crear cuenta"}
      </Button>

      <p className="text-center text-sm text-muted">
        ¿Ya tienes cuenta?{" "}
        <Link href="/ingresar" className="text-primary hover:underline">
          Ingresa
        </Link>
      </p>
    </form>
  );
}
