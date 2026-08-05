import { z } from "zod";

export const CertificationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { error: "Escribe el nombre de la certificación." })
    .max(120),
  issuer: z.string().trim().max(120).optional().or(z.literal("")),
});

export type CertificationFormState =
  | {
      errors?: {
        title?: string[];
        issuer?: string[];
      };
      message?: string;
    }
  | undefined;
