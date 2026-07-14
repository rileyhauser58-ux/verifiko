import { z } from "zod";

export const SignupSchema = z.object({
  full_name: z
    .string()
    .min(2, { error: "El nombre debe tener al menos 2 caracteres." })
    .trim(),
  email: z.email({ error: "Ingresa un correo válido." }).trim(),
  password: z
    .string()
    .min(8, { error: "La contraseña debe tener al menos 8 caracteres." }),
  role: z.enum(["client", "provider"], {
    error: "Selecciona un tipo de cuenta.",
  }),
});

export type SignupFormState =
  | {
      errors?: {
        full_name?: string[];
        email?: string[];
        password?: string[];
        role?: string[];
      };
      message?: string;
    }
  | undefined;

export const LoginSchema = z.object({
  email: z.email({ error: "Ingresa un correo válido." }).trim(),
  password: z.string().min(1, { error: "Ingresa tu contraseña." }),
});

export type LoginFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;
