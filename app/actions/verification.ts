"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile, verifySession } from "@/lib/dal";
import type { DocumentType } from "@/types/domain";

export async function recordVerificationDocument(
  documentType: DocumentType,
  storagePath: string
): Promise<{ message?: string } | undefined> {
  const { user } = await verifySession();
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== "provider") {
    return { message: "Solo las cuentas de prestador pueden subir documentos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("verification_documents").upsert(
    {
      provider_id: user.id,
      document_type: documentType,
      storage_path: storagePath,
      status: "pending",
    },
    { onConflict: "provider_id,document_type" }
  );

  if (error) {
    return { message: "No pudimos registrar el documento. Intenta de nuevo." };
  }

  revalidatePath("/panel/verificacion");
}
