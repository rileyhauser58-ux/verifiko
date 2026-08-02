"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  LoginSchema,
  RequestResetSchema,
  SignupSchema,
  type LoginFormState,
  type RequestResetFormState,
  type SignupFormState,
} from "@/lib/validations/auth";

export async function signUp(
  _state: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const validated = SignupSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    accepted_terms: formData.get("accepted_terms"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { full_name, email, password, role } = validated.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name, role } },
  });

  if (error) {
    return {
      message:
        error.code === "user_already_exists"
          ? "Ya existe una cuenta con ese correo."
          : "No pudimos crear tu cuenta. Intenta de nuevo.",
    };
  }

  if (!data.session) {
    return {
      message: "Revisa tu correo para confirmar tu cuenta antes de ingresar.",
    };
  }

  redirect(role === "provider" ? "/panel/perfil" : "/panel");
}

export async function signIn(
  _state: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const validated = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(validated.data);

  if (error) {
    return { message: "Correo o contraseña incorrectos." };
  }

  redirect("/panel");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function requestPasswordReset(
  _state: RequestResetFormState,
  formData: FormData
): Promise<RequestResetFormState> {
  const validated = RequestResetSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  await supabase.auth.resetPasswordForEmail(validated.data.email, {
    redirectTo: `${siteUrl}/actualizar-password`,
  });

  // Siempre el mismo mensaje exista o no la cuenta, para no filtrar qué
  // correos están registrados (mismo comportamiento anti-enumeración que
  // ya tiene Supabase internamente).
  return {
    message:
      "Si el correo existe, te enviamos un link para restablecer tu contraseña.",
  };
}
