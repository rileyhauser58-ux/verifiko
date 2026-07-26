"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function UpdatePasswordForm() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setPending(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setPending(false);

    if (updateError) {
      setError("No pudimos actualizar tu contraseña. Intenta de nuevo.");
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/panel"), 1500);
  }

  if (!ready) {
    return (
      <p className="text-sm text-muted">
        Este link no es válido o ya expiró.{" "}
        <Link href="/olvide-password" className="text-primary hover:underline">
          Solicita uno nuevo
        </Link>
        .
      </p>
    );
  }

  if (done) {
    return (
      <p className="text-sm text-trust">
        Contraseña actualizada. Redirigiendo…
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium">
          Nueva contraseña
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Guardando…" : "Actualizar contraseña"}
      </Button>
    </form>
  );
}
