import { z } from "zod";

export const ProviderProfileSchema = z.object({
  business_name: z.string().trim().max(120).optional().or(z.literal("")),
  bio: z
    .string()
    .trim()
    .min(20, { error: "Cuéntale a los usuarios un poco más sobre tu trabajo (mínimo 20 caracteres)." })
    .max(1000),
  years_experience: z.coerce
    .number()
    .int()
    .min(0)
    .max(80)
    .optional(),
  category_ids: z
    .array(z.coerce.number().int())
    .min(1, { error: "Selecciona al menos un rubro." }),
  comuna_ids: z
    .array(z.coerce.number().int())
    .min(1, { error: "Selecciona al menos una comuna." }),
});

export type ProviderProfileFormState =
  | {
      errors?: {
        business_name?: string[];
        bio?: string[];
        years_experience?: string[];
        category_ids?: string[];
        comuna_ids?: string[];
      };
      message?: string;
    }
  | undefined;
