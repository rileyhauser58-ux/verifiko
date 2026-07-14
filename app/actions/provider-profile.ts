"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile, verifySession } from "@/lib/dal";
import {
  ProviderProfileSchema,
  type ProviderProfileFormState,
} from "@/lib/validations/provider";

export async function updateProviderProfile(
  _state: ProviderProfileFormState,
  formData: FormData
): Promise<ProviderProfileFormState> {
  const { user } = await verifySession();
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== "provider") {
    return {
      message: "Solo las cuentas de prestador pueden editar este perfil.",
    };
  }

  const validated = ProviderProfileSchema.safeParse({
    business_name: formData.get("business_name"),
    bio: formData.get("bio"),
    years_experience: formData.get("years_experience") || undefined,
    category_ids: formData.getAll("category_ids"),
    comuna_ids: formData.getAll("comuna_ids"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { business_name, bio, years_experience, category_ids, comuna_ids } =
    validated.data;
  const supabase = await createClient();

  const { error: upsertError } = await supabase
    .from("provider_profiles")
    .upsert({
      id: user.id,
      business_name: business_name || null,
      bio,
      years_experience: years_experience ?? null,
    });

  if (upsertError) {
    return { message: "No pudimos guardar tu perfil. Intenta de nuevo." };
  }

  await supabase.from("provider_categories").delete().eq("provider_id", user.id);
  const { error: categoriesError } = await supabase
    .from("provider_categories")
    .insert(
      category_ids.map((category_id) => ({
        provider_id: user.id,
        category_id,
      }))
    );

  await supabase.from("provider_zones").delete().eq("provider_id", user.id);
  const { error: zonesError } = await supabase.from("provider_zones").insert(
    comuna_ids.map((comuna_id) => ({
      provider_id: user.id,
      comuna_id,
    }))
  );

  if (categoriesError || zonesError) {
    return { message: "Guardamos tu perfil, pero hubo un problema con rubros/comunas. Revisa e intenta de nuevo." };
  }

  revalidatePath(`/prestadores/${user.id}`);
  revalidatePath("/buscar");

  return { message: "Perfil guardado." };
}
