import { type ReactNode } from "react";
import { verifySession } from "@/lib/dal";

export default async function PanelLayout({ children }: { children: ReactNode }) {
  // Defensa en profundidad: proxy.ts ya redirige de forma optimista, pero
  // el límite de seguridad real de esta sección es este verifySession().
  await verifySession();

  return <div className="mx-auto max-w-4xl px-4 py-10">{children}</div>;
}
