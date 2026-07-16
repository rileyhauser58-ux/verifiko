import { z } from "zod";

export const MessageSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, { error: "Escribe un mensaje." })
    .max(1000),
});

export type MessageFormState =
  | { errors?: { body?: string[] }; message?: string }
  | undefined;
