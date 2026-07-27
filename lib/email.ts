import "server-only";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// El correo es un aviso "best-effort": si falla (o si Resend no está
// configurado todavía), no debe tumbar el flujo — el reporte ya quedó
// guardado en la tabla `reports` como respaldo.
export async function sendEmergencyAlertEmail(params: {
  reporterName: string;
  providerName: string;
  details: string;
  requestId: string | null;
}) {
  const to = process.env.EMERGENCY_ALERT_EMAIL;

  if (!resend || !to) {
    console.error(
      "Emergency alert email not sent: RESEND_API_KEY o EMERGENCY_ALERT_EMAIL no están configurados."
    );
    return;
  }

  try {
    await resend.emails.send({
      from: "TodoServicios <onboarding@resend.dev>",
      to,
      subject: `🚨 Botón de emergencia — ${params.reporterName}`,
      text: [
        `${params.reporterName} presionó el botón de emergencia sobre ${params.providerName}.`,
        "",
        `Detalles: ${params.details || "(sin detalles)"}`,
        "",
        params.requestId
          ? `Solicitud relacionada: /panel/solicitudes/${params.requestId}`
          : "Reportado desde el perfil público (sin solicitud asociada).",
      ].join("\n"),
    });
  } catch (err) {
    console.error("No se pudo enviar el correo de alerta de emergencia:", err);
  }
}
