"use server";

import { createClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal";
import { maskContactInfo } from "@/lib/masking";
import { MessageSchema, type MessageFormState } from "@/lib/validations/message";

export async function sendMessage(
  requestId: string,
  _state: MessageFormState,
  formData: FormData
): Promise<MessageFormState> {
  const { user } = await verifySession();

  const validated = MessageSchema.safeParse({
    body: formData.get("body"),
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

  if (!request || (request.client_id !== user.id && request.provider_id !== user.id)) {
    return { message: "No tienes acceso a esta conversación." };
  }

  if (request.status !== "accepted" && request.status !== "completed") {
    return { message: "El chat solo está disponible en solicitudes aceptadas." };
  }

  const { error } = await supabase.from("messages").insert({
    request_id: requestId,
    sender_id: user.id,
    body: maskContactInfo(validated.data.body),
  });

  if (error) {
    return { message: "No pudimos enviar tu mensaje. Intenta de nuevo." };
  }
}
