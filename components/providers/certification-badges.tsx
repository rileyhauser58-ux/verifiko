import type { ProviderCertification } from "@/types/domain";

export function CertificationBadges({
  certifications,
}: {
  certifications: ProviderCertification[];
}) {
  if (certifications.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {certifications.map((cert) => (
        <a
          key={cert.id}
          href={cert.file_url}
          target="_blank"
          rel="noopener noreferrer"
          title={cert.issuer ? `Emitido por ${cert.issuer}` : undefined}
          className="inline-flex items-center gap-1.5 rounded-full border border-trust/30 bg-trust-tint px-3 py-1.5 text-xs font-medium text-trust transition-colors hover:border-trust/50"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5 shrink-0"
            aria-hidden="true"
          >
            <circle cx="12" cy="8" r="5" />
            <path d="M8.5 12.5L7 21l5-2.5L17 21l-1.5-8.5" />
          </svg>
          {cert.title}
        </a>
      ))}
    </div>
  );
}
