import { type ReactNode } from "react";
import { getCurrentUserProfile, verifySession } from "@/lib/dal";
import { PanelSidebar } from "@/components/nav/panel-sidebar";

export default async function PanelLayout({ children }: { children: ReactNode }) {
  // Defensa en profundidad: proxy.ts ya redirige de forma optimista, pero
  // el límite de seguridad real de esta sección es este verifySession().
  await verifySession();
  const profile = await getCurrentUserProfile();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-8 sm:flex-row">
        <PanelSidebar role={profile?.role ?? "client"} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
