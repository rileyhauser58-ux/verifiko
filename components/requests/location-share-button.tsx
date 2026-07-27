"use client";

import { useEffect, useRef, useState } from "react";
import {
  createLocationShare,
  deactivateLocationShare,
} from "@/app/actions/location-shares";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RealtimeChannel } from "@supabase/supabase-js";

export function LocationShareButton({ requestId }: { requestId: string }) {
  const [shareId, setShareId] = useState<string | null>(null);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const watchIdRef = useRef<number | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!shareToken) return;

    const supabase = createClient();
    const channel = supabase.channel(`location:${shareToken}`);
    channel.subscribe();
    channelRef.current = channel;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        channel.send({
          type: "broadcast",
          event: "position",
          payload: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
      },
      () => {
        setError("No pudimos acceder a tu ubicación. Revisa los permisos del navegador.");
      },
      { enableHighAccuracy: true }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, [shareToken]);

  async function handleShare() {
    setPending(true);
    setError(null);

    const result = await createLocationShare(requestId);
    setPending(false);

    if (result.message || !result.shareToken || !result.shareId) {
      setError(result.message ?? "No pudimos generar el link.");
      return;
    }

    setShareId(result.shareId);
    setShareToken(result.shareToken);
  }

  async function handleStop() {
    if (!shareId) return;
    await deactivateLocationShare(shareId);
    setShareId(null);
    setShareToken(null);
  }

  function handleCopy(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!shareToken) {
    return (
      <div>
        <Button type="button" variant="secondary" onClick={handleShare} disabled={pending}>
          {pending ? "Generando…" : "Compartir mi ubicación"}
        </Button>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/compartir/${shareToken}`;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Compartiendo tu ubicación en vivo</p>
      <div className="flex gap-2">
        <Input readOnly value={shareUrl} className="text-xs" />
        <Button type="button" variant="secondary" onClick={() => handleCopy(shareUrl)}>
          {copied ? "¡Copiado!" : "Copiar"}
        </Button>
      </div>
      <Button type="button" variant="ghost" onClick={handleStop}>
        Dejar de compartir
      </Button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
