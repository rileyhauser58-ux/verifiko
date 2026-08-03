import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/domain";

// Si la cookie de sesión llega corrupta (ej. dos logins en pestañas
// distintas del mismo navegador pisándose los fragmentos de la cookie),
// getUser() puede lanzar en vez de simplemente devolver "sin usuario". Se
// trata igual que "no hay sesión" en vez de tumbar la página entera.
async function getAuthUser() {
  const supabase = await createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

// Límite de seguridad real de la app: siempre usa getUser() (revalida el
// JWT contra Supabase Auth), nunca getSession() (solo lee la cookie).
export const verifySession = cache(async () => {
  const user = await getAuthUser();

  if (!user) {
    redirect("/ingresar");
  }

  return { user };
});

export const getCurrentUserProfile = cache(async (): Promise<Profile | null> => {
  const user = await getAuthUser();

  if (!user) return null;

  const supabase = await createClient();

  const { data } = await supabase
    .from("profiles")
    .select("id, role, full_name, avatar_url")
    .eq("id", user.id)
    .single();

  return data;
});
