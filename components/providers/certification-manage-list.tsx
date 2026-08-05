"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteCertification } from "@/app/actions/certifications";
import type { ProviderCertification } from "@/types/domain";

export function CertificationManageList({
  certifications,
}: {
  certifications: ProviderCertification[];
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (certifications.length === 0) {
    return (
      <p className="text-sm text-muted">
        Todavía no has agregado certificaciones.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {certifications.map((cert) => (
        <li
          key={cert.id}
          className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3"
        >
          <div className="min-w-0">
            <a
              href={cert.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline"
            >
              {cert.title}
            </a>
            {cert.issuer && <p className="text-xs text-muted">{cert.issuer}</p>}
          </div>
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await deleteCertification(cert.id);
                router.refresh();
              })
            }
            className="shrink-0 text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
          >
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  );
}
