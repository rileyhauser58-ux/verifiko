"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal";
import { ReviewSchema, type ReviewFormState } from "@/lib/validations/review";

export async function submitReview(
  providerId: string,
  _state: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const { user } = await verifySession();

  if (user.id === providerId) {
    return { message: "No puedes reseñarte a ti mismo." };
  }

  const validated = ReviewSchema.safeParse({
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("reviews").insert({
    provider_id: providerId,
    reviewer_id: user.id,
    rating: validated.data.rating,
    comment: validated.data.comment || null,
  });

  if (error) {
    if (error.code === "23505") {
      return { message: "Ya reseñaste a este prestador." };
    }
    return { message: "No pudimos guardar tu reseña. Intenta de nuevo." };
  }

  revalidatePath(`/prestadores/${providerId}`);
  return { message: "¡Gracias por tu reseña!" };
}
