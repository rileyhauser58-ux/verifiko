"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal";

export async function createLocationShare(
  requestId: string
): Promise<{ shareId?: string; shareToken?: string; message?: string }> {
  const { user } = await verifySession();
  const supabase = await createClient();

  const { data: request } = await supabase
    .from("service_requests")
    .select("id, client_id, provider_id, status")
    .eq("id", requestId)
    .single();

  if (!request || (request.client_id !== user.id && request.provider_id !== user.id)) {
    return { message: "No tienes acceso a esta solicitud." };
  }

  if (request.status !== "accepted") {
    return { message: "Solo puedes compartir tu ubicación en una solicitud aceptada." };
  }

  const { data: inserted, error } = await supabase
    .from("location_shares")
    .insert({ request_id: requestId, created_by: user.id })
    .select("id, share_token")
    .single();

  if (error || !inserted) {
    return { message: "No pudimos generar el link. Intenta de nuevo." };
  }

  return { shareId: inserted.id, shareToken: inserted.share_token };
}

export async function deactivateLocationShare(
  shareId: string
): Promise<{ message?: string } | undefined> {
  const { user } = await verifySession();
  const supabase = await createClient();

  const { error } = await supabase
    .from("location_shares")
    .update({ active: false })
    .eq("id", shareId)
    .eq("created_by", user.id);

  if (error) {
    return { message: "No pudimos dejar de compartir. Intenta de nuevo." };
  }

  revalidatePath("/panel/solicitudes");
}
