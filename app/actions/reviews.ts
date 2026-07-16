"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal";
import { ReviewSchema, type ReviewFormState } from "@/lib/validations/review";

export async function submitReview(
  requestId: string,
  _state: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const { user } = await verifySession();

  const validated = ReviewSchema.safeParse({
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: request } = await supabase
    .from("service_requests")
    .select("id, client_id, provider_id, status")
    .eq("id", requestId)
    .single();

  if (!request || request.client_id !== user.id) {
    return { message: "No puedes reseñar esta solicitud." };
  }

  if (request.status !== "completed") {
    return { message: "Solo puedes reseñar trabajos completados." };
  }

  const { error } = await supabase.from("reviews").insert({
    request_id: requestId,
    provider_id: request.provider_id,
    reviewer_id: user.id,
    rating: validated.data.rating,
    comment: validated.data.comment || null,
  });

  if (error) {
    if (error.code === "23505") {
      return { message: "Ya reseñaste este trabajo." };
    }
    return { message: "No pudimos guardar tu reseña. Intenta de nuevo." };
  }

  revalidatePath(`/prestadores/${request.provider_id}`);
  revalidatePath(`/panel/solicitudes/${requestId}`);
  return { message: "¡Gracias por tu reseña!" };
}
