"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";

type Position = { lat: number; lng: number };

const MapView = dynamic(() => import("./location-map-view"), {
  ssr: false,
  loading: () => (
    <div className="flex h-80 items-center justify-center rounded-2xl border border-border bg-card text-sm text-muted">
      Cargando mapa…
    </div>
  ),
});

export function LocationShareViewer({ shareToken }: { shareToken: string }) {
  const [position, setPosition] = useState<Position | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`location:${shareToken}`)
      .on("broadcast", { event: "position" }, ({ payload }) => {
        setPosition(payload as Position);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [shareToken]);

  if (!position) {
    return (
      <div className="flex h-80 items-center justify-center rounded-2xl border border-border bg-card text-sm text-muted">
        Esperando la ubicación…
      </div>
    );
  }

  return <MapView lat={position.lat} lng={position.lng} />;
}
