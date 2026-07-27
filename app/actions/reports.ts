"use server";

import { createClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal";
import { sendEmergencyAlertEmail } from "@/lib/email";
import { ReportSchema, type ReportFormState } from "@/lib/validations/report";

export async function submitReport(
  reportedProviderId: string,
  requestId: string | null,
  _state: ReportFormState,
  formData: FormData
): Promise<ReportFormState> {
  const { user } = await verifySession();

  if (user.id === reportedProviderId) {
    return { message: "No puedes reportarte a ti mismo." };
  }

  const validated = ReportSchema.safeParse({
    reason: formData.get("reason"),
    details: formData.get("details"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("reports").insert({
    reporter_id: user.id,
    reported_provider_id: reportedProviderId,
    request_id: requestId,
    reason: validated.data.reason,
    details: validated.data.details || null,
  });

  if (error) {
    return { message: "No pudimos enviar tu reporte. Intenta de nuevo." };
  }

  return {
    message: "Gracias, tu reporte fue enviado y lo vamos a revisar.",
  };
}

export async function triggerEmergencyAlert(
  reportedProviderId: string,
  requestId: string | null,
  details: string
): Promise<{ message: string }> {
  const { user } = await verifySession();

  if (user.id === reportedProviderId) {
    return { message: "No puedes reportarte a ti mismo." };
  }

  const supabase = await createClient();

  const [{ data: reporterProfile }, { data: providerData }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).single(),
    supabase
      .from("provider_profiles")
      .select("business_name, profiles!inner(full_name)")
      .eq("id", reportedProviderId)
      .single(),
  ]);

  const providerRow = providerData as unknown as {
    business_name: string | null;
    profiles: { full_name: string } | { full_name: string }[] | null;
  } | null;
  const providerProfile = Array.isArray(providerRow?.profiles)
    ? providerRow?.profiles[0]
    : providerRow?.profiles;

  const reporterName = reporterProfile?.full_name ?? "Un usuario";
  const providerName =
    providerRow?.business_name ?? providerProfile?.full_name ?? "un prestador";

  const { error } = await supabase.from("reports").insert({
    reporter_id: user.id,
    reported_provider_id: reportedProviderId,
    request_id: requestId,
    reason: "unsafe_behavior",
    details: details || null,
    is_emergency: true,
  });

  if (error) {
    return {
      message:
        "No pudimos registrar la alerta, pero si es una emergencia real llama igual a Carabineros.",
    };
  }

  await sendEmergencyAlertEmail({ reporterName, providerName, details, requestId });

  return { message: "Alerta enviada. Nuestro equipo fue notificado." };
}
