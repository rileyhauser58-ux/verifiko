"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile, verifySession } from "@/lib/dal";
import {
  CertificationSchema,
  type CertificationFormState,
} from "@/lib/validations/certification";

export async function addCertification(
  fileUrl: string,
  _state: CertificationFormState,
  formData: FormData
): Promise<CertificationFormState> {
  const { user } = await verifySession();
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== "provider") {
    return {
      message: "Solo las cuentas de prestador pueden agregar certificaciones.",
    };
  }

  const validated = CertificationSchema.safeParse({
    title: formData.get("title"),
    issuer: formData.get("issuer"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("provider_certifications").insert({
    provider_id: user.id,
    title: validated.data.title,
    issuer: validated.data.issuer || null,
    file_url: fileUrl,
  });

  if (error) {
    return { message: "No pudimos guardar la certificación. Intenta de nuevo." };
  }

  revalidatePath("/panel/certificaciones");
  revalidatePath(`/prestadores/${user.id}`);
}

export async function deleteCertification(certificationId: string) {
  const { user } = await verifySession();
  const supabase = await createClient();

  await supabase
    .from("provider_certifications")
    .delete()
    .eq("id", certificationId)
    .eq("provider_id", user.id);

  revalidatePath("/panel/certificaciones");
  revalidatePath(`/prestadores/${user.id}`);
}
