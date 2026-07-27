import { z } from "zod";

export const ReportSchema = z.object({
  reason: z.enum(
    ["unsafe_behavior", "no_show", "harassment", "fraud", "other"],
    { error: "Selecciona un motivo." }
  ),
  details: z.string().trim().max(500).optional().or(z.literal("")),
});

export type ReportFormState =
  | { errors?: { reason?: string[]; details?: string[] }; message?: string }
  | undefined;
