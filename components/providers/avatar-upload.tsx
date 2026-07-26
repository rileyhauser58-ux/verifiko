"use client";

import { useState, useTransition, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { updateAvatar } from "@/app/actions/profile";
import { Avatar } from "@/components/ui/avatar";

export function AvatarUpload({
  userId,
  fullName,
  currentAvatarUrl,
}: {
  userId: string;
  fullName: string;
  currentAvatarUrl: string | null;
}) {
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    const supabase = createClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${userId}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setError("No pudimos subir la imagen. Intenta de nuevo.");
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(path);

    setPreview(`${publicUrl}?t=${Date.now()}`);
    setUploading(false);

    startTransition(async () => {
      await updateAvatar(publicUrl);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar src={preview} name={fullName} size={64} />
      <div>
        <label className="cursor-pointer">
          <span className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-primary-tint">
            {uploading || isPending ? "Subiendo…" : "Cambiar foto"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
            disabled={uploading || isPending}
          />
        </label>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}
