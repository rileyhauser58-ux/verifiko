"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { addCertification } from "@/app/actions/certifications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CertificationUpload({ userId }: { userId: string }) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) {
      setError("Selecciona un archivo.");
      return;
    }

    setPending(true);

    const supabase = createClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${userId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("certifications")
      .upload(path, file);

    if (uploadError) {
      setPending(false);
      setError("No pudimos subir el archivo. Intenta de nuevo.");
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("certifications").getPublicUrl(path);

    const result = await addCertification(publicUrl, undefined, formData);
    setPending(false);

    if (result?.message) {
      setError(result.message);
      return;
    }
    if (result?.errors) {
      const firstError = Object.values(result.errors)[0]?.[0];
      setError(firstError ?? "Revisa los datos ingresados.");
      return;
    }

    form.reset();
    setFileName(null);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-soft"
    >
      <p className="text-sm font-medium">Agregar certificación</p>

      <Input name="title" placeholder="Ej: Certificado SEC Clase A" required />
      <Input name="issuer" placeholder="Institución que la emitió (opcional)" />

      <div className="flex items-center gap-3">
        <label className="cursor-pointer">
          <span className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-primary-tint">
            Elegir archivo
          </span>
          <input
            type="file"
            name="file"
            accept="image/*,.pdf"
            className="hidden"
            required
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          />
        </label>
        {fileName && <span className="truncate text-xs text-muted">{fileName}</span>}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Subiendo…" : "Agregar certificación"}
      </Button>
    </form>
  );
}
