import { z } from "zod";

export const ReviewSchema = z.object({
  rating: z.coerce
    .number()
    .int()
    .min(1, { error: "Elige una calificación." })
    .max(5),
  comment: z.string().trim().max(600).optional().or(z.literal("")),
});

export type ReviewFormState =
  | {
      errors?: {
        rating?: string[];
        comment?: string[];
      };
      message?: string;
    }
  | undefined;
