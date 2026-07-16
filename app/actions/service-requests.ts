"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal";
import {
  ScheduleSchema,
  ServiceRequestSchema,
  type RequestActionState,
  type ScheduleFormState,
  type ServiceRequestFormState,
} from "@/lib/validations/service-request";

export async function createServiceRequest(
  providerId: string,
  _state: ServiceRequestFormState,
  formData: FormData
): Promise<ServiceRequestFormState> {
  const { user } = await verifySession();

  if (user.id === providerId) {
    return { message: "No puedes solicitarte un servicio a ti mismo." };
  }

  const validated = ServiceRequestSchema.safeParse({
    message: formData.get("message"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("service_requests")
    .select("id")
    .eq("client_id", user.id)
    .eq("provider_id", providerId)
    .in("status", ["pending", "accepted"])
    .maybeSingle();

  if (existing) {
    return { message: "Ya tienes una solicitud activa con este prestador." };
  }

  const { data: inserted, error } = await supabase
    .from("service_requests")
    .insert({
      client_id: user.id,
      provider_id: providerId,
      message: validated.data.message,
    })
    .select("id")
    .single();

  if (error || !inserted) {
    return { message: "No pudimos enviar tu solicitud. Intenta de nuevo." };
  }

  revalidatePath(`/prestadores/${providerId}`);
  revalidatePath("/panel/solicitudes");
  redirect(`/panel/solicitudes/${inserted.id}`);
}

export async function respondToRequest(
  requestId: string,
  decision: "accepted" | "declined",
  _state: ScheduleFormState,
  formData: FormData
): Promise<ScheduleFormState> {
  const { user } = await verifySession();
  const supabase = await createClient();

  const { data: request } = await supabase
    .from("service_requests")
    .select("id, provider_id, status")
    .eq("id", requestId)
    .single();

  if (!request || request.provider_id !== user.id) {
    return { message: "No tienes acceso a esta solicitud." };
  }

  if (request.status !== "pending") {
    return { message: "Esta solicitud ya fue respondida." };
  }

  const update: { status: "accepted" | "declined"; updated_at: string; scheduled_at?: string } = {
    status: decision,
    updated_at: new Date().toISOString(),
  };

  if (decision === "accepted") {
    const validated = ScheduleSchema.safeParse({
      scheduled_at: formData.get("scheduled_at"),
    });

    if (!validated.success) {
      return { errors: validated.error.flatten().fieldErrors };
    }

    update.scheduled_at = validated.data.scheduled_at.toISOString();
  }

  const { error } = await supabase
    .from("service_requests")
    .update(update)
    .eq("id", requestId);

  if (error) {
    return { message: "No pudimos actualizar la solicitud." };
  }

  revalidatePath(`/panel/solicitudes/${requestId}`);
  revalidatePath("/panel/solicitudes");
  revalidatePath("/panel/agenda");
}

export async function rescheduleRequest(
  requestId: string,
  _state: ScheduleFormState,
  formData: FormData
): Promise<ScheduleFormState> {
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
    return { message: "Solo puedes reagendar solicitudes aceptadas." };
  }

  const validated = ScheduleSchema.safeParse({
    scheduled_at: formData.get("scheduled_at"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { error } = await supabase
    .from("service_requests")
    .update({
      scheduled_at: validated.data.scheduled_at.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (error) {
    return { message: "No pudimos reagendar la solicitud." };
  }

  revalidatePath(`/panel/solicitudes/${requestId}`);
  revalidatePath("/panel/agenda");
}

export async function cancelRequest(
  requestId: string,
  _state: RequestActionState,
  _formData: FormData
): Promise<RequestActionState> {
  const { user } = await verifySession();
  const supabase = await createClient();

  const { data: request } = await supabase
    .from("service_requests")
    .select("id, client_id, status")
    .eq("id", requestId)
    .single();

  if (!request || request.client_id !== user.id) {
    return { message: "No tienes acceso a esta solicitud." };
  }

  if (request.status !== "pending") {
    return { message: "Solo puedes cancelar solicitudes pendientes." };
  }

  const { error } = await supabase
    .from("service_requests")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", requestId);

  if (error) {
    return { message: "No pudimos cancelar la solicitud." };
  }

  revalidatePath(`/panel/solicitudes/${requestId}`);
  revalidatePath("/panel/solicitudes");
}

export async function markRequestCompleted(
  requestId: string,
  _state: RequestActionState,
  _formData: FormData
): Promise<RequestActionState> {
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
    return { message: "Solo puedes completar solicitudes aceptadas." };
  }

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("service_requests")
    .update({ status: "completed", completed_at: now, updated_at: now })
    .eq("id", requestId);

  if (error) {
    return { message: "No pudimos marcar la solicitud como completada." };
  }

  revalidatePath(`/panel/solicitudes/${requestId}`);
  revalidatePath("/panel/solicitudes");
}
