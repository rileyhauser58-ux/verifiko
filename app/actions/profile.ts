"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal";

export async function updateAvatar(avatarUrl: string) {
  const { user } = await verifySession();
  const supabase = await createClient();

  await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", user.id);

  revalidatePath("/panel");
  revalidatePath(`/prestadores/${user.id}`);
  revalidatePath("/buscar");
}
