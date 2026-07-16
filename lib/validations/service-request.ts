import { z } from "zod";

export const ServiceRequestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(20, {
      error: "Cuéntale al prestador qué necesitas (mínimo 20 caracteres).",
    })
    .max(500),
});

export type ServiceRequestFormState =
  | { errors?: { message?: string[] }; message?: string }
  | undefined;

export type RequestActionState = { message?: string } | undefined;

export const ScheduleSchema = z.object({
  scheduled_at: z.coerce.date().refine(
    (date) => date.getTime() >= Date.now() + 60 * 60 * 1000,
    { error: "Elige una fecha y hora con al menos 1 hora de anticipación." }
  ),
});

export type ScheduleFormState =
  | { errors?: { scheduled_at?: string[] }; message?: string }
  | undefined;
