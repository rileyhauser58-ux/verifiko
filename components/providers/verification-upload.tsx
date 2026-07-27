"use client";

import { useState, useTransition, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { recordVerificationDocument } from "@/app/actions/verification";
import type { DocumentStatus, DocumentType } from "@/types/domain";

const LABELS: Record<DocumentType, string> = {
  id_card: "Foto del carnet de identidad",
  selfie: "Selfie sosteniendo el carnet",
  background_check: "Certificado de antecedentes",
};

const STATUS_LABELS: Record<DocumentStatus, string> = {
  pending: "Pendiente de revisión",
  approved: "Aprobado",
  rejected: "Rechazado, vuelve a subirlo",
};

export function VerificationUpload({
  userId,
  documentType,
  currentStatus,
}: {
  userId: string;
  documentType: DocumentType;
  currentStatus: DocumentStatus | null;
}) {
  const [status, setStatus] = useState<DocumentStatus | null>(currentStatus);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    const supabase = createClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${userId}/${documentType}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("verification-docs")
      .upload(path, file, { upsert: true });

    setUploading(false);

    if (uploadError) {
      setError("No pudimos subir el archivo. Intenta de nuevo.");
      return;
    }

    startTransition(async () => {
      const result = await recordVerificationDocument(documentType, path);
      if (result?.message) {
        setError(result.message);
        return;
      }
      setStatus("pending");
      router.refresh();
    });
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div>
        <p className="text-sm font-medium">{LABELS[documentType]}</p>
        <p className="mt-0.5 text-xs text-muted">
          {status ? STATUS_LABELS[status] : "Todavía no lo has subido"}
        </p>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>

      <label className="cursor-pointer">
        <span className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-primary-tint">
          {uploading || isPending ? "Subiendo…" : status ? "Reemplazar" : "Subir"}
        </span>
        <input
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={handleChange}
          disabled={uploading || isPending}
        />
      </label>
    </div>
  );
}
